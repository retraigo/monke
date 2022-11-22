import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { Color, getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const pixels = await getPixels(`${__dirname}/a.png`);

const newImg = pixels.pixels.map(x => {
  const r = x.r;
  const g = x.g;
  const b = x.b;
  const c = new Color(Math.trunc(Math.pow(b, 1.5) / b) % 256, Math.trunc(g * 1.1010101010101) % 256, Math.trunc(r * 1.0101010101) % 256, x.a)
  return c
})

const i = createCanvas(pixels.width, pixels.pixels.length / pixels.width);

const ctx = i.getContext("2d");

const res = Uint8ClampedArray.from(
  newImg.map(x => [x.r, x.g, x.b, x.a]).flat(),
);
ctx.putImageData({ data: res, width: i.width, height: i.height }, 0, 0);

Deno.writeFileSync(`${__dirname}/cool_kaguya.png`, i.toBuffer("image/png"));