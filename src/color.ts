export interface ColorData {
  /** RGBA */
  rgba: [number, number, number, number];
  /** Hue,  Saturation, Lightness */
  hsl: [number, number, number];
  /** Hue,  Saturation, Value */
  hsv: [number, number, number];
  /** Cyan, Magenta, Yellow, Black */
  cmyk: [number, number, number, number];
  /** Chroma */
  c: number;
  /** Luminosity */
  lum: number;
  /** Hexadecimal representation of the color */
  hex: string;
}

/** General class for RGBA colors */
export class Color {
  /** Red value of color */
  r: number;
  /** Green value of color */
  g: number;
  /** Blue value of color */
  b: number;
  /** Alpha (opacity) of color */
  a: number;
  /** Construct a color from hex code */
  constructor(hex: string);
  /** Construct a color from rgba values */
  constructor(r: number, g: number, b: number, a?: number);
  constructor(rOrHex: number | string, g?: number, b?: number, a = 255) {
    let red = 0, green = 0, blue = 0, alpha = 255;
    if (typeof rOrHex === "string") {
      if (!/^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/.test(rOrHex)) {
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
      // Convert hexadecimal to decimal
      red = parseInt(`${colors[0]}${colors[1]}`, 16) || 0;
      green = parseInt(`${colors[2]}${colors[3]}`, 16) || 0;
      blue = parseInt(`${colors[4]}${colors[5]}`, 16) || 0;
      if (colors[6] && colors[7]) {
        alpha = parseInt(`${colors[6]}${colors[7]}`, 16) ?? 255;
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
  /** Get the average of all colors
   * Can also be used instead of `grayscale` using
   * ```ts
   * const color = new Color(r, g, b, a);
   * const avg = color.average;
   * const grayscaleColor = new Color(avg, avg, avg, a);
   * ```
   */
  get average() {
    return Math.trunc((this.r + this.g + this.b) / 3);
  }
  /** Calculate chroma */
  get chroma() {
    return (this.max - this.min);
  }
  /**
   * Convert to grayscale using luminosity
   */
  get grayscale(): Color {
    // Can alternatively be done using
    // this.lightness and this.average
    const l = Math.trunc(this.luminosity * 255);
    return new Color(l, l, l, this.a);
  }
  get hex() {
    return `#${Color.toHex(this.r)}${Color.toHex(this.g)}${
      Color.toHex(this.b)
    }${Color.toHex(this.a)}`;
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
    const hue =
      (max === r
        ? (g - b) / c
        : max === g
        ? ((b - r) / c) + 2
        : ((r - g) / c) + 4);
    if (hue < 0) return (hue * 60) + 360;
    return hue * 60;
  }
  /**
   * Get lightness of image. Can also be used instead of `grayscale` using
   * ```ts
   * const color = new Color(r, g, b, a);
   * const l = color.lightness * 255;
   * const grayscaleColor = new Color(l, l, l, a);
   * ```
   */
  get lightness() {
    return ((this.max + this.min) / 2);
  }
  /** Calculate luminosity */
  get luminosity(): number {
    return (((this.r * 0.21) + (this.g * 0.72) + (this.b * 0.07)) / 3) / 255;
  }
  /** Get maximum of r, g, b */
  get max(): number {
    return Math.max(this.r, this.g, this.b) / 255;
  }
  /** Get minimum of r, g, b */
  get min(): number {
    return Math.min(this.r, this.g, this.b) / 255;
  }
  /** Get saturation */
  get saturation() {
    const c = this.chroma;
    const l = this.lightness;
    // No color
    if (!c) return 0;
    return (this.max - l) / Math.min(l, 1 - l);
  }
  /** Get a detailed conversion of the color. */
  toJSON(): ColorData {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const k = 1 - Math.max(r, g, b);
    const max = this.max;

    const l = this.lightness;
    const s = this.saturation;
    const v = (l + (s * Math.min(l, 1 - l)));
    return {
      rgba: [this.r, this.g, this.b, this.a],
      hsl: [
        Math.round(this.hue),
        Math.round(s * 100),
        Math.round(this.lightness * 100),
      ],
      hsv: [
        Math.round(this.hue),
        !v ? 0 : Math.round((2 * (1 - (l / v))) * 100),
        Math.round(v * 100),
      ],
      c: Math.round(this.chroma * 100),
      lum: Math.round(this.luminosity * 100),
      cmyk: [
        Math.round(((1 - r - k) / max) * 100),
        Math.round(((1 - g - k) / max) * 100),
        Math.round(((1 - b - k) / max) * 100),
        Math.round(k * 100),
      ],
      hex: this.a === 255 ? this.hex.slice(0, 7) : this.hex,
    };
  }
  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a / 255})`;
  }
  static toHex(n: number): string {
    return `${(n | 1 << 8).toString(16).slice(1)}`;
  }
}

/** Calculate mean distance between two colors */
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
