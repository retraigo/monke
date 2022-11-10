import {
  contentType,
  parseMediaType,
} from "https://deno.land/std@0.163.0/media_types/mod.ts";
import {
  createCanvas,
  Image,
} from "https://deno.land/x/skia_canvas@0.2.0/mod.ts";
import { Color } from "./mod.ts";

export async function getPixels(path: string) {
  const data = /https?:\/\/.+/.test(path)
    ? await getImageFromWeb(path)
    : await getImageFromLocal(path);
  const image = new Image(data.data);

  const canvas = createCanvas(image.width, image.height);

  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const d = canvas.pixels;
  const colors = [];
  let i = 0;

  while (i < d.length) {
    colors.push(new Color(d[i], d[i + 1], d[i + 2], d[i + 3] / 255));
    i += 4;
  }
  return colors;
}

async function getImageFromWeb(path: string) {
  const res = await fetch(path);
  if (res.ok) {
    const data = new Uint8Array(await res.arrayBuffer());
    const mediaType = parseMediaType(res.headers.get("content-type") ?? "")[0];
    return {
      data,
      mediaType,
    };
  } else throw new Error("Unable to load image.");
}

async function getImageFromLocal(path: string) {
  try {
    const data = await Deno.readFile(path);
    const mediaType = contentType(
      path.split(".").reverse()[0],
    );
    return {
      data,
      mediaType,
    };
  } catch (_e) {
    throw new Error("Unable to load image.");
  }
}
