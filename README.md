# demosaic
Demosaic raw images with NodeJS.

## Motivation
Mostly just experimentation with demosaic implementations for private purposes.

This code is not intended to support proprietary raw image formats from camera manufacturers.

## Usage
```nodejs
let Demosaic = require('demosaic');

buf = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({height:100, width:100, data: buf});  // Default 8-bit depth
```

Currently, the raw pixel data is expected to have depth in 8-bit multiples, ie 8-bit, 16-bit, etc.  The output is interleaved RGB of the same depth as the input.

```nodejs
let Demosaic = require('demosaic');

buf = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({height:100, width:100, data: buf}, {depth:16});
```

## To Do:

 - Support more Bayer CFAs.
 - Some more demosaic algorithms.

## License

MIT
