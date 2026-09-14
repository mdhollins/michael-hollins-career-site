# Common Senses and KANEKO Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the KANEKO archive language, update the 2019 summit photograph, and add a sourced, responsive 2022 Common Senses Festival chapter to the homepage.

**Architecture:** Keep the page’s existing server-rendered structure and visual language. Store festival facts and links in a focused data module, render them in a new semantic homepage section, and add scoped CSS for the new chapter without adding dependencies or remote media.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS, Node test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-13-common-senses-and-kaneko-refresh.md`

## Global Constraints

- Do not delete `/public/media/kaneko_students_group.webp`; only remove its rendered record.
- Keep `/public/media/iexcel_2019_speaking.webp` unchanged and use a new optimized `/public/media/iexcel_pandemic_summit_2019.webp` for the 2019 summit card.
- Use `Exhibition and programming season` on all ten KANEKO archive cards.
- Use official 2022 recap figures, including `5,000` attendees.
- Add no dependency and no remote image.
- Preserve the existing hero, WATER loop, Epson video behavior, and source archive.
- Verify at desktop and 390px mobile widths.

---

### Task 1: Lock the requested homepage behavior with browser tests

**Files:**
- Modify: `tests/heroMotion.e2e.cjs`

**Interfaces:**
- Consumes: the rendered homepage at `TEST_BASE_URL`
- Produces: browser-level contracts for KANEKO wording, card removal, festival content, source links, chronology, and mobile width

- [ ] **Step 1: Write the failing tests**

Update the existing festival metric assertion to locate `5,000`. Add tests equivalent to:

```js
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

test('presents the 2022 Common Senses Festival as a sourced chapter', async () => {
  const { context, page } = await openPage();
  const festival = page.locator('#common-senses');

  await festival.getByRole('heading', { level: 2, name: 'Building inclusion at city scale.' }).waitFor();
  assert.equal(await festival.getByText('Festival coordinator', { exact: false }).count() > 0, true);
  assert.deepEqual(
    await festival.locator('.festivalStat b').allInnerTexts(),
    ['5,000', '122', '29', '138'],
  );
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

test('keeps the festival chapter inside the mobile viewport', async () => {
  const { context, page } = await openPage({ viewport: { height: 844, width: 390 } });
  await page.locator('#common-senses').scrollIntoViewIfNeeded();
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
```

- [ ] **Step 2: Run the browser tests and verify RED**

Run a production server and then:

```bash
PATH=/Users/michael.hollins/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH PLAYWRIGHT_BROWSERS_PATH=.playwright-browsers node --test tests/heroMotion.e2e.cjs
```

Expected: the new KANEKO and Common Senses assertions fail because the old copy/card remain and `#common-senses` does not exist.

- [ ] **Step 3: Commit the failing contract only if a checkpoint commit is useful**

Keep the failing test with the implementation in the final feature commit unless an intermediate review requires a separate checkpoint.

---

### Task 2: Normalize the KANEKO archive, remove the requested card, and update the summit photograph

**Files:**
- Modify: `data/visualArchive.ts`
- Modify: `app/page.tsx`
- Create: `public/media/iexcel_pandemic_summit_2019.webp`
- Test: `tests/heroMotion.e2e.cjs`

**Interfaces:**
- Consumes: `kanekoExhibitions` and `kanekoEducation` visual records
- Produces: ten consistently labeled archive figures, no rendered `Gallery learning` figure, and the supplied summit photograph in the 2019 iEXCEL card

- [ ] **Step 1: Apply the minimal data and copy changes**

Set every `kanekoExhibitions[*].subtitle` value to:

```ts
subtitle: 'Exhibition and programming season',
```

Remove only the `kaneko-students` object from `kanekoEducation`. Change the page copy to:

```tsx
<h3>Exhibition and programming seasons.</h3>
<p>Selected installation views establish the range of art, design, architecture, culture, immersive media and participatory learning that shaped the KANEKO years (2013–2018).</p>
```

Convert `/Users/michael.hollins/Downloads/2019.png` to a quality WebP at `/public/media/iexcel_pandemic_summit_2019.webp` without altering the source or existing `/public/media/iexcel_2019_speaking.webp`. Update the `iexcel-pandemic-summit-2019` record to use the new path while preserving its descriptive alternative text.

- [ ] **Step 2: Run the browser tests and confirm only festival tests remain RED**

Use the same browser-test command from Task 1. Expected: KANEKO and summit-image tests pass; Common Senses tests still fail.

---

### Task 3: Add the Common Senses Festival chapter

**Files:**
- Create: `data/commonSenses.ts`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/heroMotion.e2e.cjs`

**Interfaces:**
- Produces: `festivalStats` and `festivalLinks` arrays consumed by `Home`
- Consumes: the approved copy and verified URLs in the design spec

- [ ] **Step 1: Add typed festival data**

Create literal arrays for the four statistics and four source links:

```ts
export const festivalStats = [
  { value: '5,000', label: 'Attendees' },
  { value: '122', label: 'Families at Up and Away' },
  { value: '29', label: 'Organizations at the Arts & Inclusion Symposium' },
  { value: '138', label: 'Voices heard' },
] as const;
```

The links must use the four exact URLs asserted in Task 1 and labels `Official 2022 recap`, `Festival final report`, `Omaha Magazine profile`, and `Omaha Science Café`.

- [ ] **Step 2: Render the semantic chapter after PACE**

Import the data, add `<a href="#common-senses">Festival</a>` to navigation, change the top figure to `5,000`, and render `<section id="common-senses" className="chapter commonSenses">` immediately after `#pace` and before `#research`.

Use the approved headline `Building inclusion at city scale.` Include the visible role label `Festival coordinator · Volunteer leadership`, describe the citywide arts/science/technology scope, mention The Living Room and Cardio Chairs, render the statistic array into `.festivalStat` cards, and render all four source links into `.festivalLinks`.

- [ ] **Step 3: Add scoped responsive styling**

Add `.commonSenses*` and `.festival*` rules to `app/globals.css`. Use the established navy, aqua, lime, paper, and line variables; CSS-only decorative rings; a two-column desktop impact panel; and single-column layouts at `900px` and below. Ensure long source labels and URLs cannot overflow at `390px`.

- [ ] **Step 4: Run browser tests and verify GREEN**

Run the complete e2e file. Expected: all homepage tests pass with no failures.

---

### Task 4: Verify the complete homepage and prepare review

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/globals.css`
- Verify: `data/commonSenses.ts`
- Verify: `data/visualArchive.ts`
- Verify: `public/media/iexcel_pandemic_summit_2019.webp`
- Verify: `tests/heroMotion.e2e.cjs`

**Interfaces:**
- Consumes: completed homepage changes
- Produces: build, regression, responsive, visual, and review evidence

- [ ] **Step 1: Run unit regressions**

```bash
PATH=/Users/michael.hollins/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm test
```

Expected: 3 tests pass.

- [ ] **Step 2: Run a production build**

```bash
PATH=/Users/michael.hollins/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm build
```

Expected: Next.js build completes successfully.

- [ ] **Step 3: Inspect desktop and mobile renderings**

Open the page at desktop width and 390×844. Confirm hierarchy, statistics, source cards, KANEKO grid, focus states, section order, and absence of horizontal overflow or console errors.

- [ ] **Step 4: Request independent code review and address valid findings**

Review against the design spec and all changed files, rerunning affected tests after any correction.

- [ ] **Step 5: Commit the verified feature**

```bash
git add app/page.tsx app/globals.css data/commonSenses.ts data/visualArchive.ts public/media/iexcel_pandemic_summit_2019.webp tests/heroMotion.e2e.cjs docs/superpowers/specs/2026-09-13-common-senses-and-kaneko-refresh.md docs/superpowers/plans/2026-09-13-common-senses-and-kaneko-refresh.md
git commit -m "Add Common Senses Festival chapter"
```
