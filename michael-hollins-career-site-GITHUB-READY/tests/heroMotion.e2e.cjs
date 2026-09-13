const assert = require('node:assert/strict');
const { after, before, describe, test } = require('node:test');
const { chromium } = require('playwright');

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

let browser;

before(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  });
});

after(async () => {
  await browser?.close();
});

async function openPage(options = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  return { context, page };
}

describe('hero motion', () => {
  test('renders the motion asset with the existing hero layout and copy', async () => {
    const { context, page } = await openPage();

    const video = page.locator('.hero video.heroPhoto');
    await video.waitFor();

    const properties = await video.evaluate((element) => ({
      autoplay: element.autoplay,
      loop: element.loop,
      muted: element.muted,
      playsInline: element.playsInline,
      poster: element.getAttribute('poster'),
      source: element.querySelector('source')?.getAttribute('src'),
    }));

    assert.deepEqual(properties, {
      autoplay: true,
      loop: true,
      muted: true,
      playsInline: true,
      poster: '/media/hero.webp',
      source: '/media/hero_motion_v1.mp4',
    });

    const [heroBox, videoBox, layout] = await Promise.all([
      page.locator('.hero').boundingBox(),
      video.boundingBox(),
      video.evaluate((element) => ({
        height: element.offsetHeight,
        objectFit: getComputedStyle(element).objectFit,
        parentHeight: element.parentElement?.clientHeight,
        parentWidth: element.parentElement?.clientWidth,
        width: element.offsetWidth,
      })),
    ]);
    assert.deepEqual(layout, {
      height: 680,
      objectFit: 'cover',
      parentHeight: 680,
      parentWidth: 1280,
      width: 1280,
    });
    assert.ok(videoBox.x <= heroBox.x);
    assert.ok(videoBox.y <= heroBox.y);
    assert.ok(videoBox.x + videoBox.width >= heroBox.x + heroBox.width);
    assert.ok(videoBox.y + videoBox.height >= heroBox.y + heroBox.height);

    await assert.doesNotReject(() =>
      page.getByRole('heading', {
        level: 1,
        name: 'Explorer. Creator. Connector.',
      }).waitFor(),
    );

    await context.close();
  });

  test('switches to only the static hero image when reduced motion is requested', async () => {
    const { context, page } = await openPage();

    await page.locator('.hero video.heroPhoto').waitFor();
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.locator('.hero video').waitFor({ state: 'detached' });
    assert.equal(
      await page.locator('.hero img.heroPhoto').getAttribute('src'),
      '/media/hero.webp',
    );

    await context.close();
  });

  test('pauses offscreen and resumes when the hero returns', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__heroMediaEvents = [];
      HTMLMediaElement.prototype.play = function play() {
        if (this.classList.contains('heroPhoto')) {
          window.__heroMediaEvents.push('play');
        }
        return Promise.resolve();
      };
      HTMLMediaElement.prototype.pause = function pause() {
        if (this.classList.contains('heroPhoto')) {
          window.__heroMediaEvents.push('pause');
        }
      };
    });

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroMediaEvents.includes('play'));
    const initialCounts = await page.evaluate(() => ({
      pause: window.__heroMediaEvents.filter((event) => event === 'pause').length,
      play: window.__heroMediaEvents.filter((event) => event === 'play').length,
    }));

    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (count) =>
        window.__heroMediaEvents.filter((event) => event === 'pause').length > count,
      initialCounts.pause,
    );

    await page.locator('#top').scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (count) =>
        window.__heroMediaEvents.filter((event) => event === 'play').length > count,
      initialCounts.play,
    );

    await context.close();
  });
});

describe('preserved visual behavior', () => {
  test('keeps the WATER timelapse source and the iEXCEL archive non-overlapping', async () => {
    const { context, page } = await openPage();

    const waterVideo = page.locator('video.archiveLoopVideo');
    await waterVideo.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document
          .querySelector('video.archiveLoopVideo source')
          ?.getAttribute('src') === '/media/kaneko_water_loop.mp4',
    );

    const boxes = await page.locator('.currentVisuals figure').evaluateAll((figures) =>
      figures.map((figure) => {
        const { left, right, top, bottom } = figure.getBoundingClientRect();
        return { bottom, left, right, top };
      }),
    );

    for (let first = 0; first < boxes.length; first += 1) {
      for (let second = first + 1; second < boxes.length; second += 1) {
        const horizontalOverlap =
          Math.min(boxes[first].right, boxes[second].right) -
          Math.max(boxes[first].left, boxes[second].left);
        const verticalOverlap =
          Math.min(boxes[first].bottom, boxes[second].bottom) -
          Math.max(boxes[first].top, boxes[second].top);

        assert.ok(horizontalOverlap <= 0 || verticalOverlap <= 0);
      }
    }

    await context.close();
  });
});

describe('homepage copy refresh', () => {
  test('describes the living archive without overflowing the mobile header', async () => {
    const { context, page } = await openPage({
      viewport: { height: 844, width: 390 },
    });

    const archiveStatus = page.locator('.brand small');
    assert.equal(
      await archiveStatus.innerText(),
      'Living career archive · Always evolving',
    );
    assert.equal(await archiveStatus.isVisible(), true);

    const pageWidth = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(pageWidth.scrollWidth <= pageWidth.clientWidth);

    await context.close();
  });

  test('keeps the requested descriptions attached to their accomplishment metrics', async () => {
    const { context, page } = await openPage();

    const experienceMetric = page
      .locator('.metrics > div')
      .filter({ hasText: '15+' });
    assert.equal(
      await experienceMetric.locator('span').innerText(),
      'Years of creative production in education, media and art',
    );
    assert.equal(
      await experienceMetric.locator('em').innerText(),
      'Academia · Industry · Community',
    );

    const festivalMetric = page
      .locator('.metrics > div')
      .filter({ hasText: '5,500+' });
    assert.equal(
      await festivalMetric.locator('em').innerText(),
      'Attendees to city-wide autism advocacy festival',
    );

    await context.close();
  });

  test('labels the two education photos with their featured artists', async () => {
    const { context, page } = await openPage();

    const violaFreyCard = page.locator('.educationGrid figure').filter({
      has: page.locator('img[src="/media/kaneko_passion_teaching_2016.webp"]'),
    });
    assert.equal(await violaFreyCard.locator('figcaption b').innerText(), 'Viola Frey');

    const goroSuzukiCard = page.locator('.educationGrid figure').filter({
      has: page.locator('img[src="/media/kaneko_passion_whyarts_2016.webp"]'),
    });
    assert.equal(await goroSuzukiCard.locator('figcaption b').innerText(), 'Goro Suzuki');

    assert.equal(
      await page
        .locator('.mosaic figure')
        .filter({ has: page.locator('img[src="/media/kaneko_passion.webp"]') })
        .locator('figcaption b')
        .innerText(),
      'Passion & Obsession',
    );

    await context.close();
  });
});
