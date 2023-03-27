import { Color } from "../../deps/color.ts";
import { findClosestColor } from "../util/closest.ts";

/**
 * Dither the image into a smaller palette
 * Uses a quick, two-row dither
 * Use twoRowSierraDither for more accuracy
 */
export function quick2(
  pixels: Color[],
  width: number,
  palette: Color[],
): Color[] {
  let i = pixels.length - 1;
  const twoW = width << 2;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i >= 0) {
    const newC = findClosestColor(pixels[i], palette);
    const err = {
      r: Math.floor((pixels[i].r - newC.r) / 16),
      g: Math.floor((pixels[i].r - newC.g) / 16),
      b: Math.floor((pixels[i].r - newC.b) / 16),
    };

    // Match our quantized palette
    pixels[i] = newC;

    // Spread error to neighbouring pixels
    if (i >= 1) {
      // Spread error to next pixel
      pixels[i - 1].r += err.r * 4;
      pixels[i - 1].g += err.g * 4;
      pixels[i - 1].b += err.b * 4;
      if (i >= 2) {
        // Spread error to next pixel
        pixels[i - 2].r += err.r * 2;
        pixels[i - 2].g += err.g * 2;
        pixels[i - 2].b += err.b * 2;
        // Spread error to lower pixels
        const k = i - width;
        if (k >= 2) {
          const k = i - width;
          pixels[k - 2].r += err.r;
          pixels[k - 1].r += err.r * 2;
          pixels[k].r += err.r * 2;
          pixels[k + 1].r += err.r * 2;
          pixels[k + 2].r += err.r;

          pixels[k - 2].g += err.g;
          pixels[k - 1].g += err.g * 2;
          pixels[k].g += err.g * 2;
          pixels[k + 1].g += err.g * 2;
          pixels[k + 2].g += err.g;

          pixels[k - 2].b += err.b;
          pixels[k - 1].b += err.b * 2;
          pixels[k].b += err.b * 2;
          pixels[k + 1].b += err.b * 2;
          pixels[k + 2].b += err.b;

          if (i >= twoW + 1) {
            pixels[i - twoW + 1].r += err.r * 2;
            pixels[i - twoW + 1].g += err.g * 2;
            pixels[i - twoW + 1].b += err.b * 2;
          }
        }
      }
    }
    i -= 1;
  }
  return pixels;
}

/**
 * Dither the image into a smaller palette
 * Starts from the mid point of the image
 * I have no idea why I did this
 */
export function bidirectional(
  pixels: Color[],
  width: number,
  palette: Color[],
): Color[] {
  const mid = Math.trunc(pixels.length / 2);
  let i = mid;
  let j = mid + 1;
  while (j < (pixels.length)) {
    const newC = findClosestColor(pixels[j], palette);
    const err = {
      r: Math.floor((pixels[j].r - newC.r) / 16),
      g: Math.floor((pixels[j].r - newC.g) / 16),
      b: Math.floor((pixels[j].r - newC.b) / 16),
    };

    // Match our quantized palette
    pixels[j] = newC;

    // Spread error to neighbouring pixels
    if (j < pixels.length - 1) {
      // Spread error to next pixel
      pixels[j + 1].r += err.r * 4;
      pixels[j + 1].g += err.g * 4;
      pixels[j + 1].b += err.b * 4;
      if (j < pixels.length - 2) {
        // Spread error to next pixel
        pixels[j + 2].r += err.r * 2;
        pixels[j + 2].g += err.g * 2;
        pixels[j + 2].b += err.b * 2;
        // Spread error to lower pixels
        if (j < pixels.length - width - 2) {
          pixels[j + width - 2].r += err.r;
          pixels[j + width - 1].r += err.r * 2;
          pixels[j + width].r += err.r * 4;
          pixels[j + width + 1].r += err.r * 2;
          pixels[j + width + 2].r += err.r;

          pixels[j + width - 2].g += err.g;
          pixels[j + width - 1].g += err.g * 2;
          pixels[j + width].g += err.g * 4;
          pixels[j + width + 1].g += err.g * 2;
          pixels[j + width + 2].g += err.g;
          pixels[j + width - 2].b += err.b;
          pixels[j + width - 1].b += err.b * 2;
          pixels[j + width].b += err.b * 4;
          pixels[j + width + 1].b += err.b * 2;
          pixels[j + width + 2].b += err.b;
        }
      }
    }
    j += 1;
  }
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i > 0) {
    const newC = findClosestColor(pixels[i], palette);
    const err = {
      r: Math.floor((pixels[i].r - newC.r) / 16),
      g: Math.floor((pixels[i].r - newC.g) / 16),
      b: Math.floor((pixels[i].r - newC.b) / 16),
    };

    // Match our quantized palette
    pixels[i] = newC;

    // Spread error to neighbouring pixels
    if (i >= 1) {
      // Spread error to next pixel
      pixels[i - 1].r += err.r * 4;
      pixels[i - 1].g += err.g * 4;
      pixels[i - 1].b += err.b * 4;
      if (i >= 2) {
        // Spread error to next pixel
        pixels[i - 2].r += err.r * 3;
        pixels[i - 2].g += err.g * 3;
        pixels[i - 2].b += err.b * 3;
        // Spread error to lower pixels
        if (i >= width + 2) {
          pixels[i - width - 2].r += err.r;
          pixels[i - width - 1].r += err.r * 2;
          pixels[i - width].r += err.r * 3;
          pixels[i - width + 1].r += err.r * 2;
          pixels[i - width + 2].r += err.r;

          pixels[i - width - 2].g += err.g;
          pixels[i - width - 1].g += err.g * 2;
          pixels[i - width].g += err.g * 3;
          pixels[i - width + 1].g += err.g * 2;
          pixels[i - width + 2].g += err.g;

          pixels[i - width - 2].b += err.b;
          pixels[i - width - 1].b += err.b * 2;
          pixels[i - width].b += err.b * 3;
          pixels[i - width + 1].b += err.b * 2;
          pixels[i - width + 2].b += err.b;
        }
      }
    }
    i -= 1;
  }
  return pixels;
}

/**
 * Dither the image into monochrome
 * Uses the same matrix as above
 */
export function monochromeQ(pixels: Color[], width: number): Color[] {
  let i = pixels.length - 1;
  const twoW = width << 2;

  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i >= 0) {
    // We shall use "black" and "white" as our quantized palette
    const newR = pixels[i].r < 129 ? 0 : 255;
    const err = { r: Math.floor((pixels[i].r - newR) / 16) };

    // Match our quantized palette
    pixels[i].r = newR;

    // Spread error to neighbouring pixels
    if (i >= 1) {
      // Spread error to next pixel
      pixels[i - 1].r += err.r * 4;
      if (i >= 2) {
        // Spread error to next pixel
        pixels[i - 2].r += err.r * 2;
        // Spread error to lower pixels
        const k = i - width;
        if (k >= 2) {
          const k = i - width;
          pixels[k - 2].r += err.r;
          pixels[k - 1].r += err.r * 2;
          pixels[k].r += err.r * 2;
          pixels[k + 1].r += err.r * 2;
          pixels[k + 2].r += err.r;

          if (i >= twoW + 1) {
            pixels[i - twoW + 1].r += err.r * 2;
          }
        }
      }
    }

    // Convert our color to black or white completely
    pixels[i].b = pixels[i].g = pixels[i].r;
    i -= 1;
  }
  return pixels;
}
