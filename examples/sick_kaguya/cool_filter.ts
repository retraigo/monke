import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { Color, getPixels } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

const image = await getPixels(`${__dirname}/a.png`);

// image.map((c) => new Color(c.b, Math.trunc(c.g / 2), c.r, c.a));
image.map(({ r, g, b, a }) =>
  new Color(
    Math.trunc(Math.pow(b, 1.5) / b) % 256,
    Math.trunc(g * 1.1010101010101) % 256,
    Math.trunc(r * 1.0101010101) % 256,
    a,
  )
);

const i = createCanvas(image.width, image.height);

const ctx = i.getContext("2d");

const data = image.toImageData();

ctx.putImageData(data, 0, 0);

Deno.writeFileSync(`${__dirname}/cool_kaguya.png`, i.toBuffer("image/png"));
