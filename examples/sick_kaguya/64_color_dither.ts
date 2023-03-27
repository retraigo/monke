import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { getPixels, quantizeByMedianCut } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const image = await getPixels(`${__dirname}/a.png`);

image.dither(quantizeByMedianCut(image.pixels, 64));

const i = createCanvas(image.width, image.height);

const ctx = i.getContext("2d");

const data = image.toImageData();

ctx.putImageData(data, 0, 0);

Deno.writeFileSync(`${__dirname}/64_color_dithered_kaguya.png`, i.toBuffer("image/png"));