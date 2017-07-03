let merge = require('lodash.merge');
let Bayer = require('./Bayer');

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

let pixel = (i, j, o) => {
    let x = reflect(i, 0, o.height - 1);
    let y = reflect(j, 0, o.width - 1);
    return read(x * o.width + y, o);
};

let isRed = (i, j, bayer) => {
    switch (bayer) {
        case Bayer.RGGB:
            return (i % 2 === 0 && j % 2 === 0);
        case Bayer.GRBG:
            return (i % 2 === 0 && j % 2 === 1);
        case Bayer.GBRG:
            return (i % 2 === 1 && j % 2 === 0);
        case Bayer.BGGR:
            return (i % 2 === 1 && j % 2 === 1);
    }
};

let isGreenR = (i, j, bayer) => {
    switch (bayer) {
        case Bayer.RGGB:
            return (i % 2 === 0 && j % 2 === 1);
        case Bayer.GRBG:
            return (i % 2 === 0 && j % 2 === 0);
        case Bayer.GBRG:
            return (i % 2 === 1 && j % 2 === 1);
        case Bayer.BGGR:
            return (i % 2 === 1 && j % 2 === 0);
    }
};

let isGreenB = (i, j, bayer) => {
    switch (bayer) {
        case Bayer.RGGB:
            return (i % 2 === 1 && j % 2 === 0);
        case Bayer.GRBG:
            return (i % 2 === 1 && j % 2 === 1);
        case Bayer.GBRG:
            return (i % 2 === 0 && j % 2 === 0);
        case Bayer.BGGR:
            return (i % 2 === 0 && j % 2 === 1);
    }
};

let isBlue = (i, j, bayer) => {
    switch (bayer) {
        case Bayer.RGGB:
            return (i % 2 === 1 && j % 2 === 1);
        case Bayer.GRBG:
            return (i % 2 === 1 && j % 2 === 0);
        case Bayer.GBRG:
            return (i % 2 === 0 && j % 2 === 1);
        case Bayer.BGGR:
            return (i % 2 === 0 && j % 2 === 0);
    }
};

module.exports = {
    write:write,
    pixel: pixel,
    isRed: isRed,
    isGreenR: isGreenR,
    isGreenB: isGreenB,
    isBlue: isBlue
};

