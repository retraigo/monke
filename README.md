# monke

A very WIP color module in TypeScript.

Supports dithering through error diffusion method.
- `dither` method to redraw the image with reduced colors, with dithering.
- `noDither` method to redraw the image with reduced colors, without dithering.
- `monochromeDither` method to redraw the image with just black and white, with dithering.

Supports color quantization through popularity method.
- TODO: Implement median cut or octrees.

Provides a class `Color` for general color-related stuff.

Refer the `examples` directory for usage.