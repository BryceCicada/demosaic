let flatmap = require('flatmap');
let distance = require('euclidean-distance');
let sharp = require('sharp');
let range = require('lodash.range');
let merge = require('lodash.merge');
let chai = require('chai');
let Demosaic = require('../src/Demosaic');

chai.should();

describe('Bilinear', () => {
    'use strict';

    // Helper functions for indexing the values of the resulting interleaved rgb
    // x = rgb, d = depth (1 = 8-bit, 2 = 16-bit, etc).
    let red = (x, d = 1) => x.filter((p, i) => range(0, d).includes(i % (3 * d)));
    let green = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + d).includes(i % (3 * d)));
    let blue = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + 2 * d).includes(i % (3 * d)));

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

    it('should exist', () => {
        Demosaic.bilinear({width: 0, height: 0, data: Buffer.from([])});
    });

    it('should demosaic solid red 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from([1, 0, 0, 0]);
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});
        red(rgb).should.eql(Buffer.from([1, 1, 1, 1]));
        green(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
        blue(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
    });

    it('should demosaic solid green 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from([0, 1, 1, 0]);
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});
        red(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
        green(rgb).should.eql(Buffer.from([1, 1, 1, 1]));
        blue(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
    });

    it('should demosaic solid blue 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from([0, 0, 0, 1]);
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});
        red(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
        green(rgb).should.eql(Buffer.from([0, 0, 0, 0]));
        blue(rgb).should.eql(Buffer.from([1, 1, 1, 1]));
    });

    it('should interpolate red over 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});
        red(rgb).should.eql(Buffer.from([1, 1, 1, 1]));
    });

    it('should interpolate red over 2x2 16-bit image with RGGB bayer CFA', () => {
        let raw = Buffer.from(flatmap(range(1, 5), x => [2, x]));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, depth: 16});
        red(rgb, 2).should.eql(Buffer.from([2, 1, 2, 1, 2, 1, 2, 1]));
    });

    it('should interpolate green over 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});

        green(rgb).should.eql(Buffer.from([3, 2, 3, 3]));
    });

    it('should interpolate green over 2x2 16-bit image with RGGB bayer CFA', () => {
        let raw = Buffer.from(flatmap(range(1, 5), x => [3, x]));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, depth: 16});

        green(rgb, 2).should.eql(Buffer.from([3, 3, 3, 2, 3, 3, 3, 3]));
    });

    it('should interpolate green over 2x2 16-bit little-endian image with RGGB bayer CFA', () => {
        let raw = Buffer.from(flatmap(range(1, 5), x => [x, 3]));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, depth: 16, endianness: 'little'});

        green(rgb, 2).should.eql(Buffer.from([3, 3, 2, 3, 3, 3, 3, 3]));
    });

    it('should interpolate blue over 2x2 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw});
        blue(rgb).should.eql(Buffer.from([4, 4, 4, 4]));
    });

    it('should interpolate red over 4x4 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 17));
        let rgb = Demosaic.bilinear({width: 4, height: 4, data: raw});
        red(rgb).should.eql(Buffer.from([1, 2, 3, 3, 5, 6, 7, 7, 9, 10, 11, 11, 9, 10, 11, 11]));
    });

    it('should interpolate green over 4x4 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 17));
        let rgb = Demosaic.bilinear({width: 4, height: 4, data: raw});

        green(rgb).should.eql(Buffer.from([4, 2, 5, 4, 5, 6, 7, 8, 10, 10, 11, 12, 13, 12, 15, 14]));
    });

    it('should interpolate blue over 4x4 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 17));
        let rgb = Demosaic.bilinear({width: 4, height: 4, data: raw});
        blue(rgb).should.eql(Buffer.from([6, 6, 7, 8, 6, 6, 7, 8, 10, 10, 11, 12, 14, 14, 15, 16]));
    });

    it('should interpolate red over 3x3 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 10));
        let rgb = Demosaic.bilinear({width: 3, height: 3, data: raw});
        red(rgb).should.eql(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });

    it('should interpolate green over 3x3 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 10));
        let rgb = Demosaic.bilinear({width: 3, height: 3, data: raw});

        green(rgb).should.eql(Buffer.from([3, 2, 4, 4, 5, 6, 6, 8, 7]));
    });

    it('should interpolate blue over 3x3 image with RGGB bayer CFA', () => {
        let raw = Buffer.from(range(1, 10));
        let rgb = Demosaic.bilinear({width: 3, height: 3, data: raw});
        blue(rgb).should.eql(Buffer.from([5, 5, 5, 5, 5, 5, 5, 5, 5]));
    });

    function testOnSampleImage(imageName, threshold) {
        let image = sharp(`test/resources/${imageName}`);
        return image
            .metadata()
            .then(metadata => image.raw().toBuffer().then(buf => merge({data: buf}, metadata)))
            .then(rgb => {
                let rgbIn = rgb.data;
                let mosaiced = mosaic(rgb.data, rgb.width, rgb.height);
                return sharp(mosaiced, {raw: {width: rgb.width, height: rgb.height, channels: 1}})
                    .jpeg()
                    .toFile(`test/artifacts/${imageName.replace('.jpg', '.raw.jpg')}`)
                    .then(info => ({rgbIn, mosaiced, info}));
            })
            .then(({rgbIn, mosaiced, info}) => {
                let rgbOut = Demosaic.bilinear({width: info.width, height: info.height, data: mosaiced});
                return sharp(rgbOut, {raw: {width: info.width, height: info.height, channels: 3}})
                    .jpeg()
                    .toFile(`test/artifacts/${imageName.replace('.jpg', '.bilinear.jpg')}`)
                    .then(() => ({rgbIn, rgbOut}));
            })
            .then(({rgbIn, rgbOut}) => {
                let rgbInArr = [...rgbIn.values()];
                let rgbOutArr = [...rgbOut.values()];
                let rgbInSum = rgbInArr.reduce((a, b) => a + b, 0);
                let rgbOutSum = rgbOutArr.reduce((a, b) => a + b, 0);
                rgbInArr = rgbInArr.map(x => x / rgbInSum);
                rgbOutArr = rgbOutArr.map(x => x / rgbOutSum);
                distance(rgbInArr, rgbOutArr).should.be.below(threshold);
            });
    }

    it('should demosaic nature-forest-industry-rails.jpg correctly', () => {
        return testOnSampleImage('nature-forest-industry-rails.jpg', 0.002);
    });

    it('should demosaic heart.jpg correctly', () => {
        return testOnSampleImage('heart.jpg', 0.00032);
    });

});

