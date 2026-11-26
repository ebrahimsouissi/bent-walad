// Bent w Walad - client (français / العربية الفصحى)
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- textes ----------
const I18N = {
  fr: {
    dir: 'ltr', other: 'ar', otherLabel: 'العربية',
    title: 'Bent w Walad, le jeu en ligne',
    intro: "Crée une salle, envoie le lien à tes amis : à chaque manche une lettre apparaît sur la porte. Le premier qui a tout rempli crie STOP !",
    name: 'Ton prénom', namePh: 'Amina', newRoom: 'Créer une salle', haveCode: 'Tu as un code ?', join: 'Rejoindre',
    connecting: 'Connexion…', connected: 'Connecté. Crée une salle ou rejoins-en une avec un code.', lost: 'Connexion perdue… reconnexion.',
    needName: "Écris d'abord ton prénom.", noRoom: 'Salle introuvable. Vérifie le code.', full: 'Salle pleine (12 joueurs max).',
    rulesT: 'Les règles',
    rules: ['À chaque manche, une lettre est tirée. Écris un mot qui commence par cette lettre dans chaque case.',
      'Quand toutes tes cases sont remplies, tu peux appuyer sur STOP : tout le monde s’arrête.',
      'Chaque joueur barre les mots faux des autres. Un mot est barré si plus de la moitié des autres joueurs le barrent.',
      'Mot juste et unique : 10 points. Mot écrit aussi par un autre : 5. Vide ou faux : 0.',
      'Sur les résultats, l’hôte peut modifier les points de n’importe quel mot, même avec une mauvaise lettre.'],
    room: 'Salle', copy: 'Copier le lien', copied: 'Lien copié', you: 'toi',
    setup: 'Prépare la partie', sendLink: 'Envoie le lien à tes amis (bouton « Copier le lien » en haut), puis lance la partie.',
    gameLang: 'Langue des réponses', boxes: 'Les cases', time: 'Durée',
    durs: { 60: '1 minute', 90: '1 min 30', 120: '2 minutes', 180: '3 minutes', 0: 'Sans limite (STOP seulement)' },
    start: 'Lancer la partie', newGame: 'Nouvelle partie', waitHost: "On attend que l'hôte lance la partie",
    boxesAre: 'Les cases', timeIs: 'Durée', noLimit: 'sans limite', langIs: 'Réponses en',
    langNames: { fr: 'français', ar: 'arabe' },
    ranking: 'Classement', round: 'Manche', letter: 'la lettre',
    stopHint: 'STOP se débloque quand toutes les cases sont remplies.', stopBy: 'STOP ! ({n})', timeUp: 'Temps écoulé !',
    voteT: 'Manche {r} : barre les mots faux',
    voteHint: 'Appuie sur un mot faux d’un autre joueur pour le barrer. Un mot est barré si plus de la moitié des autres le barrent. Quand tu as fini, appuie sur « J’ai fini ».',
    done: "J'ai fini", undo: 'Je change d’avis', force: 'Compter maintenant', waiting: 'On attend : {n}',
    wrongL: '(mauvaise lettre)', box: 'Case', total: 'Total',
    resT: 'Manche {r} : les résultats',
    resHint: 'Les points comptent seulement les mots non barrés.', resHintHost: 'Tu es l’hôte : tu peux ajuster les points de chaque mot avec − et +.',
    next: 'Manche suivante', final: 'Classement final', hostNext: "L'hôte lance la manche suivante.",
    editedBy: 'modifié par {n}', reset: 'Revenir au calcul auto', minus: 'Moins 5 points', plus: 'Plus 5 points',
    cats: { bent: 'Prénom fille', walad: 'Prénom garçon', blad: 'Pays', fakiha: 'Fruit / Légume', hayawen: 'Animal', jamad: 'Objet', nabat: 'Plante', mehna: 'Métier', lawn: 'Couleur', mekla: 'Plat', marka: 'Marque', mghanni: 'Chanteur' },
  },
  ar: {
    dir: 'rtl', other: 'fr', otherLabel: 'Français',
    title: 'بنت وولد، اللعبة على الإنترنت',
    intro: 'أنشئ غرفة وأرسل الرابط إلى أصدقائك: في كل جولة يظهر حرف على الباب، ومن يملأ كل الخانات أولًا يقول «قف!».',
    name: 'اسمك', namePh: 'أمينة', newRoom: 'أنشئ غرفة جديدة', haveCode: 'هل لديك رمز؟', join: 'ادخل',
    connecting: 'جارٍ الاتصال…', connected: 'تم الاتصال. أنشئ غرفة أو ادخل برمز.', lost: 'انقطع الاتصال… جارٍ إعادة الاتصال.',
    needName: 'اكتب اسمك أولًا.', noRoom: 'لم نجد الغرفة. تأكد من الرمز.', full: 'الغرفة ممتلئة (12 لاعبًا كحد أقصى).',
    rulesT: 'قواعد اللعبة',
    rules: ['في كل جولة يُختار حرف، فتكتب في كل خانة كلمة تبدأ بهذا الحرف.',
      'عندما تملأ كل الخانات يمكنك الضغط على «قف!» فيتوقف الجميع.',
      'يشطب كل لاعب الكلمات الخاطئة عند الآخرين، وتُشطب الكلمة إذا شطبها أكثر من نصف اللاعبين الآخرين.',
      'كلمة صحيحة لم يكتبها غيرك: 10 نقاط. كلمة كتبها لاعب آخر أيضًا: 5. فارغة أو خاطئة: 0.',
      'في النتائج يمكن للمضيف تعديل نقاط أي كلمة، حتى لو كان حرفها خاطئًا.'],
    room: 'الغرفة', copy: 'انسخ الرابط', copied: 'تم النسخ', you: 'أنت',
    setup: 'جهّز اللعبة', sendLink: 'أرسل الرابط إلى أصدقائك (زر «انسخ الرابط» في الأعلى)، ثم ابدأ اللعبة.',
    gameLang: 'لغة الإجابات', boxes: 'الخانات', time: 'المدة',
    durs: { 60: 'دقيقة', 90: 'دقيقة ونصف', 120: 'دقيقتان', 180: 'ثلاث دقائق', 0: 'بلا وقت («قف!» فقط)' },
    start: 'ابدأ اللعبة', newGame: 'لعبة جديدة', waitHost: 'ننتظر أن يبدأ المضيف اللعبة',
    boxesAre: 'الخانات', timeIs: 'المدة', noLimit: 'بلا وقت', langIs: 'الإجابات بـ',
    langNames: { fr: 'الفرنسية', ar: 'العربية' },
    ranking: 'الترتيب', round: 'الجولة', letter: 'الحرف',
    stopHint: 'يصبح زر «قف!» متاحًا عندما تملأ كل الخانات.', stopBy: 'قف! ({n})', timeUp: 'انتهى الوقت!',
    voteT: 'الجولة {r}: اشطب الكلمات الخاطئة',
    voteHint: 'اضغط على كلمة خاطئة لدى لاعب آخر لتشطبها. تُشطب الكلمة إذا شطبها أكثر من نصف اللاعبين الآخرين. عندما تنتهي اضغط «انتهيت».',
    done: 'انتهيت', undo: 'غيّرت رأيي', force: 'احسب الآن', waiting: 'ننتظر: {n}',
    wrongL: '(حرف خاطئ)', box: 'الخانة', total: 'المجموع',
    resT: 'الجولة {r}: النتائج',
    resHint: 'تُحسب النقاط للكلمات غير المشطوبة فقط.', resHintHost: 'أنت المضيف: يمكنك تعديل نقاط كل كلمة بـ − و +.',
    next: 'الجولة التالية', final: 'الترتيب النهائي', hostNext: 'المضيف يبدأ الجولة التالية.',
    editedBy: 'عدّلها {n}', reset: 'الرجوع إلى الحساب التلقائي', minus: 'ناقص 5 نقاط', plus: 'زائد 5 نقاط',
    cats: { bent: 'اسم بنت', walad: 'اسم ولد', blad: 'بلد', fakiha: 'فاكهة / خضار', hayawen: 'حيوان', jamad: 'جماد', nabat: 'نبات', mehna: 'مهنة', lawn: 'لون', mekla: 'أكلة', marka: 'علامة تجارية', mghanni: 'مغنٍّ' },
  },
};
let lang = (navigator.language || '').startsWith('ar') ? 'ar' : 'fr';
try { const saved = localStorage.getItem('bw-lang'); if (saved) lang = saved; } catch (e) {}
if (!I18N[lang]) lang = 'fr';
const t = (k, v = {}) => String(I18N[lang][k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x] ?? '');
const catName = k => I18N[lang].cats[k] || k;

function applyLang() {
  const L = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = L.dir;
  document.querySelectorAll('[data-t]').forEach(el => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll('[data-ph]').forEach(el => (el.placeholder = t(el.dataset.ph)));
  $('#rules').innerHTML = L.rules.map(r => `<li>${esc(r)}</li>`).join('');
  document.querySelectorAll('.langBtn').forEach(b => (b.textContent = L.otherLabel));
  document.title = lang === 'ar' ? 'بنت وولد' : 'Bent w Walad';
  stageKey = '';
  if (S) render();
}
document.querySelectorAll('.langBtn').forEach(b => (b.onclick = () => {
  lang = I18N[lang].other;
  try { localStorage.setItem('bw-lang', lang); } catch (e) {}
  applyLang();
}));

// ---------- état ----------
const socket = io();
let S = null, you = null, stageKey = '', answers = [], offset = 0, sentRound = -1, lastStop = null;

try { const n = localStorage.getItem('bw-name'); if (n) $('#nm').value = n; } catch (e) {}
const params = new URLSearchParams(location.search);
if (params.get('salle')) $('#cd').value = params.get('salle').toUpperCase();
applyLang();
$('#jmsg').textContent = t('connecting');

function getName() {
  const n = $('#nm').value.trim();
  if (!n) { $('#nm').focus(); $('#jmsg').textContent = t('needName'); return null; }
  try { localStorage.setItem('bw-name', n); } catch (e) {}
  return n;
}
$('#bNew').onclick = () => { const name = getName(); if (name) socket.emit('create', { name, lang }); };
$('#bJoin').onclick = () => {
  const name = getName(); if (!name) return;
  const code = $('#cd').value.trim().toUpperCase();
  if (code.length < 3) return $('#cd').focus();
  socket.emit('join', { code, name });
};
$('#cd').onkeydown = e => { if (e.key === 'Enter') $('#bJoin').click(); };

socket.on('connect', () => { $('#jmsg').textContent = t('connected'); $('#conn').hidden = true; });
socket.on('disconnect', () => { $('#jmsg').textContent = t('lost'); if (S) $('#conn').hidden = false; });
socket.on('err', code => { $('#jmsg').textContent = t(code); });
socket.on('joined', ({ code, you: id }) => {
  you = id;
  $('#join').hidden = true; $('#game').hidden = false;
  $('#tCode').textContent = code;
  history.replaceState(null, '', '?salle=' + code);
});

$('#bCopy').onclick = () => {
  const link = location.origin + location.pathname + '?salle=' + S.code;
  navigator.clipboard.writeText(link).then(() => {
    $('#bCopy').textContent = t('copied');
    setTimeout(() => ($('#bCopy').textContent = t('copy')), 1500);
  }).catch(() => prompt(t('copy'), link));
};

socket.on('state', st => { S = st; offset = st.serverNow - Date.now(); render(); });

socket.on('collect', ({ round, by }) => {
  lastStop = by;
  if (sentRound !== round) { sentRound = round; socket.emit('answers', { round, answers }); }
  document.querySelectorAll('#f input, #bStop').forEach(e => (e.disabled = true));
  const si = $('#stopInfo');
  if (si) { si.innerHTML = '<div class="banner pop"></div>'; si.firstChild.textContent = by === 'wa9t' ? t('timeUp') : t('stopBy', { n: by }); }
});

// ---------- affichage ----------
function render() {
  const amHost = S.hostId === you;
  $('#players').innerHTML = S.players.map(p =>
    `<span class="pl${p.id === you ? ' me' : ''}"><bdi>${esc(p.name)}</bdi>${p.id === you ? ' (' + t('you') + ')' : ''}${p.id === S.hostId ? ' ★' : ''}<i>${p.score}</i></span>`).join('');

  const key = lang + S.status + '|' + S.round + '|' + amHost + (S.status === 'lobby' ? JSON.stringify([S.cats, S.dur, S.lang]) : '');
  const st = $('#stage');
  if (key !== stageKey) {
    stageKey = key;
    if (S.status === 'lobby') st.innerHTML = amHost ? lobbyHost() : lobbyGuest();
    if (S.status === 'play') st.innerHTML = playView();
    if (S.status === 'review') st.innerHTML = voteShell(amHost);
    if (S.status === 'results') st.innerHTML = resultsShell(amHost);
    bind(amHost);
  }
  if (S.status === 'review') renderVote();
  if (S.status === 'results') renderResults(amHost);
}

const door = l => `<div class="door${S.lang === 'ar' ? ' ar' : ''}"><b>${esc(l)}</b></div>`;

function lobbyHost() {
  return `${S.round ? finalBoard() : ''}<div class="stage">${door('?')}<div class="side"><h2>${t('setup')}</h2>
    <p class="muted">${t('sendLink')}</p>
    <label>${t('gameLang')}</label><div class="chips">${['fr', 'ar'].map(l => `<button class="chip lchip${S.lang === l ? ' on' : ''}" data-l="${l}">${I18N[lang].langNames[l]}</button>`).join('')}</div>
    <label style="margin-top:14px">${t('boxes')}</label><div class="chips">${Object.keys(I18N.fr.cats).map(k => `<button class="chip cchip${S.cats.includes(k) ? ' on' : ''}" data-k="${k}">${esc(catName(k))}</button>`).join('')}</div>
    <div class="row" style="margin-top:14px"><div><label for="dur">${t('time')}</label><select id="dur">${[60, 90, 120, 180, 0].map(v => `<option value="${v}"${S.dur === v ? ' selected' : ''}>${I18N[lang].durs[v]}</option>`).join('')}</select></div>
    <button id="bGo">${S.round ? t('newGame') : t('start')}</button></div></div></div>`;
}
function lobbyGuest() {
  return `${S.round ? finalBoard() : ''}<div class="stage">${door('?')}<div class="side"><h2>${t('waitHost')}</h2>
    <p class="muted">${t('langIs')} ${I18N[lang].langNames[S.lang]}. ${t('boxesAre')}: ${S.cats.map(k => esc(catName(k))).join(lang === 'ar' ? '، ' : ', ')}. ${t('timeIs')}: ${S.dur ? I18N[lang].durs[S.dur] : t('noLimit')}.</p></div></div>`;
}
function finalBoard() {
  const r = [...S.players].sort((a, b) => b.score - a.score);
  return `<div class="card" style="margin-bottom:24px"><h2>${t('ranking')}</h2><ol class="rank">${r.map(p => `<li><bdi>${esc(p.name)}</bdi><b>${p.score}</b></li>`).join('')}</ol></div>`;
}
function playView() {
  answers = S.cats.map(() => '');
  const adir = S.lang === 'ar' ? 'rtl' : 'ltr';
  return `<div class="stage">${door(S.letter).replace('class="door', 'class="door pop')}<div class="side"><p class="muted" style="margin:0">${t('round')} ${S.round} · ${t('letter')}</p><div class="timer" id="tm">--</div>
    <div id="stopInfo"></div><button class="red" id="bStop" disabled>${lang === 'ar' ? 'قف!' : 'STOP !'}</button><p class="note">${t('stopHint')}</p></div></div>
    <form class="grid" id="f">${S.cats.map((k, i) => `<div><label for="a${i}">${esc(catName(k))}</label><input id="a${i}" data-i="${i}" dir="${adir}" lang="${S.lang}" maxlength="40" autocomplete="off" placeholder="${esc(S.letter)}…"></div>`).join('')}</form>`;
}
function voteShell(amHost) {
  return `<div class="stage">${door(S.letter)}<div class="side"><h2>${t('voteT', { r: S.round })}</h2>
    <p class="muted">${t('voteHint')}</p>
    <div class="row"><button id="bDone">${t('done')}</button>${amHost ? `<button class="ghost" id="bForce">${t('force')}</button>` : ''}</div>
    <p class="note" id="waitFor"></p></div></div>
    <div class="scroll"><table id="rv"></table></div>`;
}
function resultsShell(amHost) {
  return `<div class="stage">${door(S.letter)}<div class="side"><h2>${t('resT', { r: S.round })}</h2>
    <p class="muted">${t('resHint')}${amHost ? ' ' + t('resHintHost') : ''}</p>
    ${amHost ? `<div class="row"><button id="bNext">${t('next')}</button><button class="ghost" id="bLob">${t('final')}</button></div>` : `<p class="note">${t('hostNext')}</p>`}</div></div>
    <div class="scroll"><table id="rv"></table></div>`;
}

function bind(amHost) {
  if (S.status === 'lobby' && amHost) {
    document.querySelectorAll('.cchip').forEach(b => (b.onclick = () => {
      const k = b.dataset.k;
      const cats = S.cats.includes(k) ? S.cats.filter(x => x !== k) : [...S.cats, k];
      if (cats.length >= 3) socket.emit('settings', { cats });
    }));
    document.querySelectorAll('.lchip').forEach(b => (b.onclick = () => socket.emit('settings', { lang: b.dataset.l })));
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

const word = (tx, crossed) => tx ? `<bdi class="${crossed ? 'x' : ''}" dir="auto">${esc(tx)}</bdi>` : '<span class="muted">—</span>';
const head = ps => `<thead><tr><th>${t('box')}</th>${ps.map(p => `<th><bdi>${esc(p.name)}</bdi>${p.id === you ? ' (' + t('you') + ')' : ''}${S.status === 'review' && S.done.includes(p.id) ? ' ✓' : ''}</th>`).join('')}</tr></thead>`;

function renderVote() {
  const T = $('#rv'), ps = S.players.filter(p => p.answers), votes = new Map(S.votes), done = new Set(S.done);
  const iDone = done.has(you);
  $('#bDone').textContent = iDone ? t('undo') : t('done');
  $('#bDone').className = iDone ? 'ghost' : '';
  const waiting = ps.filter(p => !done.has(p.id)).map(p => p.name);
  $('#waitFor').textContent = waiting.length ? t('waiting', { n: waiting.join(', ') }) : '';
  T.innerHTML = head(ps) + '<tbody>' +
    S.cats.map((k, i) => `<tr><td><b>${esc(catName(k))}</b></td>${ps.map(p => {
      const tx = p.answers[i] || '', v = votes.get(p.id + '|' + i) || [], mine = v.includes(you);
      const can = tx && p.id !== you && !iDone;
      const crossed = p.crossed[i] || (tx && !p.auto[i]);
      return `<td class="c${can ? ' h' : ''}${mine ? ' mine' : ''}" data-p="${esc(p.id)}" data-i="${i}">${word(tx, crossed)}${v.length ? `<span class="vt">✗ ${v.length}</span>` : ''}${tx && !p.auto[i] ? ` <span class="note">${t('wrongL')}</span>` : ''}</td>`;
    }).join('')}</tr>`).join('') + '</tbody>';
  T.querySelectorAll('td.h').forEach(td => (td.onclick = () => socket.emit('vote', { playerId: td.dataset.p, i: Number(td.dataset.i) })));
}

function renderResults(amHost) {
  const T = $('#rv'), ps = S.players.filter(p => p.answers), over = new Map(S.over);
  T.innerHTML = head(ps) + '<tbody>' +
    S.cats.map((k, i) => `<tr><td><b>${esc(catName(k))}</b></td>${ps.map(p => {
      const tx = p.answers[i] || '', pts = p.pts[i] || 0, by = over.get(p.id + '|' + i);
      return `<td>${word(tx, !pts && !!tx)}
        <div class="pts" data-p="${esc(p.id)}" data-i="${i}" data-v="${pts}">
          ${amHost ? `<button class="mini" data-d="-5" aria-label="${t('minus')}" ${pts <= 0 ? 'disabled' : ''}>−</button>` : ''}
          <span class="pt p${pts >= 10 ? 10 : pts >= 5 ? 5 : 0}">${pts}</span>
          ${amHost ? `<button class="mini" data-d="5" aria-label="${t('plus')}" ${pts >= 100 ? 'disabled' : ''}>+</button>` : ''}
          ${amHost && by ? `<button class="mini ghost reset" aria-label="${t('reset')}" title="${t('reset')}">↺</button>` : ''}
        </div>${by ? `<div class="note edited"></div>` : ''}</td>`;
    }).join('')}</tr>`).join('') +
    `<tr class="sum"><td>${t('total')}</td>${ps.map(p => `<td>+${p.roundSum}</td>`).join('')}</tr></tbody>`;
  // "modifié par X" (texte venant d'un autre joueur: textContent)
  T.querySelectorAll('.pts').forEach(box => {
    const by = over.get(box.dataset.p + '|' + box.dataset.i);
    const ed = box.parentElement.querySelector('.edited');
    if (ed && by) ed.textContent = '✎ ' + t('editedBy', { n: by });
    box.querySelectorAll('button[data-d]').forEach(b => (b.onclick = () => {
      const v = Math.max(0, Math.min(100, Number(box.dataset.v) + Number(b.dataset.d)));
      socket.emit('setpts', { playerId: box.dataset.p, i: Number(box.dataset.i), v });
    }));
    const r = box.querySelector('.reset');
    if (r) r.onclick = () => socket.emit('setpts', { playerId: box.dataset.p, i: Number(box.dataset.i), v: null });
  });
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
