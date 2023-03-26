/// Uses Modified Median Cut Algorithm
/// TypeScript port of Leptonica
/// http://www.leptonica.org/

import { ColorHistogram, getHistogram } from "../mod.ts";
import { Color } from "../../deps/color.ts";

export function quantizeByPopularity(
  pixels: Color[],
  extractCount: number,
): Color[] {
  const histo = getHistogram(pixels);
  const result: [number, number][] = [];

  histo.raw.forEach((v, i) => {
    if (v) result.push([i, v]);
  });

  result.sort((a, b) => b[1] - a[1]);
  const res = [];
  for (const i of result.slice(0, extractCount)) {
    /*
    const colors = pixels.filter((color) =>
    ((color.r >> 3) << (10)) + ((color.g >> 3) << 5) +
    (color.b >> 3) === i[0]
    );
    console.log(colors)
    */
    // Temporarily use the quantized colors
    res.push(ColorHistogram.getColor(i[0]));
  }
  return res;
}
