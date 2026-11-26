import { Words } from "@/components/kord/ui";
import { BIKES, PAINTS, plain } from "@/components/kord/data";
import BikeViewer from "@/components/kord/BikeViewer";
import { WORDMARK } from "@/components/kord/wordmark";

// A page's opening (server-safe; 2026-11-25, the Guarantee page's hero, then Virtual fit's — the user's calls): the
// heading, its subhead and an optional lede on the left; on the right the landing's bike, the Arc in Stealth, in
// 3D (BikeViewer: drag or arrow keys to turn it) over KORD, the wordmark, faint and as wide as the bike's stage, in the studio, which fills the section
// edge to edge and up behind the fixed header. Stacked, bike first, below 900px. Styles: ".cd-sh" in kord.css.
const ARC = BIKES.find((b) => b.id === "arc");

export default function StudioHero({ title, subhead, lede }) {
  return (
    <section className="cd-sh cd-studio">
      <div className="cd-wrap cd-sh-row">
        <div className="cd-sh-copy">
          <h1 className="cd-h2"><Words text={title} /></h1>
          {subhead && <p className="cd-subhead">{subhead}</p>}
          {lede && <p className="cd-lede">{lede}</p>}
        </div>
        <div className="cd-sh-stage">
          <div className="cd-sh-frame">
            {/* the brand name in the wordmark's own lettering, faint behind the bike: as wide as its stage, its top level
                with the bike's (the user's calls, 2026-11-25; it was the giant ARC) */}
            <svg className="cd-sh-word" viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true" focusable="false"><path d={WORDMARK.d} fill="currentColor" /></svg>
            <BikeViewer bike={ARC.id} paint={PAINTS[0]} still={`/pitch/kord/bikes/${ARC.id}-${PAINTS[0].id}.webp`} label={`The Kord ${plain(ARC.name)}`} className="cd-sh-viewer" />
          </div>
          <p className="cd-sh-hint" aria-hidden="true">Drag to turn 360°</p>
        </div>
      </div>
    </section>
  );
}
