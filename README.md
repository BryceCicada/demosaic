# demosaic
Demosaic raw images with NodeJS.

## Motivation
Mostly just experimentation with demosaic implementations for private purposes.

## Usage
```nodejs
let Demosaic = require('demosaic');

buf = Buffer.allocate(100*100);  // raw pixels;
Demosaic.bilinear({height:100, width:100, data: buf});
```

## To Do:

 - Support more Bayer CFAs.
 - Some more demosaic algorithms.

## License

MIT
