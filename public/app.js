// Bent w Walad - client
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CATS = { bent: 'Bent', walad: 'Walad', blad: 'Blad', fakiha: 'Fakiha / Khodhra', hayawen: '7ayawen', jamad: 'Jamad', nabat: 'Nabat', mehna: 'Mehna', lawn: 'Lawn', mekla: 'Mekla tounsia', marka: 'Marka', mghanni: 'Mghanni' };
const DURS = [[60, '1 minute'], [90, '1 min 30'], [120, '2 minutes'], [180, '3 minutes'], [0, 'Bla wa9t (STOP bark)']];

const socket = io();
let S = null, you = null, stageKey = '', answers = [], offset = 0, sentRound = -1;

// ---------- écran d'accueil ----------
try { const n = localStorage.getItem('bw-name'); if (n) $('#nm').value = n; } catch (e) {}
const params = new URLSearchParams(location.search);
if (params.get('salle')) $('#cd').value = params.get('salle').toUpperCase();

function getName() {
  const n = $('#nm').value.trim();
  if (!n) { $('#nm').focus(); $('#jmsg').textContent = 'Ekteb esmek 9bal.'; return null; }
  try { localStorage.setItem('bw-name', n); } catch (e) {}
  return n;
}
$('#bNew').onclick = () => { const name = getName(); if (name) socket.emit('create', { name }); };
$('#bJoin').onclick = () => {
  const name = getName(); if (!name) return;
  const code = $('#cd').value.trim().toUpperCase();
  if (code.length < 3) return $('#cd').focus();
  socket.emit('join', { code, name });
};
$('#cd').onkeydown = e => { if (e.key === 'Enter') $('#bJoin').click(); };

socket.on('connect', () => { $('#jmsg').textContent = 'Connecté. A3mel salle wela od5ol b code.'; });
socket.on('disconnect', () => { $('#jmsg').textContent = 'Connexion ma9tou3a… nraj3ou.'; if (S) $('#conn').hidden = false; });
socket.on('err', m => { $('#jmsg').textContent = m; });
socket.on('joined', ({ code, you: id }) => {
  you = id;
  $('#join').hidden = true; $('#game').hidden = false;
  $('#tCode').textContent = code;
  history.replaceState(null, '', '?salle=' + code);
});

$('#bCopy').onclick = () => {
  const link = location.origin + location.pathname + '?salle=' + S.code;
  navigator.clipboard.writeText(link).then(() => {
    $('#bCopy').textContent = 'Lien copié';
    setTimeout(() => ($('#bCopy').textContent = 'Copier le lien'), 1500);
  }).catch(() => prompt('Copier le lien:', link));
};

// ---------- réception de l'état ----------
socket.on('state', st => {
  S = st;
  offset = st.serverNow - Date.now();
  render();
});

// el serveur y9oul STOP: nab3thou ijabetna
socket.on('collect', ({ round, by }) => {
  if (sentRound !== round) { sentRound = round; socket.emit('answers', { round, answers }); }
  document.querySelectorAll('#f input, #bStop').forEach(e => (e.disabled = true));
  const si = $('#stopInfo');
  if (si) si.innerHTML = `<div class="banner pop">${by === 'wa9t' ? 'Wfé el wa9t!' : 'STOP! (' + esc(by) + ')'}</div>`;
});

function render() {
  const amHost = S.hostId === you;
  $('#players').innerHTML = S.players.map(p =>
    `<span class="pl${p.id === you ? ' me' : ''}">${esc(p.name)}${p.id === you ? ' (enti)' : ''}${p.id === S.hostId ? ' ★' : ''}<i>${p.score}</i></span>`).join('');

  const key = S.status + '|' + S.round + '|' + amHost + (S.status === 'lobby' ? JSON.stringify([S.cats, S.dur]) : '');
  const st = $('#stage');
  if (key !== stageKey) {
    stageKey = key;
    if (S.status === 'lobby') st.innerHTML = amHost ? lobbyHost() : lobbyGuest();
    if (S.status === 'play') st.innerHTML = playView();
    if (S.status === 'review') st.innerHTML = voteShell(amHost);
    if (S.status === 'results') st.innerHTML = resultsShell(amHost);
    bind(amHost);
  }
  if (S.status === 'review') renderVote(amHost);
  if (S.status === 'results') renderResults();
}

function lobbyHost() {
  const board = S.round ? finalBoard() : '';
  return `${board}<div class="stage"><div class="door"><b>?</b></div><div class="side"><h2>Nadhem el partie</h2>
    <p class="muted">Ab3ath el lien l's7abek (bouton "Copier le lien" el fou9), w ki yod5lou ebda.</p>
    <label>Les cases</label><div class="chips">${Object.keys(CATS).map(k => `<button class="chip${S.cats.includes(k) ? ' on' : ''}" data-k="${k}">${CATS[k]}</button>`).join('')}</div>
    <div class="row" style="margin-top:14px"><div><label for="dur">El wa9t</label><select id="dur">${DURS.map(([v, t]) => `<option value="${v}"${S.dur === v ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
    <button id="bGo">${S.round ? 'Partie jdida' : 'Ebda el partie'}</button></div></div></div>`;
}
function lobbyGuest() {
  return `${S.round ? finalBoard() : ''}<div class="stage"><div class="door"><b>?</b></div><div class="side"><h2>Nestannaw el host ybda</h2>
    <p class="muted">Les cases: ${S.cats.map(k => esc(CATS[k])).join(', ')}. El wa9t: ${S.dur ? S.dur + ' s' : 'bla wa9t'}.</p></div></div>`;
}
function finalBoard() {
  const r = [...S.players].sort((a, b) => b.score - a.score);
  return `<div class="card" style="margin-bottom:24px"><h2>Classement</h2><ol class="rank">${r.map(p => `<li><span>${esc(p.name)}</span><b>${p.score}</b></li>`).join('')}</ol></div>`;
}
function playView() {
  answers = S.cats.map(() => '');
  return `<div class="stage"><div class="door pop"><b>${esc(S.letter)}</b></div><div class="side"><p class="muted" style="margin:0">Round ${S.round} · el 7arf</p><div class="timer" id="tm">--</div>
    <div id="stopInfo"></div><button class="red" id="bStop" disabled>STOP!</button><p class="note">STOP yet7all ki tkammel el cases lkol.</p></div></div>
    <form class="grid" id="f">${S.cats.map((k, i) => `<div><label for="a${i}">${esc(CATS[k])}</label><input id="a${i}" data-i="${i}" maxlength="40" autocomplete="off" placeholder="${esc(S.letter)}…"></div>`).join('')}</form>`;
}
function voteShell(amHost) {
  return `<div class="stage"><div class="door"><b>${esc(S.letter)}</b></div><div class="side"><h2>Round ${S.round}: chateb el ghalet</h2>
    <p class="muted">Enzel 3la kelma ghalta mta3 joueur ekher bech tchatebha. Kelma tetchateb ki akther men nos les autres ychatbouha. Ki tkammel, enzel "Kammelt".</p>
    <div class="row"><button id="bDone">Kammelt</button>${amHost ? '<button class="ghost" id="bForce">7seb tawa</button>' : ''}</div>
    <p class="note" id="waitFor"></p></div></div>
    <div class="scroll"><table id="rv"></table></div>`;
}
function resultsShell(amHost) {
  return `<div class="stage"><div class="door"><b>${esc(S.letter)}</b></div><div class="side"><h2>Round ${S.round}: el natija</h2>
    <p class="muted">El score m7soub ken 3al kelmet elli mouch mchatbin.</p>
    ${amHost ? '<div class="row"><button id="bNext">Round jdid</button><button class="ghost" id="bLob">Classement final</button></div>' : '<p class="note">El host ybda el round elli ba3dou.</p>'}</div></div>
    <div class="scroll"><table id="rv"></table></div>`;
}

function bind(amHost) {
  if (S.status === 'lobby' && amHost) {
    document.querySelectorAll('.chip').forEach(b => (b.onclick = () => {
      const k = b.dataset.k;
      const cats = S.cats.includes(k) ? S.cats.filter(x => x !== k) : [...S.cats, k];
      if (cats.length >= 3) socket.emit('settings', { cats });
    }));
    $('#dur').onchange = e => socket.emit('settings', { dur: Number(e.target.value) });
    $('#bGo').onclick = () => socket.emit('start');
  }
  if (S.status === 'play') {
    $('#f').onsubmit = e => e.preventDefault();
    document.querySelectorAll('#f input').forEach(inp => (inp.oninput = () => {
      answers[inp.dataset.i] = inp.value;
      $('#bStop').disabled = answers.some(a => !a.trim());
    }));
    $('#bStop').onclick = () => { sentRound = S.round; socket.emit('stop', { answers }); };
    $('#a0').focus();
  }
  if (S.status === 'review') {
    $('#bDone').onclick = () => socket.emit('done');
    if (amHost) $('#bForce').onclick = () => socket.emit('force');
  }
  if (S.status === 'results' && amHost) {
    $('#bNext').onclick = () => socket.emit('next');
    $('#bLob').onclick = () => socket.emit('lobby');
  }
}

function cellWord(t, crossed) {
  return t ? `<span class="${crossed ? 'x' : ''}">${esc(t)}</span>` : '<span class="muted">—</span>';
}

function renderVote() {
  const T = $('#rv'), ps = S.players.filter(p => p.answers), votes = new Map(S.votes), done = new Set(S.done);
  const iDone = done.has(you);
  $('#bDone').textContent = iDone ? 'Nbaddel ra2yi' : 'Kammelt';
  $('#bDone').className = iDone ? 'ghost' : '';
  const waiting = ps.filter(p => !done.has(p.id)).map(p => p.name);
  $('#waitFor').textContent = waiting.length ? 'Nestannaw: ' + waiting.join(', ') : '';
  T.innerHTML = `<thead><tr><th>Case</th>${ps.map(p => `<th>${esc(p.name)}${p.id === you ? ' (enti)' : ''}${done.has(p.id) ? ' ✓' : ''}</th>`).join('')}</tr></thead><tbody>` +
    S.cats.map((k, i) => `<tr><td><b>${esc(CATS[k])}</b></td>${ps.map(p => {
      const t = p.answers[i] || '', v = votes.get(p.id + '|' + i) || [], mine = v.includes(you);
      const can = t && p.id !== you && !iDone;
      const crossed = p.crossed[i] || (t && !p.auto[i]);
      return `<td class="c${can ? ' h' : ''}${mine ? ' mine' : ''}" data-p="${esc(p.id)}" data-i="${i}">${cellWord(t, crossed)}${v.length ? `<span class="vt">✗ ${v.length}</span>` : ''}${t && !p.auto[i] ? ' <span class="note">(7arf ghalet)</span>' : ''}</td>`;
    }).join('')}</tr>`).join('') + '</tbody>';
  T.querySelectorAll('td.h').forEach(td => (td.onclick = () => socket.emit('vote', { playerId: td.dataset.p, i: Number(td.dataset.i) })));
}

function renderResults() {
  const T = $('#rv'), ps = S.players.filter(p => p.answers);
  T.innerHTML = `<thead><tr><th>Case</th>${ps.map(p => `<th>${esc(p.name)}${p.id === you ? ' (enti)' : ''}</th>`).join('')}</tr></thead><tbody>` +
    S.cats.map((k, i) => `<tr><td><b>${esc(CATS[k])}</b></td>${ps.map(p => {
      const t = p.answers[i] || '', pts = p.pts[i] || 0;
      return `<td>${cellWord(t, t && !pts)}<span class="pt p${pts}">${pts}</span></td>`;
    }).join('')}</tr>`).join('') +
    `<tr class="sum"><td>Total</td>${ps.map(p => `<td>+${p.roundSum}</td>`).join('')}</tr></tbody>`;
}

// ---------- minuterie ----------
setInterval(() => {
  const tm = $('#tm');
  if (!S || S.status !== 'play' || !tm) return;
  if (!S.endAt) { tm.textContent = '∞'; return; }
  const left = Math.max(0, Math.ceil((S.endAt - (Date.now() + offset)) / 1000));
  tm.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
  tm.classList.toggle('hot', left <= 10);
}, 250);
