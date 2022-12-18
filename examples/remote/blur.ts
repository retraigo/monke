import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const image = await getPixels(
  `https://avatars.githubusercontent.com/u/112628419?s=200&v=4
`,
);

image.blur("box")
image.blur("box")
image.blur("box")
image.blur("box")
image.blur("box")

const i = createCanvas(image.width, image.height);

const ctx = i.getContext("2d");

ctx.putImageData(image.toImageData(), 0, 0);

Deno.writeFileSync(`${__dirname}/blur_lala.png`, i.toBuffer("image/png"));
