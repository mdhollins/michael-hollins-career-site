# Common Senses and KANEKO Refresh Design

## Scope

This is a bounded homepage expansion with four connected changes:

1. Remove the single KANEKO education card titled `Gallery learning` while retaining its local image asset for easy restoration.
2. Normalize the KANEKO exhibition archive around the phrase `Exhibition and programming season`, use the plural phrase as its section heading, and date the supporting sentence with `KANEKO years (2013–2018)`.
3. Add a dedicated 2022 Common Senses Festival chapter between PACE and Research.
4. Replace the displayed 2019 National Summit on Pandemic Preparedness photograph with the user-provided `/Users/michael.hollins/Downloads/2019.png` while retaining the current site asset for easy restoration.

## Common Senses chapter

The chapter is text-led because the repository contains no festival photography. It should feel visually substantial through typography, a dark impact panel, restrained sensory-ring decoration, verified statistics, and source links. Its layout must make future photography additive rather than necessary.

The story will identify Michael Hollins as the volunteer festival coordinator and describe the inaugural festival as a citywide, month-long collaboration spanning arts, science, technology, interactive installations, sensory-friendly performances, and public conversation. It will also connect his work to The Living Room and Cardio Chairs installations and the related Omaha Science Café.

Use the official 2022 recap figures:

- 5,000 attendees
- 122 families at *Up and Away*
- 29 organizations at the Arts & Inclusion Symposium
- 138 voices heard

Include direct links to the official 2022 recap, final report, Omaha Magazine profile, and Omaha Science Café program. Add `Festival` to the desktop navigation.

## Content rules

- The top accomplishment metric must change from `5,500+` to `5,000` so it matches the official recap.
- All ten KANEKO exhibition cards must use the subtitle `Exhibition and programming season`.
- The KANEKO archive heading must be `Exhibition and programming seasons.`
- The archive description must end with `KANEKO years (2013–2018).`
- The `Gallery learning` card must not render, but its image file must not be deleted.
- The 2019 summit card must use a newly optimized `/media/iexcel_pandemic_summit_2019.webp` derived from the supplied PNG; `/media/iexcel_2019_speaking.webp` must remain untouched.

## Responsive and accessibility requirements

- The festival section must not introduce horizontal overflow at 390px.
- Statistics must remain readable when stacked on mobile.
- Links must have descriptive visible names and open source material in a new tab using the site’s existing safe-link pattern.
- Decorative sensory elements must be CSS-only and excluded from the accessibility tree.
- The replacement summit image must load at its natural dimensions and keep the existing descriptive alternative text.
