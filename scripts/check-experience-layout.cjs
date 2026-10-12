// Run with a Playwright installation available via NODE_PATH and a local Vite server.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage({ hasTouch: true });
    for (const width of [320, 375, 390, 430, 700, 766, 920, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(process.env.CHECK_URL || 'http://127.0.0.1:3001');
      await page.locator('#experience').waitFor();
      const layout = await page.locator('#experience').evaluate(section => {
        const rect = selector => {
          const { x, y, width, height, right, bottom } = section.querySelector(selector).getBoundingClientRect();
          return { x, y, width, height, right, bottom };
        };
        return { card: rect('.exp-timeline-container'), header: rect('.exp-header'), left: rect('.exp-header-left'), info: rect('.exp-company-info'), date: rect('.exp-meta'), button: rect('.exp-expand-btn'), arrow: rect('.exp-expand-icon'), logo: rect('.exp-logo'), dateFont: getComputedStyle(section.querySelector('.exp-meta')).fontSize };
      });
      assert.ok(layout.header.right <= layout.card.right, `${width}: header overflows card`);
      assert.ok(layout.button.right <= layout.card.right, `${width}: control overflows card`);
      if (width <= 700) {
        assert.ok(layout.arrow.x - layout.date.right <= 12, `${width}: visible chevron should sit close to dates`);
        assert.equal(layout.logo.width, 30, `${width}: reference logo size`);
        assert.equal(layout.dateFont, '10.5px', `${width}: reference date size`);
        assert.ok(layout.button.y - layout.left.bottom <= 4, `${width}: closed header should have a compact row gap`);
        assert.ok(layout.date.y >= layout.left.bottom, `${width}: dates must sit below company/role`);
        assert.ok(Math.abs(layout.date.x - layout.info.x) <= 1, `${width}: dates must align with company`);
        assert.ok(layout.button.x - layout.date.right <= 12, `${width}: chevron must sit beside dates`);
        assert.ok(layout.button.width >= 44 && layout.button.height >= 44, `${width}: mobile tap target`);
      } else {
        assert.ok(layout.date.y < layout.left.bottom, `${width}: wide header must remain one row`);
      }
      if (process.env.SCREENSHOT_DIR) await page.locator('.exp-timeline-container').screenshot({ path: `${process.env.SCREENSHOT_DIR}/experience-${width}.png` });
      const button = page.getByRole('button', { name: 'Toggle details for Arabazaar' });
      await button.click();
      assert.equal(await button.getAttribute('aria-expanded'), 'true');
      await page.locator('.exp-details.expanded').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
      if (process.env.SCREENSHOT_DIR) await page.locator('#experience').screenshot({ path: `${process.env.SCREENSHOT_DIR}/experience-expanded-${width}.png` });
      if (width <= 700) {
        const expanded = await page.locator('#experience').evaluate(section => {
          const left = section.querySelector('.exp-header-left').getBoundingClientRect();
          const control = section.querySelector('.exp-header-right').getBoundingClientRect();
          const bullets = section.querySelector('.exp-bullets');
          const style = getComputedStyle(bullets);
          return { gap: control.top - left.bottom, fontSize: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight), overflow: bullets.scrollWidth > bullets.clientWidth };
        });
        assert.ok(expanded.gap <= 4, `${width}: expanded header should keep the date row compact (got ${expanded.gap}px)`);
        assert.ok(expanded.fontSize >= 11.5 && expanded.fontSize <= 12, `${width}: mobile bullets should match the reference text scale`);
        assert.ok(expanded.lineHeight <= 20, `${width}: mobile bullet lines should remain compact`);
        assert.equal(expanded.overflow, false, `${width}: expanded bullets should wrap within the card`);
      }
      await button.click();
      assert.equal(await button.getAttribute('aria-expanded'), 'false');
      console.log(`PASS ${width}px`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
