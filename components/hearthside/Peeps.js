import { PEEP_BOXES } from "./peeps-art";

// A group of Open Peeps figures (Pablo Stanley, CC0) standing together in
// front of a warm lamplight disc ("a light left on"). The art lives in one
// cached sprite, public/img/hearthside/peeps.svg (inline SVG was repeated in
// Next's hydration data and doubled the page weight); each figure here is a
// <use> of its symbol. Lines are currentColor and fills read --hs-peep-*,
// which inherit into the sprite, so figures follow every scheme and mode.
// Figures share one scale (FULL ≈ a standing figure's height), so seated
// people read shorter than standing ones; `flip` turns a figure to face the
// other way; `bust` is for waist-up figures, which instead fill the
// backdrop and sit on its bottom edge, like a portrait. Decorative: the text
// beside it says what it shows.
const SPRITE = "/img/hearthside/peeps.svg";
const FULL = 3030;

export default function Peeps({ figures, size, className = "" }) {
  return (
    <div className={`hs-peeps ${className}`} style={size ? { "--peeps-h": `${size}px` } : undefined} aria-hidden="true">
      <span className="hs-peeps-disc" />
      {figures.map(({ name, flip, bust }) => {
        const box = PEEP_BOXES[name];
        return (
          <svg key={name} className={`hs-peep${flip ? " is-flipped" : ""}${bust ? " is-bust" : ""}`} viewBox={box.join(" ")} style={{ "--peep-h": bust ? 0.78 : box[3] / FULL }} focusable="false">
            <use href={`${SPRITE}#${name}`} />
          </svg>
        );
      })}
    </div>
  );
}

// "How care begins": one small scene per step, in step order.
export const STEP_FIGURES = [
  [{ name: "step-call3", bust: true }],
  [{ name: "step-check" }],
  [{ name: "nurse-2" }],
  [{ name: "step-walk" }, { name: "step-walk2" }],
];
