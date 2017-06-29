[![Build Status](https://travis-ci.org/BryceCicada/demosaic.svg?branch=master)](https://travis-ci.org/BryceCicada/demosaic)

# demosaic
Demosaic raw images with NodeJS.

## Motivation
Mostly just experimentation with demosaic implementations for private purposes.

This code is not intended to support proprietary raw image formats from camera manufacturers.

## Usage
```Demosaic.bilinear(args)```

Where args is:
  - __data__.  Buffer. Raw pixel data. Required.
  - __width__.  Number. Width of image. Required.
  - __height__.  Number. Height of image. Required.
  - __depth__.  Number.  Number of bits per pixel.  8 or 16.  Default 8.
  - __endianness__.  String.  Endianness of pixel data when depth is 16. 'big' or 'little'.  Default 'big'.

### Examples

```nodejs
let Demosaic = require('demosaic');

let buf = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({height:100, width:100, data: buf});  // Default 8-bit depth
```

```nodejs
let Demosaic = require('demosaic');

let buf = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({height:100, width:100, data: buf, depth:16, endianness: 'big'});
```

## To Do

 - Support more Bayer CFAs.
 - Some more demosaic algorithms.

## License

MIT
