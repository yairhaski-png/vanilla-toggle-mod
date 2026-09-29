'use strict';
// Vexo mascot + logo system. Everything is drawn in a 200x200 space.
let uid = 0;
const nid = (p = 'u') => `${p}${++uid}`;

// ---------- palettes (one per shirt colour family) ----------
const PALETTES = {
  dark: {
    main: '#7B52E0', paper: '#F6F1E7', white: '#F6F1E7', pupil: '#141018', iris: '#2E1A6B',
    outline: '#141018', text: '#F6F1E7', accent: '#B9A2F0', pink: '#F062C8', gold: '#E9C46A', gloss: '#B79BFF',
  },
  light: {
    main: '#5B37A8', paper: '#F6F1E7', white: '#F6F1E7', pupil: '#141018', iris: '#2E1A6B',
    outline: '#141018', text: '#3A2277', accent: '#5B37A8', pink: '#E24FC0', gold: '#D9A93B', gloss: '#8F6FE0',
  },
  purple: {
    main: '#F6F1E7', paper: '#5B37A8', white: '#5B37A8', pupil: '#F6F1E7', iris: '#F6F1E7',
    outline: '#F6F1E7', text: '#F6F1E7', accent: '#F6F1E7', pink: '#F6F1E7', gold: '#F6F1E7', gloss: '#FFFFFF',
  },
};

// ---------- body shapes ----------
const BODIES = {
  scallop: () =>
    `<path d="M30 158 C30 88 60 50 100 50 C140 50 170 88 170 158 Z"/>` +
    [[48, 160], [83, 165], [117, 165], [152, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20"/>`).join(''),
  bean: () =>
    `<path d="M30 168 V108 C30 70 60 50 100 50 C140 50 170 70 170 108 V168 Q170 184 154 184 H46 Q30 184 30 168 Z"/>`,
  arcade: () =>
    `<path d="M30 180 V100 C30 66 58 48 100 48 C142 48 170 66 170 100 V180 H146 V160 H126 V180 H74 V160 H54 V180 Z"/>`,
};

const ANTENNAE = {
  single: { stems: ['M100 60 Q101 36 110 22'], balls: [[111, 19, 12]] },
  double: { stems: ['M70 62 Q64 44 56 30', 'M130 62 Q136 44 144 30'], balls: [[54, 26, 11], [146, 26, 11]] },
  arcadeTop: { stems: ['M100 50 Q101 34 110 22'], balls: [[111, 19, 12]] },
  none: { stems: [], balls: [] },
};

function bodyLayer(shapes, ant, color, grow) {
  const stemW = 9;
  const s = grow ? ` stroke="${color}" stroke-width="${grow * 2}" stroke-linejoin="round"` : '';
  return (
    `<g fill="${color}"${s}>${shapes}${ant.balls.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>` +
    ant.stems.map((d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${stemW + grow * 2}" stroke-linecap="round"/>`).join('')
  );
}

// ---------- eyes ----------
const HEART = 'M0 8 C-16 -2 -9 -13 0 -6 C9 -13 16 -2 0 8 Z';
const heart = (x, y, s, c) => `<path d="${HEART}" transform="translate(${x} ${y}) scale(${s})" fill="${c}"/>`;

function eyeWhite(cx, cy, P, { dx = 5, dy = 2, pr = [8.5, 11], clip = '' } = {}) {
  return (
    `<g ${clip}><ellipse cx="${cx}" cy="${cy}" rx="15" ry="19" fill="${P.white}"/>` +
    `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="${pr[0]}" ry="${pr[1]}" fill="${P.pupil}"/>` +
    `<circle cx="${cx + dx + 2.6}" cy="${cy + dy - 4.5}" r="2.6" fill="${P.white}"/></g>`
  );
}

// mode 'ink' = single-colour eyes (holes drawn in `ink`), 'color' = white eyes with pupils
function eyes(type, P, mode = 'color', ink = '#141018') {
  const ovalInk = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="14" fill="${ink}"/>`;
  switch (type) {
    case 'classic':
      return mode === 'ink' ? ovalInk(77, 108) + ovalInk(123, 108) : eyeWhite(77, 108, P) + eyeWhite(123, 108, P);
    case 'iris':
      return eyeWhite(77, 108, P, { dx: 4, pr: [11, 14.5] }) + eyeWhite(123, 108, P, { dx: 4, pr: [11, 14.5] });
    case 'wink': {
      const left = mode === 'ink' ? ovalInk(77, 108) : eyeWhite(77, 108, P, { dx: -3 });
      return left + `<path d="M111 99 L135 109 L111 119" fill="none" stroke="${mode === 'ink' ? ink : P.pupil}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    case 'angry': {
      const id1 = nid('a'), id2 = nid('a');
      const c1 = `<clipPath id="${id1}"><polygon points="56,91 99,108 99,150 56,150"/></clipPath>`;
      const c2 = `<clipPath id="${id2}"><polygon points="144,91 101,108 101,150 144,150"/></clipPath>`;
      const lidInk = mode === 'ink' ? ink : P.pupil;
      const e1 = mode === 'ink' ? `<g clip-path="url(#${id1})">${ovalInk(77, 112)}</g>` : eyeWhite(77, 112, P, { dx: 4, dy: 1, clip: `clip-path="url(#${id1})"` });
      const e2 = mode === 'ink' ? `<g clip-path="url(#${id2})">${ovalInk(123, 112)}</g>` : eyeWhite(123, 112, P, { dx: 4, dy: 1, clip: `clip-path="url(#${id2})"` });
      return `<defs>${c1}${c2}</defs>${e1}${e2}` +
        `<path d="M55 90 L100 108 M145 90 L100 108" stroke="${lidInk}" stroke-width="6.5" stroke-linecap="round" fill="none"/>`;
    }
    case 'surprised':
      return eyeWhite(77, 108, P, { dx: 0, dy: 0, pr: [6, 8] }) + eyeWhite(123, 108, P, { dx: 0, dy: 0, pr: [6, 8] }) +
        `<path d="M152 62 L160 46 M162 76 L178 68 M164 90 L181 90" stroke="${P.accent}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
    case 'love':
      return [77, 123].map((cx) => `<ellipse cx="${cx}" cy="108" rx="15" ry="19" fill="${P.white}"/>${heart(cx, 109, 1.05, P.pink)}`).join('') +
        heart(166, 40, 0.85, P.pink) + heart(180, 66, 0.55, P.pink);
    case 'sleepy': {
      const z = (x, y, s) => `<path d="M0 0 H10 L0 11 H10" transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${P.accent}" stroke-width="${3.4 / s}" stroke-linecap="round" stroke-linejoin="round"/>`;
      return `<path d="M62 110 Q77 124 92 110 M108 110 Q123 124 138 110" fill="none" stroke="${mode === 'ink' ? ink : P.pupil}" stroke-width="5" stroke-linecap="round"/>` +
        z(148, 62, 0.9) + z(160, 44, 1.2) + z(174, 22, 1.5);
    }
    case 'cyclops':
      return `<ellipse cx="100" cy="112" rx="28" ry="32" fill="${P.white}"/>` +
        `<ellipse cx="108" cy="114" rx="15" ry="19" fill="${P.iris}"/><circle cx="114" cy="106" r="4.5" fill="${P.white}"/>`;
    default:
      return '';
  }
}

// ---------- mascot ----------
// fill 'none' + outline => transparent line-art version.
function mascot({ P, fill, outline = null, ow = 0, eyesType = 'classic', mode = 'color', ink, body = 'scallop', ant = 'single', gloss = false, halo = false }) {
  const shapes = BODIES[body]();
  const a = ANTENNAE[ant];
  let out = '';
  if (fill === 'none') {
    const id = nid('m');
    out += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="260"><rect x="-30" y="-30" width="260" height="260" fill="#fff"/>${bodyLayer(shapes, a, '#000', 0)}</mask>`;
    out += `<g mask="url(#${id})">${bodyLayer(shapes, a, outline, ow)}</g>`;
  } else {
    if (outline) out += bodyLayer(shapes, a, outline, ow);
    out += bodyLayer(shapes, a, fill, 0);
  }
  if (gloss) out += `<path d="M46 118 C44 88 60 68 82 60" fill="none" stroke="${P.gloss}" stroke-width="5.5" stroke-linecap="round" opacity=".55"/>`;
  out += eyes(eyesType, P, mode, ink || outline || P.pupil);
  if (halo) out += `<ellipse cx="100" cy="17" rx="30" ry="8" fill="none" stroke="${P.gold}" stroke-width="5.5"/>`;
  return `<g>${out}</g>`;
}

// place a 200-space mascot so its visual centre lands on (cx, cy) at scale s
const fit = (inner, cx, cy, s) => `<g transform="translate(${cx - 100 * s} ${cy - 96 * s}) scale(${s})">${inner}</g>`;

// ---------- the logo system (20 logos + 7 mood variants) ----------
const LOGOS = {
  classic: { name: 'Classic', draw: (P) => mascot({ P, fill: P.main, eyesType: 'classic' }) },
  outline: { name: 'Ghost Line', draw: (P) => mascot({ P, fill: 'none', outline: P.main, ow: 6, eyesType: 'classic', mode: 'ink', ink: P.main }) },
  badge: {
    name: 'Badge',
    draw: (P) => `<circle cx="100" cy="100" r="96" fill="${P.main}"/>` + fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 104, 0.62),
  },
  arcade: { name: 'Arcade Ghost', draw: (P) => mascot({ P, fill: P.main, eyesType: 'iris', body: 'arcade', ant: 'arcadeTop' }) },
  grumpy: { name: 'Grumpy', draw: (P) => mascot({ P, fill: P.main, eyesType: 'angry' }) },
  seal: {
    name: 'Seal',
    draw: (P) =>
      `<circle cx="100" cy="100" r="93" fill="none" stroke="${P.main}" stroke-width="7"/><circle cx="100" cy="100" r="79" fill="${P.main}"/>` +
      fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 104, 0.56),
  },
  bean: { name: 'Bean', draw: (P) => mascot({ P, fill: P.main, eyesType: 'classic', body: 'bean' }) },
  speed: {
    name: 'Zoom',
    draw: (P) =>
      `<g stroke="${P.main}" stroke-width="9" stroke-linecap="round"><path d="M8 92 H70"/><path d="M8 116 H52"/><path d="M8 140 H74"/></g>` +
      fit(mascot({ P, fill: P.main, eyesType: 'classic' }), 118, 102, 0.9),
  },
  heart: {
    name: 'Love Alien',
    draw: (P) =>
      `<path d="M100 190 C18 130 6 88 28 60 C50 32 88 42 100 72 C112 42 150 32 172 60 C194 88 182 130 100 190 Z" fill="${P.main}"/>` +
      fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 96, 0.5),
  },
  wink: { name: 'Wink Line', draw: (P) => mascot({ P, fill: 'none', outline: P.main, ow: 6, eyesType: 'wink', mode: 'ink', ink: P.main }) },
  app: {
    name: 'App Icon',
    draw: (P) =>
      `<rect x="10" y="10" width="180" height="180" rx="38" fill="${P.main}"/>` + fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 106, 0.66),
  },
  iris: { name: 'Big Iris', draw: (P) => mascot({ P, fill: P.main, eyesType: 'iris', gloss: true }) },
  chomp: {
    name: 'Chomp',
    draw: (P) =>
      `<path d="M114 112 L163 62.7 A80 80 0 1 0 163 161.3 Z" fill="${P.main}"/>` +
      `<path d="M96 38 Q96 24 106 14" fill="none" stroke="${P.main}" stroke-width="9" stroke-linecap="round"/><circle cx="108" cy="11" r="11" fill="${P.main}"/>` +
      `<ellipse cx="78" cy="102" rx="14" ry="18" fill="${P.white}"/><ellipse cx="84" cy="104" rx="8" ry="11" fill="${P.pupil}"/>` +
      `<ellipse cx="116" cy="82" rx="14" ry="18" fill="${P.white}"/><ellipse cx="122" cy="84" rx="8" ry="11" fill="${P.pupil}"/>`,
  },
  ring: {
    name: 'Thin Ring',
    draw: (P) =>
      `<circle cx="100" cy="100" r="93" fill="none" stroke="${P.main}" stroke-width="4.5"/>` +
      fit(mascot({ P, fill: 'none', outline: P.main, ow: 6, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 106, 0.56),
  },
  pixel: {
    name: 'Pixel',
    draw: (P) => {
      const rows = [
        '......#......', '.....###.....', '......#......', '......#......', '...#######...', '..#########..', '.###########.',
        '###..###..###', '###..###..###', '#############', '#############', '##.###.###.##', '#...##.##...#',
      ];
      const c = 13.5, ox = (200 - 13 * c) / 2, oy = 12;
      let s = '';
      rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') s += `<rect x="${(ox + x * c).toFixed(1)}" y="${(oy + y * c).toFixed(1)}" width="${c + 0.8}" height="${c + 0.8}" fill="${P.main}" shape-rendering="crispEdges"/>`; }));
      return s;
    },
  },
  peek: {
    name: 'Peek',
    draw: (P) => {
      const id = nid('c');
      return `<defs><clipPath id="${id}"><polygon points="0,0 200,0 200,86 62,200 0,200"/></clipPath></defs>` +
        `<g clip-path="url(#${id})">${fit(mascot({ P, fill: P.main, eyesType: 'classic' }), 96, 100, 1.0)}</g>` +
        `<path d="M188 104 L80 196" stroke="${P.main}" stroke-width="9" stroke-linecap="round"/>`;
    },
  },
  shield: {
    name: 'Shield',
    draw: (P) =>
      `<path d="M100 6 L188 32 V100 C188 150 150 178 100 194 C50 178 12 150 12 100 V32 Z" fill="${P.main}"/>` +
      `<path d="M100 18 L176 40 V100 C176 142 144 166 100 181 C56 166 24 142 24 100 V40 Z" fill="none" stroke="${P.paper}" stroke-width="3.5"/>` +
      fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 100, 0.5),
  },
  watcher: {
    name: 'Watcher',
    draw: (P) =>
      `<circle cx="66" cy="132" r="30" fill="${P.main}"/><circle cx="138" cy="132" r="30" fill="${P.main}"/>` +
      `<ellipse cx="78" cy="132" rx="12" ry="18" fill="${P.paper}"/><ellipse cx="150" cy="132" rx="12" ry="18" fill="${P.paper}"/>` +
      `<path d="M104 62 Q102 46 112 30" fill="none" stroke="${P.main}" stroke-width="9" stroke-linecap="round"/><circle cx="114" cy="24" r="13" fill="${P.main}"/>`,
  },
  cyclops: { name: 'One Eye', draw: (P) => mascot({ P, fill: P.main, eyesType: 'cyclops', gloss: true }) },
  planet: {
    name: 'Orbit',
    draw: (P) =>
      `<g transform="rotate(-18 100 108)"><path d="M2 108 A98 30 0 0 1 198 108" fill="none" stroke="${P.main}" stroke-width="7"/></g>` +
      `<circle cx="100" cy="100" r="80" fill="${P.main}"/>` +
      fit(mascot({ P, fill: P.paper, eyesType: 'classic', mode: 'ink', ink: P.main }), 100, 104, 0.5) +
      `<g transform="rotate(-18 100 108)"><path d="M2 108 A98 30 0 0 0 198 108" fill="none" stroke="${P.main}" stroke-width="7"/></g>`,
  },
  // ---- mood series (black-outlined sticker style, like the reference sheet) ----
  m_hey: { name: 'Mood · Hey', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'classic', gloss: true }) },
  m_wink: { name: 'Mood · Wink', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'wink', gloss: true }) },
  m_grr: { name: 'Mood · Grr', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'angry', gloss: true }) },
  m_whoa: { name: 'Mood · Whoa', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'surprised', gloss: true }) },
  m_crush: { name: 'Mood · Crush', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'love', gloss: true }) },
  m_zzz: { name: 'Mood · Zzz', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'sleepy', gloss: true }) },
  angel: { name: 'Angel', draw: (P) => mascot({ P, fill: P.main, outline: P.outline, ow: 5, eyesType: 'classic', ant: 'double', gloss: true, halo: true }) },
};


// ---------- symbols (used by the slogan series) ----------
const SYMBOLS = {
  bolt: { name: 'Bolt', draw: (P) => `<path d="M118 8 L38 112 H92 L76 192 L162 78 H108 Z" fill="${P.main}" stroke="${P.main}" stroke-width="8" stroke-linejoin="round"/>` },
  star: {
    name: 'Star',
    draw: (P) => {
      const pts = [];
      for (let i = 0; i < 10; i++) { const r = i % 2 ? 42 : 96, a = -Math.PI / 2 + (i * Math.PI) / 5; pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(106 + r * Math.sin(a)).toFixed(1)}`); }
      return `<polygon points="${pts.join(' ')}" fill="${P.main}" stroke="${P.main}" stroke-width="8" stroke-linejoin="round"/>`;
    },
  },
  moon: {
    name: 'Moon',
    draw: (P) => {
      const id = nid('mo');
      return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-30" y="-30" width="260" height="260"><rect x="-30" y="-30" width="260" height="260" fill="#fff"/><circle cx="142" cy="80" r="68" fill="#000"/></mask>` +
        `<circle cx="96" cy="104" r="86" fill="${P.main}" mask="url(#${id})"/>` +
        `<circle cx="178" cy="162" r="7" fill="${P.main}"/><circle cx="176" cy="112" r="5" fill="${P.main}"/><circle cx="120" cy="30" r="5" fill="${P.main}"/>`;
    },
  },
  ufo: {
    name: 'UFO',
    draw: (P) =>
      `<path d="M72 134 L30 196 H170 L128 134 Z" fill="${P.main}" opacity=".22"/>` +
      `<path d="M56 110 C56 44 144 44 144 110 Z" fill="${P.paper}" stroke="${P.main}" stroke-width="8" stroke-linejoin="round"/>` +
      `<ellipse cx="100" cy="118" rx="92" ry="26" fill="${P.main}"/>` +
      [52, 100, 148].map((x) => `<circle cx="${x}" cy="122" r="6" fill="${P.paper}"/>`).join(''),
  },
  rocket: {
    name: 'Rocket',
    draw: (P) =>
      `<path d="M100 194 C88 176 92 168 100 160 C108 168 112 176 100 194 Z" fill="${P.gold}"/>` +
      `<path d="M68 128 L38 158 L40 116 L68 84 Z M132 128 L162 158 L160 116 L132 84 Z" fill="${P.main}"/>` +
      `<path d="M100 6 C144 40 150 100 136 150 H64 C50 100 56 40 100 6 Z" fill="${P.main}"/>` +
      `<circle cx="100" cy="84" r="17" fill="${P.paper}"/><rect x="72" y="138" width="56" height="10" rx="5" fill="${P.paper}" opacity=".9"/>`,
  },
  eye: {
    name: 'Eye',
    draw: (P) =>
      `<path d="M6 102 C48 40 152 40 194 102 C152 164 48 164 6 102 Z" fill="${P.main}"/>` +
      `<circle cx="100" cy="102" r="36" fill="${P.paper}"/><circle cx="106" cy="104" r="20" fill="${P.iris}"/><circle cx="113" cy="96" r="6" fill="${P.paper}"/>`,
  },
  crown: {
    name: 'Crown',
    draw: (P) =>
      `<path d="M18 152 L26 58 L70 100 L100 36 L130 100 L174 58 L182 152 Z" fill="${P.main}" stroke="${P.main}" stroke-width="8" stroke-linejoin="round"/>` +
      `<rect x="18" y="162" width="164" height="24" rx="8" fill="${P.main}"/>` +
      [[26, 52], [100, 30], [174, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${P.main}"/>`).join('') +
      `<circle cx="100" cy="126" r="10" fill="${P.paper}"/>`,
  },
  flame: {
    name: 'Flame',
    draw: (P) =>
      `<path d="M100 4 C112 52 166 80 160 138 C154 180 122 196 100 196 C76 196 44 180 42 138 C40 100 72 90 78 58 C92 78 98 46 100 4 Z" fill="${P.main}"/>` +
      `<path d="M100 96 C106 124 130 132 126 156 C122 176 108 182 100 182 C90 182 76 174 76 156 C76 138 96 130 100 96 Z" fill="${P.paper}"/>`,
  },
  heart: {
    name: 'Heart',
    draw: (P) => `<path d="M100 190 C18 130 6 88 28 60 C50 32 88 42 100 72 C112 42 150 32 172 60 C194 88 182 130 100 190 Z" fill="${P.main}" stroke="${P.main}" stroke-width="6" stroke-linejoin="round"/>`,
  },
  cloud: {
    name: 'Cloud',
    draw: (P) =>
      `<g fill="${P.main}"><circle cx="62" cy="122" r="40"/><circle cx="108" cy="92" r="54"/><circle cx="150" cy="122" r="38"/><rect x="24" y="122" width="164" height="40" rx="20"/></g>` +
      `<g fill="${P.paper}"><ellipse cx="86" cy="118" rx="7" ry="10"/><ellipse cx="122" cy="118" rx="7" ry="10"/></g>`,
  },
  smile: {
    name: 'Smile',
    draw: (P) =>
      `<circle cx="100" cy="100" r="92" fill="${P.main}"/><ellipse cx="70" cy="80" rx="10" ry="15" fill="${P.paper}"/><ellipse cx="130" cy="80" rx="10" ry="15" fill="${P.paper}"/>` +
      `<path d="M54 118 Q100 170 146 118" fill="none" stroke="${P.paper}" stroke-width="10" stroke-linecap="round"/>`,
  },
  diamond: {
    name: 'Diamond',
    draw: (P) =>
      `<path d="M52 28 H148 L192 82 L100 192 L8 82 Z" fill="${P.main}" stroke="${P.main}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M8 82 H192 M72 82 L100 192 M128 82 L100 192 M72 82 L52 28 M128 82 L148 28 M72 82 L100 28 M128 82 L100 28" fill="none" stroke="${P.paper}" stroke-width="4" stroke-linejoin="round" opacity=".85"/>`,
  },
};

const symbolSvg = (id, P, size = 200) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 212 212" width="${size}" height="${size}">${SYMBOLS[id].draw(P)}</svg>`;

// wrap a logo as a standalone <svg> string of a given pixel size
function logoSvg(id, P, size = 200, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 212 212" width="${size}" height="${size}">${extra}${LOGOS[id].draw(P)}</svg>`;
}

module.exports = { PALETTES, LOGOS, SYMBOLS, symbolSvg, logoSvg, mascot, fit, nid, heart };
