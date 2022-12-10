import {
  contentType,
  parseMediaType,
} from "https://deno.land/std@0.163.0/media_types/mod.ts";

import {
  createCanvas,
  loadImage,
} from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { Color } from "../deps/color.ts";

export async function getPixels(path: string) {
  const data = /https?:\/\/.+/.test(path)
    ? await getImageFromWeb(path)
    : await getImageFromLocal(path);
  const image = await loadImage(data.data);

  const canvas = createCanvas(image.width(), image.height());

  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colors: Color[] = new Array(d.length / 4);
  let i = 0;

  while (i < d.length) {
    colors[i / 4] = new Color(
      d[i],
      d[i + 1],
      d[i + 2],
      d[i + 3],
    );
    i += 4;
  }
  return { pixels: colors, width: canvas.width };
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
