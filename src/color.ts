import { getPixels } from "./pixels.ts";

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(hex: string);
  constructor(r: number, g: number, b: number, a: number);
  constructor(rOrHex: number | string, g?: number, b?: number, a = 255) {
    let red = 0, green = 0, blue = 0, alpha = 1;
    if (typeof rOrHex === "string") {
      if (!/^#([A-Fa-f0-9]{3}){1,2}[A-Fa-f0-9]{2}?$/.test(rOrHex)) {
        throw new TypeError(`Expected number or hex code. Got ${rOrHex}`);
      }
      let colors = rOrHex.slice(1).split("");
      if (colors.length === 3) {
        colors = [
          colors[0],
          colors[0],
          colors[1],
          colors[1],
          colors[2],
          colors[2],
        ];
      }
      red = parseInt(`${colors[0]}${colors[1]}`, 16) || 0;
      green = parseInt(`${colors[2]}${colors[3]}`, 16) || 0;
      blue = parseInt(`${colors[4]}${colors[5]}`, 16) || 0;
      if (colors[6] && colors[7]) {
        blue = parseInt(`${colors[6]}${colors[7]}`, 16) ?? 255;
      }
    } else {
      red = rOrHex || 0;
      green = g || 0;
      blue = b || 0;
      alpha = a ?? 255;
    }
    this.r = red;
    this.g = green;
    this.b = blue;
    this.a = alpha;
  }
  /** Get the average of all colors */
  get average() {
    return (this.r + this.g + this.b) / 3;
  }
  /** Calculate chroma */
  get chroma() {
    return this.max - this.min;
  }
  /**
   * Convert to grayscale using luminosity
   */
  get grayscale(): Color {
    // Can alternatively be done using
    // this.lightness and this.average
    const l = this.luminosity * 255;
    return new Color(l, l, l, this.a);
  }
  get hex() {
    return `#${Color.toHex(this.r)}${Color.toHex(this.g)}${
      Color.toHex(this.b)
    }${Color.toHex(this.a * 255)}`;
  }
  /** Calculate hue using chroma */
  get hue() {
    const max = this.max;
    const c = this.chroma;
    // No color
    if (!c) return 0;
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    return (max === r
      ? (g - b) / c
      : max === g
      ? ((b - r) / c) + 2
      : ((r - g) / c) + 4) / 6;
  }
  /**
   * Get lightness of image. Can also be used instead of `grayscale` using
   * ```ts
   * const color = new Color(r, g, b, a);
   * const l = color.lightness;
   * const grayscaleColor = new Color(l, l, l, a);
   * ```
   */
  get lightness() {
    return (this.max + this.min) / 2;
  }
  /** Calculate luminosity */
  get luminosity(): number {
    return (((this.r * 0.21) + (this.g * 0.72) + (this.b * 0.07)) / 3) / 255;
  }
  get max(): number {
    return Math.max(this.r / 255, this.g / 255, this.b / 255);
  }
  get min(): number {
    return Math.min(this.r / 255, this.g / 255, this.b / 255);
  }
  get saturation() {
    const c = this.chroma;
    const l = this.lightness;
    // No color
    if (!c) return 0;
    return this.max / (l < 0.5 ? 1 - l : l);
  }
  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a / 255})`;
  }
  static toHex(n: number): string {
    return `${(n | 1 << 8).toString(16).slice(1)}`;
  }
}

export async function getProminentColor(path: string, extractCount: number) {
  const { pixels: colors } = await getPixels(path);
  return reducePalette(colors, extractCount);
}

export function meanDistance(from: Color, to: Color): number {
  return (
    (
      Math.abs(from.r - to.r) +
      Math.abs(from.g - to.g) +
      Math.abs(from.b - to.b) +
      Math.abs(from.a - to.a)
    ) / 255
  ) / 4;
}

export function reducePalette(colors: Color[], extractCount: number): Color[] {
  if (!colors.length) {
    throw new RangeError("There must be at least one color in the palette.");
  }
  if (extractCount < 1) {
    throw new RangeError("Cannot extract less than one color.");
  }
  return colors;
}

export class ColorHistogram {
  #data: Uint32Array;
  constructor() {
    this.#data = new Uint32Array(32768);
  }
  #getIndex(hex: string) {
    const data = new Color(hex);
    // ignore alpha
    const index = (data.r << (10)) + (data.g << 5) + data.b;
    return index;
  }
  get(hex: string): number {
    const index = this.#getIndex(hex);
    return this.#data[index];
  }
  add(hex: string, amount: number): number {
    const index = this.#getIndex(hex);
    return Atomics.add(this.#data, index, amount);
  }
  get raw(): Uint32Array {
    return this.#data;
  }
}

export interface ColorRange {
  r: { min: number; max: number };
  g: { min: number; max: number };
  b: { min: number; max: number };
}

/** Get the minimum and maximum RGB values. */
export function getColorRange(
  colors: Color[],
): ColorRange {
  const range = {
    r: { min: 255, max: 0 },
    g: { min: 255, max: 0 },
    b: { min: 255, max: 0 },
  };
  let i = 0;
  while (i < colors.length) {
    if (colors[i].r < range.r.min) range.r.min = colors[i].r;
    if (colors[i].r > range.r.max) range.r.max = colors[i].r;

    if (colors[i].g < range.g.min) range.g.min = colors[i].g;
    if (colors[i].g > range.g.max) range.g.max = colors[i].g;

    if (colors[i].b < range.b.min) range.b.min = colors[i].b;
    if (colors[i].b > range.b.max) range.b.max = colors[i].b;

    i += 1;
  }
  return range;
}

/** Get a histogram of frequency of colors. */
export function getHistogram(colors: Color[]): ColorHistogram {
  const histo = new ColorHistogram();
  let i = 0;
  while (i < colors.length) {
    const hIndex = colors[i].hex;
    histo.add(hIndex, 1);
    i += 1;
  }
  return histo;
}

// USES Floyd–Steinberg Dithering algorithm
// Only supports monochrome dither for now.

/** Dither the colors */
export function monochromeDither(pixels: Color[], width: number): Color[] {
  let i = 0;
  while (i < (pixels.length - width - 1)) {
    // optional: produce an eldtritch horror by making the image grayscale
    //    const avg = (pixels[i].r + pixels[i].g + pixels[i].b) / 3
    //    pixels[i].b = pixels[i].g = pixels[i].r = avg;

    // Gray
    const newR = pixels[i].r < 129 ? 0 : 255;

    const errR = Math.floor((pixels[i].r - newR) / 16);

    pixels[i].r = newR;

    pixels[i + 1].r += errR * 7;
    pixels[i + width - 1].r += errR * 3;
    pixels[i + width].r += errR * 5;
    pixels[i + width + 1].r += errR * 1;

    pixels[i].b = pixels[i].g = pixels[i].r;

    //    console.log(pixels[i + 1].r)

    i += 1;
  }
  return pixels;
}
