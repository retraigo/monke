import { Color } from "./color.ts";

/*
const palette = [
  new Color("#e3242b"),
  new Color("#000000"),
  new Color("#ffffff")
]*/

export function dither(pixels: Color[], width: number): Color[] {
  let i = 0;
  while (i < (pixels.length - width - 1)) {
    // optional: produce an eldtritch horror by making the image grayscale
    //    const avg = (pixels[i].r + pixels[i].g + pixels[i].b) / 3
    //    pixels[i].b = pixels[i].g = pixels[i].r = avg;

    // Gray
    const newR = pixels[i].r < 129 ? 0 : 255;
    //    const newR = palette.sort((a, b) => meanDistance(a, pixels[i]) - meanDistance(b, pixels[i]))[0].r

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
