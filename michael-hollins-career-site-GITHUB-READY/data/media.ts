export type MediaRecord = {
  id: string;
  year: string;
  type: string;
  title: string;
  outlet: string;
  description: string;
  primaryUrl: string;
  listenUrl?: string;
  duration?: string;
  featured?: boolean;
  latest?: boolean;
  streamUrl?: string;
  videoSrc?: string;
  clipStart?: number;
  clipEnd?: number;
  eventDate?: string;
  publishedDate?: string;
  youtubeId?: string;
  poster?: string;
  relatedUrl?: string;
  relatedLabel?: string;
  anchorId?: string;
  playerTitle?: string;
  tags: string[];
};

export const media: MediaRecord[] = [
  {
    id: 'ncn-statewide-stroke-conference',
    year: '2026',
    type: 'TV interview',
    title: 'UNMC uses immersive technology to expand stroke education statewide',
    outlet: 'News Channel Nebraska',
    description:
      'At the DHHS Statewide Stroke Conference, Hollins discussed how holograms, VR and interactive walls connect health professionals and students across Nebraska.',
    primaryUrl:
      'https://central.newschannelnebraska.com/story/364065246/unmc-uses-immersive-technology-to-expand-stroke-education-statewide',
    duration: '0:22 excerpt',
    latest: true,
    streamUrl:
      'https://ncn.vod.immergo.tv/ncn/transcoded/ee63d0f2-4426-4b6c-bf84-5904a6c33496/hls/master.m3u8',
    videoSrc: '/media/stroke_conference_loop.mp4',
    poster: '/media/stroke_conference_poster.jpg',
    clipStart: 16,
    clipEnd: 38,
    eventDate: 'September 18, 2026',
    publishedDate: 'September 19, 2026',
    tags: ['Statewide Education', 'Stroke Education', 'Immersive Technology', 'UNMC'],
  },
  {
    id: 'futurists-simulating-human-body',
    year: '2026',
    type: 'Podcast',
    title: 'Simulating The Human Body',
    outlet: 'The Futurists · Episode 328',
    description:
      'A national conversation on healthcare simulation, medical imaging, immersive technology, and the translation of entertainment-derived technologies into health professions education and workforce training.',
    primaryUrl: 'https://www.thefuturists.com/episodes/simulating-the-human-body',
    listenUrl:
      'https://podcasts.apple.com/au/podcast/simulating-the-human-body/id1615809726?i=1000755164201',
    duration: '49 min',
    featured: true,
    tags: [
      'Healthcare Simulation',
      'Emerging Technology',
      'iEXCEL',
      'Medical Imaging',
      'National Media',
    ],
  },
  {
    id: 'epson-infinity-room-kaneko',
    year: '2018',
    type: 'Video interview',
    title: 'Infinity Room at KANEKO',
    outlet: 'Epson America',
    description:
      'In this Epson interview, Michael Hollins discusses bringing Refik Anadol’s Infinity Room to KANEKO and the projection technology behind the installation.',
    primaryUrl: 'https://www.youtube.com/watch?v=GDw2PxRGbmA',
    duration: '4:29',
    youtubeId: 'GDw2PxRGbmA',
    poster: '/media/kaneko_light_refik_anadol_2018.webp',
    anchorId: 'media-epson-infinity-room',
    playerTitle: 'Epson Projectors | Infinity Room at KANEKO by Refik Anadol',
    relatedUrl:
      'https://news.epson.com/case-studies/refik-anadol-infinity-room-projectors',
    relatedLabel: 'Read the Epson case study ↗',
    tags: ['KANEKO', 'Refik Anadol', 'Immersive Art', 'Epson'],
  },
];
