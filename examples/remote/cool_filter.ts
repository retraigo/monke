import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { Color, getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const pixels = await getPixels(
  `https://avatars.githubusercontent.com/u/112628419?s=200&v=4
`,
);
const newImg = pixels.pixels.map(x => {
  const r = x.r;
  const g = x.g;
  const b = x.b;
  return new Color(b, Math.trunc(g / 2), r, x.a)
})

const i = createCanvas(pixels.width, pixels.pixels.length / pixels.width);

const ctx = i.getContext("2d");

const res = Uint8ClampedArray.from(
  newImg.map(x => [x.r, x.g, x.b, x.a]).flat(),
);
ctx.putImageData({ data: res, width: i.width, height: i.height }, 0, 0);

Deno.writeFileSync(`${__dirname}/cool_lala.png`, i.toBuffer("image/png"));