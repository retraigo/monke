export { getProminentColor, reducePalette } from "./quantize.ts";

export { ColorHistogram, getHistogram } from "./histogram.ts";

export { getPixels } from "./pixels.ts";

export {
  floydSteinbergDither,
  midPointDither,
  monochromeDither,
  noDither,
  quickDither,
  twoRowSierraDither,
} from "./dither.ts";

// For backwards compat. TODO: Remove soon
export { Color } from "../deps/color.ts";
