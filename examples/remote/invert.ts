import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const pixels = await getPixels(
  `https://avatars.githubusercontent.com/u/112628419?s=200&v=4
`,
);

const newImg = pixels.pixels.map((x) => x.invert);

const i = createCanvas(pixels.width, pixels.pixels.length / pixels.width);

const ctx = i.getContext("2d");

const res = Uint8ClampedArray.from(
  newImg.map((x) => [x.r, x.g, x.b, x.a]).flat(),
);
ctx.putImageData({ data: res, width: i.width, height: i.height }, 0, 0);

Deno.writeFileSync(`${__dirname}/evil_lala.png`, i.toBuffer("image/png"));
