import { Color } from "../deps/color.ts";

import {
  floydSteinbergDither,
  noDither,
  quickDither,
  quickTwoRowDither,
  twoRowSierraDither,
} from "./dither.ts";

export interface DitherOptions {
  method: "floyd_steinberg" | "sierra_2" | "sierra_lite" | "monke";
}

export type BlurType = "box";

export class Image {
  pixels: Color[];
  width: number;
  height: number;
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
  blur(method: BlurType) {
    switch (method) {
      case "box": {
        let i = 0;
        // pixels is an array of pixels with r, g, b values
        // width is the width of the image in pixels
        while (i < (this.pixels.length)) {
          const sumNeighbours = [0, 0, 0];
          let numAdded = 0;

          if (i > this.width + 1) {
            // 1
            sumNeighbours[0] += this.pixels[i - this.width - 1].r;
            sumNeighbours[1] += this.pixels[i - this.width - 1].g;
            sumNeighbours[2] += this.pixels[i - this.width - 1].b;
            numAdded += 1;
          }
          if (i > this.width) {
            // 2
            sumNeighbours[0] += this.pixels[i - this.width].r;
            sumNeighbours[1] += this.pixels[i - this.width].g;
            sumNeighbours[2] += this.pixels[i - this.width].b;

            // 3
            sumNeighbours[0] += this.pixels[i - this.width + 1].r;
            sumNeighbours[1] += this.pixels[i - this.width + 1].g;
            sumNeighbours[2] += this.pixels[i - this.width + 1].b;
            numAdded += 2;
          }

          if (i % this.width > 0) {
            // 4
            sumNeighbours[0] += this.pixels[i - 1].r;
            sumNeighbours[1] += this.pixels[i - 1].g;
            sumNeighbours[2] += this.pixels[i - 1].b;
            numAdded += 1;
          }
          // 5
          sumNeighbours[0] += this.pixels[i].r;
          sumNeighbours[1] += this.pixels[i].g;
          sumNeighbours[2] += this.pixels[i].b;
          numAdded += 1;

          if ((i % this.width) - this.width < -1) {
            // 6
            sumNeighbours[0] += this.pixels[i + 1].r;
            sumNeighbours[1] += this.pixels[i + 1].g;
            sumNeighbours[2] += this.pixels[i + 1].b;
            numAdded += 1;
          }

          if (this.pixels.length - i > this.width) {
            // 7
            sumNeighbours[0] += this.pixels[i + this.width].r;
            sumNeighbours[1] += this.pixels[i + this.width].g;
            sumNeighbours[2] += this.pixels[i + this.width].b;

            // 8
            sumNeighbours[0] += this.pixels[i + this.width - 1].r;
            sumNeighbours[1] += this.pixels[i + this.width - 1].g;
            sumNeighbours[2] += this.pixels[i + this.width - 1].b;
            numAdded += 2;

            if (this.pixels.length - i > this.width + 1) {
              // 9
              sumNeighbours[0] += this.pixels[i + this.width + 1].r;
              sumNeighbours[1] += this.pixels[i + this.width + 1].g;
              sumNeighbours[2] += this.pixels[i + this.width + 1].b;
              numAdded += 1;
            }
          }

          this.pixels[i].r = Math.trunc(sumNeighbours[0] / numAdded);
          this.pixels[i].g = Math.trunc(sumNeighbours[1] / numAdded);
          this.pixels[i].b = Math.trunc(sumNeighbours[2] / numAdded);
          i += 1;
        }
        break;
      }
      default: {
        throw new TypeError(`Unknown blur method ${method}`);
      }
    }
  }
  dither(
    palette: Color[],
    options: DitherOptions = { method: "monke" },
  ) {
    switch (options.method) {
      case "floyd_steinberg": {
        floydSteinbergDither(this.pixels, this.width, palette);
        break;
      }
      case "monke": {
        quickTwoRowDither(this.pixels, this.width, palette);
        break;
      }
      case "sierra_2": {
        twoRowSierraDither(this.pixels, this.width, palette);
        break;
      }
      case "sierra_lite": {
        quickDither(this.pixels, this.width, palette);
        break;
      }
      default: {
        throw new TypeError(`Unknown dithering method: ${options.method}`);
      }
    }
  }
  grayscale(): void {
    let i = 0;
    while (i < this.pixels.length) {
      this.pixels[i] = this.pixels[i].grayscale;
      i += 1;
    }
  }
  invert(): void {
    let i = 0;
    while (i < this.pixels.length) {
      this.pixels[i] = this.pixels[i].invert;
      i += 1;
    }
  }
  recolor(palette: Color[]) {
    noDither(this.pixels, palette);
  }
  toImageData(): { data: Uint8ClampedArray; width: number; height: number } {
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
    return { data, width: this.width, height: this.height };
  }
}
