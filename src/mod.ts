export { getProminentColor, reducePalette, quantizeByMedianCut, quantizeByPopularity } from "./quantize.ts";

export { ColorHistogram, getHistogram } from "./histogram.ts";

export { getPixels } from "./pixels.ts";

export {
  floydSteinbergDither,
  midPointDither,
  monochromeDither,
  noDither,
  quickDither,
  twoRowSierraDither,
  quickTwoRowDither,
} from "./dither.ts";

export { Image } from "./image.ts"

// For backwards compat. TODO: Remove soon
export { Color } from "../deps/color.ts";
