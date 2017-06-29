let merge = require('lodash.merge');

let reflect = (x, p1, p2) => {
    if (x >= p1 && x <= p2) {
        return x;
    }
    if (x < p1) {
        return p1 + Math.abs(p1 - x);
    }
    if (x > p2) {
        return p2 - Math.abs(p2 - x);
    }
};

let Bayer = {
    RGGB: 1,
    GRBG: 2,
    GBRG: 3,
    BGGR: 4
};

function bilinear(options) {

    options = merge({depth: 8, endianness: 'big'}, options);

    let result = Buffer.alloc(options.height * options.width * 3 * (options.depth/8));

    let p = (i, j) => {
        let x = reflect(i, 0, options.height - 1);
        let y = reflect(j, 0, options.width - 1);
        return read(x * options.width + y);
    };

    let read = i => {
      switch (options.depth) {
          case 16:
              if (options.endianness==='little') {
                  return options.data.readUInt16LE(i*2)
              } else {
                  return options.data.readUInt16BE(i*2);
              }
          default: return options.data.readUInt8(i);
      }
    };

    let write = (x,i) => {
        switch (options.depth) {
            case 16:
                if (options.endianness==='little') {
                    result.writeUInt16LE(x,i*2);
                } else {
                    result.writeUInt16BE(x,i*2);
                }
                break;
            default: result.writeUInt8(x,i); break;
        }
    };

    let red = (i, j) => {
        if (i % 2 === 0 && j % 2 === 1) return Math.round((p(i, j - 1) + p(i, j + 1)) / 2);
        if (i % 2 === 1 && j % 2 === 0) return Math.round((p(i - 1, j) + p(i + 1, j)) / 2);
        if (i % 2 === 1 && j % 2 === 1) return Math.round((p(i - 1, j - 1) + p(i - 1, j + 1) + p(i + 1, j - 1) + p(i + 1, j + 1)) / 4);
        return p(i, j);
    };

    let green = (i, j) => {
        if (i % 2 === j % 2) return Math.round((p(i, j - 1) + p(i, j + 1) + p(i - 1, j) + p(i + 1, j)) / 4);
        return p(i, j);
    };

    let blue = (i, j) => {
        if (i % 2 === 0 && j % 2 === 0) return Math.round((p(i - 1, j - 1) + p(i - 1, j + 1) + p(i + 1, j - 1) + p(i + 1, j + 1)) / 4);
        if (i % 2 === 0 && j % 2 === 1) return Math.round((p(i - 1, j) + p(i + 1, j)) / 2);
        if (i % 2 === 1 && j % 2 === 0) return Math.round((p(i, j - 1) + p(i, j + 1)) / 2);
        return p(i, j);
    };

    for (let i = 0; i < options.height; i++) {
        for (let j = 0; j < options.width; j++) {
            write(red(i,j), i * options.width * 3 + j * 3);
            write(green(i,j), i * options.width * 3 + j * 3 + 1);
            write(blue(i,j), i * options.width * 3 + j * 3 + 2);
        }
    }

    return result;
}

module.exports = {
    Bayer: Bayer,
    bilinear: bilinear
};