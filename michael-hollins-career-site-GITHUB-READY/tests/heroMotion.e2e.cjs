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
    assert.equal(
      await page.locator('.hero .photoTag').innerText(),
      'Michael Hollins · UNMC Davis Global Center · 2020',
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
      .filter({
        has: page.locator('b').filter({ hasText: /^5,500$/ }),
      });
    assert.equal(await festivalMetric.locator('b').innerText(), '5,500');
    assert.equal(
      await festivalMetric.locator('em').innerText(),
      'Attendees to city-wide autism advocacy festival',
    );

    await context.close();
  });

  test('identifies Hollins as the principal investigator throughout the NSF story', async () => {
    const { context, page } = await openPage();

    const nsfMetric = page.locator('.metrics > div').filter({ hasText: '$8M' });
    assert.equal(
      await nsfMetric.locator('span').innerText(),
      'National Science Foundation Award, PI',
    );

    const centerCard = page.locator('.featureCard').filter({
      hasText: 'Nebraska Center for 3D Innovation',
    });
    assert.equal(
      await centerCard.locator('p').innerText(),
      'Principal investigator on NSF Award No. 2546319 supporting an $8 million statewide E-RISE initiative.',
    );

    const researchRecord = page.locator('#research .records a').filter({
      hasText: '$8M NSF E-RISE / Nebraska Center for 3D Innovation',
    });
    assert.equal(
      await researchRecord.locator('p').innerText(),
      'Principal investigator',
    );
    assert.equal(
      await page.getByText(/co[- ]?(?:pi|principal investigator)/i).count(),
      0,
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
      'Jun Kaneko',
    );

    await context.close();
  });

  test('uses one KANEKO season label and removes Gallery Learning', async () => {
    const { context, page } = await openPage();
    const archive = page.locator('#kaneko');

    assert.equal(
      await archive.locator('.archiveDivider').first().locator('h3').innerText(),
      'Exhibition and programming seasons.',
    );
    assert.match(
      await archive.locator('.archiveDivider').first().locator(':scope > p').innerText(),
      /KANEKO years \(2013–2018\)\.$/,
    );
    assert.equal(await archive.locator('.exhibitionTimeline figure').count(), 10);
    assert.deepEqual(
      await archive.locator('.exhibitionTimeline figcaption > span:not(.yearPill)').allInnerTexts(),
      Array(10).fill('Exhibition and programming season'),
    );
    assert.equal(await archive.getByText('Gallery learning', { exact: true }).count(), 0);

    await context.close();
  });

  test('shows the strongest Light installation once and removes the repeated Storytelling teaching image', async () => {
    const { context, page } = await openPage();

    const lightSeason = page.locator('.exhibitionTimeline figure').filter({
      has: page.getByText('Light', { exact: true }),
    });
    assert.equal(
      await lightSeason.locator('img').getAttribute('src'),
      '/media/kaneko_light_installation_2018.webp',
    );
    assert.equal(
      await page.locator('img[src="/media/kaneko_light_installation_2018.webp"]').count(),
      1,
    );
    assert.equal(
      await page.locator('.immersiveGrid img[src="/media/kaneko_light_installation_2018.webp"]').count(),
      0,
    );
    assert.equal(
      await page.locator('.educationGrid img[src="/media/kaneko_storytelling_teaching_2016.webp"]').count(),
      0,
    );
    assert.deepEqual(
      await page.locator('.immersiveGrid figure.immersiveWide img').evaluateAll(
        (images) => images.map((image) => image.getAttribute('src')),
      ),
      [
        '/media/kaneko_light_refik_anadol_2018.webp',
        '/media/kaneko_light_blumen_lumen_2018.webp',
      ],
    );
    assert.deepEqual(
      await page.locator('.educationGrid figure.educationWide img').evaluateAll(
        (images) => images.map((image) => image.getAttribute('src')),
      ),
      [
        '/media/kaneko_storytelling_group_2016.webp',
        '/media/kaneko_passion_whyarts_2016.webp',
      ],
    );

    await context.close();
  });

  test('uses consistent visible chapter labels and the full Common Senses navigation title', async () => {
    const { context, page } = await openPage();

    assert.equal(
      await page.locator('.top nav a[href="#common-senses"]').innerText(),
      'Common Senses',
    );
    assert.equal(
      await page.locator('#kaneko .chapterLabel').first().innerText(),
      'KANEKO · 2013–2018',
    );
    assert.equal(
      await page.locator('#pace .chapterLabel').first().innerText(),
      'Pottawattamie Arts, Culture & Entertainment (PACE) · 2018–2019',
    );
    assert.equal(
      await page.locator('#research .chapterLabel').first().innerText(),
      'Research & scholarship',
    );
    assert.equal(
      await page.locator('#iexcel-visuals .chapterLabel').first().innerText(),
      'UNMC iEXCEL · 2019–current',
    );
    assert.ok(
      await page.locator('#pace .chapterLabel').first().evaluate(
        (element) => Number.parseFloat(getComputedStyle(element).fontSize) >= 16,
      ),
    );

    await context.close();
  });

  test('presents the 2022 Common Senses Festival as a sourced chapter', async () => {
    const { context, page } = await openPage();
    const festival = page.locator('#common-senses');

    await festival.getByRole('heading', { level: 2, name: 'Building inclusion at city scale.' }).waitFor();
    assert.equal(await festival.getByText('Festival coordinator', { exact: false }).count() > 0, true);
    assert.deepEqual(
      await festival.locator('.festivalLinks a').evaluateAll((links) =>
        links.map((link) => ({ href: link.getAttribute('href'), target: link.getAttribute('target') })),
      ),
      [
        { href: 'https://www.commonsensesfestival.org/2022-recap', target: '_blank' },
        { href: 'https://cdn.prod.website-files.com/68a8a835f537008f09e5e5cc/68e2f0fc18576ae809879b5a_2022-final-report-compressed.pdf', target: '_blank' },
        { href: 'https://www.omahamagazine.com/uncategorized/autism-action-partnership-our-common-senses/', target: '_blank' },
        { href: 'https://www.nescifest.com/event/omaha-science-cafe-with-common-senses-festival/', target: '_blank' },
      ],
    );

    await context.close();
  });

  test('foregrounds the Festival year and revised leadership story', async () => {
    const { context, page } = await openPage();
    const festival = page.locator('#common-senses');
    const festivalYear = festival.locator('.festivalYear');

    await festivalYear.waitFor();
    assert.equal(await festivalYear.textContent(), 'Common Senses Festival · 2022');
    assert.ok(await festivalYear.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize) >= 16));
    assert.equal(await festival.getByText('One city. Many ways to experience it.', { exact: true }).count(), 0);
    assert.equal(
      await festival.locator('.festivalNarrative > p:not(.festivalKicker)').nth(1).innerText(),
      'Hollins co-founded the Common Senses Festival and coordinated the inaugural event. In addition to organizing events and installations, he presented at the Omaha Science Café, moderated the opening night panel, and served as a media representative.',
    );

    await context.close();
  });

  test('presents the revised Festival impact as one continuous band', async () => {
    const { context, page } = await openPage();
    const festival = page.locator('#common-senses');

    assert.deepEqual(
      await festival.locator('.festivalStat b').allInnerTexts(),
      ['5,500', '31', '37', '9'],
    );
    assert.deepEqual(
      await festival.locator('.festivalStat dd').allInnerTexts(),
      ['Attendees', 'Days', 'Events', 'Installations'],
    );
    const statLayout = await festival.locator('.festivalStat').evaluateAll((items) => items.map((item) => {
      const box = item.getBoundingClientRect();
      const style = getComputedStyle(item);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        top: Math.round(box.top),
      };
    }));
    assert.equal(new Set(statLayout.map((item) => item.top)).size, 1);
    assert.equal(statLayout.every((item) => item.backgroundColor === 'rgba(0, 0, 0, 0)'), true);
    assert.equal(statLayout.every((item) => item.borderRadius === '0px'), true);

    await context.close();
  });

  test('orders the branding session before the enhanced Festival panel photograph', async () => {
    const { context, page } = await openPage();
    const photos = page.locator('#common-senses .festivalPhoto');
    const images = photos.locator('img');

    assert.equal(await images.count(), 2);
    await images.first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Array.from(
      document.querySelectorAll('#common-senses .festivalGallery img'),
    ).every((image) => image.complete && image.naturalWidth > 0));
    assert.deepEqual(
      await photos.evaluateAll((items) => items.map((photo) => ({
        alt: photo.querySelector('img')?.getAttribute('alt'),
        caption: photo.querySelector('figcaption span')?.textContent?.trim(),
        src: photo.querySelector('img')?.getAttribute('src'),
      }))),
      [
        {
          alt: 'Michael Hollins and a collaborator in a Festival branding design session in 2019',
          caption: 'Festival branding design session, 2019',
          src: '/media/common_senses_planning_2022.jpg',
        },
        {
          alt: 'Panel discussion before an audience at the 2022 Common Senses Festival',
          caption: 'Festival panel discussion · 2022',
          src: '/media/common_senses_panel_2022_upscaled.jpg',
        },
      ],
    );
    const imageState = await images.evaluateAll((items) => items.map((image) => ({
      complete: image.complete,
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
    })));
    assert.deepEqual(imageState[0], {
      complete: true,
      naturalHeight: 1112,
      naturalWidth: 1400,
    });
    assert.equal(imageState[1].complete, true);
    assert.ok(imageState[1].naturalWidth >= 3840);
    assert.ok(imageState[1].naturalHeight > 1992);

    await context.close();
  });

  test('keeps the festival chapter inside the mobile viewport', async () => {
    const { context, page } = await openPage({ viewport: { height: 844, width: 390 } });
    await page.locator('#common-senses').scrollIntoViewIfNeeded();
    const photoLayout = await page.locator('#common-senses .festivalPhoto').evaluateAll((photos) =>
      photos.map((photo) => {
        const photoBox = photo.getBoundingClientRect();
        const captionBox = photo.querySelector('figcaption')?.getBoundingClientRect();
        return {
          bottom: Math.round(photoBox.bottom),
          captionBottom: Math.round(captionBox?.bottom ?? 0),
          captionTop: Math.round(captionBox?.top ?? 0),
          left: Math.round(photoBox.left),
          right: Math.round(photoBox.right),
          top: Math.round(photoBox.top),
        };
      }),
    );
    assert.equal(photoLayout.length, 2);
    assert.ok(photoLayout[1].top - photoLayout[0].bottom >= 12);
    assert.ok(photoLayout.every((photo) => photo.captionTop >= photo.top));
    assert.ok(photoLayout.every((photo) => photo.captionBottom <= photo.bottom));
    assert.ok(photoLayout.every((photo) => photo.left >= 0 && photo.right <= 390));

    const headerBox = await page.locator('.top').boundingBox();
    assert.ok(headerBox);
    assert.equal(
      await page.locator('.top').evaluate((header) => getComputedStyle(header).position),
      'relative',
    );
    assert.equal(
      photoLayout.some((photo) =>
        Math.min(headerBox.y + headerBox.height, photo.bottom) -
          Math.max(headerBox.y, photo.top) > 0,
      ),
      false,
    );

    const width = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(width.scrollWidth <= width.clientWidth);
    await context.close();
  });

  test('uses the supplied 2019 National Summit photograph', async () => {
    const { context, page } = await openPage();
    const summitImage = page.locator(
      '.currentVisuals img[src="/media/iexcel_pandemic_summit_2019.webp"]',
    );
    await summitImage.waitFor();
    const imageState = await summitImage.evaluate((image) => ({
      complete: image.complete,
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
    }));
    assert.equal(imageState.complete, true);
    assert.ok(imageState.naturalWidth > 0);
    assert.ok(imageState.naturalHeight > 0);
    await context.close();
  });

  test('keeps the 2019 summit card inside the mobile viewport', async () => {
    const { context, page } = await openPage({ viewport: { height: 844, width: 390 } });
    const summitImage = page.locator(
      '.currentVisuals img[src="/media/iexcel_pandemic_summit_2019.webp"]',
    );

    await summitImage.scrollIntoViewIfNeeded();
    await summitImage.waitFor();
    const box = await summitImage.boundingBox();
    assert.ok(box);
    assert.ok(box.x >= 0);
    assert.ok(box.x + box.width <= 390);

    const width = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(width.scrollWidth <= width.clientWidth);
    await context.close();
  });
});

describe('September 2026 media and copy refresh', () => {
  const ncnStoryUrl = 'https://central.newschannelnebraska.com/story/364065246/unmc-uses-immersive-technology-to-expand-stroke-education-statewide';
  const unmcWhooperlandUrl = 'https://www.unmc.edu/newsroom/2026/09/15/forsberg-event-captured-majesty-of-sandhill-and-whooping-cranes/';

  test('expands the statewide work card into a featured interview directly below the selected work grid', async () => {
    const { context, page } = await openPage();
    const hero = page.locator('.hero');
    const latest = page.locator('#latest-coverage');

    assert.equal(
      await hero.locator('.lead').innerText(),
      'Nebraska-grown interdisciplinary executive, faculty member and scholar-practitioner building connections across creative leadership, emerging technology, health professions education, research, business development and community impact.',
    );
    assert.equal(await page.getByText('Omaha-grown', { exact: false }).count(), 0);
    assert.equal(
      await latest.evaluate((section) => section.previousElementSibling?.classList.contains('featureGrid')),
      true,
    );
    const statewideCard = page.locator('.featureCard').filter({
      hasText: 'Statewide & rural health education',
    });
    assert.equal(await statewideCard.getAttribute('href'), '#latest-coverage');
    assert.equal(await statewideCard.locator('strong').innerText(), 'Watch the interview →');
    assert.equal(
      await latest.getByRole('heading', { level: 2 }).innerText(),
      'Statewide stroke education, connected across Nebraska.',
    );
    assert.equal(
      await latest.getByRole('link', { name: 'Watch the full NCN story ↗' }).getAttribute('href'),
      ncnStoryUrl,
    );

    const clip = latest.locator('video.newsClipVideo');
    assert.deepEqual(
      await clip.evaluate((video) => ({
        end: video.getAttribute('data-clip-end'),
        preload: video.getAttribute('preload'),
        src: video.getAttribute('data-stream-src'),
        start: video.getAttribute('data-clip-start'),
      })),
      {
        end: '38',
        preload: 'none',
        src: 'https://ncn.vod.immergo.tv/ncn/transcoded/ee63d0f2-4426-4b6c-bf84-5904a6c33496/hls/master.m3u8',
        start: '15',
      },
    );
    assert.equal(
      await latest.getByRole('button', { name: 'Play the 23-second News Channel Nebraska interview excerpt' }).count(),
      1,
    );
    assert.equal(
      await latest.locator('.latestCoverageKicker').innerText(),
      'STATEWIDE STROKE CONFERENCE · SEPTEMBER 18, 2026',
    );
    assert.equal(
      await latest.locator('.newsClipSourceLabel').innerText(),
      'NEWS CHANNEL NEBRASKA · PUBLISHED SEPTEMBER 19, 2026',
    );
    assert.match(await latest.innerText(), /Michael Hollins interview excerpt · 0:15–0:38/);

    await context.close();
  });

  test('uses the 1:55–2:35 Whooper Highway excerpt and adds current UNMC coverage', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const continuity = page.locator('.continuityProject');

    assert.equal(
      await continuity.getByRole('link', { name: 'UNMC event coverage ↗' }).getAttribute('href'),
      unmcWhooperlandUrl,
    );
    const playButton = continuity.getByRole('button', {
      name: 'Play video excerpt: The Whooper Highway, 0:40, Cornell Lab of Ornithology',
    });
    assert.equal(await playButton.count(), 1);
    assert.match(
      await playButton.locator('img').getAttribute('src'),
      /whooper_highway_poster\.jpg/,
    );

    await playButton.press('Enter');
    const player = continuity.locator('iframe');
    await player.waitFor();
    const playerUrl = new URL(await player.getAttribute('src'));
    assert.equal(playerUrl.hostname, 'www.youtube-nocookie.com');
    assert.equal(playerUrl.pathname, '/embed/MxTWU6CdMBw');
    assert.equal(playerUrl.searchParams.get('start'), '115');
    assert.equal(playerUrl.searchParams.get('end'), '155');
    assert.equal(playerUrl.searchParams.get('loop'), '1');
    assert.equal(playerUrl.searchParams.get('playlist'), 'MxTWU6CdMBw');

    await context.close();
  });

  test('updates the requested LVK and KANEKO language without changing their supporting context', async () => {
    const { context, page } = await openPage();
    const lvkCopy = await page.locator('#healing-arts .projectSpotlightCopy').innerText();
    assert.doesNotMatch(lvkCopy, /\bpain\b/i);
    assert.match(lvkCopy, /art, medicine, technology and healing/);

    const card = page.locator('.mosaic figure').filter({
      has: page.locator('img[src="/media/kaneko_passion.webp"]'),
    });
    assert.equal(await card.locator('figcaption b').innerText(), 'Jun Kaneko');
    assert.equal(
      await card.locator('figcaption > span:not(.yearPill)').innerText(),
      'Connecting students with exhibition ideas',
    );

    await context.close();
  });

  test('adds both new reports to the visible evidence and source archives', async () => {
    const { context, page } = await openPage();

    assert.equal(
      await page.locator(`.evidenceLinks a[href="${ncnStoryUrl}"]`).count(),
      1,
    );
    assert.equal(
      await page.locator(`.sourceGrid a[href="${ncnStoryUrl}"]`).count(),
      1,
    );
    assert.equal(
      await page.locator(`.sourceGrid a[href="${unmcWhooperlandUrl}"]`).count(),
      1,
    );
    assert.equal(
      await page.locator(`#media .relatedMedia a[href="${ncnStoryUrl}"]`).count(),
      1,
    );

    await context.close();
  });

  test('keeps the new top coverage feature inside the mobile viewport', async () => {
    const { context, page } = await openPage({ viewport: { height: 844, width: 390 } });
    const latest = page.locator('#latest-coverage');
    await latest.scrollIntoViewIfNeeded();
    const box = await latest.boundingBox();
    assert.ok(box);
    assert.ok(box.x >= 0);
    assert.ok(box.x + box.width <= 390);

    const width = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(width.scrollWidth <= width.clientWidth);

    await context.close();
  });
});

describe('Epson Infinity Room interview', () => {
  test('connects the Light archive photograph to the complete media feature', async () => {
    const { context, page } = await openPage();

    const archiveCard = page.locator('.immersiveGrid figure').filter({
      has: page.locator(
        'img[src="/media/kaneko_light_refik_anadol_2018.webp"]',
      ),
    });
    assert.equal(
      await archiveCard.locator('figcaption b').innerText(),
      'Refik Anadol — Infinity Room',
    );
    const caseStudyLink = archiveCard.getByRole('link', {
      name: 'Related case study: Epson',
    });
    const interviewLink = archiveCard.getByRole('link', {
      name: 'Watch the Epson interview ↓',
    });
    assert.equal(await caseStudyLink.count(), 1);
    assert.equal(await interviewLink.count(), 1);
    assert.equal(
      await caseStudyLink.getAttribute('href'),
      'https://news.epson.com/case-studies/refik-anadol-infinity-room-projectors',
    );
    assert.equal(
      await interviewLink.getAttribute('href'),
      '#media-epson-infinity-room',
    );

    const mediaFeature = page.locator('#media-epson-infinity-room');
    assert.equal(
      await mediaFeature.getByRole('heading', { level: 3 }).innerText(),
      'Infinity Room at KANEKO',
    );
    assert.equal(await mediaFeature.locator('.mediaOutlet').innerText(), 'Epson America');
    assert.equal(await mediaFeature.getByText('2018', { exact: true }).count(), 1);
    assert.equal(
      await mediaFeature.getByText('Video interview', { exact: true }).count(),
      1,
    );
    assert.equal(await mediaFeature.getByText('4:29', { exact: true }).count(), 1);
    assert.equal(
      await mediaFeature
        .getByRole('link', { name: 'Watch on YouTube ↗' })
        .getAttribute('href'),
      'https://www.youtube.com/watch?v=GDw2PxRGbmA',
    );
    assert.equal(
      await mediaFeature
        .getByRole('link', { name: 'Read the Epson case study ↗' })
        .getAttribute('href'),
      'https://news.epson.com/case-studies/refik-anadol-infinity-room-projectors',
    );

    const podcastFeature = page.locator('.mediaFeature').filter({
      has: page.getByRole('heading', {
        level: 3,
        name: 'Simulating The Human Body',
      }),
    });
    assert.equal(await podcastFeature.count(), 1);
    assert.equal(
      await podcastFeature.locator('.mediaOutlet').innerText(),
      'The Futurists · Episode 328',
    );
    assert.equal(
      await podcastFeature
        .getByRole('link', { name: 'Official episode ↗' })
        .getAttribute('href'),
      'https://www.thefuturists.com/episodes/simulating-the-human-body',
    );
    assert.equal(
      await page
        .locator('iframe[title="The Futurists — Simulating The Human Body"]')
        .getAttribute('src'),
      'https://embed.podcasts.apple.com/au/podcast/simulating-the-human-body/id1615809726?i=1000755164201',
    );

    await context.close();
  });

  test('loads the privacy-enhanced YouTube player only after activation', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const youtubeRequests = [];
    page.on('request', (request) => {
      const hostname = new URL(request.url()).hostname;
      if (hostname === 'www.youtube.com' || hostname === 'www.youtube-nocookie.com') {
        youtubeRequests.push(request.url());
      }
    });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const mediaFeature = page.locator('#media-epson-infinity-room');

    assert.equal(await mediaFeature.locator('iframe').count(), 0);
    assert.deepEqual(youtubeRequests, []);
    const playButton = mediaFeature.getByRole('button', {
      name: 'Play interview: Infinity Room at KANEKO, 4:29, Epson America',
    });
    assert.equal(await playButton.count(), 1);
    assert.match(
      await playButton.locator('img').getAttribute('src'),
      /kaneko_light_refik_anadol_2018\.webp/,
    );

    const embedRequest = page.waitForRequest((request) =>
      request.url().startsWith(
        'https://www.youtube-nocookie.com/embed/GDw2PxRGbmA?',
      ),
    );
    await playButton.press('Enter');
    const player = mediaFeature.locator('iframe');
    await player.waitFor();
    assert.equal(
      (await embedRequest).url(),
      'https://www.youtube-nocookie.com/embed/GDw2PxRGbmA?autoplay=1&rel=0&playsinline=1',
    );

    const properties = await player.evaluate((element) => ({
      allowFullscreen: element.hasAttribute('allowfullscreen'),
      source: element.getAttribute('src'),
      title: element.getAttribute('title'),
    }));
    assert.deepEqual(properties, {
      allowFullscreen: true,
      source:
        'https://www.youtube-nocookie.com/embed/GDw2PxRGbmA?autoplay=1&rel=0&playsinline=1',
      title: 'Epson Projectors | Infinity Room at KANEKO by Refik Anadol',
    });
    await page.waitForFunction(
      () => document.activeElement?.matches('#media-epson-infinity-room iframe'),
    );

    await context.close();
  });

  test('keeps the video feature within the mobile viewport', async () => {
    const { context, page } = await openPage({
      viewport: { height: 844, width: 390 },
    });

    const mediaFeature = page.locator('#media-epson-infinity-room');
    await mediaFeature.scrollIntoViewIfNeeded();
    await mediaFeature
      .getByRole('button', {
        name: 'Play interview: Infinity Room at KANEKO, 4:29, Epson America',
      })
      .click();
    await mediaFeature.locator('iframe').waitFor();
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(layout.scrollWidth <= layout.clientWidth);

    const [featureBox, previewBox] = await Promise.all([
      mediaFeature.boundingBox(),
      mediaFeature.locator('.youtubePreview').boundingBox(),
    ]);
    assert.ok(featureBox.width <= layout.clientWidth);
    assert.ok(previewBox.width <= featureBox.width);

    await context.close();
  });
});
