import { Color } from "../../deps/color.ts";

/** Box blur with r = 3 */
export function boxBlur(image: { pixels: Color[]; width: number }) {
  let i = 0;
  // pixels is an array of pixels with r, g, b values
  // width is the width of the image in pixels
  while (i < (image.pixels.length)) {
    const sumNeighbours = [0, 0, 0];
    let numAdded = 0;

    if (i > image.width + 1) {
      // 1
      sumNeighbours[0] += image.pixels[i - image.width - 1].r;
      sumNeighbours[1] += image.pixels[i - image.width - 1].g;
      sumNeighbours[2] += image.pixels[i - image.width - 1].b;
      numAdded += 1;
    }
    if (i > image.width) {
      // 2
      sumNeighbours[0] += image.pixels[i - image.width].r;
      sumNeighbours[1] += image.pixels[i - image.width].g;
      sumNeighbours[2] += image.pixels[i - image.width].b;

      // 3
      sumNeighbours[0] += image.pixels[i - image.width + 1].r;
      sumNeighbours[1] += image.pixels[i - image.width + 1].g;
      sumNeighbours[2] += image.pixels[i - image.width + 1].b;
      numAdded += 2;
    }

    if (i % image.width > 0) {
      // 4
      sumNeighbours[0] += image.pixels[i - 1].r;
      sumNeighbours[1] += image.pixels[i - 1].g;
      sumNeighbours[2] += image.pixels[i - 1].b;
      numAdded += 1;
    }
    // 5
    sumNeighbours[0] += image.pixels[i].r;
    sumNeighbours[1] += image.pixels[i].g;
    sumNeighbours[2] += image.pixels[i].b;
    numAdded += 1;

    if ((i % image.width) - image.width < -1) {
      // 6
      sumNeighbours[0] += image.pixels[i + 1].r;
      sumNeighbours[1] += image.pixels[i + 1].g;
      sumNeighbours[2] += image.pixels[i + 1].b;
      numAdded += 1;
    }

    if (image.pixels.length - i > image.width) {
      // 7
      sumNeighbours[0] += image.pixels[i + image.width].r;
      sumNeighbours[1] += image.pixels[i + image.width].g;
      sumNeighbours[2] += image.pixels[i + image.width].b;

      // 8
      sumNeighbours[0] += image.pixels[i + image.width - 1].r;
      sumNeighbours[1] += image.pixels[i + image.width - 1].g;
      sumNeighbours[2] += image.pixels[i + image.width - 1].b;
      numAdded += 2;

      if (image.pixels.length - i > image.width + 1) {
        // 9
        sumNeighbours[0] += image.pixels[i + image.width + 1].r;
        sumNeighbours[1] += image.pixels[i + image.width + 1].g;
        sumNeighbours[2] += image.pixels[i + image.width + 1].b;
        numAdded += 1;
      }
    }

    image.pixels[i].r = Math.trunc(sumNeighbours[0] / numAdded);
    image.pixels[i].g = Math.trunc(sumNeighbours[1] / numAdded);
    image.pixels[i].b = Math.trunc(sumNeighbours[2] / numAdded);
    i += 1;
  }
}
