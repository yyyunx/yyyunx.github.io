import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
const screenshots = 'test-results/screenshots';

for (const width of [375, 768, 1024, 1440]) {
  test('all public routes fit a ' + width + 'px viewport', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of [...routes, '/404.html', '/en/404/']) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBeLessThan(400);
      await expect(page.locator('h1')).toHaveCount(1);
      const geometry = await page.evaluate(() => ({
        viewport: innerWidth,
        width: document.documentElement.scrollWidth,
        broken: [...document.images].filter(
          (image) => !image.complete || !image.naturalWidth,
        ).length,
      }));
      expect(geometry.width, route).toBeLessThanOrEqual(geometry.viewport);
      expect(geometry.broken, route).toBe(0);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical, route).toBe('https://yyyunx.github.io' + route);
    }
    expect(errors).toEqual([]);
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(
    'public pages pass WCAG checks in ' + theme + ' mode',
    async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      const failures = [];
      for (const route of [...routes, '/404.html', '/en/404/']) {
        await page.goto(route);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        if (results.violations.length)
          failures.push({
            route,
            violations: results.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              nodes: v.nodes.map((n) => n.target),
            })),
          });
      }
      await mkdir('test-results', { recursive: true });
      await writeFile(
        'test-results/accessibility-' + theme + '.json',
        JSON.stringify(failures, null, 2),
      );
      expect(failures).toEqual([]);
    },
  );
}

test('theme, language, filtering, case studies, and math work', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-select').selectOption('light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page
    .getByRole('link', { name: 'Switch to English', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await page.locator('button[data-filter="Developer Tools"]').click();
  await expect(page.locator('[data-project-category]:visible')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('1 project');
  await page.locator('[data-project-category]:visible h3 a').click();
  await expect(page).toHaveURL(/\/en\/projects\/groupctl\/$/);
  await page.getByRole('link', { name: '切換為繁體中文', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/groupctl\/$/);
  await page.goto('/projects/laplacian-blur-detector/');
  await expect(page.locator('.katex')).toBeVisible();
  await expect(page.locator('.article-body table')).toHaveCount(1);
  await page.locator('#theme-select').selectOption('system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('keyboard and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.goto('/projects/');
  const filter = page.locator('button[data-filter="Coursework"]');
  await filter.focus();
  await page.keyboard.press('Enter');
  await expect(filter).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-category]:visible')).toHaveCount(3);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});

test('content stays readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(
    (process.env.BASE_URL || 'http://127.0.0.1:4173') + '/projects/',
  );
  await expect(page.locator('h3')).toHaveCount(8);
  await expect(page.locator('.project-filters')).toBeHidden();
  await context.close();
});

test('save actual desktop and mobile screenshots', async ({ page }) => {
  await mkdir(screenshots, { recursive: true });
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      for (const lang of ['zh-tw', 'en']) {
        await page.goto(lang === 'en' ? '/en/' : '/');
        await page.screenshot({
          path:
            screenshots + '/home-' + lang + '-' + theme + '-' + width + '.png',
          fullPage: true,
        });
        if (
          (width === 1440 && lang === 'zh-tw' && theme === 'light') ||
          (width === 375 && lang === 'zh-tw' && theme === 'dark')
        ) {
          await page.screenshot({
            path:
              screenshots +
              '/home-' +
              lang +
              '-' +
              theme +
              '-' +
              width +
              '-viewport.png',
            fullPage: false,
          });
        }
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/projects/laplacian-blur-detector/');
  await page.screenshot({
    path: screenshots + '/project-desktop.png',
    fullPage: true,
  });
});
