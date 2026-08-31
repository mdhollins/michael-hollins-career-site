export type VisualRecord = {
  id: string;
  year?: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  galleryUrl?: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

export type ArchiveLink = {
  year?: string;
  title: string;
  url: string;
};

export const iexcelVisuals: VisualRecord[] = [
  {
    id: 'iexcel-pandemic-summit-2019',
    year: '2019',
    title: 'National Summit on Pandemic Preparedness',
    subtitle: 'Speaking to attendees, Fall 2019',
    src: '/media/iexcel_2019_speaking.webp',
    alt: 'Michael Hollins presenting to attendees at the National Summit on Pandemic Preparedness at UNMC iEXCEL in Fall 2019',
  },
  {
    id: 'iexcel-ops-outreach-2023',
    year: '2023',
    title: 'OPS Student Outreach',
    subtitle: 'Engaging Omaha Public Schools students at UNMC',
    src: '/media/iexcel_ops_students_2023.webp',
    alt: 'Michael Hollins educating a group of Omaha Public Schools students at UNMC in 2023',
  },
  {
    id: 'iexcel-miami-2026',
    year: '2026',
    title: 'University of Miami',
    subtitle: 'Bascom Palmer Eye Institute: Digital Eye-Con, April 2026',
    src: '/media/iexcel_miami_2026.webp',
    alt: 'Michael Hollins presenting for iEXCEL at the University of Miami Bascom Palmer Eye Institute Digital Eye-Con in April 2026',
  },
  {
    id: 'iexcel-holostage-2026',
    year: '2026',
    title: 'holoSTAGE Holographic Presentation',
    subtitle: 'Digital Hollywood Panel Presentation, July 2026',
    src: '/media/iexcel_holostage_2026.webp',
    alt: 'Michael Hollins beside a life-size holographic presenter during a Digital Hollywood holoSTAGE panel presentation in July 2026',
  },
];

export const kanekoExhibitions: VisualRecord[] = [
  {
    id: 'from-the-collection-2013',
    year: '2013',
    title: 'From the Collection',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_from_collection_2013.webp',
    alt: 'Installation view of From the Collection at KANEKO in 2013',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/From-the-Collection',
  },
  {
    id: 'no-strangers-2014',
    year: '2014',
    title: 'No Strangers: Ancient Wisdom in a Modern World',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_no_strangers_2014.webp',
    alt: 'Installation view of No Strangers: Ancient Wisdom in a Modern World at KANEKO in 2014',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/No-Strangers',
  },
  {
    id: 'truck-a-tecture-2014',
    year: '2014',
    title: 'Truck-A-Tecture',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_truck_a_tecture_2014.webp',
    alt: 'Installation view of Truck-A-Tecture at KANEKO in 2014',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/Truck-A-Tecture/3Truck-A-Texture',
  },
  {
    id: 'design-legends-2014',
    year: '2014',
    title: 'Design Legends',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_design_legends_2014.webp',
    alt: 'Installation view of Design Legends at KANEKO in 2014',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/Design-Legends',
  },
  {
    id: 'fiber-2015',
    year: '2015',
    title: 'FIBER',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_fiber_2015.webp',
    alt: 'Installation view from FIBER at KANEKO in 2015',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/FIBER',
  },
  {
    id: 'play-2015',
    year: '2015',
    title: 'PLAY',
    subtitle: 'Exhibition and programming season',
    src: '/media/kaneko_play_2015_b.webp',
    alt: 'Wide installation view of PLAY at KANEKO in 2015',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/PLAY',
  },
  {
    id: 'design-in-motion-2015',
    year: '2015',
    title: 'Design in Motion',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_design_in_motion_2015.webp',
    alt: 'Wide installation view of Design in Motion at KANEKO in 2015',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/Design-in-Motion',
  },
  {
    id: 'water-2016',
    year: '2016',
    title: 'WATER',
    subtitle: 'KANEKO exhibition',
    src: '/media/kaneko_water_exhibition_2016.webp',
    alt: 'Installation view of WATER at KANEKO in 2016',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/Water',
  },
  {
    id: 'light-2018',
    year: '2018',
    title: 'Light',
    subtitle: 'Immersive light and media exhibition',
    src: '/media/kaneko_light_triph_2018.webp',
    alt: 'TRIPH by Circus Family in the Light exhibition at KANEKO in 2018',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/Light',
  },
  {
    id: 'reality-2018',
    year: '2018',
    title: 'Reality',
    subtitle: 'Art, science and emerging technology',
    src: '/media/kaneko_reality_misha_gordin_2018.webp',
    alt: 'Misha Gordin installation in the Reality exhibition at KANEKO in 2018',
    galleryUrl: 'https://kaneko.smugmug.com/Exhibitions/13-REALITY',
  },
];

export const kanekoGalleryIndex: ArchiveLink[] = [
  { year: '2013', title: 'From the Collection', url: 'https://kaneko.smugmug.com/Exhibitions/From-the-Collection' },
  { year: '2014', title: 'No Strangers', url: 'https://kaneko.smugmug.com/Exhibitions/No-Strangers' },
  { year: '2014', title: 'Truck-A-Tecture', url: 'https://kaneko.smugmug.com/Exhibitions/Truck-A-Tecture/3Truck-A-Texture' },
  { year: '2014', title: 'Design Legends', url: 'https://kaneko.smugmug.com/Exhibitions/Design-Legends' },
  { year: '2015', title: 'FIBER', url: 'https://kaneko.smugmug.com/Exhibitions/FIBER' },
  { year: '2015', title: 'PLAY', url: 'https://kaneko.smugmug.com/Exhibitions/PLAY' },
  { year: '2015', title: 'Design in Motion', url: 'https://kaneko.smugmug.com/Exhibitions/Design-in-Motion' },
  { year: '2016', title: 'WATER', url: 'https://kaneko.smugmug.com/Exhibitions/Water' },
  { year: '2016', title: 'Storytelling', url: 'https://kaneko.smugmug.com/Exhibitions/Storytelling' },
  { year: '2016', title: 'Passion & Obsession', url: 'https://kaneko.smugmug.com/Exhibitions/P-and-O' },
  { title: 'Kinetic', url: 'https://kaneko.smugmug.com/Exhibitions/Kinetic' },
  { year: '2018', title: 'Light', url: 'https://kaneko.smugmug.com/Exhibitions/Light' },
  { year: '2018', title: 'Reality', url: 'https://kaneko.smugmug.com/Exhibitions/13-REALITY' },
];

export const kanekoEducation: VisualRecord[] = [
  {
    id: 'storytelling-context-2016', year: '2016', title: 'Storytelling', subtitle: 'Student engagement in the gallery',
    src: '/media/kaneko_storytelling_context_2016.webp', alt: 'Michael Hollins speaking with students during the Storytelling exhibition at KANEKO in 2016',
  },
  {
    id: 'storytelling-teaching-2016', year: '2016', title: 'Storytelling', subtitle: 'Gallery teaching and interpretation',
    src: '/media/kaneko_storytelling_teaching_2016.webp', alt: 'Michael Hollins and students pointing to exhibition material during Storytelling at KANEKO in 2016',
  },
  {
    id: 'storytelling-group-2016', year: '2016', title: 'Storytelling', subtitle: 'Facilitating discussion with a student group',
    src: '/media/kaneko_storytelling_group_2016.webp', alt: 'Michael Hollins facilitating a student discussion during Storytelling at KANEKO in 2016',
  },
  {
    id: 'water-teaching-2016', year: '2016', title: 'WATER', subtitle: 'Gallery teaching and public education',
    src: '/media/kaneko_water_teaching_2016.webp', alt: 'Michael Hollins teaching students beside photography in the WATER exhibition at KANEKO in 2016',
  },
  {
    id: 'passion-teaching-2016', year: '2016', title: 'Passion & Obsession', subtitle: 'Student engagement in the gallery',
    src: '/media/kaneko_passion_teaching_2016.webp', alt: 'Michael Hollins teaching a student group during Passion and Obsession at KANEKO in 2016',
  },
  {
    id: 'passion-whyarts-2016', year: '2016', title: 'Passion & Obsession', subtitle: 'WhyArts gallery teaching',
    src: '/media/kaneko_passion_whyarts_2016.webp', alt: 'Michael Hollins teaching WhyArts participants during Passion and Obsession at KANEKO in 2016',
  },
  {
    id: 'kaneko-students', title: 'Gallery learning', subtitle: 'Engaging young visitors with contemporary art',
    src: '/media/kaneko_students_group.webp', alt: 'Michael Hollins guiding a group of students through an installation at KANEKO',
  },
];

export const kanekoLeadership: VisualRecord[] = [
  {
    id: 'with-jun-kaneko-1', title: 'With Jun Kaneko', subtitle: 'Artist relationship and institutional leadership',
    src: '/media/kaneko_jun_1.webp', alt: 'Michael Hollins in conversation with artist Jun Kaneko at KANEKO',
  },
  {
    id: 'with-jun-kaneko-2', title: 'With Jun Kaneko', subtitle: 'Collaboration across exhibitions and public programming',
    src: '/media/kaneko_jun_2.webp', alt: 'Michael Hollins speaking with artist Jun Kaneko at KANEKO',
  },
];

export const kanekoLight2018: VisualRecord[] = [
  {
    id: 'light-wide', year: '2018', title: 'Light', subtitle: 'Installation view',
    src: '/media/kaneko_light_installation_2018.webp', alt: 'Wide installation view of the Light exhibition at KANEKO in 2018',
  },
  {
    id: 'light-adam-belt', year: '2018', title: 'Adam Belt', subtitle: 'Light exhibition',
    src: '/media/kaneko_light_adam_belt_2018.webp', alt: 'Visitor examining an illuminated work by Adam Belt in the Light exhibition at KANEKO in 2018',
  },
  {
    id: 'light-refik-anadol', year: '2018', title: 'Refik Anadol — Infinity Room', subtitle: 'Light exhibition',
    src: '/media/kaneko_light_refik_anadol_2018.webp', alt: 'Visitor inside Refik Anadol Infinity Room at KANEKO in 2018',
    sourceUrl: 'https://news.epson.com/case-studies/refik-anadol-infinity-room-projectors', sourceLabel: 'Related case study: Epson',
  },
  {
    id: 'light-blumen-lumen', year: '2018', title: 'Blumen Lumen by Foldhaus', subtitle: 'Light exhibition',
    src: '/media/kaneko_light_blumen_lumen_2018.webp', alt: 'Blumen Lumen by Foldhaus in the Light exhibition at KANEKO in 2018',
  },
  {
    id: 'light-michael', year: '2018', title: 'Inside Light', subtitle: 'Michael Hollins examining the exhibition',
    src: '/media/kaneko_light_michael_2018.webp', alt: 'Michael Hollins examining the Light exhibition at KANEKO in 2018',
  },
];

export const kanekoReality2018: VisualRecord[] = [
  {
    id: 'reality-nik-fackler', year: '2018', title: 'Nik Fackler + tbd. Dance Collective', subtitle: 'Video installation',
    src: '/media/kaneko_reality_nik_fackler_2018.webp', alt: 'Nik Fackler and tbd. Dance Collective video installation in Reality at KANEKO in 2018',
  },
  {
    id: 'reality-vr-public', year: '2018', title: 'Virtual Reality Public Exhibit', subtitle: 'Public engagement with emerging technology',
    src: '/media/kaneko_reality_vr_public_2018.webp', alt: 'Michael Hollins using a virtual reality viewer in a public exhibit at KANEKO during Reality in 2018',
  },
  {
    id: 'reality-vr-art', year: '2018', title: 'Virtual Reality Public Art Installation', subtitle: 'Immersive public experience',
    src: '/media/kaneko_reality_vr_art_2018.webp', alt: 'Visitors using head-mounted virtual reality displays in a public art installation during Reality at KANEKO in 2018',
  },
  {
    id: 'reality-ar-healthcare', year: '2018', title: 'Augmented Reality Healthcare Installation', subtitle: 'Reality exhibition',
    src: '/media/kaneko_reality_ar_healthcare_2018.webp', alt: 'Augmented reality healthcare installation displayed on a tablet during Reality at KANEKO in 2018',
  },
  {
    id: 'reality-healthcare', year: '2018', title: 'Healthcare Installation', subtitle: 'Reality exhibition',
    src: '/media/kaneko_reality_healthcare_2018.webp', alt: 'Visitors viewing a healthcare visualization and 3D printing installation during Reality at KANEKO in 2018',
  },
];

export const paceVisuals: VisualRecord[] = [
  { id: 'pace-owh', title: 'Hoff Center construction', subtitle: 'Originally published by the Omaha World-Herald', src: '/media/pace_owh.webp', alt: 'Michael Hollins at the Hoff Center construction site in a photograph published by the Omaha World-Herald' },
  { id: 'pace-site', title: 'Facility development', subtitle: 'Construction-site planning and design', src: '/media/pace_site.webp', alt: 'Michael Hollins at the Hoff Center construction site' },
  { id: 'pace-headshot', title: 'PACE design phase', subtitle: 'Council Bluffs', src: '/media/pace_headshot.webp', alt: 'Michael Hollins wearing a PACE construction helmet during the design phase' },
  { id: 'pace-construction-1', title: 'On-site design review', subtitle: 'Discussing space and facility functions during construction', src: '/media/pace_construction_1.webp', alt: 'Michael Hollins gesturing during a construction-site design discussion at the Hoff Center' },
  { id: 'pace-construction-2', title: 'Building the organization', subtitle: 'Leadership team walkthrough during construction', src: '/media/pace_construction_2.webp', alt: 'Michael Hollins and colleagues walking through the Hoff Center during construction' },
  { id: 'pace-construction-3', title: 'Design development', subtitle: 'Reviewing the evolving facility on site', src: '/media/pace_construction_3.webp', alt: 'Michael Hollins discussing the evolving Hoff Center facility during construction' },
];
