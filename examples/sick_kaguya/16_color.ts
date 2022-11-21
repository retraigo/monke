import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { getPixels, reducePalette, dither } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const pixels = await getPixels(`${__dirname}/a.png`);

const palette = reducePalette(pixels.pixels, 16)

const newImg = dither(pixels.pixels, pixels.width, palette);

const i = createCanvas(pixels.width, pixels.pixels.length / pixels.width);

const ctx = i.getContext("2d");

const res = Uint8ClampedArray.from(
  newImg.map(x => [x.r, x.g, x.b, x.a]).flat(),
);
ctx.putImageData({ data: res, width: i.width, height: i.height }, 0, 0);

Deno.writeFileSync(`${__dirname}/16_color_kaguya.png`, i.toBuffer("image/png"));