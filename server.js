// Bent w Walad - serveur temps réel (Express + Socket.IO)
// El serveur howa elli y9arrer: el 7arf, el wa9t, el STOP, el votes w el score.

const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const CATS = ['bent', 'walad', 'blad', 'fakiha', 'hayawen', 'jamad', 'nabat', 'mehna', 'lawn', 'mekla', 'marka', 'mghanni'];
const DEF = ['bent', 'walad', 'blad', 'fakiha', 'hayawen', 'jamad', 'nabat'];
const LETTERS = 'ABCDEFGHIJKLMNOPRSTZ';
const rooms = new Map(); // code -> room

// ---------- outils ----------
const norm = s => String(s || '').toLowerCase().normalize('NFD')
  .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9؀-ۿ]/g, '');

// verification automatique: fergha, 9sira barcha, wela ma tebdach bel 7arf
function autoValid(word, letter) {
  const n = norm(word);
  if (n.length < 2) return false;
  if (/[؀-ۿ]/.test(n)) return true; // kelma bel 3arbi: les joueurs y9arrrou
  return n[0] === letter.toLowerCase();
}

function newCode() {
  const a = 'ABCDEFGHJKLMNPRSTUVWXYZ23456789';
  let c;
  do { c = Array.from({ length: 4 }, () => a[Math.floor(Math.random() * a.length)]).join(''); }
  while (rooms.has(c));
  return c;
}

function pickLetter(used) {
  const pool = [...LETTERS].filter(l => !used.includes(l));
  const p = pool.length ? pool : [...LETTERS];
  return p[Math.floor(Math.random() * p.length)];
}

const clean = (s, max) => String(s ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, max);
const answered = room => [...room.players.values()].filter(p => p.answers);

// ---------- votes ----------
// kelma tetchateb ki akther men nos les autres joueurs (ghir moula-ha) ychatbouha
function isCrossed(room, playerId, i) {
  const voters = room.votes.get(playerId + '|' + i);
  if (!voters || !voters.size) return false;
  const others = answered(room).filter(p => p.id !== playerId).length;
  return others > 0 && voters.size > others / 2;
}

// ---------- score (ken 3al kelmet elli mouch mchatbin) ----------
function computeScores(room) {
  const players = answered(room);
  room.cats.forEach((_, i) => {
    const vals = players.map(p => {
      const t = p.answers[i] || '';
      return { ok: autoValid(t, room.letter) && !isCrossed(room, p.id, i), n: norm(t) };
    });
    vals.forEach((v, j) => {
      const dup = vals.some((w, k) => k !== j && w.ok && w.n === v.n);
      players[j].pts[i] = v.ok ? (dup ? 5 : 10) : 0;
    });
  });
  players.forEach(p => { p.roundSum = p.pts.reduce((a, b) => a + b, 0); });
}

// ---------- état public envoyé aux joueurs ----------
function publicState(room) {
  const showAnswers = room.status === 'review' || room.status === 'results';
  const showPts = room.status === 'results';
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status, // lobby | play | review (votes) | results
    cats: room.cats,
    dur: room.dur,
    round: room.round,
    letter: room.status === 'lobby' && room.round === 0 ? null : room.letter,
    endAt: room.endAt,
    serverNow: Date.now(),
    stoppedBy: room.stoppedBy,
    votes: [...room.votes].map(([k, s]) => [k, [...s]]),
    done: [...room.done],
    players: [...room.players.values()].map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      answers: showAnswers ? p.answers : null,
      auto: showAnswers && p.answers ? p.answers.map(t => autoValid(t, room.letter)) : null,
      crossed: showAnswers && p.answers ? room.cats.map((_, i) => isCrossed(room, p.id, i)) : null,
      pts: showPts ? p.pts : null,
      roundSum: showPts ? p.roundSum : null,
    })),
  };
}

const broadcast = room => io.to(room.code).emit('state', publicState(room));

// ---------- déroulement d'un round ----------
function startRound(room) {
  clearTimeout(room.timer);
  room.round += 1;
  room.letter = pickLetter(room.used);
  room.used = [...room.used, room.letter].slice(-12);
  room.status = 'play';
  room.stoppedBy = null;
  room.votes = new Map();
  room.done = new Set();
  room.collecting = false;
  room.players.forEach(p => { p.answers = null; p.pts = []; p.roundSum = 0; });
  room.endAt = room.dur ? Date.now() + room.dur * 1000 : null;
  if (room.dur) room.timer = setTimeout(() => stopRound(room, null), room.dur * 1000);
  broadcast(room);
}

// STOP: n9oulou l'kol yab3thou ijabethom
function stopRound(room, byName) {
  if (room.status !== 'play' || room.collecting) return;
  clearTimeout(room.timer);
  room.collecting = true;
  room.stoppedBy = byName || 'wa9t';
  io.to(room.code).emit('collect', { round: room.round, by: room.stoppedBy });
  room.timer = setTimeout(() => toReview(room), 2000);
}

// phase mta3 el tachtib
function toReview(room) {
  if (room.status !== 'play') return;
  clearTimeout(room.timer);
  room.collecting = false;
  room.players.forEach(p => { if (!p.answers) p.answers = room.cats.map(() => ''); });
  room.status = 'review';
  broadcast(room);
}

// l'kol kammlou ychatbou: n7esbou
function toResults(room) {
  if (room.status !== 'review') return;
  computeScores(room);
  room.status = 'results';
  broadcast(room);
}

function checkAllDone(room) {
  const ps = answered(room);
  if (room.status === 'review' && ps.length && ps.every(p => room.done.has(p.id))) toResults(room);
}

function commitRound(room) {
  room.players.forEach(p => { p.score += p.roundSum || 0; p.roundSum = 0; });
}

// ---------- connexions ----------
io.on('connection', socket => {
  let room = null;

  const me = () => room && room.players.get(socket.id);
  const isHost = () => room && room.hostId === socket.id;

  function enter(r, name) {
    room = r;
    socket.join(r.code);
    r.players.set(socket.id, { id: socket.id, name, score: 0, answers: null, pts: [], roundSum: 0 });
    socket.emit('joined', { code: r.code, you: socket.id });
    broadcast(r);
  }

  socket.on('create', ({ name }) => {
    name = clean(name, 20);
    if (!name || room) return;
    const code = newCode();
    const r = { code, hostId: socket.id, players: new Map(), cats: DEF.slice(), dur: 90, round: 0,
      letter: null, used: [], status: 'lobby', endAt: null, stoppedBy: null,
      votes: new Map(), done: new Set(), timer: null, collecting: false };
    rooms.set(code, r);
    enter(r, name);
  });

  socket.on('join', ({ code, name }) => {
    name = clean(name, 20);
    code = clean(code, 6).toUpperCase();
    const r = rooms.get(code);
    if (!name || room) return;
    if (!r) return socket.emit('err', 'Salle ma l9itehech. Thabbet fel code.');
    if (r.players.size >= 12) return socket.emit('err', 'Salle m3abbia (12 joueurs max).');
    let n = name, k = 2;
    const names = new Set([...r.players.values()].map(p => p.name.toLowerCase()));
    while (names.has(n.toLowerCase())) n = `${name} ${k++}`;
    enter(r, n);
  });

  socket.on('settings', ({ cats, dur }) => {
    if (!isHost() || room.status !== 'lobby') return;
    if (Array.isArray(cats)) {
      const c = CATS.filter(x => cats.includes(x));
      if (c.length >= 3) room.cats = c;
    }
    if ([0, 60, 90, 120, 180].includes(Number(dur))) room.dur = Number(dur);
    broadcast(room);
  });

  socket.on('start', () => {
    if (!isHost() || room.status !== 'lobby') return;
    room.players.forEach(p => { p.score = 0; });
    room.round = 0;
    startRound(room);
  });

  socket.on('stop', ({ answers }) => {
    const p = me();
    if (!p || room.status !== 'play' || room.collecting) return;
    const a = room.cats.map((_, i) => clean(Array.isArray(answers) ? answers[i] : '', 40));
    if (a.some(x => !x)) return; // lazem el cases lkol m3abbin
    p.answers = a;
    stopRound(room, p.name);
  });

  socket.on('answers', ({ round, answers }) => {
    const p = me();
    if (!p || room.status !== 'play' || round !== room.round) return;
    p.answers = room.cats.map((_, i) => clean(Array.isArray(answers) ? answers[i] : '', 40));
    if ([...room.players.values()].every(x => x.answers)) toReview(room);
  });

  // joueur ychateb (wela yna77i el tachtib) 3la kelmet joueur ekher
  socket.on('vote', ({ playerId, i }) => {
    const p = me();
    i = Number(i);
    if (!p || room.status !== 'review' || !p.answers || room.done.has(p.id)) return;
    const target = room.players.get(playerId);
    if (!target || target.id === p.id || !target.answers || !(i >= 0 && i < room.cats.length)) return;
    if (!target.answers[i]) return;
    const key = playerId + '|' + i;
    if (!room.votes.has(key)) room.votes.set(key, new Set());
    const s = room.votes.get(key);
    s.has(p.id) ? s.delete(p.id) : s.add(p.id);
    if (!s.size) room.votes.delete(key);
    broadcast(room);
  });

  // "Kammelt": el joueur wfé mel tachtib (yenajem yraja3 ma dem l'kol ma kammlouch)
  socket.on('done', () => {
    const p = me();
    if (!p || room.status !== 'review' || !p.answers) return;
    room.done.has(p.id) ? room.done.delete(p.id) : room.done.add(p.id);
    broadcast(room);
    checkAllDone(room);
  });

  // el host ynajem y7seb ken 7ad 9a3ed ma ykammelch
  socket.on('force', () => {
    if (!isHost()) return;
    toResults(room);
  });

  socket.on('next', () => {
    if (!isHost() || room.status !== 'results') return;
    commitRound(room);
    startRound(room);
  });

  socket.on('lobby', () => {
    if (!isHost() || room.status !== 'results') return;
    commitRound(room);
    room.status = 'lobby';
    broadcast(room);
  });

  socket.on('disconnect', () => {
    if (!room) return;
    room.players.delete(socket.id);
    room.done.delete(socket.id);
    room.votes.forEach((s, k) => {
      s.delete(socket.id);
      if (!s.size || k.startsWith(socket.id + '|')) room.votes.delete(k);
    });
    if (room.players.size === 0) {
      clearTimeout(room.timer);
      rooms.delete(room.code);
      return;
    }
    if (room.hostId === socket.id) room.hostId = room.players.keys().next().value; // host jdid
    if (room.status === 'play' && room.collecting && [...room.players.values()].every(x => x.answers)) toReview(room);
    broadcast(room);
    checkAllDone(room);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Bent w Walad yemchi 3la http://localhost:${PORT}`));
