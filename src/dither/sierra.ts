import { Color } from "../../deps/color.ts";
import { findClosestColor } from "../util/closest.ts";

/**
 * Dither the image into a smaller palette
 * Uses two-row Sierra matrix
 */
export function sierra2(
  pixels: Color[],
  width: number,
  palette: Color[],
): Color[] {
  let i = 0;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i < (pixels.length)) {
    const newC = findClosestColor(pixels[i], palette);
    const err = {
      r: Math.floor((pixels[i].r - newC.r) / 16),
      g: Math.floor((pixels[i].r - newC.g) / 16),
      b: Math.floor((pixels[i].r - newC.b) / 16),
    };

    // Match our quantized palette
    pixels[i] = newC;

    // Spread error to neighbouring pixels
    if (i < pixels.length - 1) {
      // Spread error to next pixel
      pixels[i + 1].r += err.r * 4;
      pixels[i + 1].g += err.g * 4;
      pixels[i + 1].b += err.b * 4;
      if (i < pixels.length - 2) {
        // Spread error to next pixel
        pixels[i + 2].r += err.r * 3;
        pixels[i + 2].g += err.g * 3;
        pixels[i + 2].b += err.b * 3;
        // Spread error to lower pixels
        if (i < pixels.length - width - 2) {
          pixels[i + width - 2].r += err.r;
          pixels[i + width - 1].r += err.r * 2;
          pixels[i + width].r += err.r * 3;
          pixels[i + width + 1].r += err.r * 2;
          pixels[i + width + 2].r += err.r;

          pixels[i + width - 2].g += err.g;
          pixels[i + width - 1].g += err.g * 2;
          pixels[i + width].g += err.g * 3;
          pixels[i + width + 1].g += err.g * 2;
          pixels[i + width + 2].g += err.g;

          pixels[i + width - 2].b += err.b;
          pixels[i + width - 1].b += err.b * 2;
          pixels[i + width].b += err.b * 3;
          pixels[i + width + 1].b += err.b * 2;
          pixels[i + width + 2].b += err.b;
        }
      }
    }
    i += 1;
  }
  return pixels;
}

/**
 * Dither the image into a smaller palette
 * Uses Sierra lite matrix
 * Use twoRowSierraDither for more accuracy
 */
export function sierraLite(
  pixels: Color[],
  width: number,
  palette: Color[],
): Color[] {
  let i = pixels.length - 1;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i >= 0) {
    const newC = findClosestColor(pixels[i], palette);
    const err = {
      r: Math.floor((pixels[i].r - newC.r) >> 2),
      g: Math.floor((pixels[i].r - newC.g) >> 2),
      b: Math.floor((pixels[i].r - newC.b) >> 2),
    };

    // Match our quantized palette
    pixels[i] = newC;

    // Spread error to neighbouring pixels
    if (i > 0) {
      // Spread error to next pixel
      if (i % width !== 0) {
        pixels[i - 1].r += err.r << 1;
        pixels[i - 1].g += err.g << 1;
        pixels[i - 1].b += err.b << 1;
      }
      // Spread error to lower pixels
      if (i > width + 1) {
        pixels[i - width + 1].r += err.r;
        pixels[i - width].r += err.r;
        pixels[i - width + 1].g += err.g;
        pixels[i - width].g += err.g;
        pixels[i - width + 1].b += err.b;
        pixels[i - width].b += err.b;
      }
    }
    i -= 1;
  }
  return pixels;
}
