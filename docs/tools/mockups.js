'use strict';
const { LOGOS, SYMBOLS, PALETTES, mascot } = require('./art');

const SHIRTS = {
  black: { hex: '#17161B', pal: 'dark', label: 'שחור' },
  charcoal: { hex: '#3B3A45', pal: 'dark', label: 'אפור פחם' },
  white: { hex: '#F3EFE6', pal: 'light', label: 'לבן שבור' },
  lavender: { hex: '#CDBDF2', pal: 'light', label: 'לבנדר' },
  purple: { hex: '#5B37A8', pal: 'purple', label: 'סגול Vexo' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const logoInner = (id, P) => LOGOS[id].draw(P);
const logoBox = (id, P, x, y, size) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="-6 -6 212 212" overflow="visible">${logoInner(id, P)}</svg>`;

// font-size that fits `len` chars of Bungee into `width`
const fitFont = (len, width, max) => Math.min(max, Math.floor(width / (len * 0.74)));
const bungee = (txt, x, y, size, fill, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Bungee" font-size="${size}" fill="${fill}" ${extra}>${esc(txt)}</text>`;
const wordmark = (x, y, size, fill) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${size}" fill="${fill}" letter-spacing="${size * 0.06}">vexo</text>`;

// ---------- print layouts (units: 1 = 0.01 inch) ----------
const symBox = (id, P, x, y, size) =>
  `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="-6 -6 212 212" overflow="visible">${SYMBOLS[id].draw(P)}</svg>`;

function layoutArt(kind, logoId, P, text = '', sym = '') {
  switch (kind) {
    case 'center': {
      const W = 1100;
      let y = 0, svg = logoBox(logoId, P, 100, 0, 900);
      let H = 930;
      if (text) {
        svg += bungee(text, W / 2, 1080, fitFont(text.length, 1040, 125), P.text);
        H = 1140;
      }
      svg += wordmark(W / 2, H + 95, 84, P.accent);
      H += 130;
      return { W, H, svg, place: { top: 150 } };
    }
    case 'slogan': {
      const W = 1100;
      const lines = text.split('\n');
      const size = Math.min(...lines.map((l) => fitFont(l.length, 1040, 250)));
      let svg = symBox(sym, P, W / 2 - 170, 0, 340);
      let y = 340 + 40 + size * 0.85;
      lines.forEach((l, i) => { svg += bungee(l, W / 2, y, size, i % 2 ? P.text : P.main); y += size * 1.08; });
      y += 10;
      svg += logoBox(logoId, P, W / 2 - 95, y, 190);
      svg += wordmark(W / 2, y + 190 + 90, 84, P.accent);
      return { W, H: y + 190 + 130, svg, place: { top: 140 } };
    }
    case 'giant': {
      const W = 1300;
      let svg = logoBox(logoId, P, 50, 0, 1200), H = 1200;
      if (text) { svg += bungee(text, W / 2, 1350, fitFont(text.length, 1240, 130), P.text); H = 1400; }
      return { W, H, svg, place: { top: 140 } };
    }
    case 'chest':
      return { W: 340, H: 340, svg: logoBox(logoId, P, 0, 0, 340), place: { top: 150, dx: 50 } };
    case 'nape':
      return { W: 420, H: 470, svg: logoBox(logoId, P, 60, 0, 300) + wordmark(210, 440, 120, P.text), place: { top: 110 } };
    case 'big': {
      const W = 1100;
      let svg = logoBox(logoId, P, 150, 0, 800), H = 830;
      if (text) { svg += bungee(text, W / 2, 960, fitFont(text.length, 1040, 120), P.text); H = 1010; }
      svg += wordmark(W / 2, H + 100, 84, P.accent);
      H += 140;
      return { W, H, svg, place: { top: 140 } };
    }
    case 'text': {
      const W = 1200;
      const lines = text.split('\n');
      const size = Math.min(...lines.map((l) => fitFont(l.length, 1160, 330)));
      let svg = '';
      lines.forEach((l, i) => { svg += bungee(l, W / 2, size * 0.95 + i * size * 1.05, size, i % 2 ? P.text : P.main); });
      const y0 = size * 0.95 + lines.length * size * 1.05 - size * 0.5;
      svg += logoBox(logoId, P, W / 2 - 150, y0 + 20, 300);
      const H = y0 + 340;
      svg += wordmark(W / 2, H + 100, 84, P.accent);
      return { W, H: H + 140, svg, place: { top: 135 } };
    }
    default:
      throw new Error('layout ' + kind);
  }
}

// ---------- T-shirt mockup ----------
const TEE = 'M285 70 C300 118 400 118 415 70 L545 105 L660 235 L590 300 L515 255 L515 735 Q350 752 185 735 L185 255 L110 300 L40 235 L155 105 Z';
const TEE_BACK = 'M285 70 C305 90 395 90 415 70 L545 105 L660 235 L590 300 L515 255 L515 735 Q350 752 185 735 L185 255 L110 300 L40 235 L155 105 Z';
const K = 0.23; // mockup units per art unit

function stage(inner, bgA = '#F2EEFB', bgB = '#DCD3F3') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 800" width="700" height="800">
<defs><radialGradient id="bg" cx="50%" cy="42%" r="75%"><stop offset="0" stop-color="${bgA}"/><stop offset="1" stop-color="${bgB}"/></radialGradient></defs>
<rect width="700" height="800" fill="url(#bg)"/>${inner}</svg>`;
}

function teeSvg({ view, colorKey, art }) {
  const c = SHIRTS[colorKey].hex;
  const back = view === 'back';
  const path = back ? TEE_BACK : TEE;
  const light = SHIRTS[colorKey].pal === 'light';
  const ink = light ? '0,0,0' : '255,255,255';
  const rib = light ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.10)';
  let artSvg = '';
  if (art) {
    const w = art.W * K, h = art.H * K;
    const cx = 350 + (art.place.dx || 0) * (view === 'front' ? 1 : 0);
    artSvg = `<svg x="${cx - w / 2}" y="${art.place.top}" width="${w}" height="${h}" viewBox="0 0 ${art.W} ${art.H}" overflow="visible">${art.svg}</svg>`;
  }
  const collar = back
    ? `<path d="M285 70 C305 90 395 90 415 70" fill="none" stroke="${rib}" stroke-width="11" stroke-linecap="round"/><path d="M290 66 C308 82 392 82 410 66" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
       <rect x="331" y="86" width="38" height="20" rx="3" fill="rgba(${ink},.10)"/><text x="350" y="100" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="11" fill="rgba(${ink},.45)">vexo</text>`
    : `<path d="M285 70 C300 118 400 118 415 70" fill="none" stroke="${rib}" stroke-width="12" stroke-linecap="round"/><path d="M290 72 C305 108 395 108 410 72" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2"/>`;
  return stage(`
<defs>
<linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".10"/></linearGradient>
<clipPath id="tc"><path d="${path}"/></clipPath>
<filter id="ds" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>
<ellipse cx="350" cy="748" rx="210" ry="16" fill="#2a1a5a" opacity=".22" filter="url(#ds)"/>
<path d="${path}" fill="${c}"/>
<g clip-path="url(#tc)">
<rect width="700" height="800" fill="url(#sh)"/><rect width="700" height="800" fill="url(#hl)"/>
<path d="M155 105 L185 255 M545 105 L515 255" stroke="rgba(0,0,0,.14)" stroke-width="3" fill="none"/>
<path d="M200 480 Q260 500 300 470 M410 560 Q450 545 500 575 M230 640 Q270 655 330 640" stroke="rgba(${ink},.07)" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M112 296 L44 236 M588 296 L656 236" stroke="rgba(0,0,0,.18)" stroke-width="5" fill="none"/>
<path d="M188 722 Q350 738 512 722" stroke="rgba(0,0,0,.16)" stroke-width="3" fill="none"/>
</g>
<path d="${path}" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1.6" stroke-linejoin="round"/>
${collar}${artSvg}`);
}

// ---------- other products ----------
function mugSvg({ P, logoId, mug = '#FFFFFF' }) {
  const big = logoBox(logoId, P, 270, 300, 160);
  return stage(`
<defs><linearGradient id="mg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".25" stop-color="#fff" stop-opacity=".25"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<filter id="ds"><feGaussianBlur stdDeviation="9"/></filter></defs>
<ellipse cx="350" cy="590" rx="200" ry="16" fill="#2a1a5a" opacity=".25" filter="url(#ds)"/>
<path d="M490 330 C580 320 590 470 480 480" fill="none" stroke="${mug}" stroke-width="34" stroke-linecap="round"/>
<path d="M490 330 C580 320 590 470 480 480" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="34" stroke-linecap="round" opacity=".35"/>
<path d="M190 250 H510 V520 Q510 585 445 585 H255 Q190 585 190 520 Z" fill="${mug}"/>
<path d="M190 250 H510 V520 Q510 585 445 585 H255 Q190 585 190 520 Z" fill="url(#mg)"/>
<ellipse cx="350" cy="250" rx="160" ry="26" fill="#EDE8F7"/><ellipse cx="350" cy="254" rx="146" ry="19" fill="#C9BFE6"/>
${big}
<path d="M190 250 H510 V520 Q510 585 445 585 H255 Q190 585 190 520 Z" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>`);
}

function toteSvg({ P, logoId, bag = '#E9DFC9', text = 'vexo' }) {
  return stage(`
<defs><filter id="ds"><feGaussianBlur stdDeviation="10"/></filter></defs>
<ellipse cx="350" cy="722" rx="200" ry="14" fill="#2a1a5a" opacity=".22" filter="url(#ds)"/>
<path d="M250 300 C240 120 300 100 300 100 M450 300 C460 120 400 100 400 100" fill="none" stroke="${bag}" stroke-width="20" stroke-linecap="round"/>
<path d="M250 300 C240 120 300 100 300 100 M450 300 C460 120 400 100 400 100" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="20" stroke-linecap="round"/>
<path d="M170 290 H530 L548 700 Q350 716 152 700 Z" fill="${bag}"/>
<path d="M170 290 H530 L548 700 Q350 716 152 700 Z" fill="rgba(0,0,0,.04)"/>
<path d="M160 330 Q350 350 540 330 M158 640 Q350 660 546 640" stroke="rgba(0,0,0,.08)" stroke-width="3" fill="none"/>
${logoBox(logoId, P, 265, 350, 170)}${text ? wordmark(350, 580, 56, P.text) : ''}
<path d="M170 290 H530 L548 700 Q350 716 152 700 Z" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1.5"/>`);
}

function capSvg({ P, logoId, cap = '#17161B' }) {
  const patch = `<g><ellipse cx="350" cy="384" rx="66" ry="62" fill="rgba(0,0,0,.30)" transform="translate(2 5)"/>${logoBox(logoId, P, 288, 322, 124)}</g>`;
  return stage(`
<defs><filter id="ds"><feGaussianBlur stdDeviation="10"/></filter>
<linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".4" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
<ellipse cx="350" cy="612" rx="230" ry="16" fill="#2a1a5a" opacity=".22" filter="url(#ds)"/>
<path d="M160 480 C150 175 550 175 540 480 C430 512 270 512 160 480 Z" fill="${cap}"/>
<path d="M160 480 C150 175 550 175 540 480 C430 512 270 512 160 480 Z" fill="url(#cg)"/>
<path d="M350 256 C300 300 292 410 300 500 M350 256 C400 300 408 410 400 500" stroke="rgba(255,255,255,.10)" stroke-width="2.5" fill="none"/>
<circle cx="350" cy="255" r="12" fill="${cap}" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
<path d="M150 476 C270 514 430 514 550 476 C600 500 592 560 522 588 C430 616 270 616 178 588 C108 560 100 500 150 476 Z" fill="${cap}"/>
<path d="M150 476 C270 514 430 514 550 476 C600 500 592 560 522 588 C430 616 270 616 178 588 C108 560 100 500 150 476 Z" fill="rgba(255,255,255,.07)"/>
<path d="M150 476 C270 514 430 514 550 476" stroke="rgba(255,255,255,.28)" stroke-width="3" fill="none"/>
<path d="M170 540 C270 585 430 585 530 540" stroke="rgba(255,255,255,.10)" stroke-width="2.5" fill="none"/>
${patch}`);
}

function stickerSvg({ P, logoId }) {
  const st = mascotSticker(logoId, P)(130, 190, 440);
  return stage(`<defs><filter id="dsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="6" dy="12" stdDeviation="9" flood-color="#2a1a5a" flood-opacity=".3"/></filter></defs>
<g transform="rotate(-7 350 400)" filter="url(#dsh)">${st}</g>`, '#F6F3FC', '#E4DDF6');
}

// sticker = logo on a thick white die-cut border (dilated alpha)
function mascotSticker(id, P) {
  return (x, y, size) => {
    const fid = `st${Math.round(x)}${Math.round(y)}`;
    return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="-6 -6 212 212" overflow="visible">
<defs><filter id="${fid}" x="-15%" y="-15%" width="130%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="8" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/><feMerge><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<g filter="url(#${fid})">${LOGOS[id].draw(P)}</g></svg>`;
  };
}

function phoneSvg({ P, logoId, body = '#CDBDF2' }) {
  return stage(`
<defs><filter id="ds"><feGaussianBlur stdDeviation="10"/></filter>
<linearGradient id="pg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient></defs>
<ellipse cx="350" cy="716" rx="150" ry="14" fill="#2a1a5a" opacity=".25" filter="url(#ds)"/>
<rect x="225" y="100" width="250" height="600" rx="48" fill="${body}"/><rect x="225" y="100" width="250" height="600" rx="48" fill="url(#pg)"/>
<rect x="225" y="100" width="250" height="600" rx="48" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2"/>
<rect x="243" y="118" width="98" height="98" rx="26" fill="#1c1a22"/><circle cx="272" cy="147" r="15" fill="#3a3844" stroke="#0d0c10" stroke-width="3"/><circle cx="314" cy="189" r="15" fill="#3a3844" stroke="#0d0c10" stroke-width="3"/><circle cx="314" cy="147" r="7" fill="#f6f1e7" opacity=".7"/>
${logoBox(logoId, P, 270, 330, 160)}`);
}

module.exports = { symBox, SHIRTS, layoutArt, teeSvg, mugSvg, toteSvg, capSvg, stickerSvg, phoneSvg, logoBox, wordmark, bungee, fitFont, stage, mascotSticker };
