let merge = require('lodash.merge');

let reflect = (x, p1, p2) => {
    let r;
    if (x >= p1 && x <= p2) {
        r = x;
    } else if (x < p1) {
        r = p1 + Math.abs(p1 - x);
    } else {
        r = p2 - Math.abs(p2 - x);
    }
    return r;
};

let Bayer = {
    RGGB: 'rggb',
    GRBG: 'grbg',
    GBRG: 'gbrg',
    BGGR: 'bggr'
};

let bayerMask = bayer => {
  switch (bayer) {
      case Bayer.RGGB:
          return {
              isRed:    (i,j) => i % 2 === 0 && j % 2 === 0,
              isGreenR: (i,j) => i % 2 === 0 && j % 2 === 1,
              isGreenB: (i,j) => i % 2 === 1 && j % 2 === 0,
              isBlue:   (i,j) => i % 2 === 1 && j % 2 === 1
          };
      case Bayer.GRBG:
          return {
              isRed:    (i,j) => i % 2 === 0 && j % 2 === 1,
              isGreenR: (i,j) => i % 2 === 0 && j % 2 === 0,
              isGreenB: (i,j) => i % 2 === 1 && j % 2 === 1,
              isBlue:   (i,j) => i % 2 === 1 && j % 2 === 0
          };
      case Bayer.GBRG:
          return {
              isRed:    (i,j) => i % 2 === 1 && j % 2 === 0,
              isGreenR: (i,j) => i % 2 === 1 && j % 2 === 1,
              isGreenB: (i,j) => i % 2 === 0 && j % 2 === 0,
              isBlue:   (i,j) => i % 2 === 0 && j % 2 === 1
          };
      case Bayer.BGGR:
          return {
              isRed:    (i,j) => i % 2 === 1 && j % 2 === 1,
              isGreenR: (i,j) => i % 2 === 1 && j % 2 === 0,
              isGreenB: (i,j) => i % 2 === 0 && j % 2 === 1,
              isBlue:   (i,j) => i % 2 === 0 && j % 2 === 0
          };

    }
};

let read = (i, o) => {
    switch (o.depth) {
        case 16:
            if (o.endianness === 'little') {
                return o.data.readUInt16LE(i * 2)
            } else {
                return o.data.readUInt16BE(i * 2);
            }
        default:
            return o.data.readUInt8(i);
    }
};

let write = (x, i, o, r) => {
    switch (o.depth) {
        case 16:
            if (o.endianness === 'little') {
                r.writeUInt16LE(x, i * 2);
            } else {
                r.writeUInt16BE(x, i * 2);
            }
            break;
        default:
            r.writeUInt8(x, i);
            break;
    }
};

let p = (i, j, o) => {
    let x = reflect(i, 0, o.height - 1);
    let y = reflect(j, 0, o.width - 1);
    return read(x * o.width + y, o);
};

let red = (i, j, b, o) => {
    if (b.isGreenR(i, j)) return Math.round((p(i, j - 1, o) + p(i, j + 1, o)) / 2);
    if (b.isGreenB(i, j)) return Math.round((p(i - 1, j, o) + p(i + 1, j, o)) / 2);
    if (b.isBlue(i, j))
        return Math.round((p(i - 1, j - 1, o) + p(i - 1, j + 1, o) + p(i + 1, j - 1, o) + p(i + 1, j + 1, o)) / 4);
    return p(i, j, o);
};

let green = (i, j, b, o) => {
    if (b.isRed(i, j) || b.isBlue(i, j))
        return Math.round((p(i, j - 1, o) + p(i, j + 1, o) + p(i - 1, j, o) + p(i + 1, j, o)) / 4);
    return p(i, j, o);
};

let blue = (i, j, b, o) => {
    if (b.isRed(i, j))
        return Math.round((p(i - 1, j - 1, o) + p(i - 1, j + 1, o) + p(i + 1, j - 1, o) + p(i + 1, j + 1, o)) / 4);
    if (b.isGreenR(i, j)) return Math.round((p(i - 1, j, o) + p(i + 1, j, o)) / 2);
    if (b.isGreenB(i, j)) return Math.round((p(i, j - 1, o) + p(i, j + 1, o)) / 2);
    return p(i, j, o);
};

function bilinear(options) {

    options = merge({depth: 8, endianness: 'big', bayer: Bayer.RGGB}, options);

    let h = options.height;
    let w = options.width;

    let result = Buffer.alloc(h * w * 3 * (options.depth / 8));

    let bayer = bayerMask(options.bayer);

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


module.exports = {
    Bayer: Bayer,
    bilinear: bilinear
};