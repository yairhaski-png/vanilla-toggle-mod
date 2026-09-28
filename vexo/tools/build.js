'use strict';
// Builds every asset (mockups, print files, logo pack) and the HTML deck.
//   NODE_PATH=<dir with playwright> node build.js [--skip-render]
const fs = require('fs');
const path = require('path');
const { PALETTES, LOGOS, logoSvg } = require('./art');
const M = require('./mockups');
const { SHIRTS, FAVORITES, PRODUCTS } = require('./data');
const { makeRenderer } = require('./render');

const ROOT = path.resolve(__dirname, '..');
const DL = path.join(ROOT, 'downloads');
const LG = path.join(ROOT, 'logos');
const skipRender = process.argv.includes('--skip-render');
const mk = (d) => fs.mkdirSync(d, { recursive: true });
const artSvg = (a) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a.W} ${a.H}" width="${a.W}" height="${a.H}" overflow="visible">${a.svg}</svg>`;
const inch = (n) => (n / 100).toFixed(1).replace(/\.0$/, '');
const dims = (a) => `<span dir="ltr">${inch(a.W)}" × ${inch(a.H)}"</span>`;

const PLACE_TXT = {
  center: (a) => `מרכז החזה · ${dims(a)}`,
  giant: (a) => `הדפס גדול על כל החזה · ${dims(a)}`,
  chest: (a) => `חזה שמאל (מבט הלובש) · ${dims(a)}`,
  nape: (a) => `קטן בגב העליון, מתחת לצווארון · ${dims(a)}`,
  big: (a) => `הדפס גדול על הגב · ${dims(a)}`,
  text: (a) => `כיתוב גדול על הגב · ${dims(a)}`,
};

const prepared = SHIRTS.map((s) => {
  const P = PALETTES[M.SHIRTS[s.color].pal];
  const front = M.layoutArt(s.front[0], s.logo, P, s.front[1]);
  const back = M.layoutArt(s.back[0], s.logo, P, s.back[1]);
  return { ...s, P, frontArt: front, backArt: back };
});

const LOGO_IDS = Object.keys(LOGOS);

// product mockups for favourites
function productSvg(key, logoId) {
  const dark = PALETTES.dark, light = PALETTES.light;
  switch (key) {
    case 'cap': return M.capSvg({ P: dark, logoId });
    case 'mug': return M.mugSvg({ P: light, logoId });
    case 'tote': return M.toteSvg({ P: light, logoId });
    case 'sticker': return M.stickerSvg({ P: light, logoId });
    case 'phone': return M.phoneSvg({ P: light, logoId });
  }
}
function productPrint(key, logoId) {
  const dark = PALETTES.dark, light = PALETTES.light;
  const wrap = (W, H, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="visible">${inner}</svg>`;
  switch (key) {
    case 'cap': return { W: 300, H: 300, svg: wrap(300, 300, M.logoBox(logoId, dark, 0, 0, 300)), file: 'embroidery-3in' };
    case 'mug': return { W: 900, H: 360, svg: wrap(900, 360, M.logoBox(logoId, light, 130, 20, 270) + M.logoBox(logoId, light, 500, 20, 270) + M.wordmark(265, 335, 44, light.text) + M.wordmark(635, 335, 44, light.text)), file: 'wrap-9x3.6in' };
    case 'tote': return { W: 1000, H: 1000, svg: wrap(1000, 1000, M.logoBox(logoId, light, 170, 40, 660) + M.wordmark(500, 930, 190, light.text)), file: 'print-10x10in' };
    case 'sticker': return { W: 300, H: 300, svg: wrap(300, 300, `<svg x="0" y="0" width="300" height="300" viewBox="-16 -16 232 232" overflow="visible">${M.mascotSticker(logoId, light)(0, 0, 200).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`), file: 'diecut-3in' };
    case 'phone': return { W: 400, H: 400, svg: wrap(400, 400, M.logoBox(logoId, light, 0, 0, 400)), file: 'print-4in' };
  }
}

async function renderAll() {
  const r = await makeRenderer();
  mk(DL); mk(LG); mk(path.join(DL, 'merch'));

  // --- shirts
  for (const s of prepared) {
    const dir = path.join(DL, s.id);
    mk(dir);
    const put = (name, buf) => fs.writeFileSync(path.join(dir, `${s.id}-${name}`), buf);
    put('mockup-front.jpg', await r.shot(M.teeSvg({ view: 'front', colorKey: s.color, art: s.frontArt }), 700, 800, { scale: 2, type: 'jpeg', quality: 90 }));
    put('mockup-back.jpg', await r.shot(M.teeSvg({ view: 'back', colorKey: s.color, art: s.backArt }), 700, 800, { scale: 2, type: 'jpeg', quality: 90 }));
    put('print-front.png', await r.shot(artSvg(s.frontArt), s.frontArt.W, s.frontArt.H, { scale: 3, transparent: true }));
    put('print-back.png', await r.shot(artSvg(s.backArt), s.backArt.W, s.backArt.H, { scale: 3, transparent: true }));
    process.stdout.write(`shirt ${s.id}\n`);
  }

  // --- logo pack (transparent PNG, light + dark palette)
  for (const id of LOGO_IDS) {
    for (const [tag, P] of [['purple', PALETTES.light], ['light-on-dark', PALETTES.dark]]) {
      fs.writeFileSync(path.join(LG, `vexo-logo-${id}-${tag}.png`), await r.shot(logoSvg(id, P, 400), 400, 400, { scale: 5, transparent: true }));
    }
  }
  process.stdout.write('logos done\n');

  // --- merch for favourites
  for (const f of FAVORITES) {
    for (const p of PRODUCTS) {
      const base = path.join(DL, 'merch', `${f.logo}-${p.key}`);
      fs.writeFileSync(`${base}-mockup.jpg`, await r.shot(productSvg(p.key, f.logo), 700, 800, { scale: 2, type: 'jpeg', quality: 90 }));
      const pr = productPrint(p.key, f.logo);
      fs.writeFileSync(`${base}-${pr.file}.png`, await r.shot(pr.svg, pr.W, pr.H, { scale: 3, transparent: true }));
    }
    process.stdout.write(`merch ${f.logo}\n`);
  }
  await r.close();
}

// ---------------------------------------------------------------- deck
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const fontFace = (fam, file, w, range) => `@font-face{font-family:'${fam}';font-weight:${w};font-display:swap;src:url(assets/fonts/${file}) format('woff2');${range ? 'unicode-range:' + range + ';' : ''}}`;
const HEB = 'U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F';
const LAT = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const CSS = `
${[500, 700, 800].map((w) => fontFace('Rubik', `rubik-hebrew-${w}-normal.woff2`, w, HEB) + fontFace('Rubik', `rubik-latin-${w}-normal.woff2`, w, LAT)).join('')}
${fontFace('Bungee', 'bungee-latin-400-normal.woff2', 400)}
:root{--bg:#0E0A1A;--s1:#171029;--s2:#211838;--tx:#F3EEFF;--mu:#ABA0C9;--ac:#8B5CF6;--ac2:#C4B0FF;--pk:#F062C8;--bd:rgba(255,255,255,.09)}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-snap-type:y proximity}
body{margin:0;background:var(--bg);color:var(--tx);font-family:Rubik,system-ui,sans-serif;font-weight:500;line-height:1.55}
a{color:inherit;text-decoration:none}
.slide{min-height:100vh;padding:56px 5vw 64px;display:flex;align-items:center;scroll-snap-align:start;position:relative;border-bottom:1px solid var(--bd)}
.slide>.in{width:100%;max-width:1320px;margin:0 auto}
.disp{font-family:Bungee,Rubik,sans-serif;font-weight:400;letter-spacing:.02em}
h1,h2,h3{margin:0;font-weight:800;line-height:1.1}
.muted{color:var(--mu)}.chip{display:inline-block;background:rgba(139,92,246,.18);color:var(--ac2);border:1px solid rgba(139,92,246,.35);border-radius:999px;padding:3px 12px;font-size:13px;font-weight:700}
.idx{color:var(--mu);font-size:14px;letter-spacing:.06em}
.btn{display:inline-flex;align-items:center;gap:8px;padding:9px 15px;border-radius:12px;border:1px solid var(--bd);background:var(--s2);font-size:14px;font-weight:700;transition:.15s;cursor:pointer}
.btn:hover{background:#2c2050;border-color:rgba(196,176,255,.5);transform:translateY(-1px)}
.btn.pri{background:var(--ac);border-color:var(--ac);color:#fff}.btn.pri:hover{background:#9d74fb}
.btn.sm{padding:6px 10px;font-size:12.5px;border-radius:9px}
/* shirt slide */
.shirt-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:44px;align-items:center;direction:ltr}
.info{direction:rtl;text-align:right}
.info h2{font-size:clamp(34px,4.2vw,60px);margin:8px 0 12px}
.price{display:flex;align-items:baseline;gap:10px;margin:8px 0 20px}.price b{font-size:44px;font-weight:800;color:#fff}.price span{color:var(--mu);font-size:14px}
.blk{margin:0 0 18px}.blk h3{font-size:13px;letter-spacing:.08em;color:var(--ac2);margin-bottom:6px;font-weight:700}
.blk ul{margin:0;padding:0 18px 0 0}.blk li{margin:3px 0}
.meta{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:14.5px}.meta dt{color:var(--mu)}.meta dd{margin:0}
.sw{display:inline-block;width:13px;height:13px;border-radius:50%;border:1px solid rgba(255,255,255,.35);vertical-align:-1px;margin-left:6px}
.dl{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.mock{display:grid;grid-template-columns:1fr 1fr;gap:16px;direction:ltr}
.mock figure{margin:0;background:var(--s1);border:1px solid var(--bd);border-radius:22px;overflow:hidden;position:relative}
.mock img{display:block;width:100%;height:auto}
.mock figcaption{position:absolute;top:10px;left:12px;background:rgba(14,10,26,.72);backdrop-filter:blur(4px);border-radius:8px;padding:2px 10px;font-size:12px;font-weight:700;color:#fff}
/* cover */
.cover{background:radial-gradient(1200px 600px at 75% 40%,rgba(139,92,246,.35),transparent 60%),var(--bg)}
.cover h1{font-size:clamp(70px,13vw,190px);letter-spacing:.02em;line-height:.95}
.cover .sub{font-size:clamp(18px,2vw,26px);color:var(--mu);max-width:560px}
.cover-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;direction:ltr}.cover-grid .l{direction:rtl;text-align:right}
.cover-logos{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.cover-logos img{width:100%;background:#F4F0E8;border-radius:22px;padding:12px}
.stats{display:flex;gap:26px;margin-top:28px;flex-wrap:wrap}.stats div{font-size:13px;color:var(--mu)}.stats b{display:block;font-size:34px;color:#fff;font-weight:800}
/* generic */
.sec-title{font-size:clamp(30px,3.6vw,50px);margin-bottom:8px}.lead{color:var(--mu);font-size:18px;max-width:760px;margin:0 0 26px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.card{background:var(--s1);border:1px solid var(--bd);border-radius:20px;padding:20px}.card h3{font-size:18px;margin-bottom:8px}.card p,.card li{color:#d6ccf0;font-size:15px;margin:4px 0}
.pal{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}.pal i{width:52px;height:52px;border-radius:14px;border:1px solid var(--bd);display:block;position:relative}.pal i em{position:absolute;bottom:-20px;left:0;font-style:normal;font-size:10.5px;color:var(--mu);white-space:nowrap;direction:ltr}
.logo-grid{direction:ltr;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.logo-grid a{background:#F4F0E8;border-radius:18px;padding:12px 12px 8px;text-align:center;color:#3A2277;font-size:12.5px;font-weight:700;direction:ltr;transition:.15s}
.logo-grid a:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(139,92,246,.35)}.logo-grid img{width:100%;display:block}
.logo-grid a.dk{background:#17161B;color:var(--ac2)}
.ov{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.ov a{background:var(--s1);border:1px solid var(--bd);border-radius:16px;overflow:hidden;transition:.15s;display:block}.ov a:hover{transform:translateY(-3px);border-color:rgba(196,176,255,.5)}
.ov img{width:100%;display:block}.ov div{padding:8px 10px;font-size:12.5px;display:flex;justify-content:space-between;gap:6px;direction:ltr}.ov b{color:var(--ac2)}
/* favourites */
.fav-top{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:center;margin-bottom:22px;direction:ltr}
.fav-top img{width:170px;background:#F4F0E8;border-radius:28px;padding:14px}.fav-top .t{direction:rtl;text-align:right}
.prod-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;direction:ltr}
.prod{background:var(--s1);border:1px solid var(--bd);border-radius:18px;overflow:hidden;display:flex;flex-direction:column;direction:rtl;text-align:right}
.prod img{width:100%;display:block}.prod .b{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1}.prod .b h4{margin:0;font-size:15px}.prod .b p{margin:0;color:var(--mu);font-size:12.5px;flex:1}.prod .pr{font-size:22px;font-weight:800}
.prod .dl{margin-top:4px}
/* table */
.tbl{display:grid;grid-template-columns:1fr 1fr;gap:0 40px}
.tbl table{width:100%;border-collapse:collapse;font-size:14px}.tbl td,.tbl th{padding:7px 8px;border-bottom:1px solid var(--bd);text-align:right}.tbl th{color:var(--ac2);font-size:12px;letter-spacing:.06em}.tbl td.p{font-weight:800;color:#fff;white-space:nowrap}
#hud{position:fixed;bottom:16px;left:16px;z-index:9;display:flex;gap:8px;align-items:center;background:rgba(23,16,41,.85);backdrop-filter:blur(8px);border:1px solid var(--bd);border-radius:14px;padding:6px 8px;font-size:13px}
#hud button{background:var(--s2);border:1px solid var(--bd);color:#fff;border-radius:9px;width:32px;height:30px;font-size:15px;cursor:pointer}#hud span{min-width:64px;text-align:center;direction:ltr;color:var(--mu)}
@media(max-width:980px){.shirt-grid,.cover-grid{grid-template-columns:1fr}.info{order:2}.tbl{grid-template-columns:1fr}.prod-grid{grid-template-columns:repeat(2,1fr)}.fav-top{grid-template-columns:1fr}.slide{padding:32px 18px 60px}}
@media print{@page{size:1400px 900px;margin:0}html{scroll-snap-type:none}#hud{display:none}.slide{min-height:auto;height:900px;page-break-after:always;break-after:page;overflow:hidden}.btn{display:none}}
`;

const dlBtn = (href, label, cls = '') => `<a class="btn ${cls}" href="${href}" download>${label}</a>`;

function shirtSlide(s, i, total) {
  const d = `downloads/${s.id}`;
  const hex = M.SHIRTS[s.color].hex;
  return `
<section class="slide" id="s-${s.id}"><div class="in"><div class="shirt-grid">
  <div class="info">
    <div class="idx">חולצה ${String(i + 1).padStart(2, '0')} / ${total} · ${s.logo.startsWith('m_') || s.logo === 'angel' ? 'סדרת Moods' : 'קולקציית לוגואים'}</div>
    <h2 class="disp">${esc(s.name)}</h2>
    <span class="chip">${esc(s.tag)}</span>
    <div class="price"><b>₪${s.price}</b><span>מחיר מומלץ ללקוח (כולל מע״מ)</span></div>
    <div class="blk"><h3>למה אני ממליץ עליה</h3><ul>${s.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul></div>
    <div class="blk"><h3>קהל יעד</h3>${esc(s.who)}</div>
    <div class="blk"><h3>פרטי מוצר</h3><dl class="meta">
      <dt>צבע חולצה</dt><dd><span class="sw" style="background:${hex}"></span>${M.SHIRTS[s.color].label}</dd>
      <dt>הדפס קדימה</dt><dd>${PLACE_TXT[s.front[0]](s.frontArt)}${s.front[1] ? ` · <span dir="ltr">"${esc(s.front[1])}"</span>` : ''}</dd>
      <dt>הדפס אחורה</dt><dd>${PLACE_TXT[s.back[0]](s.backArt)}${s.back[1] ? ` · <span dir="ltr">"${esc(s.back[1].replace('\n', ' '))}"</span>` : ''}</dd>
    </dl></div>
    <div class="dl">
      ${dlBtn(`${d}/${s.id}.zip`, '⬇ הורד הכל (ZIP)', 'pri')}
      ${dlBtn(`${d}/${s.id}-mockup-front.jpg`, 'תמונת חזית לאתר', 'sm')}
      ${dlBtn(`${d}/${s.id}-mockup-back.jpg`, 'תמונת גב לאתר', 'sm')}
      ${dlBtn(`${d}/${s.id}-print-front.png`, 'קובץ הדפסה – חזית', 'sm')}
      ${dlBtn(`${d}/${s.id}-print-back.png`, 'קובץ הדפסה – גב', 'sm')}
    </div>
  </div>
  <div class="mock">
    <figure><img src="${d}/${s.id}-mockup-front.jpg" alt="${esc(s.name)} – חזית" loading="lazy"><figcaption>חזית</figcaption></figure>
    <figure><img src="${d}/${s.id}-mockup-back.jpg" alt="${esc(s.name)} – גב" loading="lazy"><figcaption>גב</figcaption></figure>
  </div>
</div></div></section>`;
}

function favSlide(f, i) {
  const id = f.logo;
  return `
<section class="slide" id="f-${id}"><div class="in">
  <div class="fav-top"><img src="logos/vexo-logo-${id}-purple.png" alt="${esc(f.name)}"><div class="t">
    <div class="idx">לוגו אהוב ${i + 1} / ${FAVORITES.length} · מוצרים נוספים</div>
    <h2 class="sec-title disp">${esc(f.name)}</h2><p class="lead" style="margin:0">${esc(f.pitch)}</p>
    <div class="dl" style="margin-top:12px">${dlBtn(`logos/vexo-logo-${id}-purple.png`, 'לוגו – סגול על בהיר', 'sm')}${dlBtn(`logos/vexo-logo-${id}-light-on-dark.png`, 'לוגו – לרקע כהה', 'sm')}</div>
  </div></div>
  <div class="prod-grid">${PRODUCTS.map((p) => {
    const base = `downloads/merch/${id}-${p.key}`;
    const pr = productPrint(p.key, id);
    return `<div class="prod"><img src="${base}-mockup.jpg" alt="${esc(p.name)}" loading="lazy"><div class="b"><h4>${p.name}</h4><p>${p.note}</p><div class="pr">₪${p.price}</div>
      <div class="dl">${dlBtn(`${base}-mockup.jpg`, 'תמונה', 'sm')}${dlBtn(`${base}-${pr.file}.png`, 'קובץ הדפסה', 'sm')}</div></div></div>`;
  }).join('')}</div>
</div></section>`;
}

function buildDeck() {
  const total = prepared.length;
  const logoCards = LOGO_IDS.map((id) => `<a href="logos/vexo-logo-${id}-purple.png" download title="הורדה"><img src="logos/vexo-logo-${id}-purple.png" alt="${esc(LOGOS[id].name)}" loading="lazy">${esc(LOGOS[id].name)}</a>`).join('');
  const ov = prepared.map((s) => `<a href="#s-${s.id}"><img src="downloads/${s.id}/${s.id}-mockup-front.jpg" alt="${esc(s.name)}" loading="lazy"><div><span>${esc(s.name)}</span><b>₪${s.price}</b></div></a>`).join('');
  const avg = Math.round(prepared.reduce((a, s) => a + s.price, 0) / total);
  const half = Math.ceil(total / 2);
  const row = (s) => `<tr><td><a href="#s-${s.id}">${esc(s.name)}</a></td><td>${M.SHIRTS[s.color].label}</td><td class="p">₪${s.price}</td></tr>`;
  const tbl = (arr) => `<table><thead><tr><th>חולצה</th><th>צבע</th><th>מחיר</th></tr></thead><tbody>${arr.map(row).join('')}</tbody></table>`;
  const coverLogos = ['classic', 'm_wink', 'grumpy', 'm_whoa', 'm_crush', 'angel'].map((id) => `<img src="logos/vexo-logo-${id}-purple.png" alt="">`).join('');
  const slides = [];

  slides.push(`
<section class="slide cover" id="cover"><div class="in"><div class="cover-grid">
  <div class="l"><div class="idx">ספר קולקציה · סתיו 2026</div><h1 class="disp">VEXO</h1>
    <p class="sub">${total} חולצות, ${LOGO_IDS.length} וריאציות לוגו ו־${FAVORITES.length * PRODUCTS.length} מוצרים נוספים – הכל מוכן להעלאה לשופיפיי.</p>
    <div class="stats"><div><b>${total}</b>חולצות</div><div><b>${LOGO_IDS.length}</b>לוגואים</div><div><b>${FAVORITES.length * PRODUCTS.length}</b>מוצרי מרצ׳</div><div><b>₪${avg}</b>מחיר ממוצע</div></div>
    <div class="dl" style="margin-top:26px"><a class="btn pri" href="#overview">לקולקציה המלאה ↓</a><a class="btn" href="vexo-all-designs.zip" download>⬇ כל הקבצים (ZIP)</a></div>
  </div>
  <div class="cover-logos">${coverLogos}</div>
</div></div></section>`);

  slides.push(`
<section class="slide" id="guide"><div class="in">
  <h2 class="sec-title disp">איך משתמשים בקובץ</h2><p class="lead">כל חולצה מקבלת שקף משלה: שם, מחיר, הסבר, קהל יעד, תצוגת חזית וגב, וכפתורי הורדה.</p>
  <div class="cards">
    <div class="card"><h3>1 · תמונות לאתר</h3><p>״תמונת חזית/גב לאתר״ – JPG בגודל 1400×1600. מעלים ישר כתמונות מוצר בשופיפיי.</p></div>
    <div class="card"><h3>2 · קבצי הדפסה</h3><p>״קובץ הדפסה״ – PNG שקוף ב־300dpi (הגודל בשקף). מעלים לכלי עיצוב החולצות / למפעל.</p><p class="muted">תצוגה: הקבצים שקופים, לכן על רקע לבן ייתכן שלא ייראו טקסטים בהירים – זה תקין.</p></div>
    <div class="card"><h3>3 · חבילת ZIP</h3><p>לכל חולצה: הכל בקובץ אחד. למעלה בשער יש ZIP של כל הקולקציה + חבילת לוגואים.</p></div>
    <div class="card"><h3>מחירים</h3><p>כל המחירים בש״ח והם <b>הצעה</b>. אני לא יודע את עלות הייצור/משלוח – שלח לי ואעדכן לפי מרווח רצוי (בדרך כלל ×2.2–3 מהעלות).</p></div>
  </div>
  <h3 style="margin:34px 0 10px">שפה עיצובית</h3>
  <div class="cards">
    <div class="card"><h3>הדמות</h3><p>גוף כיפה סגול עם 4 גלים בתחתית, אנטנה עם כדור, עיניים גדולות. ההבעות (מבט, קריצה, כעס, הפתעה, אהבה, שינה) מחליפות רק את העיניים.</p></div>
    <div class="card"><h3>צבעים</h3><div class="pal" style="margin-bottom:22px"><i style="background:#5B37A8"><em>#5B37A8</em></i><i style="background:#7B52E0"><em>#7B52E0</em></i><i style="background:#CDBDF2"><em>#CDBDF2</em></i><i style="background:#F6F1E7"><em>#F6F1E7</em></i><i style="background:#141018"><em>#141018</em></i><i style="background:#F062C8"><em>#F062C8</em></i></div></div>
    <div class="card"><h3>טיפוגרפיה</h3><p>כותרות על החולצות: Bungee (עבה, ארקייד). לוגוטייפ: Fredoka ״vexo״.</p></div>
  </div>
</div></section>`);

  slides.push(`
<section class="slide" id="logos"><div class="in">
  <h2 class="sec-title disp">מערכת הלוגואים</h2><p class="lead">${LOGO_IDS.length} וריאציות – ${LOGO_IDS.length - 7} לוגואים בסגנון גריד הלוגואים שהעלית + 6 הבעות + הרקמה עם ההילה. לחיצה על לוגו מורידה אותו (PNG שקוף, 2000px).</p>
  <div class="logo-grid">${logoCards}</div>
  <div class="dl" style="margin-top:20px"><a class="btn pri" href="vexo-logos.zip" download>⬇ חבילת לוגואים (סגול + לרקע כהה)</a></div>
</div></section>`);

  slides.push(`<section class="slide" id="overview"><div class="in"><h2 class="sec-title disp">כל הקולקציה</h2><p class="lead">לחיצה על חולצה פותחת את השקף שלה.</p><div class="ov">${ov}</div></div></section>`);
  prepared.forEach((s, i) => slides.push(shirtSlide(s, i, total)));
  slides.push(`<section class="slide" id="favs-intro"><div class="in"><h2 class="sec-title disp">הלוגואים האהובים עליי + מוצרים נוספים</h2><p class="lead">בחרתי ${FAVORITES.length} לוגואים שעובדים הכי טוב מעבר לחולצה, ולכל אחד הכנתי ${PRODUCTS.length} מוצרים: כובע רקום, ספל, תיק בד, מדבקה וכיסוי לטלפון. מוצרים קטנים מעלים את סל הקנייה ומכניסים לקוחות חדשים בזול.</p>
    <div class="cards">${FAVORITES.map((f) => `<a class="card" href="#f-${f.logo}" style="display:block"><img src="logos/vexo-logo-${f.logo}-purple.png" alt="" style="width:90px;background:#F4F0E8;border-radius:16px;padding:8px;margin-bottom:10px"><h3 class="disp" style="font-size:20px">${esc(f.name)}</h3><p>${esc(f.pitch)}</p></a>`).join('')}</div></div></section>`);
  FAVORITES.forEach((f, i) => slides.push(favSlide(f, i)));

  slides.push(`
<section class="slide" id="summary"><div class="in">
  <h2 class="sec-title disp">סיכום מחירים ומבצעים</h2>
  <p class="lead">כל החולצות במחיר ₪99–₪119 (ממוצע ₪${avg}). הצעות לחבילות: <b>סדרת Moods – 3 חולצות ב־₪269</b> · <b>סדרת גיימינג (Arcade Ghost + Chomp + Pixel) – 3 ב־₪299</b> · <b>Love Alien זוגי – 2 ב־₪199</b> · <b>3 מדבקות – ₪35</b>.</p>
  <div class="tbl">${tbl(prepared.slice(0, half))}${tbl(prepared.slice(half))}</div>
  <div class="cards" style="margin-top:26px">
    <div class="card"><h3>המלצה להשקה</h3><p>להתחיל ב־8–10 חולצות: Vexo Original, Vexo Badge, Grumpy, Love Alien, Pixel, Mood · Whoa, Angel + כובע ומדבקות. אחרי שבועיים להסתכל על נתוני מכירות ולהרחיב.</p></div>
    <div class="card"><h3>מה חסר לי כדי לדייק</h3><ul><li>עלות ייצור + משלוח לכל מוצר</li><li>שם המפעל / כלי ההדפסה (מידות קבצים)</li><li>האם רוצים הדפסה בלבן (על שחור) או רק צבעים</li></ul></div>
    <div class="card"><h3>קבצי עזר</h3><p><a class="btn sm" href="vexo-catalog.csv" download>⬇ קטלוג CSV (שם, מחיר, צבע, קהל)</a></p></div>
  </div>
</div></section>`);

  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VEXO – ספר קולקציה</title><style>${CSS}</style></head><body>
${slides.join('\n')}
<div id="hud"><button id="pv" aria-label="הקודם">›</button><span id="cnt">1 / ${slides.length}</span><button id="nx" aria-label="הבא">‹</button></div>
<script>
(function(){var S=[].slice.call(document.querySelectorAll('.slide')),cnt=document.getElementById('cnt'),cur=0;
function upd(){var y=window.innerHeight*.4,best=0;S.forEach(function(s,i){if(s.getBoundingClientRect().top<=y)best=i});cur=best;cnt.textContent=(best+1)+' / '+S.length}
function go(i){i=Math.max(0,Math.min(S.length-1,i));S[i].scrollIntoView({behavior:'smooth',block:'start'})}
window.addEventListener('scroll',upd,{passive:true});upd();
document.getElementById('nx').onclick=function(){go(cur+1)};document.getElementById('pv').onclick=function(){go(cur-1)};
document.addEventListener('keydown',function(e){if(e.key==='ArrowDown'||e.key==='PageDown'||e.key==='ArrowLeft'){e.preventDefault();go(cur+1)}if(e.key==='ArrowUp'||e.key==='PageUp'||e.key==='ArrowRight'){e.preventDefault();go(cur-1)}});})();
</script></body></html>`;
}

function buildCsv() {
  const head = ['Handle', 'Title', 'Price ILS', 'Shirt colour', 'Front print', 'Back print', 'Audience', 'Tag', 'Front image', 'Back image'];
  const q = (v) => `"${String(v).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  const rows = prepared.map((s) => [s.id, s.name, s.price, M.SHIRTS[s.color].label, PLACE_TXT[s.front[0]](s.frontArt).replace(/<[^>]+>/g, ''), PLACE_TXT[s.back[0]](s.backArt).replace(/<[^>]+>/g, ''), s.who, s.tag, `downloads/${s.id}/${s.id}-mockup-front.jpg`, `downloads/${s.id}/${s.id}-mockup-back.jpg`]);
  return '﻿' + [head, ...rows].map((r) => r.map(q).join(',')).join('\n') + '\n';
}

(async () => {
  if (!skipRender) await renderAll();
  fs.writeFileSync(path.join(ROOT, 'index.html'), buildDeck());
  fs.writeFileSync(path.join(ROOT, 'vexo-catalog.csv'), buildCsv());
  console.log('deck written');
})();
