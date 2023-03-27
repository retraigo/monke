import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { Color, getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const image = await getPixels(
  `https://avatars.githubusercontent.com/u/112628419?s=200&v=4
`,
);
image.map(({ r, g, b, a }) => {
  return new Color(b, Math.trunc(g / 2), r, a);
});

const i = createCanvas(image.width, image.height);

const ctx = i.getContext("2d");

const data = image.toImageData();

ctx.putImageData(data, 0, 0);

Deno.writeFileSync(`${__dirname}/cool_lala.png`, i.toBuffer("image/png"));
