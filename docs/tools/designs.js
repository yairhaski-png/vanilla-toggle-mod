'use strict';
// Illustrated shirt graphics. Each design returns front/back art {W,H,svg,place} (units: 0.01 inch).
const { LOGOS, SYMBOLS, mascot, nid } = require('./art');
const M = require('./mockups');

const INK = '#141018';
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const colors = (P) => {
  const dk = P.text === '#F6F1E7';
  return { dk, pink: dk ? '#F062C8' : '#E24FC0', gold: dk ? '#E9C46A' : '#E0A526', mint: dk ? '#5EEAD4' : '#14B8A6', orange: '#FF9A3D', red: '#E5484D', night: '#2E1A6B', cream: '#F6F1E7' };
};

// ---- primitives
const T = (txt, x, y, size, fill, o = {}) =>
  `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="${o.font || 'Bungee'}" ${o.weight ? `font-weight="${o.weight}"` : ''} font-size="${size}" fill="${fill}" ${o.ls ? `letter-spacing="${o.ls}"` : ''} ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 8}" stroke-linejoin="round" paint-order="stroke"` : ''} ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''}>${String(txt).replace(/&/g, '&amp;')}</text>`;
const SANS = 'Arial, Helvetica, DejaVu Sans, sans-serif';
const fit = (len, w, max) => M.fitFont(len, w, max);
const mas = (opts, P, cx, cy, size, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${size / 200}) translate(-100 -96)">${mascot({ P, fill: P.main, ...opts })}</g>`;
const logo = (id, P, cx, cy, size, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot})">${M.logoBox(id, P, -size / 2, -size / 2, size)}</g>`;
const sym = (id, P, cx, cy, size, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot})">${M.symBox(id, P, -size / 2, -size / 2, size)}</g>`;
const sparkle = (x, y, r, fill, op = 1) => `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z" fill="${fill}" opacity="${op}"/>`;
function stars(n, x0, y0, w, h, seed, fills, rmax = 10) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h, k = r(), f = fills[Math.floor(r() * fills.length)];
    s += k > 0.7 ? sparkle(Math.round(x), Math.round(y), Math.round(rmax * (0.8 + r())), f, 0.9) : `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + r() * rmax * 0.35).toFixed(1)}" fill="${f}" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`;
  }
  return s;
}
function arcText(txt, cx, cy, r, size, fill, { bottom = false, font = 'Bungee', ls = 0, weight } = {}) {
  const id = nid('ar');
  const d = bottom ? `M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx + r} ${cy}` : `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return `<defs><path id="${id}" d="${d}"/></defs><text font-family="${font}" ${weight ? `font-weight="${weight}"` : ''} font-size="${size}" fill="${fill}" letter-spacing="${ls}" text-anchor="middle"><textPath href="#${id}" startOffset="50%">${txt}</textPath></text>`;
}
// sticker: logo with white die-cut border
function stk(id, P, cx, cy, size, rot = 0) {
  const fid = nid('sf');
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><svg x="${-size / 2}" y="${-size / 2}" width="${size}" height="${size}" viewBox="-6 -6 212 212" overflow="visible">
<defs><filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="7" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feMerge><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#${fid})">${LOGOS[id] ? LOGOS[id].draw(P) : SYMBOLS[id].draw(P)}</g></svg></g>`;
}
const art = (W, H, svg, place) => ({ W, H, svg, place });
const chestArt = (svg) => art(340, 340, svg, { top: 150, dx: 50 });
const wm = (x, y, size, fill) => M.wordmark(x, y, size, fill);

// =====================================================================
const D = {};

// 1 ------------------------------------------------ Abduction Report
D.abduction = {
  front: (P) => { const c = colors(P); return chestArt(sym('ufo', P, 170, 130, 250) + T('CASE 0042', 170, 300, 64, P.text)); },
  back: (P) => {
    const c = colors(P), g = nid('bm');
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.gold}" stop-opacity=".85"/><stop offset="1" stop-color="${c.gold}" stop-opacity=".04"/></linearGradient></defs>`;
    s += stars(52, 0, 0, 1100, 780, 7, [c.cream, P.accent, c.gold], 12);
    s += `<circle cx="900" cy="180" r="112" fill="${c.cream}" opacity=".95"/><circle cx="870" cy="150" r="20" fill="${P.accent}" opacity=".3"/><circle cx="930" cy="215" r="28" fill="${P.accent}" opacity=".3"/><circle cx="880" cy="225" r="12" fill="${P.accent}" opacity=".3"/>`;
    s += `<polygon points="420,330 680,330 880,960 220,960" fill="url(#${g})"/>`;
    s += `<path d="M395 296 C395 160 705 160 705 296 Z" fill="${c.cream}" fill-opacity=".25" stroke="${P.main}" stroke-width="14" stroke-linejoin="round"/>`;
    s += mas({ eyesType: 'classic' }, P, 550, 236, 130);
    s += `<ellipse cx="550" cy="312" rx="340" ry="82" fill="${P.main}"/><ellipse cx="550" cy="286" rx="300" ry="40" fill="#fff" opacity=".13"/>`;
    [280, 415, 550, 685, 820].forEach((x) => (s += `<circle cx="${x}" cy="326" r="14" fill="${c.gold}"/>`));
    s += mas({ eyesType: 'surprised', arms: ['M36 124 Q6 100 12 62', 'M164 124 Q194 100 188 62'] }, P, 550, 660, 400, 8);
    s += `<path d="M0 1050 L0 950 Q180 900 360 950 T740 940 T1100 930 L1100 1050 Z" fill="${c.night}"/>`;
    [[110, 990, 90, 60], [250, 975, 70, 80], [790, 985, 100, 65], [930, 965, 80, 85]].forEach(([x, y, w, h]) => {
      s += `<rect x="${x}" y="${y - h + 60}" width="${w}" height="${h}" fill="${P.main}"/><rect x="${x + w * 0.25}" y="${y - h + 80}" width="${w * 0.2}" height="${w * 0.2}" fill="${c.gold}"/><rect x="${x + w * 0.6}" y="${y - h + 80}" width="${w * 0.2}" height="${w * 0.2}" fill="${c.gold}"/>`;
    });
    s += T('ABDUCTED', 550, 1195, fit(8, 1040, 190), P.text) + T('CASE FILE 0042 · SUBJECT: VEXO', 550, 1265, 46, P.accent, { font: SANS, weight: 700, ls: 6 });
    return art(1100, 1300, s, { top: 130 });
  },
};

// 2 ------------------------------------------------ World Tour
D.tour = {
  front: (P) => {
    const c = colors(P);
    let s = stars(20, 40, 0, 1020, 380, 11, [c.gold, P.accent], 12);
    s += mas({ acc: 'headphones', eyesType: 'classic' }, P, 550, 340, 620);
    s += T('VEXO', 550, 850, 300, P.text, { stroke: P.main, sw: 16 });
    s += `<rect x="120" y="905" width="860" height="110" rx="55" fill="${c.pink}"/>` + T('WORLD TOUR 2026', 550, 985, fit(15, 800, 84), c.dk ? INK : '#fff');
    s += T('GALAXY EDITION', 550, 1080, 52, P.accent, { font: SANS, weight: 700, ls: 14 });
    return art(1100, 1130, s, { top: 140 });
  },
  back: (P) => {
    const c = colors(P);
    const rows = [['AUG 01', 'MARS', 'SOLD OUT'], ['AUG 08', 'SATURN', 'SOLD OUT'], ['AUG 15', 'PLUTO', 'LAST TICKETS'], ['AUG 22', 'NEPTUNE', 'SOLD OUT'], ['AUG 29', 'THE MOON', 'SOLD OUT'], ['SEP 05', 'ANDROMEDA', 'SOON']];
    let s = T('VEXO', 550, 230, 250, P.text, { stroke: P.main, sw: 14 }) + T('WORLD TOUR 2026', 550, 320, 78, c.pink);
    s += `<rect x="70" y="360" width="960" height="10" fill="${P.main}"/>`;
    rows.forEach(([d, city, st], i) => {
      const y = 460 + i * 110;
      s += T(d, 80, y, 56, P.accent, { anchor: 'start' }) + T(city, 330, y, 62, P.text, { anchor: 'start' }) + T(st, 1020, y, 40, st === 'SOLD OUT' ? c.gold : c.pink, { anchor: 'end' });
      s += `<rect x="70" y="${y + 30}" width="960" height="3" fill="${P.accent}" opacity=".35"/>`;
    });
    s += mas({ acc: 'headphones' }, P, 550, 1195, 250);
    return art(1100, 1400, s, { top: 130 });
  },
};

// 3 ------------------------------------------------ Snack Club
function pizza(c, x, y, s, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-95 -105 L95 -105 L0 120 Z" fill="${c.gold}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-105" y="-130" width="210" height="42" rx="21" fill="${c.orange}" stroke="${INK}" stroke-width="7"/>` +
    [[-42, -50, 22], [40, -44, 20], [0, 14, 20], [-18, -78, 0]].map(([px, py, r]) => (r ? `<circle cx="${px}" cy="${py}" r="${r}" fill="${c.red}" stroke="${INK}" stroke-width="4"/>` : '')).join('') + '</g>';
}
D.snacks = {
  front: (P) => {
    const c = colors(P);
    let s = stars(16, 60, 30, 980, 300, 5, [c.gold, c.pink], 12);
    s += mas({ arms: ['M30 128 Q6 118 6 96', 'M170 124 Q200 112 214 84'], eyesType: 'classic' }, P, 470, 430, 620);
    s += pizza(c, 890, 300, 1.35, 24);
    s += T('SNACKS', 550, 900, fit(6, 1000, 250), P.text, { stroke: P.main, sw: 14 }) + T('FROM SPACE', 550, 1050, fit(10, 1000, 170), c.gold);
    s += T('OPEN 24/7 · ALL GALAXIES', 550, 1130, 46, P.accent, { font: SANS, weight: 700, ls: 8 });
    return art(1100, 1180, s, { top: 140 });
  },
  back: (P) => {
    const c = colors(P);
    const items = [['MOON CHEESE PIZZA', '5'], ['COMET FRIES', '3'], ['NEBULA SHAKE', '4'], ['STAR SPRINKLE DONUT', '2'], ['BLACK HOLE BURGER', '7'], ['ROCKET POPS', '2']];
    let s = mas({ acc: 'chef', arms: ['M30 128 Q6 118 6 96', 'M170 128 Q194 118 194 96'] }, P, 550, 200, 330);
    s += T('SPACE DINER', 550, 470, fit(11, 1000, 170), P.text, { stroke: P.main, sw: 12 }) + T('EST. 2026 · NO HUMANS ALLOWED', 550, 535, 40, c.pink, { font: SANS, weight: 700, ls: 6 });
    items.forEach(([n, p], i) => {
      const y = 650 + i * 92;
      s += T(n, 60, y, 50, P.text, { anchor: 'start' }) + T(`${p} GALAXY COINS`, 1040, y, 34, c.gold, { anchor: 'end', font: SANS, weight: 700 });
      s += `<path d="M60 ${y + 26} H1040" stroke="${P.accent}" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round"/>`;
    });
    s += T('TIPS ACCEPTED IN STARDUST', 550, 1250, 40, P.accent, { font: SANS, weight: 700, ls: 6 });
    return art(1100, 1300, s, { top: 130 });
  },
};

// 4 ------------------------------------------------ Arcade Champion
const INV1 = ['......#......', '.....###.....', '...#######...', '..#########..', '.###########.', '###..###..###', '###..###..###', '#############', '##.###.###.##', '#...##.##...#'];
const INV2 = ['.....###.....', '...#######...', '..#########..', '.###########.', '####..#..####', '####..#..####', '#############', '#.###.#.###.#', '#..##...##..#', '...#.....#...'];
function sprite(rows, x, y, c, fill) {
  let s = '';
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') s += `<rect x="${x + i * c}" y="${y + j * c}" width="${c + 0.6}" height="${c + 0.6}" fill="${fill}" shape-rendering="crispEdges"/>`; }));
  return s;
}
D.arcade = {
  front: (P) => {
    const c = colors(P);
    let s = `<rect x="10" y="10" width="1080" height="1170" rx="50" fill="none" stroke="${P.main}" stroke-width="14"/>`;
    s += T('HIGH SCORE', 550, 130, 64, c.pink, { font: SANS, weight: 700, ls: 16 }) + T('999999', 550, 290, 210, c.gold, { stroke: INK, sw: 6 });
    const cols = [P.main, c.mint, c.pink];
    for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) {
      const row = r === 1 ? INV2 : INV1, w = row[0].length * 14;
      s += sprite(row, 90 + k * 200 + (r === 1 ? 10 : 16), 350 + r * 155, 13, cols[r]);
    }
    s += M.logoBox('arcade', P, 425, 820, 250);
    s += T('INSERT COIN', 550, 1150, 88, c.pink);
    return art(1100, 1200, s, { top: 140 });
  },
  back: (P) => {
    const c = colors(P);
    let s = T('GAME', 550, 250, 300, P.text, { stroke: P.main, sw: 16 }) + T('OVER?', 550, 520, 300, c.pink, { stroke: INK, sw: 6 });
    s += `<circle cx="550" cy="800" r="200" fill="none" stroke="${c.gold}" stroke-width="20" stroke-dasharray="40 24"/>` + T('CONTINUE?', 550, 690, 74, P.text) + T('9', 550, 900, 260, c.gold);
    s += T('NOPE. WE NEVER QUIT.', 550, 1130, 64, P.accent);
    s += M.logoBox('arcade', P, 470, 1170, 160);
    return art(1100, 1370, s, { top: 130 });
  },
};

// 5 ------------------------------------------------ Trading card
function cardBase(P, c, W, H) {
  const g = nid('cg');
  return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B37A8"/><stop offset="1" stop-color="#2E1A6B"/></linearGradient></defs>` +
    `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="46" fill="${c.cream}" stroke="${c.gold}" stroke-width="12"/>`;
}
D.card = {
  front: (P) => {
    const c = colors(P), W = 900, H = 1250, g = nid('pg');
    let s = cardBase(P, c, W, H);
    s += `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6D45C8"/><stop offset="1" stop-color="#2E1A6B"/></linearGradient></defs>`;
    s += T('VEXO', 70, 120, 78, INK, { anchor: 'start' }) + T('HP 99', 830, 116, 60, c.red, { anchor: 'end' });
    s += `<rect x="60" y="150" width="780" height="560" rx="26" fill="url(#${g})" stroke="${c.gold}" stroke-width="10"/>`;
    s += stars(40, 80, 170, 740, 520, 3, [c.cream, c.gold, '#B9A2F0'], 12);
    s += `<circle cx="450" cy="470" r="200" fill="#fff" opacity=".08"/>` + mas({ eyesType: 'classic' }, { ...P, main: '#8B5CF6', white: c.cream, pupil: INK }, 450, 440, 480, -4);
    s += `<text x="70" y="762" font-family="Bungee" font-size="42" fill="${INK}">ALIEN · COSMIC TYPE</text>`;
    s += `<rect x="60" y="790" width="780" height="6" fill="${INK}" opacity=".25"/>`;
    [['SNACK ATTACK', '30'], ['TOO CUTE', '90'], ['CHAOS BEAM', '60']].forEach(([n, v], i) => {
      const y = 870 + i * 86;
      s += `<text x="70" y="${y}" font-family="Bungee" font-size="46" fill="${INK}">${n}</text><text x="830" y="${y}" text-anchor="end" font-family="Bungee" font-size="54" fill="${INK}">${v}</text>`;
    });
    s += T('Rarely seen before midnight.', 450, 1150, 34, '#4b3a78', { font: SANS, weight: 700 });
    s += T('#001/027 · HOLO RARE', 450, 1206, 34, INK, { font: SANS, weight: 700, ls: 4 });
    return art(W, H, s, { top: 115 });
  },
  back: (P) => {
    const c = colors(P), W = 900, H = 1250;
    let s = `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="46" fill="#2E1A6B" stroke="${c.gold}" stroke-width="12"/><rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="30" fill="none" stroke="${c.cream}" stroke-width="5" opacity=".6"/>`;
    for (let r = 0; r < 6; r++) for (let k = 0; k < 4; k++) s += logo('classic', { ...P, main: '#5B37A8' }, 130 + k * 213, 150 + r * 190, 90, (r + k) % 2 ? 10 : -10);
    s += `<circle cx="450" cy="625" r="230" fill="${c.gold}"/><circle cx="450" cy="625" r="200" fill="#5B37A8"/>` + mas({ eyesType: 'classic' }, { ...P, main: c.cream, white: '#5B37A8', pupil: c.cream }, 450, 640, 260);
    s += T('VEXO CARDS', 450, 960, 100, c.cream);
    return art(W, H, s, { top: 115 });
  },
};

// 6 ------------------------------------------------ Vexo Facts
D.facts = {
  front: (P) => chestArt(logo('classic', P, 170, 150, 250) + T('SEE BACK', 170, 320, 50, P.text)),
  back: (P) => {
    const c = colors(P), W = 900, H = 1240, f = P.text;
    let s = `<rect x="8" y="8" width="884" height="1224" fill="none" stroke="${f}" stroke-width="10"/>`;
    s += `<text x="40" y="128" font-family="${SANS}" font-weight="900" font-size="112" fill="${f}">Vexo Facts</text><rect x="30" y="150" width="840" height="20" fill="${f}"/>`;
    s += `<text x="40" y="215" font-family="${SANS}" font-weight="700" font-size="42" fill="${f}">1 serving per alien</text><text x="40" y="270" font-family="${SANS}" font-weight="900" font-size="46" fill="${f}">Serving size</text><text x="860" y="270" text-anchor="end" font-family="${SANS}" font-weight="900" font-size="46" fill="${f}">1 whole alien</text><rect x="30" y="292" width="840" height="34" fill="${f}"/>`;
    s += `<text x="40" y="376" font-family="${SANS}" font-weight="900" font-size="34" fill="${f}">Amount per serving</text><text x="40" y="450" font-family="${SANS}" font-weight="900" font-size="74" fill="${f}">Cuteness</text><text x="860" y="450" text-anchor="end" font-family="${SANS}" font-weight="900" font-size="74" fill="${f}">100%</text><rect x="30" y="470" width="840" height="12" fill="${f}"/>`;
    [['Chaos', '100%'], ['Snacks', '87%'], ['Weirdness', '99%'], ['Sleep', '3%'], ['Common sense', '0%']].forEach(([n, v], i) => {
      const y = 540 + i * 78;
      s += `<text x="40" y="${y}" font-family="${SANS}" font-weight="700" font-size="52" fill="${f}">${n}</text><text x="860" y="${y}" text-anchor="end" font-family="${SANS}" font-weight="900" font-size="52" fill="${f}">${v}</text><rect x="30" y="${y + 18}" width="840" height="4" fill="${f}"/>`;
    });
    s += `<rect x="30" y="948" width="840" height="24" fill="${f}"/>`;
    s += `<text x="40" y="1040" font-family="${SANS}" font-weight="700" font-size="34" fill="${f}">* Percent Daily Values are based on 2000 space snacks.</text><text x="40" y="1090" font-family="${SANS}" font-weight="700" font-size="34" fill="${f}">May contain traces of glitter. Ingredients: 100% Vexo.</text>`;
    s += logo('classic', { ...P, main: c.dk ? '#7B52E0' : P.main }, 770, 1150, 140);
    return art(W, H, s, { top: 120 });
  },
};

// 7 ------------------------------------------------ Mood sheet
D.moods = {
  front: (P) => {
    const c = colors(P);
    const ids = ['m_hey', 'm_wink', 'm_grr', 'm_whoa', 'm_crush', 'm_zzz'], names = ['HEY', 'WINK', 'GRRR', 'WHOA', 'CRUSH', 'ZZZ'];
    let s = T('MOOD', 550, 170, 190, P.text, { stroke: P.main, sw: 12 }) + T('CHART', 550, 300, 120, c.pink);
    ids.forEach((id, i) => {
      const cx = 200 + (i % 3) * 350, cy = 470 + Math.floor(i / 3) * 400;
      s += `<circle cx="${cx}" cy="${cy}" r="158" fill="${P.main}" opacity=".16"/>` + logo(id, P, cx, cy, 280, (i % 2 ? 5 : -5));
      s += T(names[i], cx, cy + 205, 56, P.text);
    });
    s += T('HOW ARE YOU TODAY?', 550, 1330, 56, P.accent, { font: SANS, weight: 700, ls: 8 });
    return art(1100, 1390, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = T("TODAY'S MOOD:", 300, 90, 64, P.text);
    ['m_hey', 'm_wink', 'm_grr', 'm_whoa', 'm_crush', 'm_zzz'].forEach((id, i) => {
      s += `<rect x="${20 + i * 100}" y="140" width="80" height="80" rx="16" fill="none" stroke="${P.text}" stroke-width="7"/>`;
      if (i === 5) s += `<path d="M${30 + i * 100} 178 L${52 + i * 100} 204 L${88 + i * 100} 150" fill="none" stroke="${c.pink}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    return art(640, 260, s, { top: 110 });
  },
};

// 8 ------------------------------------------------ Retro sunset
D.sunset = {
  front: (P) => {
    const c = colors(P), g = nid('sg'), m = nid('sm');
    let s = `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.gold}"/><stop offset=".55" stop-color="${c.orange}"/><stop offset="1" stop-color="${c.pink}"/></linearGradient>` +
      `<mask id="${m}"><rect width="1100" height="1200" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="0" y="${520 + i * 62}" width="1100" height="${6 + i * 5}" fill="#000"/>`).join('')}</mask></defs>`;
    s += arcText('GOOD VIBES', 550, 500, 440, 130, P.text, { ls: 8 });
    s += `<circle cx="550" cy="560" r="380" fill="url(#${g})" mask="url(#${m})"/>`;
    s += `<rect x="60" y="930" width="980" height="12" rx="6" fill="${P.main}"/>` + `<rect x="150" y="960" width="800" height="9" rx="4" fill="${P.main}" opacity=".7"/><rect x="260" y="985" width="580" height="7" rx="3" fill="${P.main}" opacity=".45"/>`;
    s += mas({ eyesType: 'classic' }, P, 550, 760, 430);
    s += T('FROM ANOTHER GALAXY', 550, 1130, fit(19, 1000, 96), P.text);
    return art(1100, 1190, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = ''; for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8; s += `<path d="M350 350 L${350 + Math.cos(a) * 340} ${350 + Math.sin(a) * 340}" stroke="${c.gold}" stroke-width="12" stroke-linecap="round" opacity=".8"/>`; }
    s += `<circle cx="350" cy="350" r="170" fill="${c.gold}"/><circle cx="350" cy="350" r="150" fill="${P.main}"/>` + wm(350, 385, 120, c.cream);
    return art(700, 700, s, { top: 130 });
  },
};

// 9 ------------------------------------------------ Astro Vexo
D.astro = {
  front: (P) => {
    const c = colors(P);
    let s = stars(50, 30, 20, 1040, 1000, 21, [c.cream, c.gold, P.accent], 12);
    s += `<ellipse cx="550" cy="560" rx="470" ry="160" fill="none" stroke="${P.accent}" stroke-width="5" stroke-dasharray="6 18" stroke-linecap="round" transform="rotate(-18 550 560)"/>`;
    // planet
    s += `<g transform="translate(220 250) rotate(-20)"><ellipse cx="0" cy="0" rx="190" ry="48" fill="none" stroke="${c.gold}" stroke-width="14" transform="translate(0 0)"/><circle cx="0" cy="0" r="105" fill="${c.pink}"/><path d="M-100 -20 Q0 -60 100 -20" fill="none" stroke="#fff" stroke-width="10" opacity=".35"/><path d="M-190 0 A190 48 0 0 0 190 0" fill="none" stroke="${c.gold}" stroke-width="14"/></g>`;
    s += `<circle cx="900" cy="230" r="58" fill="${c.mint}"/><circle cx="878" cy="212" r="12" fill="#000" opacity=".15"/><circle cx="925" cy="252" r="16" fill="#000" opacity=".15"/>`;
    s += mas({ acc: 'helmet', eyesType: 'surprised', arms: ['M34 126 Q0 140 -6 112', 'M166 126 Q200 100 200 70'] }, P, 570, 640, 560, -12);
    s += T('LOST IN SPACE', 550, 1075, fit(13, 1040, 150), P.text, { stroke: P.main, sw: 12 }) + T('SEND SNACKS', 550, 1150, 52, c.gold, { font: SANS, weight: 700, ls: 12 });
    return art(1100, 1200, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = `<circle cx="450" cy="450" r="430" fill="${c.night}" stroke="${c.gold}" stroke-width="14"/><circle cx="450" cy="450" r="330" fill="none" stroke="${c.cream}" stroke-width="4" opacity=".5"/>`;
    s += arcText('VEXO SPACE PROGRAM', 450, 450, 372, 62, c.cream, { ls: 6 }) + arcText('MISSION 2026', 450, 450, 420, 62, c.gold, { bottom: true, ls: 10 });
    s += stars(24, 130, 130, 640, 640, 9, [c.cream, c.gold], 9) + mas({ acc: 'helmet' }, P, 450, 470, 340, -8);
    return art(900, 900, s, { top: 130 });
  },
};

// 10 ----------------------------------------------- Varsity
D.varsity = {
  front: (P) => {
    const c = colors(P);
    let s = arcText('VEXO', 550, 520, 400, 300, P.text, { ls: 10 });
    s += `<circle cx="550" cy="640" r="270" fill="${P.main}" stroke="${P.text}" stroke-width="14"/><circle cx="550" cy="640" r="236" fill="none" stroke="${c.gold}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>`;
    s += mas({ eyesType: 'classic' }, { ...P, main: c.cream, white: P.main, pupil: c.cream }, 550, 650, 360);
    [[120, 330], [980, 330]].forEach(([x, y]) => (s += sparkle(x, y, 38, c.gold)));
    s += `<path d="M110 960 H990 L960 1030 L990 1100 H110 L140 1030 Z" fill="${c.gold}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>` + T('ALIEN ATHLETIC DEPT.', 550, 1058, fit(20, 780, 70), INK);
    s += T('EST. 2026 · GO VEXO', 550, 1170, 50, P.accent, { font: SANS, weight: 700, ls: 10 });
    return art(1100, 1220, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = T('VEXO', 500, 150, 150, P.accent, { ls: 16 }) + T('01', 500, 830, 720, P.main, { stroke: P.text, sw: 22 });
    s += T('ALIEN ATHLETICS', 500, 950, 90, P.text) + `<rect x="120" y="990" width="760" height="10" fill="${c.gold}"/>`;
    return art(1000, 1030, s, { top: 130 });
  },
};

// 11 ----------------------------------------------- Sticker bomb
D.bomb = {
  front: (P) => {
    const L = { ...P, main: '#7B52E0', paper: '#F6F1E7', white: '#F6F1E7', pupil: INK };
    const ids = ['classic', 'badge', 'arcade', 'grumpy', 'seal', 'bean', 'speed', 'heart', 'app', 'iris', 'chomp', 'pixel', 'peek', 'shield', 'watcher', 'cyclops', 'planet', 'm_hey', 'm_wink', 'm_grr', 'm_whoa', 'm_crush', 'm_zzz', 'angel', 'bolt', 'ufo', 'star', 'crown', 'flame', 'moon'];
    const r = rng(42); let s = '';
    ids.forEach((id, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const cx = 120 + col * 240 + (r() - 0.5) * 30, cy = 110 + row * 215 + (r() - 0.5) * 24;
      s += stk(id, L, cx, cy, 190 + r() * 60, (r() - 0.5) * 36);
    });
    return art(1200, 1300, s, { top: 130 });
  },
  back: (P) => {
    const L = { ...P, main: '#7B52E0', paper: '#F6F1E7', white: '#F6F1E7', pupil: INK };
    let s = '';
    ['classic', 'heart', 'm_wink', 'planet', 'ufo', 'angel'].forEach((id, i) => (s += stk(id, L, 150 + (i % 3) * 270, 150 + Math.floor(i / 3) * 260, 220, (i % 2 ? 9 : -9))));
    return art(830, 560, s, { top: 130 });
  },
};

// 12 ----------------------------------------------- Skate
D.skate = {
  front: (P) => {
    const c = colors(P);
    let s = stars(20, 40, 20, 1020, 400, 12, [c.gold, c.pink, P.accent], 12);
    s += `<g transform="rotate(-10 550 900)"><path d="M120 850 Q120 800 190 800 H910 Q980 800 980 850 Q980 900 910 900 H190 Q120 900 120 850 Z" fill="${c.pink}" stroke="${INK}" stroke-width="10"/><path d="M200 850 H900" stroke="#fff" stroke-width="8" opacity=".5" stroke-linecap="round" stroke-dasharray="2 24"/><circle cx="290" cy="935" r="44" fill="${c.gold}" stroke="${INK}" stroke-width="8"/><circle cx="810" cy="935" r="44" fill="${c.gold}" stroke="${INK}" stroke-width="8"/></g>`;
    s += `<path d="M20 640 H150 M0 700 H110 M40 760 H170" stroke="${P.accent}" stroke-width="14" stroke-linecap="round"/>`;
    s += mas({ acc: 'shades', arms: ['M30 128 Q4 150 -4 120', 'M170 128 Q196 150 204 120'] }, P, 560, 520, 620, -8);
    s += T('SKATE &', 550, 1130, fit(7, 1000, 200), P.text, { stroke: P.main, sw: 12 }) + T('ABDUCT', 550, 1345, fit(6, 1000, 230), c.pink);
    return art(1100, 1400, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = `<circle cx="450" cy="450" r="430" fill="${P.main}"/><circle cx="450" cy="450" r="400" fill="none" stroke="${c.cream}" stroke-width="5"/>`;
    s += arcText('ALIEN SKATE CO.', 450, 450, 340, 80, c.cream, { ls: 8 }) + arcText('SINCE 2026', 450, 450, 385, 62, c.gold, { bottom: true, ls: 12 });
    s += mas({ acc: 'shades' }, { ...P, main: c.cream, white: P.main }, 450, 450, 320, 6);
    return art(900, 900, s, { top: 130 });
  },
};

// 13 ----------------------------------------------- Coffee
D.coffee = {
  front: (P) => {
    const c = colors(P);
    let s = stars(12, 60, 40, 980, 260, 14, [c.gold, c.pink], 12);
    s += `<path d="M640 470 H960 L920 800 Q915 860 850 860 H750 Q685 860 680 800 Z" fill="${c.cream}" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M960 520 Q1080 520 1060 640 Q1040 730 925 730" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M960 520 Q1080 520 1060 640 Q1040 730 925 730" fill="none" stroke="${c.cream}" stroke-width="14" stroke-linecap="round"/>`;
    s += `<path d="M652 540 H948 L928 700 H672 Z" fill="${P.main}" opacity=".9"/>` + sym('heart', { ...P, main: c.pink }, 800, 620, 100);
    s += `<path d="M720 430 Q700 380 740 340 Q780 300 750 250 M810 430 Q790 380 830 340 Q870 300 840 250 M900 430 Q880 380 920 340" fill="none" stroke="${P.accent}" stroke-width="12" stroke-linecap="round" opacity=".8"/>`;
    s += mas({ eyesType: 'sleepy', arms: ['M170 130 Q210 140 220 118'] }, P, 380, 600, 640, -6);
    s += T('NOT A MORNING', 550, 1030, fit(13, 1040, 130), P.text, { stroke: P.main, sw: 10 }) + T('ALIEN', 550, 1200, 170, c.gold);
    return art(1100, 1250, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    return art(900, 520, T('BUT FIRST,', 450, 170, 150, P.text) + T('COFFEE', 450, 340, 190, c.gold, { stroke: P.main, sw: 10 }) + [80, 450, 820].map((x) => `<ellipse cx="${x}" cy="450" rx="34" ry="22" fill="${P.main}"/><path d="M${x - 30} 450 Q${x} 430 ${x + 30} 450" stroke="${P.paper}" stroke-width="5" fill="none"/>`).join(''), { top: 110 });
  },
};

// 14 ----------------------------------------------- Caution
D.caution = {
  front: (P) => {
    const c = colors(P), id = nid('cs'), cl = nid('cl');
    let s = `<defs><pattern id="${id}" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="80" fill="${c.gold}"/></pattern><clipPath id="${cl}"><rect x="30" y="1040" width="1040" height="90" rx="14"/></clipPath></defs>`;
    s += `<path d="M550 30 L1000 780 H100 Z" fill="${c.gold}" stroke="${INK}" stroke-width="24" stroke-linejoin="round"/><path d="M550 130 L900 730 H200 Z" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`;
    s += mas({ eyesType: 'angry' }, P, 550, 490, 420);
    s += T('CAUTION', 550, 900, fit(7, 1040, 230), c.gold, { stroke: INK, sw: 6 }) + T('ALIEN INSIDE', 550, 1010, fit(12, 1000, 110), P.text);
    s += `<rect x="30" y="1040" width="1040" height="90" rx="14" fill="${INK}" stroke="${c.gold}" stroke-width="6"/><rect x="30" y="1040" width="1040" height="90" fill="url(#${id})" clip-path="url(#${cl})"/>`;
    return art(1100, 1160, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = T('DO NOT FEED', 500, 150, fit(11, 960, 150), c.gold, { stroke: INK, sw: 4 }) + T('SPACE SNACKS', 500, 290, fit(12, 960, 150), P.text);
    ['MAY CAUSE HUGS', 'CONTAINS 100% WEIRD', 'HANDLE WITH SNACKS', 'KEEP AWAY FROM BORING'].forEach((t, i) => {
      const y = 440 + i * 100;
      s += `<path d="M90 ${y - 44} L150 ${y - 44} L120 ${y - 100} Z" fill="${c.gold}"/>` + T('!', 120, y - 52, 44, INK) + T(t, 190, y, 58, P.text, { anchor: 'start' });
    });
    return art(1000, 900, s, { top: 130 });
  },
};

// 15 ----------------------------------------------- Valentine
D.valentine = {
  front: (P) => {
    const c = colors(P);
    let s = ''; [[130, 150, 40], [960, 260, 34], [880, 90, 26], [70, 400, 24], [1000, 560, 30]].forEach(([x, y, r]) => (s += sym('heart', { ...P, main: c.pink }, x, y, r * 2, x % 2 ? 12 : -12)));
    s += `<path d="M680 580 Q700 800 640 940" fill="none" stroke="${P.text}" stroke-width="6" opacity=".7"/>`;
    s += `<g transform="translate(760 330) rotate(10)">${M.symBox('heart', { ...P, main: c.pink }, -230, -230, 460)}<path d="M-120 -120 Q-150 -40 -100 20" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".45"/></g>`;
    s += `<path d="M760 565 Q720 700 620 720" fill="none" stroke="${P.text}" stroke-width="6" opacity=".7"/>`;
    s += mas({ eyesType: 'love', arms: ['M170 124 Q190 110 196 92'] }, P, 380, 760, 620);
    s += T('SEND LOVE', 550, 1160, fit(9, 1040, 190), P.text, { stroke: P.main, sw: 12 }) + T('TO EARTH', 550, 1325, fit(8, 1040, 190), c.pink);
    return art(1100, 1370, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = `<rect x="60" y="120" width="780" height="520" rx="26" fill="${c.cream}" stroke="${INK}" stroke-width="10"/><path d="M60 140 L450 440 L840 140" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M60 620 L330 380 M840 620 L570 380" stroke="${INK}" stroke-width="8"/>`;
    s += sym('heart', { ...P, main: c.pink }, 450, 440, 130) + T('TO: EARTH', 450, 740, 64, P.text) + T('FROM: VEXO', 450, 820, 64, c.pink);
    return art(900, 880, s, { top: 130 });
  },
};

// 16 ----------------------------------------------- Constellation
D.constellation = {
  front: (P) => {
    const c = colors(P);
    const pts = [[160, 500], [280, 250], [470, 120], [640, 190], [780, 90], [900, 330], [830, 620], [610, 760], [330, 720]];
    let s = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${P.accent}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>`;
    pts.forEach(([x, y], i) => (s += sparkle(x, y, i % 3 ? 26 : 40, c.gold)));
    s += stars(30, 20, 20, 1060, 860, 33, [P.accent, c.cream], 9);
    s += logo('outline', P, 550, 480, 620);
    s += T('CONSTELLATION', 550, 1010, fit(13, 1040, 140), P.text) + T('VEXO · 27 STARS', 550, 1084, 46, P.accent, { font: SANS, weight: 700, ls: 12 });
    return art(1100, 1140, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    let s = `<circle cx="450" cy="450" r="420" fill="none" stroke="${P.text}" stroke-width="8"/><circle cx="450" cy="450" r="330" fill="none" stroke="${P.accent}" stroke-width="3"/><circle cx="450" cy="450" r="220" fill="none" stroke="${P.accent}" stroke-width="3" stroke-dasharray="6 12"/>`;
    for (let i = 0; i < 24; i++) { const a = (i * Math.PI) / 12, r0 = i % 2 ? 400 : 380; s += `<path d="M${450 + Math.cos(a) * r0} ${450 + Math.sin(a) * r0} L${450 + Math.cos(a) * 420} ${450 + Math.sin(a) * 420}" stroke="${P.text}" stroke-width="5"/>`; }
    s += `<path d="M30 450 H870 M450 30 V870" stroke="${P.accent}" stroke-width="3" opacity=".6"/>`;
    const r = rng(8); const pts = []; for (let i = 0; i < 9; i++) pts.push([450 + (r() - 0.5) * 560, 450 + (r() - 0.5) * 560]);
    s += `<polyline points="${pts.map((p) => p.map(Math.round).join(',')).join(' ')}" fill="none" stroke="${c.gold}" stroke-width="4"/>`;
    pts.forEach(([x, y]) => (s += sparkle(Math.round(x), Math.round(y), 22, c.gold)));
    s += T('N', 450, 90, 60, P.text) + T('S', 450, 850, 60, P.text) + T('W', 70, 470, 60, P.text) + T('E', 830, 470, 60, P.text);
    s += logo('classic', P, 450, 450, 130);
    return art(900, 900, s, { top: 130 });
  },
};

// 17 ----------------------------------------------- Good vs Bad
D.duo = {
  front: (P) => {
    const c = colors(P);
    let s = `<path d="M600 60 L520 330 H620 L540 620" fill="none" stroke="${c.gold}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += mas({ halo: true, eyesType: 'classic', gloss: true }, P, 300, 380, 500, -6);
    s += mas({ acc: 'horns', eyesType: 'angry', gloss: true }, P, 850, 380, 500, 6);
    s += T('GOOD', 300, 800, 140, P.text, { stroke: P.main, sw: 10 }) + T('BAD', 850, 800, 140, c.red, { stroke: INK, sw: 6 });
    s += T('VEXO', 575, 990, 230, c.cream, { stroke: P.main, sw: 14 }) + T('PICK YOUR SIDE', 575, 1070, 50, P.accent, { font: SANS, weight: 700, ls: 12 });
    return art(1150, 1120, s, { top: 130 });
  },
  back: (P) => {
    const c = colors(P);
    return art(900, 470, mas({ halo: true }, P, 200, 190, 250) + mas({ acc: 'horns', eyesType: 'angry' }, P, 700, 190, 250) + T('TEAM GOOD', 200, 400, 60, P.text) + T('TEAM BAD', 700, 400, 60, c.red, { stroke: INK, sw: 4 }) + T('VS', 450, 220, 90, c.gold), { top: 130 });
  },
};

// 18 ----------------------------------------------- Eyes on you
D.eyes = {
  front: (P) => {
    const c = colors(P), r = rng(77);
    let s = '';
    for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) {
      const cx = 110 + col * 220 + (row % 2 ? 60 : 0), cy = 90 + row * 175;
      if (cx > 1060) continue;
      const a = r() * Math.PI * 2, d = 12 + r() * 10;
      for (const ex of [-46, 46]) {
        s += `<ellipse cx="${cx + ex}" cy="${cy}" rx="40" ry="56" fill="${c.cream}"/><ellipse cx="${cx + ex + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" rx="22" ry="30" fill="${row % 2 ? c.pink : P.main}"/><circle cx="${cx + ex + Math.cos(a) * d + 7}" cy="${cy + Math.sin(a) * d - 10}" r="7" fill="${c.cream}"/>`;
      }
    }
    s += T('STAY', 550, 1090, 220, P.text, { stroke: P.main, sw: 14 }) + T('WEIRD', 550, 1290, 250, c.pink, { stroke: INK, sw: 6 });
    return art(1100, 1340, s, { top: 130 });
  },
  back: (P) => art(700, 330, T('WE SEE YOU', 350, 120, 110, P.text) + `<ellipse cx="290" cy="240" rx="36" ry="50" fill="${colors(P).cream}"/><ellipse cx="410" cy="240" rx="36" ry="50" fill="${colors(P).cream}"/><circle cx="302" cy="246" r="20" fill="${P.main}"/><circle cx="422" cy="246" r="20" fill="${P.main}"/>`, { top: 110 }),
};

// 19 ----------------------------------------------- Movie poster
D.poster = {
  front: (P) => {
    const c = colors(P), W = 900, H = 1250;
    let s = `<rect x="8" y="8" width="884" height="1234" fill="none" stroke="${P.text}" stroke-width="8"/><rect x="26" y="26" width="848" height="1198" fill="none" stroke="${P.text}" stroke-width="3"/>`;
    s += T('IN A GALAXY FAR FROM BORING', 450, 100, 34, P.accent, { font: SANS, weight: 700, ls: 2 });
    s += T('MAIN', 450, 250, 230, P.text, { stroke: P.main, sw: 12 });
    for (let i = 0; i < 5; i++) { const x = 90 + i * 180; s += `<polygon points="${x},300 ${x + 90},300 ${450 + (x - 450) * 0.1 + 45},700" fill="${c.gold}" opacity=".12"/>`; }
    s += mas({ acc: 'crown', eyesType: 'classic' }, P, 450, 560, 520);
    s += T('CHARACTER', 450, 870, fit(9, 820, 190), c.gold, { stroke: INK, sw: 4 });
    s += `<rect x="60" y="910" width="780" height="6" fill="${P.text}"/>`;
    s += T('A VEXO PRODUCTION', 450, 980, 48, P.text, { font: SANS, weight: 700, ls: 10 });
    s += T('STARRING VEXO · FEATURING SNACKS', 450, 1040, 30, P.accent, { font: SANS, weight: 700, ls: 2 });
    s += T('RATED W FOR WEIRD', 450, 1096, 30, P.accent, { font: SANS, weight: 700, ls: 3 });
    s += T('VEXO', 450, 1190, 66, c.pink);
    return art(W, H, s, { top: 115 });
  },
  back: (P) => art(700, 300, T('NOW SHOWING', 350, 110, 100, P.text) + T('YOU ARE THE MAIN CHARACTER', 350, 190, 34, P.accent, { font: SANS, weight: 700, ls: 6 }) + wm(350, 270, 70, colors(P).pink), { top: 110 }),
};

// 20 ----------------------------------------------- Low battery
D.battery = {
  front: (P) => {
    const c = colors(P);
    let s = `<rect x="80" y="70" width="860" height="440" rx="70" fill="none" stroke="${P.text}" stroke-width="24"/><rect x="960" y="200" width="70" height="180" rx="24" fill="${P.text}"/>`;
    s += `<rect x="130" y="120" width="160" height="340" rx="30" fill="${c.red}"/>`;
    s += mas({ eyesType: 'sleepy' }, P, 770, 320, 300, -6) + T('3%', 330, 400, 150, c.red, { stroke: INK, sw: 4, anchor: 'start' });
    s += sym('bolt', { ...P, main: c.gold }, 550, 690, 240, 8);
    s += T('LOW BATTERY', 550, 950, fit(11, 1040, 170), P.text, { stroke: P.main, sw: 10 }) + T('HIGH VIBES', 550, 1080, fit(10, 1040, 150), c.gold);
    return art(1100, 1130, s, { top: 140 });
  },
  back: (P) => art(700, 420, T('PLEASE CHARGE', 350, 130, 100, P.text) + sym('bolt', { ...P, main: colors(P).gold }, 350, 290, 160) + wm(350, 400, 50, P.accent), { top: 110 }),
};

// 21 ----------------------------------------------- Essential: Original
D.original = {
  front: (P) => chestArt(logo('classic', P, 170, 170, 320)),
  back: (P) => {
    const c = colors(P);
    let s = mas({ eyesType: 'classic' }, P, 500, 360, 660) + wm(500, 830, 210, P.text) + T('ALIEN CLOTHING CO.', 500, 910, 54, P.accent, { font: SANS, weight: 700, ls: 14 });
    return art(1000, 960, s, { top: 130 });
  },
};

// 22 ----------------------------------------------- Essential: Badge
D.badge = {
  front: (P) => chestArt(logo('badge', P, 170, 170, 320)),
  back: (P) => {
    const c = colors(P);
    let s = `<circle cx="450" cy="450" r="330" fill="none" stroke="${P.main}" stroke-width="10"/>` + logo('badge', P, 450, 450, 560);
    s += arcText('ALIEN CLOTHING CO.', 450, 450, 380, 68, P.text, { ls: 8 }) + arcText('VEXO CLUB · 2026', 450, 450, 425, 62, P.accent, { bottom: true, ls: 10 });
    return art(900, 900, s, { top: 130 });
  },
};

module.exports = { D };
