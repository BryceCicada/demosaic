let merge = require('lodash.merge');
let Bayer = require('./Bayer');
let util = require('./util');

// Dereference all these functions up front.  Speeds up benchmarks significantly.
let write = util.write;
let p = util.pixel;
let isRed = util.isRed;
let isGreenR = util.isGreenR;
let isGreenB = util.isGreenB;
let isBlue = util.isBlue;

let red = (i, j, b, o) => {
    if (isGreenR(i, j, b)) return Math.round((p(i, j - 1, o) + p(i, j + 1, o)) / 2);
    if (isGreenB(i, j, b)) return Math.round((p(i - 1, j, o) + p(i + 1, j, o)) / 2);
    if (isBlue(i, j, b))
        return Math.round((p(i - 1, j - 1, o) + p(i - 1, j + 1, o) + p(i + 1, j - 1, o) + p(i + 1, j + 1, o)) / 4);
    return p(i, j, o);
};

let green = (i, j, b, o) => {
    if (isRed(i, j, b) || isBlue(i, j, b))
        return Math.round((p(i, j - 1, o) + p(i, j + 1, o) + p(i - 1, j, o) + p(i + 1, j, o)) / 4);
    return p(i, j, o);
};

let blue = (i, j, b, o) => {
    if (isRed(i, j, b))
        return Math.round((p(i - 1, j - 1, o) + p(i - 1, j + 1, o) + p(i + 1, j - 1, o) + p(i + 1, j + 1, o)) / 4);
    if (isGreenR(i, j, b)) return Math.round((p(i - 1, j, o) + p(i + 1, j, o)) / 2);
    if (isGreenB(i, j, b)) return Math.round((p(i, j - 1, o) + p(i, j + 1, o)) / 2);
    return p(i, j, o);
};

function bilinear(options) {

    options = merge({depth: 8, endianness: 'big', bayer: Bayer.RGGB}, options);

    let h = options.height;
    let w = options.width;

    let result = Buffer.alloc(h * w * 3 * (options.depth / 8));

    let bayer = options.bayer;

    for (let i = 0; i < h; i++) {
        let l = i * w * 3;
        for (let j = 0; j < w; j++) {
            let k = l + j * 3;
            write(red(i, j, bayer, options), k, options, result);
            write(green(i, j, bayer, options), k + 1, options, result);
            write(blue(i, j, bayer, options), k + 2, options, result);
        }
    }

    return result;
}

module.exports = bilinear;
