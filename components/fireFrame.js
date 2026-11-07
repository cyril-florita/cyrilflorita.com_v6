// Fiery hover frame (see "Fiery hover frame" in _components.scss): runs the
// flame head round the hovered tile's frame at a constant speed. The flame
// is a conic gradient, so its head sits at an angle from the tile's centre;
// sampling the frame by distance and keying --fire-angle to each sample's
// angle keeps it from racing into the corners of wide tiles.
export const FIRE_MOTION = "(hover: hover) and (pointer: fine) and (min-width: 1201px) and (prefers-reduced-motion: no-preference)";
export const FIRE_LAP = 3000;
const FIRE_SAMPLES = 64;

export const fireFrames = (w, h) => {
  const per = 2 * (w + h);
  const frames = [];
  for (let i = 0; i <= FIRE_SAMPLES; i++) {
    // Clockwise from the middle of the top edge, y pointing down.
    let d = (i / FIRE_SAMPLES) * per, x, y;
    if (d < w / 2) { x = d; y = -h / 2; }
    else if ((d -= w / 2) < h) { x = w / 2; y = d - h / 2; }
    else if ((d -= h) < w) { x = w / 2 - d; y = h / 2; }
    else if ((d -= w) < h) { x = -w / 2; y = h / 2 - d; }
    else { x = d - h - w / 2; y = -h / 2; }
    const a = i === FIRE_SAMPLES ? 360 : ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
    frames.push({ "--fire-angle": `${a}deg`, offset: i / FIRE_SAMPLES });
  }
  return frames;
};
