export * from "./quantize/mod.ts";

export { ColorHistogram, getHistogram } from "./histogram.ts";

export { getPixels } from "./pixels.ts";

export * from "./dither/mod.ts";

export { Image } from "./structures/image.ts";

// For backwards compat. TODO: Remove soon
export { Color } from "../deps/color.ts";
