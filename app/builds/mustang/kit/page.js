import KitEmail from "@/components/mustang/KitEmail";
import KitAds from "@/components/mustang/KitAds";
import KitNav from "@/components/mustang/KitNav";
import KitCar from "@/components/mustang/KitCar";
import "./kit.css";

// The campaign kit (/pitch/mustang/kit/): every deliverable made from the ad's one concept,
// each with a preview, what it's for, its specs and a download. The spots, the GIF and the
// stills are recorded from /pitch/mustang/spot/ (see the README's "Campaign kit"); the
// email is a static file, public/pitch/mustang/kit/email.html.
const K = "/pitch/mustang/kit/";

const SPOTS = [
  { id: "story", ratio: "9:16", size: "1080 × 1920", mb: "3.1", use: "Instagram and Facebook Reels and Stories, TikTok, YouTube Shorts", note: "Copy stays out of the top 14% and bottom 20%, where the apps draw their own buttons." },
  { id: "feed", ratio: "4:5", size: "1080 × 1350", mb: "2.4", use: "Instagram and Facebook feeds", note: "The tallest size the feeds show in full." },
  { id: "wide", ratio: "16:9", size: "1920 × 1080", mb: "4.2", use: "YouTube, X, LinkedIn, and the dealer's site", note: "Also works as a video banner or a showroom screen loop." },
];

// the display ads (scripts/mustang/make-banners.mjs), largest first; sizes in KB
const ADS = [
  { id: "970x250", w: 970, h: 250, name: "Billboard", zip: 139, gif: 130 },
  { id: "728x90", w: 728, h: 90, name: "Leaderboard", zip: 139, gif: 137 },
  { id: "300x600", w: 300, h: 600, name: "Half page", zip: 140, gif: 115 },
  { id: "160x600", w: 160, h: 600, name: "Wide skyscraper", zip: 114, gif: 126 },
  { id: "300x250", w: 300, h: 250, name: "Medium rectangle", zip: 140, gif: 111 },
  { id: "320x50", w: 320, h: 50, name: "Mobile banner", zip: 82, gif: 46 },
];

// the index: a sticky sidebar on wide screens (KitNav)
const NAV = [
  { id: "landing", label: "Landing page" },
  { id: "email", label: "Email" },
  { id: "gif", label: "Email GIF" },
  { id: "spots", label: "Social spots" },
  { id: "hero", label: "Website hero" },
  { id: "ads", label: "Display ads" },
  { id: "stills", label: "Stills" },
];

const STILLS = [
  { id: "rear", label: "Tri-bar taillights" },
  { id: "cockpit", label: "Driver's cockpit" },
  { id: "lights", label: "LED headlights" },
];

const Slashes = () => <span className="ms-slashes" aria-hidden="true"><i /><i /><i /><i /></span>;
const Down = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M6 11l6 6 6-6M5 20h14" /></svg>
);
const Out = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

function Item({ n, id, title, lede, children }) {
  return (
    <section className="kit-item" id={id} aria-labelledby={`${id}-title`}>
      <header className="kit-item-head">
        <p className="kit-n" aria-hidden="true">{String(n).padStart(2, "0")}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p className="kit-lede">{lede}</p>
      </header>
      {children}
    </section>
  );
}

const Specs = ({ rows }) => (
  <dl className="kit-specs">
    {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
  </dl>
);

export default function Kit() {
  const year = new Date().getFullYear();
  return (
    <>
      <a className="ms-skip" href="#main">Skip to content</a>
      <main id="main" className="kit">
        <header className="kit-head">
          <KitCar />
          <p className="kit-top"><span>S650</span><span>Mustang <Slashes /></span></p>
          <h1>Campaign kit</h1>
          <p className="kit-tagline">One concept, everywhere the buyer is.</p>
          <p className="kit-intro">The interactive ad is the center of the campaign. From the same car, stage, and type come a launch email with an animated hero, seven-second spots for social, a hero for the dealer&apos;s website, and display ads in the standard sizes, so the Mustang looks the same in the inbox, in the feed, and on every page. Everything here is ready to download; the prices and terms are sample content.</p>
        </header>

        <div className="kit-body">
        <KitNav items={NAV} />
        <div className="kit-sections">

        <Item n={1} id="landing" title="Landing page" lede="Where every other piece points: a 3D Dark Horse to turn, repaint, and look inside, with the lease offer under the car.">
          <div className="kit-landing">
            <a className="kit-shot kit-shot-desk" href="/pitch/mustang/">
              <img src="/img/thumbs/portfolio/mustang_desktop-landing@1600.webp" width="1600" height="1000" alt="The landing page on a desktop: the car under a giant MUSTANG, the paint rail, three close-up windows and the offer" />
            </a>
            <a className="kit-shot kit-shot-phone" href="/pitch/mustang/">
              <img src="/img/thumbs/portfolio/mustang_mobile-landing.webp" width="780" height="1688" alt="The landing page on a phone: the car full width, the windows in a row and the offer" />
            </a>
          </div>
          <div className="kit-foot">
            <Specs rows={[["Built for", "Phones first, enhanced for desktops"], ["Made with", "Next.js, three.js, a licensed 3D model"], ["Link", "cyrilflorita.com/pitch/mustang"]]} />
            <a className="ms-btn" href="/pitch/mustang/">Open the landing page <Out /></a>
          </div>
        </Item>

        <Item n={2} id="email" title="Email" lede="A launch email for the dealer's list: the car turning at the top, three close-ups, the specs, and the offer, with every image and button leading to the landing page.">
          <KitEmail />
          <div className="kit-foot">
            <Specs rows={[
              ["Subject", "The Mustang, all the way around"],
              ["Preview text", "Turn it, open it, and look closer: the Mustang Dark Horse in 3D. Lease from $499 a month."],
              ["Build", "600px, table layout with inline styles, stacks on phones; web fonts where the inbox allows them, Arial elsewhere"],
            ]} />
            <div className="kit-actions">
              <a className="ms-btn" href={`${K}email.html`} target="_blank" rel="noopener noreferrer">Open the email <Out /></a>
              <a className="ms-btn ms-btn-ghost" href={`${K}email.html`} download="mustang-email.html">Download HTML <Down /></a>
            </div>
          </div>
        </Item>

        <Item n={3} id="gif" title="Email GIF" lede="The email's hero: one full turn of the car, looping. It opens on the front three-quarter view, the frame Outlook on Windows shows on its own.">
          <figure className="kit-gif">
            <img src={`${K}mustang-email-turn.gif`} width="560" height="299" alt="The Mustang Dark Horse turning all the way around under a giant MUSTANG" />
          </figure>
          <div className="kit-foot">
            <Specs rows={[["Size", "560 × 299, 1.3 MB"], ["Loop", "6 seconds, 8 frames a second, seamless"], ["Also for", "Text messages and chat, where video doesn't autoplay"]]} />
            <a className="ms-btn ms-btn-ghost" href={`${K}mustang-email-turn.gif`} download>Download GIF <Down /></a>
          </div>
        </Item>

        <Item n={4} id="spots" title="Social spots" lede="Seven seconds each: the car turns from its tail to the front three-quarter view, the giant word rises behind it, and the offer lands with a call to explore it in 3D.">
          <div className="kit-spots">
            {SPOTS.map((s) => (
              <figure key={s.id} className={`kit-spot kit-spot-${s.id}`}>
                <video src={`${K}mustang-spot-${s.id}.mp4`} poster={`${K}mustang-spot-${s.id}-poster.webp`} controls muted loop playsInline preload="none" aria-label={`The ${s.ratio} spot`} />
                <figcaption>
                  <p className="kit-ratio">{s.ratio}</p>
                  <p className="kit-use">{s.use}</p>
                  <p className="kit-note">{s.size} · 7 seconds · {s.mb} MB · {s.note}</p>
                  <a className="kit-dl" href={`${K}mustang-spot-${s.id}.mp4`} download>Download MP4 <Down /></a>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="kit-post">
            <p className="kit-label">Suggested post</p>
            <p className="kit-post-text">Turn it. Open it. Look closer. Explore the Mustang Dark Horse in 3D, from the tri-bar taillights to the cockpit, then see the offer. Link in bio.</p>
            <p className="kit-post-note">The spots are silent, so they play the same with the sound off; licensed music in the platform can be added.</p>
          </div>
        </Item>

        <Item n={5} id="hero" title="Website hero" lede="A full-width banner for the top of the dealer's site, 1920 × 600: the offer on the left, the car turning under the giant word on the right, looping without a seam.">
          <figure className="kit-hero">
            <video src={`${K}hero/mustang-hero.mp4`} poster={`${K}hero/mustang-hero.jpg`} autoPlay muted loop playsInline aria-label="The website hero: the Mustang turning beside the offer" />
          </figure>
          <div className="kit-foot">
            <Specs rows={[
              ["Size", "1920 × 600, the common height for a full-width hero: room for the car and the offer, with the dealer's inventory still above the fold"],
              ["Video", "8-second loop, H.264, silent, 1 MB; the version to use. Embed it as a muted, looping, inline video with the JPG as its poster"],
              ["HTML5", "The same layout built live with GSAP: the word rises, the car turns in, the copy follows, then the car turns again on hover; it scales to its container"],
              ["Also", "A GIF (1280 × 400, 2 MB) where video isn't allowed, and a JPG still"],
            ]} />
            <div className="kit-actions">
              <a className="ms-btn ms-btn-ghost" href={`${K}hero/mustang-hero.mp4`} download>MP4 · 1 MB <Down /></a>
              <a className="ms-btn ms-btn-ghost" href={`${K}ads/hero-1920x600/index.html`} target="_blank" rel="noopener noreferrer">Open HTML5 <Out /></a>
            </div>
          </div>
          <p className="kit-more">
            <a className="kit-dl" href={`${K}ads/mustang-hero-1920x600-html5.zip`} download>HTML5 zip · 603 KB <Down /></a>
            <a className="kit-dl" href={`${K}hero/mustang-hero.gif`} download>GIF · 2 MB <Down /></a>
            <a className="kit-dl" href={`${K}hero/mustang-hero.jpg`} download>JPG · 97 KB <Down /></a>
          </p>
        </Item>

        <Item n={6} id="ads" title="Display ads" lede="The standard sizes for ad networks, each as an HTML5 ad animated with GSAP, a GIF, and the backup JPG networks show where neither runs. Each plays once, about ten seconds, and turns the car again on hover.">
          <KitAds ads={ADS} base={`${K}ads/`} />
          <div className="kit-foot">
            <Specs rows={[
              ["HTML5", "Each zip is under 150 KB with GSAP inside it, the cap Google Ads sets; uses clickTag for the click-through"],
              ["GIF", "Under 150 KB each; the entrance, then the final frame, three plays"],
              ["Motion", "Stops by 11 seconds, inside the networks' 30-second limit; holds still for people who ask for reduced motion"],
            ]} />
          </div>
        </Item>

        <Item n={7} id="stills" title="Stills" lede="The three close-ups from the ad's windows, for the email, posts, and the dealer's site.">
          <div className="kit-stills">
            {STILLS.map((s) => (
              <figure key={s.id}>
                <img src={`${K}mustang-${s.id}.jpg`} width="600" height="400" alt={`The Mustang's ${s.label.toLowerCase()}, up close`} loading="lazy" />
                <figcaption>
                  <span>{s.label}</span>
                  <a className="kit-dl" href={`${K}mustang-${s.id}.jpg`} download>JPG <Down /></a>
                </figcaption>
              </figure>
            ))}
          </div>
        </Item>
        </div>
        </div>
      </main>
      <footer className="ms-footer">
        <p>3D model: <a href="https://sketchfab.com/3d-models/free-2024-ford-mustang-dark-horse-a29c8bb07f6e41b594fe2248366cffbf" target="_blank" rel="noopener noreferrer">“[FREE] 2024 Ford Mustang Dark Horse”</a> by <a href="https://sketchfab.com/livanovbog" target="_blank" rel="noopener noreferrer">livanovbog</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> (closed up, recolored and compressed for this page).</p>
        <p>Unofficial concept. Not affiliated with or endorsed by Ford Motor Company. Ford and Mustang are trademarks of Ford Motor Company.</p>
        <p>Design and Dev Pitch · © {year} Cyril Florita. All rights reserved. · <a href="/pitch/mustang/">The ad</a> · <a href="/">Back to portfolio</a></p>
      </footer>
    </>
  );
}
