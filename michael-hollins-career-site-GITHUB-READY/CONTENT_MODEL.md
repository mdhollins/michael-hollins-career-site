# Content model

The site is evolving into a structured living career archive rather than a single hard-coded portfolio page.

## Structured data
- `data/media.ts` — podcasts, interviews, press and other media appearances
- `data/visualArchive.ts` — photographs and exhibition imagery grouped by career chapter

Each visual record can include:
- id
- year when known
- title
- subtitle/context
- image path
- accessible alt text

## Media organization
Optimized web assets live in `public/media/`.

Future releases can add structured data for:
- projects/case studies
- research/publications
- speaking engagements
- community programs
- press coverage
- video/audio embeds
- source verification

The intent is for a single record to be reusable across the homepage, timeline, project pages, archive views and thematic filters.
