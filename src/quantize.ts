import { ColorHistogram, getHistogram, getPixels } from "./mod.ts";
import { Color } from "../deps/color.ts";

export async function getProminentColor(path: string, extractCount: number) {
  const { pixels: colors } = await getPixels(path);
  return reducePalette(colors, extractCount);
}

export function reducePalette(colors: Color[], extractCount: number): Color[] {
  if (!colors.length) {
    throw new RangeError("There must be at least one color in the palette.");
  }
  if (extractCount < 2) {
    throw new RangeError("Cannot extract less than one color.");
  }
  const histo = getHistogram(colors);

  const res = quantizeByPopularity(histo, extractCount);

  return res;
}

export function quantizeByPopularity(
  histo: ColorHistogram,
  extractCount: number,
): Color[] {
  const result: [number, number][] = [];

  histo.raw.forEach((v, i) => {
    if (v) result.push([i, v]);
  });

  result.sort((a, b) => b[1] - a[1]);

  const res = result.map((x) => ColorHistogram.getColor(x[0]));

  return res.slice(0, extractCount);
}

/** The vbox. We use an interface instead of a class. */
export interface ColorRange {
  r: { min: number; max: number };
  g: { min: number; max: number };
  b: { min: number; max: number };
}

/** Get the minimum and maximum RGB values. */
export function getColorRange(
  colors: Color[],
): ColorRange {
  const range = {
    r: { min: 255, max: 0 },
    g: { min: 255, max: 0 },
    b: { min: 255, max: 0 },
  };
  let i = 0;
  while (i < colors.length) {
    if (colors[i].r < range.r.min) range.r.min = colors[i].r;
    if (colors[i].r > range.r.max) range.r.max = colors[i].r;

    if (colors[i].g < range.g.min) range.g.min = colors[i].g;
    if (colors[i].g > range.g.max) range.g.max = colors[i].g;

    if (colors[i].b < range.b.min) range.b.min = colors[i].b;
    if (colors[i].b > range.b.max) range.b.max = colors[i].b;

    i += 1;
  }
  return range;
}
