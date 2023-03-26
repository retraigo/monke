import { Color, meanDistance } from "../../deps/color.ts";

export function findClosestColor(color: Color, palette: Color[]): Color {
  const closest = {
    dist: Infinity,
    i: 0,
  };
  let i = 0;
  while (i < palette.length) {
    const m = meanDistance(color, palette[i]);
    if (m < closest.dist) {
      closest.dist = m;
      closest.i = i;
    }
    i += 1;
  }
  return palette[closest.i];
}
