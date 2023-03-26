import { Color } from "../../deps/color.ts";
import { findClosestColor } from "./closest.ts";

/** Recolor the image without dithering */
export function recolor(
  pixels: Color[],
  palette: Color[],
): Color[] {
  let i = 0;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i < (pixels.length)) {
    const newC = findClosestColor(pixels[i], palette);

    // Match our quantized palette
    pixels[i] = newC;
    i += 1;
  }
  return pixels;
}
