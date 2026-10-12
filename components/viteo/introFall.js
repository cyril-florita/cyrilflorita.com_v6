// The landing intro's drop, per object: the carton lands first, then the
// nine pills tumble in one by one, each with its own delay, speed, drop
// height, bounce and spin. IntroMoment.js plays it as one GSAP timeline;
// each object's tween writes both the CSS hero (custom properties) and
// introState below, which the 3D scene (ProductStory.js) reads every frame,
// so the live 3D and the CSS fallback can't drift apart. Plain module.
//
// delay and dur in seconds; h = drop height as a fraction of the product
// square's width; o = bounce (becomes GSAP's back.out strength); r = extra
// spin in degrees, unwinding as it lands.

export const CARTON_FALL = { delay: 0.25, dur: 0.95, h: 0.5, o: 1.45, r: 0 };

// Indexed like BURST in page.js. rank = landing order.
const RANK = [3, 0, 5, 2, 7, 1, 8, 4, 6];
const DUR = [0.62, 0.86, 0.7, 0.92, 0.66, 0.8, 0.72, 0.9, 0.68];
const H = [0.62, 0.48, 0.7, 0.55, 0.66, 0.5, 0.6, 0.72, 0.58];
const O = [1.9, 1.3, 1.65, 1.2, 1.8, 1.4, 1.7, 1.3, 1.55];
const R = [50, -70, 35, -45, 75, -30, 60, -65, 40];

export const pillFall = (i) => ({
  delay: 0.42 + RANK[i % 9] * 0.052,
  dur: DUR[i % 9],
  h: H[i % 9],
  o: O[i % 9],
  r: R[i % 9],
});

// GSAP's back.out strength for a given bounce value.
export const backStrength = (o) => Math.max(0.6, (o - 1) * 2.5);

// Live intro state, written by IntroMoment's tweens: p = linear progress
// (0 before the object starts), drop = remaining fall (fraction of the
// product width), turn = remaining spin in degrees.
export const introState = {
  active: false,
  carton: { p: 1, drop: 0, turn: 0 },
  pills: Array.from({ length: 9 }, () => ({ p: 1, drop: 0, turn: 0 })),
};
