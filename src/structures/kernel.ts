/** A simple square matrix */

export class Kernel {
  size: number;
  data: number[][];
  constructor(size: number, ...values: number[]) {
    if(values.length / size !== size) throw new Error("Kernel must be square.")
    this.size = size;
    this.data = [];
    let i = 0;
    while (i < size) {
      const row: number[] = [];
      let j = 0;
      while (j < size) {
        row[j] = values[i + j];
        j += 1;
      }
      this.data[i] = row;
      i += 1;
    }
  }
}
