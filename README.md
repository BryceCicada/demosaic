# demosaic
Demosaic raw images with NodeJS.

## Motivation
Mostly just experimentation with demosaic implementations for private purposes.

This code is not intended to support proprietary raw image formats from camera manufacturers.

## Usage
```nodejs
let Demosaic = require('demosaic');

buf = Buffer.allocate(100*100);  // raw pixels;
Demosaic.bilinear({height:100, width:100, data: buf});
```

Currently, the raw pixel data is expected to be 8-bit.  The output is interleaved 8-bit RGB.

## To Do:

 - Support more Bayer CFAs.
 - Some more demosaic algorithms.

## License

MIT
