import { getPixels, Color } from "../../src/mod.ts";
const __dirname = new URL(".", import.meta.url).pathname;
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";

const methods = [
  "floyd_steinberg",
  "sierra_2",
  "sierra_lite",
  "quick",
  "bidirectional",
];

for (const method of methods) {
  const image = await getPixels(`${__dirname}/a.png`);
  // @ts-ignore please
  image.dither([new Color("#000000"), new Color("#ffffff")], { method: method });
  const i = createCanvas(image.width, image.height);

  const ctx = i.getContext("2d");

  const data = image.toImageData();

  ctx.putImageData(data, 0, 0);

  Deno.writeFileSync(`${__dirname}/${method}.png`, i.toBuffer("image/png"));
}
