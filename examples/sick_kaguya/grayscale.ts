import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const image = await getPixels(`${__dirname}/a.png`);

image.grayscale()

const i = createCanvas(image.width, image.height);

const ctx = i.getContext("2d");

ctx.putImageData(image.toImageData(), 0, 0);

Deno.writeFileSync(`${__dirname}/gray_kaguya.png`, i.toBuffer("image/png"));