import { media } from '../data/media';
import {
  iexcelVisuals,
  kanekoEducation,
  kanekoExhibitions,
  kanekoGalleryIndex,
  kanekoLeadership,
  kanekoLight2018,
  kanekoReality2018,
  paceVisuals,
  type VisualRecord,
} from '../data/visualArchive';

const scholarship = [
  ['2026','Funded research','$8M NSF E-RISE / Nebraska Center for 3D Innovation','Co-principal investigator','https://www.unomaha.edu/news/uno-secures-8m-nsf-award-to-establish-nebraska-center-for-3d-innovation.php'],
  ['2026','Book chapter','Enhancing Interprofessional Healthcare Simulation to Address the Needs of All Patient Populations','Co-author · Springer','https://link.springer.com/book/10.1007/978-3-032-03947-7'],
  ['2026','Award-recognized scholarship','Implementing Holographic Instruction in Multi-Campus DPT Education','Co-author · Second Place Outstanding Project Award','https://www.unmc.edu/academy/scholarship/spotlight.html'],
  ['2025','Publication','The Current State and Future of Haptics in Healthcare Simulation','Co-author · Society for Simulation in Healthcare STORM','https://www.ssih.org/sites/default/files/2025-10/STORM-Vol.%204%2C%20Issue%202_0.pdf'],
];

const speaking = [
  ['2026','Digital Hollywood: The AI & Entertainment Summit','Panelist — interactive holography, volumetric media and AI','https://www.digitalhollywood.com/wednesday-twelve---summer-2026-ai-festival'],
  ['2026','University of Miami Digital EyeCon','Workshop + invited presentations on AI, XR and future learning environments','https://news.med.miami.edu/digital-eyecon-2026-ai-remote-patient-monitoring/'],
  ['2026','University of Georgia Healthcare 5.0','Presenter — immersive technology and health professions education','https://rx.uga.edu/event/healthcare-5-0-driving-precision-health-and-education-through-immersive-technology-and-artificial-intelligence/'],
  ['2026','International Meeting on Simulation in Healthcare','Panelist — evidence, challenges and strategies for haptics','https://imsh2026.org/sites/default/files/2026-01/2026%20IMSH%20DIGITAL%20PROGRAM%20BOOK-opt_0.pdf'],
  ['2024','The Generalists in Medical Education','National keynote co-presenter — implementing change in traditional settings','https://thegeneralists.org/wp-content/uploads/2024/11/TGME_Program_2024.pdf'],
];

function VisualFigure({v, className=''}:{v:VisualRecord;className?:string;key?:string}){
  return <figure className={className}>
    <img src={v.src} alt={v.alt}/>
    <figcaption>
      {v.year && <span className="yearPill">{v.year}</span>}
      <b>{v.title}</b>
      <span>{v.subtitle}</span>
      {v.galleryUrl && <a className="captionLink" href={v.galleryUrl} target="_blank" rel="noreferrer">View full exhibition gallery ↗</a>}
      {v.sourceUrl && <a className="captionLink" href={v.sourceUrl} target="_blank" rel="noreferrer">{v.sourceLabel || 'Source ↗'}</a>}
    </figcaption>
  </figure>
}

export default function Home(){return <main>
<header className="top"><a className="brand" href="#top"><b>MH</b><span>Michael Hollins<small>Living career archive</small></span></a><nav><a href="#work">Work</a><a href="#kaneko">KANEKO</a><a href="#pace">PACE</a><a href="#research">Research</a><a href="#media">Media</a><a href="#speaking">Speaking</a></nav></header>

<section id="top" className="hero"><img className="heroPhoto" src="/media/hero.webp" alt="Michael Hollins at UNMC Davis Global Center"/><div className="shade"></div><div className="wrap heroCopy"><p className="eyebrow light">Executive leadership · technology · scholarship · community</p><h1>Omaha roots.<br/>National reach.</h1><p className="lead">Omaha-grown interdisciplinary executive, faculty member and scholar-practitioner building connections across creative leadership, emerging technology, health professions education, research, business development and community impact.</p><div className="buttons"><a className="btn lime" href="#work">Explore the career archive</a></div></div><div className="photoTag">Michael Hollins · UNMC Davis Global Center · 2024</div></section>

<section className="metrics wrap" aria-label="Selected accomplishments">
  <div><small>Career</small><b>100+</b><span>Creative Producer for 100+ Art, Media & Education Projects</span><em>Academia · Industry · Community</em></div>
  <div><small>2026</small><b>$8M</b><span>National Science Foundation Award, Co-PI</span><em>E-RISE · 3D NE Collaboration with UNO, UNL & UNMC</em></div>
  <div><small>2022</small><b>5,500+</b><span>Common Senses Festival</span><em>Attendees</em></div>
  <div><small>2013–2018</small><b>12</b><span>KANEKO</span><em>Thematic exhibition & programming seasons</em></div>
</section>

<section id="work" className="section wrap">
  <div className="heading"><div><p className="eyebrow">Selected work</p><h2>A career built at the intersections.</h2></div><p>The archive is designed to show the work, not just list it: institutions built, technologies translated, communities connected and ideas brought into public life.</p></div>
  <div className="featureGrid">
    <a className="featureCard" href="#iexcel-visuals"><span>2019–present</span><h3>UNMC iEXCEL</h3><p>Executive leadership in creative production, emerging technology, business development, statewide education, research, external relations and advancement.</p><strong>Explore current work →</strong></a>
    <a className="featureCard" href="#research"><span>2026–present</span><h3>Nebraska Center for 3D Innovation</h3><p>Co-principal investigator on NSF Award No. 2546319 supporting an $8 million statewide E-RISE initiative.</p><strong>Explore research →</strong></a>
    <a className="featureCard" href="#iexcel-visuals"><span>2023–present</span><h3>Statewide & rural health education</h3><p>Holography, VR, connected 3D iWalls and multi-site production used to reduce geographic barriers across Nebraska.</p><strong>Explore visual archive →</strong></a>
  </div>
  <div id="iexcel-visuals" className="visualIntro"><p className="eyebrow">iEXCEL visual archive</p><h3>From simulation leadership to national conversations about the future of learning.</h3></div>
  <div className="currentVisuals">{iexcelVisuals.map((v,i)=><VisualFigure key={v.id} v={v} className={i===2?'featureVisual':''}/>)}</div>
</section>

<section id="kaneko" className="chapter dark"><div className="wrap">
  <div className="chapterIntro"><div><p className="eyebrow aqua">KANEKO · 2013–2018</p><h2>Curating across art, science, design and emerging technology.</h2></div><p>Across twelve thematic seasons, Hollins combined exhibition leadership with public programming, youth education, media, design collaboration and increasingly immersive technology.</p></div>

  <div className="mosaic">
    <figure className="wide"><img src="/media/kaneko_design_in_motion.webp" alt="Michael Hollins leading a Design in Motion youth workshop at KANEKO"/><figcaption><span className="yearPill">2015</span><b>Design in Motion</b><span>Youth workshop and hands-on design engagement</span></figcaption></figure>
    <figure><img src="/media/kaneko_water.webp" alt="Michael Hollins teaching students during WATER at KANEKO"/><figcaption><span className="yearPill">2016</span><b>WATER</b><span>Gallery teaching and public education</span></figcaption></figure>
    <figure><img src="/media/kaneko_passion.webp" alt="Michael Hollins teaching students during Passion and Obsession at KANEKO"/><figcaption><span className="yearPill">2016</span><b>Passion & Obsession</b><span>Connecting students with exhibition ideas</span></figcaption></figure>
    <figure className="wide"><img src="/media/kaneko_reality_1.webp" alt="Michael Hollins presenting during Reality at KANEKO"/><figcaption><span className="yearPill">2018</span><b>Reality</b><span>Public programming at the convergence of VR, holography, art and science</span></figcaption></figure>
    <figure><img src="/media/kaneko_reality_2.webp" alt="Michael Hollins presenting on stage during Reality at KANEKO"/><figcaption><span className="yearPill">2018</span><b>Reality</b><span>Speaking across art, science and emerging technology</span></figcaption></figure>
    <figure><img src="/media/kaneko_google_ai.webp" alt="Michael Hollins introducing a presentation on artificial intelligence by Chris Russell of Google during Reality at KANEKO"/><figcaption><span className="yearPill">2018</span><b>Artificial intelligence at Reality</b><span>Introducing Chris Russell of Google for a public program on AI</span></figcaption></figure>
  </div>

  <div className="archiveDivider stacked"><div><p className="eyebrow aqua">Exhibition archive</p><h3>A visual chronology of interdisciplinary programming.</h3></div><p>Selected installation views establish the range of art, design, architecture, culture, immersive media and participatory learning that shaped the KANEKO years.</p></div>
  <div className="exhibitionTimeline">{kanekoExhibitions.map((v,i)=><VisualFigure key={v.id} v={v} className={(i===2||i===5||i===8||i===9)?'timelineWide':''}/>)}</div>

  <div className="galleryIndexBlock">
    <div><p className="eyebrow aqua">Institutional photo archive</p><h3>Go deeper into the original KANEKO galleries.</h3></div>
    <div className="galleryIndex">{kanekoGalleryIndex.map((g)=><a key={g.title} href={g.url} target="_blank" rel="noreferrer"><span>{g.year || 'Archive'}</span><b>{g.title}</b><em>Full gallery ↗</em></a>)}</div>
  </div>

  <div className="archiveDivider stacked"><div><p className="eyebrow aqua">Education & community</p><h3>Turning exhibitions into places for dialogue, interpretation and access.</h3></div><p>In addition to designing exhibitions and often installing them alongside the artists, Hollins hosted youth and learners of all ages for hands-on, experiential workshops that connected exhibition ideas with creative exploration, dialogue and public learning.</p></div>
  <div className="educationGrid">{kanekoEducation.map((v,i)=><VisualFigure key={v.id} v={v} className={(i===1||i===6)?'educationWide':''}/>)}</div>

  <div className="archiveDivider stacked"><div><p className="eyebrow aqua">Leadership & collaboration</p><h3>Working alongside artists while building the institution around the work.</h3></div></div>
  <div className="leadershipPair">{kanekoLeadership.map(v=><VisualFigure key={v.id} v={v}/>)}</div>

  <div className="archiveDivider stacked"><div><p className="eyebrow aqua">2018 · Light</p><h3>Immersive environments at the intersection of art, technology and perception.</h3></div><p><a className="sectionExternal" href="https://kaneko.smugmug.com/Exhibitions/Light" target="_blank" rel="noreferrer">View full Light exhibition gallery ↗</a></p></div>
  <div className="immersiveGrid">{kanekoLight2018.map((v,i)=><VisualFigure key={v.id} v={v} className={i===0?'immersiveWide':''}/>)}</div>

  <div className="archiveDivider stacked"><div><p className="eyebrow aqua">2018 · Reality</p><h3>Art, science, healthcare visualization, virtual reality, augmented reality and public conversation.</h3></div><p><a className="sectionExternal" href="https://kaneko.smugmug.com/Exhibitions/13-REALITY" target="_blank" rel="noreferrer">View full Reality exhibition gallery ↗</a></p></div>
  <div className="realityGrid">{kanekoReality2018.map((v,i)=><VisualFigure key={v.id} v={v} className={i===0?'realityWide':''}/>)}</div>

  <div className="archiveDivider"><p className="eyebrow aqua">Public programs</p><h3>Speaking, access and public conversation.</h3></div>
  <div className="kanekoArchive">
    <figure className="archiveTall"><img src="/media/kaneko_arts_workshop_light.webp" alt="Michael Hollins engaging children during an arts workshop in KANEKO's Light environment"/><figcaption><span className="yearPill">2018</span><b>Arts workshop</b><span>Hands-on engagement with young participants inside an immersive installation</span></figcaption></figure>
    <figure><img src="/media/kaneko_arts_workshop_gallery.webp" alt="Michael Hollins speaking with arts workshop participants in a KANEKO gallery"/><figcaption><b>Gallery learning</b><span>Facilitating conversation and access to contemporary art</span></figcaption></figure>
    <figure><img src="/media/kaneko_speaking_open_space_2.webp" alt="Michael Hollins speaking from a podium at KANEKO"/><figcaption><b>Open Space for Your Mind</b><span>Public speaking and program leadership at KANEKO</span></figcaption></figure>
  </div>
</div></section>

<section id="pace" className="chapter pace"><div className="wrap"><div className="chapterIntro"><div><p className="eyebrow">PACE · 2018–2019</p><h2>Building an organization while the building itself was taking shape.</h2></div><p>Recruited during development of the nearly $27 million, 95,000-square-foot Hoff Family Arts & Culture Center, Hollins contributed to organizational structure, programming strategy, facility functions, public identity and the design-development process.</p></div><div className="paceArchiveGrid">{paceVisuals.map((v,i)=><VisualFigure key={v.id} v={v} className={i===0?'paceLead':''}/>)}</div></div></section>

<section id="research" className="section wrap"><div className="heading"><div><p className="eyebrow">Research & scholarship</p><h2>From implementing technology to studying how it should be used.</h2></div></div><div className="records">{scholarship.map(([year,type,title,desc,url])=><a key={title} href={url} target="_blank" rel="noreferrer"><span>{year}</span><div><small>{type}</small><h3>{title}</h3><p>{desc}</p></div><b>↗</b></a>)}</div></section>

<section id="media" className="mediaSection section"><div className="wrap"><div className="heading mediaHeading"><div><p className="eyebrow">Media & public engagement</p><h2>Ideas carried into public conversation.</h2></div><p>Selected podcasts, interviews, television, radio, documentary appearances and press coverage connecting emerging technology, healthcare education and innovation with broader audiences.</p></div>{media.filter(m=>m.featured).map(m=><article className="mediaFeature" key={m.id}><div className="mediaVisual" aria-hidden="true"><span className="mediaPulse"></span><div className="mediaMonogram">TF</div><p>THE FUTURISTS</p></div><div className="mediaCopy"><div className="mediaMeta"><span>{m.year}</span><span>{m.type}</span>{m.duration&&<span>{m.duration}</span>}</div><p className="eyebrow">Featured appearance</p><h3>{m.title}</h3><p className="mediaOutlet">{m.outlet}</p><p>{m.description}</p><div className="tagRow">{m.tags.map(t=><span key={t}>{t}</span>)}</div><div className="mediaActions"><a className="btn navyBtn" href={m.primaryUrl} target="_blank" rel="noreferrer">Official episode ↗</a>{m.listenUrl&&<a className="textLink" href={m.listenUrl} target="_blank" rel="noreferrer">Listen on Apple Podcasts ↗</a>}</div></div></article>)}<div className="embedShell"><iframe title="The Futurists — Simulating The Human Body" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameBorder="0" height="175" style={{width:'100%',overflow:'hidden',borderRadius:'12px'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="https://embed.podcasts.apple.com/au/podcast/simulating-the-human-body/id1615809726?i=1000755164201"></iframe></div></div></section>

<section id="speaking" className="soft section"><div className="wrap"><div className="heading"><div><p className="eyebrow">National voice</p><h2>Speaking where health, technology, education and media converge.</h2></div></div><div className="records">{speaking.map(([year,title,desc,url])=><a key={title} href={url} target="_blank" rel="noreferrer"><span>{year}</span><div><small>Forum</small><h3>{title}</h3><p>{desc}</p></div><b>↗</b></a>)}</div></div></section>

<footer><div className="wrap"><div><p className="eyebrow aqua">Living career archive</p><h2>Michael Hollins</h2><p>Assistant Vice Chancellor · Assistant Professor · UNMC<br/>Omaha, Nebraska</p></div><div><a href="mailto:michael.hollins@unmc.edu">michael.hollins@unmc.edu</a><a href="https://www.linkedin.com/in/michael-hollins-70463371/">LinkedIn ↗</a></div></div></footer>
</main>}
