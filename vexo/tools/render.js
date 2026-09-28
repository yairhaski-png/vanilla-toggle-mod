'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const FONTS = path.resolve(__dirname, '../assets/fonts');
const face = (fam, file, w) =>
  `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, file)).toString('base64')}) format('woff2');}`;
const CSS = face('Bungee', 'bungee-latin-400-normal.woff2', 400) + face('Fredoka', 'fredoka-latin-700-normal.woff2', 700);

async function makeRenderer() {
  const browser = await chromium.launch();
  const ctxCache = {};
  const getPage = async (scale) => {
    if (!ctxCache[scale]) {
      const ctx = await browser.newContext({ deviceScaleFactor: scale });
      ctxCache[scale] = await ctx.newPage();
    }
    return ctxCache[scale];
  };
  const api = {
    // svg string with explicit width/height (css px) -> Buffer
    async shot(svg, w, h, { scale = 1, transparent = false, type = 'png', quality = 90 } = {}) {
      const page = await getPage(scale);
      await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
      await page.setContent(`<!doctype html><html><head><style>${CSS}html,body{margin:0;padding:0;background:${transparent ? 'transparent' : '#fff'}}svg{display:block}</style></head><body>${svg}</body></html>`);
      await page.evaluate(async () => { await Promise.all([document.fonts.load('40px Bungee'), document.fonts.load('700 40px Fredoka')]); await document.fonts.ready; });
      const opts = { type, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } };
      if (type === 'jpeg') opts.quality = quality;
      return page.screenshot(opts);
    },
    async close() { await browser.close(); },
  };
  return api;
}
module.exports = { makeRenderer };
