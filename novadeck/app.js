'use strict';
/* ---------- Données ---------- */
const COLLECTIONS = [
  { id: 'ambre', name: 'Port-Ambre', tag: 'Le port des brumes', color: '#ffb23d', pal: ['#1b2440', '#ff8a3c', '#ffd27a', '#3a2a4a', '#120e1c'], cards: [
    ['Quai des Brumes', 'L'], ['Le Phare Borgne', 'L'], ['Marché aux Cordes', 'L'], ['Pont Sainte-Rouille', 'L'], ['Docker de Nuit', 'F'],
    ['La Capitaine Ysée', 'F'], ['Cargo Mirabelle', 'B'], ['Taxi Ambré', 'B'], ['Remorqueur 9', 'B'], ['Vieille Douane', 'L'],
    ['Le Contrebandier', 'F'], ['Grue Titan', 'L'], ['Hors-bord Safran', 'B'], ['Sirène de Brume', 'O'], ['Clé du Hangar 12', 'O'],
    ['Madame Courant', 'F'], ['Léviathan Rouillé', 'B'], ['Coffre des Marées', 'O'], ['Le Roi des Quais', 'F'], ['Ambre Noire', 'O']] },
  { id: 'cyan', name: 'Baie Cyan', tag: 'La côte qui ne dort pas', color: '#3de0d0', pal: ['#0d2b45', '#22c7b8', '#f6ff9a', '#14506a', '#06202c'], cards: [
    ['Promenade des Palmes', 'L'], ['Motel Lagune', 'L'], ['Surfeuse de l’Aube', 'F'], ['Glacier Polaris', 'L'], ['Cabriolet Menthe', 'B'],
    ['Jetée 44', 'L'], ['Maître-Nageur Zed', 'F'], ['Arcade Marée', 'L'], ['Skate de Bois', 'O'], ['Néon « Ouvert »', 'O'],
    ['Le DJ Corail', 'F'], ['Hydravion Turquoise', 'B'], ['Villa Miroir', 'L'], ['La Voltigeuse', 'F'], ['Cassette Dorée', 'O'],
    ['Reine du Front de Mer', 'F'], ['Le Requin Chromé', 'B'], ['Soleil en Bouteille', 'O'], ['Minuit Cyan', 'F'], ['L’Éclipse', 'O']] },
  { id: 'mesa', name: 'Mesa Rouge', tag: 'Le désert aux mille routes', color: '#ff5a3c', pal: ['#3a1230', '#ff5a3c', '#ffe08a', '#7a2a2a', '#240c14'], cards: [
    ['Station Dernière Chance', 'L'], ['Canyon du Sifflet', 'L'], ['Pick-up Poussière', 'B'], ['La Mécano Rita', 'F'], ['Diner Comète', 'L'],
    ['Cactus Centenaire', 'O'], ['Motard Solitaire', 'F'], ['Éolienne Tordue', 'L'], ['Radio Pirate', 'O'], ['Pont de Corde', 'L'],
    ['Le Shérif Fantôme', 'F'], ['Buggy Scorpion', 'B'], ['Mine d’Opale', 'L'], ['La Cartographe', 'F'], ['Boussole Fêlée', 'O'],
    ['Tempête de Cuivre', 'L'], ['Le Convoi', 'B'], ['Météorite', 'O'], ['Le Mirage', 'F'], ['Cœur de Mesa', 'O']] },
  { id: 'fer', name: 'Fer-Nord', tag: 'La cité des forges', color: '#7da2ff', pal: ['#0a1228', '#3b5bbd', '#dfe9ff', '#1d2c55', '#070b18'], cards: [
    ['Usine 7', 'L'], ['Tram de Minuit', 'B'], ['Soudeuse Ilka', 'F'], ['Passerelle Givrée', 'L'], ['Camion Cendre', 'B'],
    ['Kiosque à Vapeur', 'L'], ['Veilleur de Nuit', 'F'], ['Château d’Eau', 'L'], ['Clef à Molette', 'O'], ['Gare de Triage', 'L'],
    ['L’Ingénieure Volt', 'F'], ['Motoneige Cobalt', 'B'], ['Haut-Fourneau', 'L'], ['Le Syndic', 'F'], ['Plan Interdit', 'O'],
    ['La Dame de Fer', 'F'], ['Locomotive Zéro', 'B'], ['Turbine Boréale', 'O'], ['Le Fondeur', 'F'], ['Aurore Blanche', 'O']] },
  { id: 'aurora', name: 'Aurora', tag: 'Bientôt disponible', color: '#c77dff', pal: ['#14092c', '#8a3cff', '#b8ffd9', '#2c1660', '#0a0518'], locked: true, cards: [] },
];
const RARITY = ['Commune', 'Rare', 'Épique', 'Hors-série'];
const RCOLOR = ['#b79cc9', '#35f0ff', '#b98bff', '#ffe14d'];
const FINISH = ['Standard', 'Holographique', 'Full art holo'];
const KIND = { L: 'Lieu', B: 'Bolide', F: 'Figure', O: 'Objet' };
const CARDS = [];
COLLECTIONS.forEach(col => col.cards = col.cards.map(([name, kind], i) => {
  const c = { id: col.id + '-' + (i + 1), n: i + 1, name, kind, col, r: i < 10 ? 0 : i < 15 ? 1 : i < 18 ? 2 : 3 };
  CARDS.push(c); return c;
}));
const byId = Object.fromEntries(CARDS.map(c => [c.id, c]));
const RELEASE = new Date(2026, 11, 18, 18, 0, 0);
const CODES = { BIENVENUE: 2, NOVA: 1, HALCYON: 1 };
const WHEEL = [1, 0, 1, 2, 1, 0, 1, 3];
const RIVALS = [['Kestrel_9', 58, .9], ['Mirabeau', 51, .7], ['LunaVolt', 44, .8], ['Tacotac', 39, .5], ['Orso', 33, .6], ['Pixelle', 30, .4],
  ['Ravn', 24, .7], ['Bo_Zen', 21, .3], ['Séraphine', 17, .5], ['DocMarmotte', 14, .4], ['Nimbus', 11, .3], ['Yuzu', 8, .2]];

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const pad = n => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const weekId = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const hash = s => { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
const rng = seed => () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

/* ---------- État ---------- */
const KEY = 'novadeck.v1';
const blank = () => ({ user: null, packs: 0, owned: {}, lastDaily: null, lastSpin: null, codes: [], week: { id: weekId(), gained: 0 }, sound: true, opened: 0 });
let S = blank();
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { /* stockage indisponible */ }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* idem */ } };
const uniqueCount = () => Object.keys(S.owned).length;

/* ---------- Son ---------- */
let actx;
function beep(freq, dur = .08, type = 'triangle', vol = .08, when = 0) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + when;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur);
  } catch (e) { /* audio indisponible */ }
}
const sfx = {
  tear: () => { for (let i = 0; i < 6; i++) beep(180 + Math.random() * 400, .05, 'sawtooth', .04, i * .04); },
  flip: r => { beep(420 + r * 140, .09); if (r >= 1) [660, 880, 1100, 1320].slice(0, r + 1).forEach((f, i) => beep(f, .16, 'sine', .07, .08 + i * .09)); },
  tick: () => beep(900, .03, 'square', .03),
  win: () => [523, 659, 784, 1047].forEach((f, i) => beep(f, .18, 'sine', .08, i * .1)),
};

/* ---------- Illustrations procédurales ---------- */
function art(c, wide) {
  const r = rng(hash(c.id)), [top, mid, sun, far, near] = c.col.pal, W = wide ? 480 : 300, H = wide ? 300 : 420, g = 'g' + c.id + (wide ? 'w' : '');
  const base = H * .72, sx = W * (.25 + r() * .5), sy = H * (.3 + r() * .14), sr = H * (.11 + r() * .06);
  let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".75" stop-color="${mid}"/></linearGradient><pattern id="p${g}" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#000"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#${g})"/>`;
  for (let i = 0; i < 14; i++) s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * H * .4).toFixed(0)}" r="${(r() * 1.4 + .4).toFixed(1)}" fill="#fff" opacity="${(.3 + r() * .5).toFixed(2)}"/>`;
  s += `<circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="${sr.toFixed(0)}" fill="${sun}"/>`;
  for (let i = 1; i < 5; i++) s += `<rect x="${(sx - sr).toFixed(0)}" y="${(sy + sr * (i * .22 - .1)).toFixed(0)}" width="${(sr * 2).toFixed(0)}" height="${(1 + i * 1.2).toFixed(1)}" fill="${mid}"/>`;
  for (let x = -10; x < W;) { const w = 18 + r() * 34, h = 30 + r() * H * .3; s += `<rect x="${x.toFixed(0)}" y="${(base - h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 4).toFixed(0)}" fill="${far}"/>`; x += w + r() * 6; }
  s += `<rect y="${base.toFixed(0)}" width="${W}" height="${H}" fill="${near}"/>`;
  const cx = W / 2, k = wide ? 'L' : c.kind;
  if (k === 'L') {
    for (let x = 6; x < W - 20;) { const w = 34 + r() * 46, h = 60 + r() * H * .36, y = H * .9 - h; s += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 60).toFixed(0)}" fill="${near}"/>`;
      for (let wy = y + 10; wy < H * .88; wy += 16) for (let wx = x + 7; wx < x + w - 8; wx += 12) if (r() < .45) s += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="8" fill="${sun}" opacity=".85"/>`;
      x += w + 4 + r() * 14; }
  } else if (k === 'B') {
    const y = H * .8;
    s += `<path d="M${cx - 130} ${y}q8-30 52-34l30-30q10-9 32-9h54q22 0 36 17l20 23q34 4 36 33v12h-260z" fill="${top}" stroke="${sun}" stroke-width="3"/><path d="M${cx - 42} ${y - 60}h60l22 26h-104z" fill="${mid}" opacity=".8"/><circle cx="${cx - 76}" cy="${y + 12}" r="22" fill="#05060a" stroke="${sun}" stroke-width="4"/><circle cx="${cx + 78}" cy="${y + 12}" r="22" fill="#05060a" stroke="${sun}" stroke-width="4"/><path d="M${cx + 128} ${y - 16}l60-14v40z" fill="${sun}" opacity=".45"/>`;
  } else if (k === 'F') {
    const hy = H * .56;
    s += `<path d="M${cx - 110} ${H}q0-${H * .3} 110-${H * .31}q110 ${H * .01} 110 ${H * .31}z" fill="${top}" stroke="${sun}" stroke-width="3"/><circle cx="${cx}" cy="${hy}" r="46" fill="${top}" stroke="${sun}" stroke-width="3"/>`;
    const v = r();
    if (v < .34) s += `<rect x="${cx - 70}" y="${hy - 40}" width="140" height="9" rx="4" fill="${sun}"/><path d="M${cx - 42} ${hy - 40}q0-46 42-46t42 46z" fill="${near}" stroke="${sun}" stroke-width="3"/>`;
    else if (v < .67) s += `<rect x="${cx - 44}" y="${hy - 14}" width="88" height="20" rx="10" fill="${sun}" opacity=".9"/>`;
    else s += `<path d="M${cx - 48} ${hy - 10}q-6-62 48-62t48 62q-20-30-48-30t-48 30z" fill="${sun}"/>`;
  } else {
    const cy = H * .6, n = 4 + Math.floor(r() * 4) * 2, R = 78, pts = [];
    for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2, d = i % 2 ? R * (.45 + r() * .2) : R; pts.push((cx + Math.cos(a) * d).toFixed(0) + ',' + (cy + Math.sin(a) * d).toFixed(0)); }
    for (let i = 0; i < 16; i++) { const a = Math.PI * i / 8; s += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 190).toFixed(0)}" y2="${(cy + Math.sin(a) * 190).toFixed(0)}" stroke="${sun}" stroke-width="2" opacity=".28"/>`; }
    s += `<polygon points="${pts.join(' ')}" fill="${sun}" stroke="${top}" stroke-width="5" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="20" fill="${top}"/>`;
  }
  return s + `<rect width="${W}" height="${H}" fill="url(#p${g})" opacity=".1"/></svg>`;
}
function cardHTML(c, f = 0, dup = 0, tag = 'div') {
  return `<${tag} class="card r${c.r} f${f}"${tag === 'button' ? ` data-card="${c.id}" aria-label="${esc(c.name)}, ${RARITY[c.r]}, ${FINISH[f]}"` : ''}><span class="art">${art(c)}</span><span class="meta"><span class="name">${esc(c.name)}</span><span class="sub"><span>${pad(c.n)}/20 · ${KIND[c.kind]}</span><b>${RARITY[c.r]}</b></span></span>${dup > 1 ? `<span class="dup">×${dup}</span>` : ''}<span class="shine"></span></${tag}>`;
}

/* ---------- Interface générale ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3200); }
function openDlg(id) { const d = $('#' + id); if (!d.open) d.showModal(); }
$$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); }));
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o) ({ wheel: openWheel, code: openCode })[o.dataset.open]();
  const c = e.target.closest('[data-card]'); if (c) showCard(c.dataset.card);
});

function refreshTop() {
  $('#accountBtn').textContent = S.user ? S.user : 'Créer mon compte';
  $('#packChip').hidden = !S.user; $('#packCount').textContent = S.packs; $('#packPlural').textContent = S.packs > 1 ? 's' : '';
  const spun = S.lastSpin === today();
  $('#wheelBandText').textContent = spun ? 'Tour du jour utilisé. Reviens demain.' : 'Un tour gratuit par jour : jusqu’à 3 boosters à gagner.';
  $('#heroFine').textContent = S.user ? `${S.packs} booster${S.packs > 1 ? 's' : ''} en réserve · +2 chaque jour` : 'Gratuit · 5 cartes par paquet · essai immédiat sans compte';
  $('#heroPack').textContent = S.user && !S.packs ? 'Plus de paquet aujourd’hui' : 'Déchirer un paquet ↗';
  $('#boosterOpen').textContent = S.user ? 'Ouvrir un paquet ↗' : 'Essayer l’ouverture ↗';
  $('#soundBtn').setAttribute('aria-pressed', S.sound); $('#soundBtn').setAttribute('aria-label', S.sound ? 'Son activé' : 'Son coupé');
}
$('#soundBtn').onclick = () => { S.sound = !S.sound; save(); refreshTop(); sfx.tick(); };
$('#packChip').onclick = () => startPack();
$('#heroPack').onclick = () => startPack();
$('#boosterOpen').onclick = () => startPack();
function refreshAll() { refreshTop(); renderBinder(); renderRank(); }

/* ---------- Compte (local) ---------- */
$('#accountBtn').onclick = openAccount;
function openAccount() {
  const b = $('#accountBody');
  if (!S.user) {
    b.innerHTML = `<h3>Crée ton compte</h3><p class="fine">3 boosters offerts, ton premier paquet s’ouvre tout de suite. Ta partie est enregistrée sur cet appareil : ni e-mail ni mot de passe.</p>
      <form id="signForm"><label for="pseudo">Pseudo</label><input id="pseudo" required minlength="3" maxlength="16" pattern="[A-Za-zÀ-ÿ0-9_\\- ]+" autocomplete="nickname" placeholder="3 à 16 caractères"><button class="btn big">Créer mon compte ↗</button></form>`;
    $('#signForm').onsubmit = e => {
      e.preventDefault(); const v = $('#pseudo').value.trim(); if (v.length < 3) return;
      S.user = v; S.packs = 3; S.lastDaily = today(); save(); $('#dlgAccount').close(); refreshAll(); toast('Bienvenue ' + v + ' : 3 boosters offerts'); startPack();
    };
  } else {
    const holo = Object.values(S.owned).filter(o => o.f.some((n, i) => i && n)).length;
    b.innerHTML = `<h3>${esc(S.user)}</h3><div class="stats"><div><b>${uniqueCount()}</b><span>cartes</span></div><div><b>${holo}</b><span>holo</span></div><div><b>${S.opened}</b><span>paquets</span></div></div>
      <form id="renameForm"><label for="pseudo">Changer de pseudo</label><input id="pseudo" required minlength="3" maxlength="16" pattern="[A-Za-zÀ-ÿ0-9_\\- ]+" value="${esc(S.user)}"><button class="btn">Enregistrer</button></form>
      <button class="linkish" id="resetBtn">Effacer ma partie sur cet appareil</button>`;
    $('#renameForm').onsubmit = e => { e.preventDefault(); const v = $('#pseudo').value.trim(); if (v.length < 3) return; S.user = v; save(); $('#dlgAccount').close(); refreshAll(); toast('Pseudo mis à jour'); };
    $('#resetBtn').onclick = () => { if (confirm('Effacer définitivement ta collection et ton compte sur cet appareil ?')) { S = blank(); save(); $('#dlgAccount').close(); refreshAll(); toast('Partie effacée'); } };
  }
  openDlg('dlgAccount');
}
function dailyGrant() {
  if (S.week.id !== weekId()) S.week = { id: weekId(), gained: 0 };
  if (S.user && S.lastDaily !== today()) { S.lastDaily = today(); S.packs += 2; toast('Nouveau jour : +2 boosters'); }
  save();
}

/* ---------- Tirage et ouverture ---------- */
function drawCard(r, minR) {
  let x = r() * 100, rar = x < 1.5 ? 3 : x < 8 ? 2 : x < 30 ? 1 : 0; if (rar < minR) rar = minR;
  const pool = CARDS.filter(c => c.r === rar), y = r() * 100;
  return { c: pool[Math.floor(r() * pool.length)], f: y < 3 ? 2 : y < 18 ? 1 : 0 };
}
function drawPack() { const out = []; for (let i = 0; i < 5; i++) out.push(drawCard(Math.random, i === 4 ? 1 : 0)); return out; }
function grant(pulls) {
  pulls.forEach(p => {
    const o = S.owned[p.c.id]; p.isNew = !o;
    if (o) { o.n++; o.f[p.f]++; } else { S.owned[p.c.id] = { n: 1, f: [0, 0, 0] }; S.owned[p.c.id].f[p.f] = 1; S.week.gained++; }
  });
  S.opened++; save();
}
function startPack() {
  const demo = !S.user;
  if (!demo && S.packs < 1) { toast('Plus de booster : tourne la roue ou reviens demain'); return; }
  const st = $('#packStage');
  st.innerHTML = `<p class="pack-stage-title">${demo ? 'Paquet de démonstration' : 'Booster Nova Deck'}</p><p class="fine">Touche le paquet pour le déchirer.</p>
    <button class="tear" id="tear" aria-label="Déchirer le paquet"><span class="pack"><span>NOVA<b>DECK</b></span><small>5 CARTES</small></span></button>`;
  openDlg('dlgPack');
  $('#tear').onclick = function () {
    if (this.classList.contains('ripped')) return;
    this.classList.add('ripped'); sfx.tear();
    const pulls = drawPack();
    if (!demo) { S.packs--; grant(pulls); refreshAll(); }
    setTimeout(() => reveal(pulls, demo), matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 650);
  };
  $('#tear').focus();
}
function reveal(pulls, demo) {
  const st = $('#packStage');
  st.innerHTML = `<p class="pack-stage-title">Tes cinq cartes</p><p class="fine">Touche chaque carte pour la retourner.</p><div class="reveal">${pulls.map((p, i) =>
    `<button class="flip${p.c.r ? ' hot' : ''}" style="--glow:${RCOLOR[p.c.r]}88" data-i="${i}" aria-label="Retourner la carte ${i + 1}">${p.isNew ? '<span class="new-tag">Nouvelle</span>' : ''}<span class="inner"><span class="back">ND</span><span class="front">${cardHTML(p.c, p.f)}</span></span></button>`).join('')}</div>
    <div class="pack-actions"><button class="btn ghost" id="flipAll">Tout révéler</button></div><div id="packEnd"></div>`;
  let left = 5;
  const flip = b => {
    if (b.classList.contains('on')) return; b.classList.add('on'); const p = pulls[b.dataset.i]; sfx.flip(p.c.r);
    b.setAttribute('aria-label', `${p.c.name}, ${RARITY[p.c.r]}, ${FINISH[p.f]}`);
    if (!--left) end();
  };
  $$('.flip', st).forEach(b => b.onclick = () => flip(b));
  $('#flipAll').onclick = () => $$('.flip', st).forEach((b, i) => setTimeout(() => flip(b), i * 180));
  function end() {
    $('#flipAll').remove();
    const nw = pulls.filter(p => p.isNew).length;
    $('#packEnd').innerHTML = demo
      ? `<p class="lead" style="margin:1rem auto">C’était une démonstration : ces cartes ne sont pas gardées. Crée ton compte pour 3 vrais boosters, puis 2 par jour.</p><div class="pack-actions"><button class="btn big" id="endSign">Créer mon compte ↗</button><button class="btn ghost" id="endAgain">Réessayer ↻</button></div>`
      : `<p class="lead" style="margin:1rem auto">${nw ? nw + ' nouvelle' + (nw > 1 ? 's' : '') + ' carte' + (nw > 1 ? 's' : '') + ' au classeur.' : 'Que des doublons cette fois.'} Il te reste ${S.packs} booster${S.packs > 1 ? 's' : ''}.</p><div class="pack-actions">${S.packs ? '<button class="btn big" id="endAgain">Ouvrir un autre paquet ↻</button>' : ''}<button class="btn ghost" id="endBinder">Voir le classeur</button></div>`;
    const a = $('#endAgain'); if (a) a.onclick = startPack;
    const s = $('#endSign'); if (s) s.onclick = () => { $('#dlgPack').close(); openAccount(); };
    const bn = $('#endBinder'); if (bn) bn.onclick = () => { $('#dlgPack').close(); location.hash = '#classeur'; };
  }
}

/* ---------- Classeur ---------- */
let curCol = COLLECTIONS[0], curFilter = 'all';
function renderTabs() {
  $('#tabs').innerHTML = COLLECTIONS.map(c => { const own = c.cards.filter(k => S.owned[k.id]).length;
    return `<button class="tab" role="tab" style="--c:${c.color}" data-col="${c.id}" aria-selected="${c === curCol}"${c.locked ? ' disabled' : ''}><i></i>${esc(c.name)}<small>${c.locked ? 'bientôt' : own + '/20'}</small></button>`; }).join('');
}
function renderBinder() {
  renderTabs();
  const own = curCol.cards.filter(c => S.owned[c.id]).length;
  $('#progBar').style.width = own * 5 + '%'; $('#progBar').style.background = curCol.color;
  $('#progText').textContent = `${curCol.name} · ${own}/20`;
  $('#binderStats').textContent = `4 collections · ${uniqueCount()}/80 cartes · 0 spoiler`;
  const list = curCol.cards.filter(c => curFilter === 'all' || (curFilter === 'own') === !!S.owned[c.id]);
  $('#grid').innerHTML = list.length ? list.map(c => { const o = S.owned[c.id];
    if (!o) return `<div class="slot"><div><b>${pad(c.n)}</b><span>${c.r === 3 ? 'Hors-série' : 'Scellée'}</span></div></div>`;
    return cardHTML(c, o.f[2] ? 2 : o.f[1] ? 1 : 0, o.n, 'button'); }).join('')
    : `<p class="empty">${curFilter === 'own' ? 'Aucune carte de cette collection pour l’instant. Ouvre un paquet.' : 'Collection complète. Bravo.'}</p>`;
}
$('#tabs').onclick = e => { const t = e.target.closest('[data-col]'); if (!t || t.disabled) return; curCol = COLLECTIONS.find(c => c.id === t.dataset.col); renderBinder(); };
$$('[data-filter]').forEach(b => b.onclick = () => { curFilter = b.dataset.filter; $$('[data-filter]').forEach(x => x.classList.toggle('on', x === b)); renderBinder(); });

/* ---------- Fiche carte ---------- */
function showCard(id, shared) {
  const c = byId[id]; if (!c) return;
  const o = S.owned[id] || { n: 0, f: [shared ? 1 : 0, 0, 0] };
  let f = o.f[2] ? 2 : o.f[1] ? 1 : 0;
  const draw = () => {
    $('#tilt').innerHTML = cardHTML(c, f);
    $('#cardInfo').innerHTML = `<p class="eyebrow" style="color:${c.col.color}">${esc(c.col.name)} · ${pad(c.n)}/20</p><h3>${esc(c.name)}</h3><p class="fine">${KIND[c.kind]} · ${RARITY[c.r]}${o.n ? ' · ' + o.n + ' exemplaire' + (o.n > 1 ? 's' : '') : ' · carte partagée'}</p>
      <div class="finishes" role="group" aria-label="Choisir une finition">${FINISH.map((n, i) => `<button class="pill${i === f ? ' on' : ''}" data-f="${i}"${o.f[i] ? '' : ' disabled title="Finition non obtenue"'}>${n}${o.f[i] > 1 ? ' ×' + o.f[i] : ''}</button>`).join('')}</div>
      <p class="fine">Bouge le curseur ou le doigt sur la carte pour faire jouer la lumière.</p><button class="btn" id="shareBtn" style="margin-top:1rem">Partager cette carte ↗</button>`;
    $$('[data-f]', $('#cardInfo')).forEach(b => b.onclick = () => { f = +b.dataset.f; draw(); });
    $('#shareBtn').onclick = async () => {
      const url = location.origin + location.pathname + '?carte=' + c.id, data = { title: 'Nova Deck', text: `J’ai trouvé « ${c.name} » (${RARITY[c.r]}) sur Nova Deck`, url };
      try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(url); toast('Lien copié'); } } catch (e) { /* partage annulé */ }
    };
  };
  draw(); openDlg('dlgCard');
}
$('#tilt').addEventListener('pointermove', e => {
  const el = $('#tilt .card'); if (!el) return; const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
  el.style.setProperty('--ry', (x - .5) * 28 + 'deg'); el.style.setProperty('--rx', (.5 - y) * 22 + 'deg'); el.style.setProperty('--mx', x * 100);
});
$('#tilt').addEventListener('pointerleave', () => { const el = $('#tilt .card'); if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } });

/* ---------- Roue ---------- */
let rot = 0, spinning = false;
$('#wheel').innerHTML = WHEEL.map((v, i) => `<span style="transform:rotate(${i * 45 + 22.5}deg)"><b style="color:${[0, 4].includes(i) || [2, 6, 7].includes(i) ? '#1a0420' : i === 3 ? '#1a0420' : '#fff4fc'}">${v ? '+' + v : 'RIEN'}</b></span>`).join('');
function openWheel() {
  const spun = S.lastSpin === today();
  $('#wheelMsg').textContent = !S.user ? 'Crée ton compte pour tourner : un tour gratuit par jour.' : spun ? 'Tour du jour déjà utilisé. Reviens demain.' : 'Un tour gratuit par jour : des boosters à gagner.';
  $('#spinBtn').textContent = S.user ? 'Tourner ↗' : 'Créer mon compte ↗'; $('#spinBtn').disabled = !!S.user && spun;
  openDlg('dlgWheel');
}
$('#spinBtn').onclick = () => {
  if (!S.user) { $('#dlgWheel').close(); return openAccount(); }
  if (spinning || S.lastSpin === today()) return;
  spinning = true; $('#spinBtn').disabled = true;
  const i = Math.floor(Math.random() * 8), win = WHEEL[i];
  S.lastSpin = today(); S.packs += win; save();
  rot = Math.ceil(rot / 360) * 360 + 360 * 5 + (360 - (i * 45 + 22.5));
  $('#wheel').style.transform = `rotate(${rot}deg)`;
  const tk = setInterval(sfx.tick, 160);
  setTimeout(() => {
    clearInterval(tk); spinning = false; refreshAll();
    $('#wheelMsg').textContent = win ? `Gagné : +${win} booster${win > 1 ? 's' : ''}. Reviens demain.` : 'Rien cette fois. Reviens demain.';
    if (win) { sfx.win(); toast(`+${win} booster${win > 1 ? 's' : ''}`); }
  }, matchMedia('(prefers-reduced-motion:reduce)').matches ? 50 : 4300);
};

/* ---------- Codes ---------- */
function openCode() { $('#codeMsg').textContent = 'Essaie BIENVENUE pour 2 boosters.'; $('#codeInput').value = ''; openDlg('dlgCode'); }
$('#codeForm').onsubmit = e => {
  e.preventDefault(); const v = $('#codeInput').value.trim().toUpperCase(), m = $('#codeMsg');
  if (!S.user) { $('#dlgCode').close(); toast('Crée ton compte pour utiliser un code'); return openAccount(); }
  if (!CODES[v]) m.textContent = 'Code inconnu.';
  else if (S.codes.includes(v)) m.textContent = 'Code déjà utilisé.';
  else { S.codes.push(v); S.packs += CODES[v]; save(); refreshAll(); $('#dlgCode').close(); toast(`Code validé : +${CODES[v]} booster${CODES[v] > 1 ? 's' : ''}`); }
};

/* ---------- Classement ---------- */
let rankMode = 'all';
function renderRank() {
  const day = Math.floor(Date.now() / 864e5) - 20770, dow = (new Date().getDay() + 6) % 7;
  const rows = RIVALS.map(([n, a, b]) => ({ n, v: rankMode === 'all' ? Math.min(78, a + Math.floor(Math.max(0, day) * b)) : Math.floor((dow + 1) * (1 + b * 3)) }));
  rows.push({ n: S.user || 'Toi', me: true, v: rankMode === 'all' ? uniqueCount() : S.week.gained });
  rows.sort((x, y) => y.v - x.v || (x.me ? -1 : 1));
  const meI = rows.findIndex(r => r.me), show = rows.slice(0, 8); if (meI > 7) show.push(rows[meI]);
  $('#rank').innerHTML = show.map(r => `<li class="${r.me ? 'me' : ''}"><b>${rows.indexOf(r) + 1}</b><span>${esc(r.n)}${r.me ? ' <small>(toi)</small>' : ''}</span><b>${r.v} <small>carte${r.v > 1 ? 's' : ''}</small></b></li>`).join('');
}
$$('[data-rank]').forEach(b => b.onclick = () => { rankMode = b.dataset.rank; $$('[data-rank]').forEach(x => x.classList.toggle('on', x === b)); renderRank(); });

/* ---------- Statique : héros, collections, compte à rebours ---------- */
$('#heroFan').innerHTML = ['ambre-19', 'cyan-17', 'mesa-12', 'fer-16'].map((id, i) => cardHTML(byId[id], [0, 1, 0, 2][i])).join('');
$('#showPack').innerHTML = '<span>NOVA<b>DECK</b></span><small>5 CARTES</small>';
$('#worlds').innerHTML = COLLECTIONS.map(c => `<button class="world${c.locked ? ' locked' : ''}" data-world="${c.id}"${c.locked ? ' disabled' : ''}>${art({ id: c.id + '-w', col: c }, true)}<div><h3>${esc(c.name)}</h3><p>${esc(c.tag)}${c.locked ? '' : ' · 20 cartes'}</p></div></button>`).join('');
$('#worlds').onclick = e => { const w = e.target.closest('[data-world]'); if (!w || w.disabled) return; curCol = COLLECTIONS.find(c => c.id === w.dataset.world); renderBinder(); location.hash = '#classeur'; };
function tick() {
  let d = Math.max(0, RELEASE - Date.now()) / 1000 | 0;
  const v = { d: d / 86400 | 0, h: (d % 86400) / 3600 | 0, m: (d % 3600) / 60 | 0, s: d % 60 };
  $$('[data-cd]').forEach(el => { const t = pad(v[el.dataset.cd]); if (el.textContent !== t) el.textContent = t; });
}
tick(); setInterval(tick, 1000);

dailyGrant(); refreshAll();
document.addEventListener('visibilitychange', () => { if (!document.hidden) { dailyGrant(); refreshAll(); } });
const shared = new URLSearchParams(location.search).get('carte');
if (shared && byId[shared]) showCard(shared, true);
