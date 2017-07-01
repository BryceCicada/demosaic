'use strict';

// Create a mosaiced image to use in tests.  Here, bayer CFA is RGGB.
let mosaic = (rgb, w, h) => {
    let mosaiced = Buffer.alloc(w * h);
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (i % 2 !== j % 2) { // green
                mosaiced[i * w + j] = rgb[i * w * 3 + j * 3 + 1];
            } else if (i % 2 === 0) { // red
                mosaiced[i * w + j] = rgb[i * w * 3 + j * 3];
            } else if (i % 2 === 1) { // blue
                mosaiced[i * w + j] = rgb[i * w * 3 + j * 3 + 2];
            }
        }
    }
    return mosaiced;
};

module.exports = mosaic;