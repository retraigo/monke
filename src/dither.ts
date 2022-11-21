// USES Floyd–Steinberg Dithering algorithm

import { Color, meanDistance } from "./mod.ts";

/** Dither the image into monochrome */
export function monochromeDither(pixels: Color[], width: number): Color[] {
  let i = 0;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i < (pixels.length)) {
    // We shall use "black" and "white" as our quantized palette
    const newR = pixels[i].r < 129 ? 0 : 255;
    const errR = Math.floor((pixels[i].r - newR) / 16);

    // Match our quantized palette
    pixels[i].r = newR;

    if (i < pixels.length - 1) {
      // Spread error to next pixel
      pixels[i + 1].r += errR * 7;
      // Spread error to lower pixels
      if (i < pixels.length - width - 1) {
        pixels[i + width - 1].r += errR * 3;
        pixels[i + width].r += errR * 5;
        pixels[i + width + 1].r += errR * 1;
      }
    }

    // Convert our color to black or white completely
    pixels[i].b = pixels[i].g = pixels[i].r;
    i += 1;
  }
  return pixels;
}

function findClosestColor(color: Color, palette: Color[]): Color {
  const closest = {
    dist: Infinity,
    i: 0,
  };
  let i = 0;
  while (i < palette.length) {
    const m = meanDistance(palette[i], color);
    if (m < closest.dist) {
      closest.dist = m;
      closest.i = i;
    }
    i += 1;
  }
  return palette[closest.i];
}

/** Dither the image into a smaller palette */
export function dither(
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
      pixels[i + 1].r += err.r * 7;
      pixels[i + 1].g += err.g * 7;
      pixels[i + 1].b += err.b * 7;
      // Spread error to lower pixels
      if (i < pixels.length - width - 1) {
        pixels[i + width - 1].r += err.r * 3;
        pixels[i + width].r += err.r * 5;
        pixels[i + width + 1].r += err.r * 1;
        pixels[i + width - 1].g += err.g * 3;
        pixels[i + width].g += err.g * 5;
        pixels[i + width + 1].g += err.g * 1;
        pixels[i + width - 1].b += err.b * 3;
        pixels[i + width].b += err.b * 5;
        pixels[i + width + 1].b += err.b * 1;
      }
    }
    i += 1;
  }
  return pixels;
}

/** Recolor the image without dithering */
export function noDither(
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
