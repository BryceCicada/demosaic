[![Build Status](https://travis-ci.org/BryceCicada/demosaic.svg?branch=master)](https://travis-ci.org/BryceCicada/demosaic)

# demosaic
Bayer demosaic with NodeJS.

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
  - __bayer__.  String.  Bayer CFA alignment. 'rggb', 'grbg', 'gbrg' or 'bggr'. Default 'rggb'.

### Bayer alignment

The option _bayer_ desribes the orientation of the 4 pixels in the top left corner of the Bayer CFA.

##### Bayer.RGGB

 | R | G |
 | G | B |

##### Bayer.GRBG

 | G | R |
 | B | G |

##### Bayer.GBRG

 | G | B |
 | R | G |

##### Bayer.BGGR

 | B | G |
 | G | R |

### Examples

```nodejs
let Demosaic = require('demosaic');

let raw = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({data: raw, height:100, width:100});  // Default 8-bit depth
```

```nodejs
let Demosaic = require('demosaic');

let raw = Buffer.allocate(100*100);  // raw pixels;
let rgb = Demosaic.bilinear({
    height:100, 
    width:100, 
    data: raw, 
    depth:16, 
    endianness: 'big'
    bayer: Demosaic.Bayer.RGGB
});
```

## To Do

 - Some more demosaic algorithms.

## License

MIT
