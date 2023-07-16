import { Color } from "../../deps/color.ts";
import { boxBlur } from "../blur/mod.ts";
import { recolor } from "../util/recolor.ts";

import {
  bidirectional,
  floydSteinberg,
  monochromeFs,
  monochromeQ,
  quick2,
  sierra2,
  sierraLite,
} from "../dither/mod.ts";

export interface DitherOptions {
  method:
    | "floyd_steinberg"
    | "sierra_2"
    | "sierra_lite"
    | "quick"
    | "bidirectional";
}

export type BlurType = "box";

export interface ImageData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  channels: number; // always 4, for compat with retraigo/vectorizer
  colorSpace: "srgb" | "display-p3";
}

/**
 * Image with width, height, and pixel data
 * All methods mutate the image itself
 */
export class Image implements ImageData {
  pixels: Color[];
  width: number;
  height: number;
  /** Canvas ImageData always returns RGBA values */
  channels = 4; 
  /** We are only gonna work with sRGB images */
  colorSpace: "srgb" = "srgb";
  constructor(pixels: Uint8ClampedArray, width: number, height?: number) {
    if (!height) height = pixels.length / width;
    if (width !== Math.trunc(width) || width <= 0) {
      throw new TypeError("Width must be a natural number.");
    }
    if (height !== Math.trunc(height) || height <= 0) {
      throw new TypeError("Height must be a natural number.");
    }
    this.width = width;
    this.height = height;
    this.pixels = new Array(pixels.length / 4);
    let i = 0;

    while (i < pixels.length) {
      this.pixels[i / 4] = new Color(
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
        pixels[i + 3],
      );
      i += 4;
    }
  }
  /** Blur the image. Currently only supports box blur. */
  blur(method: BlurType) {
    switch (method) {
      case "box": {
        boxBlur(this);
        break;
      }
      default: {
        throw new TypeError(`Unknown blur method ${method}`);
      }
    }
  }
  /** Recolor the image with dithering */
  dither(
    palette: Color[],
    options: DitherOptions = { method: "quick" },
  ) {
    switch (options.method) {
      case "floyd_steinberg": {
        floydSteinberg(this.pixels, this.width, palette);
        break;
      }
      case "quick": {
        quick2(this.pixels, this.width, palette);
        break;
      }
      case "sierra_2": {
        sierra2(this.pixels, this.width, palette);
        break;
      }
      case "sierra_lite": {
        sierraLite(this.pixels, this.width, palette);
        break;
      }
      case "bidirectional": {
        bidirectional(this.pixels, this.width, palette);
        break;
      }
      default: {
        throw new TypeError(`Unknown dithering method: ${options.method}`);
      }
    }
  }
  /** Make the image grayscale */
  grayscale(): void {
    let i = 0;
    while (i < this.pixels.length) {
      this.pixels[i] = this.pixels[i].grayscale;
      i += 1;
    }
  }
  /** Invert colors in the image */
  invert(): void {
    let i = 0;
    while (i < this.pixels.length) {
      this.pixels[i] = this.pixels[i].invert;
      i += 1;
    }
  }
  /** Apply a function on every pixel in the image */
  map(fn: (c: Color) => Color): void {
    let i = 0;
    while (i < this.pixels.length) {
      this.pixels[i] = fn(this.pixels[i]);
      i += 1;
    }
  }
  /** Recolor the image using just black and white */
  monochrome(
    dither = false,
    ditherMode: "floyd_steinberg" | "quick" = "floyd_steinberg",
  ): void {
    if (dither) {
      ditherMode === "floyd_steinberg"
        ? monochromeFs(this.pixels, this.width)
        : monochromeQ(this.pixels, this.width);
    } else this.recolor([new Color("#000000"), new Color("#ffffff")]);
  }
  /** Recolor the image without dithering */
  recolor(palette: Color[]) {
    recolor(this.pixels, palette);
  }
  /** Convert to an ImageData object */
  toImageData(): ImageData {
    return {
      data: this.data,
      width: this.width,
      height: this.height,
      channels: this.channels,
      colorSpace: this.colorSpace,
    };
  }
  /** Get a Uint8ClampedArray with RGBA values */
  get data(): Uint8ClampedArray {
    const data = new Uint8ClampedArray(this.pixels.length * 4);
    let i = 0;

    while (i < data.length) {
      const c = this.pixels[i / 4];
      data[i] = c.r;
      data[i + 1] = c.g;
      data[i + 2] = c.b;
      data[i + 3] = c.a;
      i += 4;
    }
    return data;
  }
}
