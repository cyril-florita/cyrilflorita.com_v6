import { thumbFor } from "@/components/imageProps";

// Brand-guide building blocks for case studies that document an identity
// (first used on /patricia-macarthur-pastoral-care-fund). Styles are the
// "brand guide" block after the case-study styles in _components.scss.
// Grids use .cyril-brand-grid so their items reveal one by one (see
// REVEAL_SELECTORS in public/utility/index.js).

// A region of a portfolio image, shown at its own aspect ratio. `box` is
// [x, y, width, height] and `size` the original's [width, height], both in
// the original's pixels. Uses the 1600w WebP, since crops are shown zoomed in.
export const BrandCrop = ({ src, box, size, alt, className = "", style }) => {
  const [x, y, w, h] = box;
  const [W] = size;
  return (
    <div className={`cyril-brand-crop ${className}`} style={{ aspectRatio: `${w} / ${h}`, ...style }}>
      <img
        src={thumbFor(src, true)}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: `${(W / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </div>
  );
};

// Logo versions: the artwork on its own ground, plus what it's for. An item
// with `box` + `size` shows that region of the file (e.g. the mark alone),
// centered at `fit` width in a tile the same shape as the whole files.
// `ratio` (e.g. "1 / 1") crops every tile to one shape, centered, for files
// of different sizes.
export const BrandLogos = ({ items, ratio }) => (
  <div className="cyril-brand-grid cyril-brand-logos">
    {items.map(({ src, name, ground, use, box, size, fit = "60%" }) => (
      <figure key={name} className="cyril-brand-logo">
        <div
          className={`cyril-brand-logo-art${box ? " cyril-brand-logo-part" : ""}${ratio ? " cyril-brand-logo-fixed" : ""}`}
          style={ratio ? { aspectRatio: ratio } : undefined}
        >
          {box ? (
            <BrandCrop src={src} box={box} size={size} alt={`${name} logo`} className="cyril-brand-fit" style={{ width: fit }} />
          ) : (
            <img src={thumbFor(src)} alt={`${name} logo`} loading="lazy" decoding="async" />
          )}
        </div>
        <figcaption>
          <h3 className="cyril-brand-name">{name}</h3>
          <dl className="cyril-brand-specs">
            <div><dt className="cyril-upper">Ground</dt><dd>{ground}</dd></div>
            <div><dt className="cyril-upper">Use for</dt><dd>{use}</dd></div>
          </dl>
        </figcaption>
      </figure>
    ))}
  </div>
);

// Color discs (after the logo's color discs behind the drawn poppies).
export const BrandSwatches = ({ colors }) => (
  <ul className="cyril-brand-grid cyril-brand-swatches">
    {colors.map(({ name, hex, rgb, role }) => (
      <li key={hex} className="cyril-brand-swatch">
        <span className="cyril-brand-disc" style={{ backgroundColor: hex }} aria-hidden="true" />
        <h3 className="cyril-brand-name">{name}</h3>
        <dl className="cyril-brand-values">
          <div><dt className="cyril-upper">Hex</dt><dd>{hex}</dd></div>
          <div><dt className="cyril-upper">RGB</dt><dd>{rgb}</dd></div>
        </dl>
        <p className="cyril-brand-role">{role}</p>
      </li>
    ))}
  </ul>
);

// Lettering roles, each shown as a crop of the logo itself (the lockup's
// lettering is artwork, so it isn't re-set in a web font). `fit` sets each
// crop's width, so small lettering isn't blown up past the rest. An item's
// own `src` + `size` override the shared ones (lettering from another file).
export const BrandLettering = ({ src, size, items }) => (
  <div className="cyril-brand-lettering">
    {items.map(({ name, box, role, fit = "100%", src: itemSrc, size: itemSize }) => (
      <div key={name} className="cyril-brand-letter">
        <div className="cyril-brand-letter-art">
          <BrandCrop src={itemSrc || src} box={box} size={itemSize || size} alt={`${name} from the logo`} style={{ width: fit }} />
        </div>
        <div className="cyril-brand-letter-text">
          <h3 className="cyril-brand-name">{name}</h3>
          <p className="cyril-brand-role">{role}</p>
        </div>
      </div>
    ))}
  </div>
);

// Clear-space diagram: the logo (cropped to `box`) inside a margin of
// `margin` × its width on every side. As padding that's margin / (1 + 2 ×
// margin) of the whole box (one eighth → 10%).
export const BrandClearSpace = ({ src, box, size, specs, margin = 0.125 }) => (
  <div className="cyril-brand-clear">
    <div className="cyril-brand-clear-diagram">
      <div className="cyril-brand-clear-zone" style={{ "--clear-pad": `${(margin / (1 + 2 * margin)) * 100}%` }}>
        <span className="cyril-brand-clear-x cyril-brand-clear-x-top cyril-upper" aria-hidden="true">x</span>
        <span className="cyril-brand-clear-x cyril-brand-clear-x-left cyril-upper" aria-hidden="true">x</span>
        <BrandCrop src={src} box={box} size={size} alt="Logo with its clear-space margin marked" className="cyril-brand-clear-emblem" />
      </div>
    </div>
    <dl className="cyril-brand-specs cyril-brand-clear-specs">
      {specs.map(({ label, value }) => (
        <div key={label}><dt className="cyril-upper">{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  </div>
);

// Do / don't tiles. `visual` is the tile's picture; `ok` marks a "do".
export const BrandUsage = ({ items }) => (
  <div className="cyril-brand-grid cyril-brand-usage">
    {items.map(({ ok, label, visual }) => (
      <figure key={label} className={`cyril-brand-rule ${ok ? "cyril-brand-do" : "cyril-brand-dont"}`}>
        <div className="cyril-brand-rule-art">{visual}</div>
        <figcaption>
          <span className="cyril-upper cyril-brand-verdict">{ok ? "Do" : "Don’t"}</span>
          {label}
        </figcaption>
      </figure>
    ))}
  </div>
);
