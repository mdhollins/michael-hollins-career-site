# Content model

The site uses structured records for media and visual archive content.

- `data/media.ts` stores podcasts and public-media appearances.
- `data/visualArchive.ts` stores iEXCEL, KANEKO, PACE, exhibition, education, Light, Reality and institutional-gallery records.
- KANEKO exhibition records may include `galleryUrl` links to the original institutional SmugMug archive.
- Third-party case studies may use `sourceUrl` and `sourceLabel` for contextual attribution and related documentation.
- Dates are displayed prominently where confirmed. Unknown dates are intentionally not invented.

Add future records to the data files rather than hard-coding repeated cards whenever practical.
