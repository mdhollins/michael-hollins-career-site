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
  tags: string[];
};

export const media: MediaRecord[] = [
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
];
