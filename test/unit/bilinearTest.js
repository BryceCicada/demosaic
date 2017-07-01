let flatmap = require('flatmap');
let range = require('lodash.range');
let chai = require('chai');
let Demosaic = require('../../Demosaic');

chai.should();

describe('Bilinear', () => {
    'use strict';

    // Helper functions for indexing the values of the resulting interleaved rgb
    // x = rgb, d = depth (1 = 8-bit, 2 = 16-bit, etc).
    let red = (x, d = 1) => x.filter((p, i) => range(0, d).includes(i % (3 * d)));
    let green = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + d).includes(i % (3 * d)));
    let blue = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + 2 * d).includes(i % (3 * d)));

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

    it('should interpolate red over 2x2 image with GRBG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GRBG});
        red(rgb).should.eql(Buffer.from([2, 2, 2, 2]));
    });

    it('should interpolate red over 2x2 image with GBRG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GBRG});
        red(rgb).should.eql(Buffer.from([3, 3, 3, 3]));
    });

    it('should interpolate red over 2x2 image with BGGR bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.BGGR});
        red(rgb).should.eql(Buffer.from([4, 4, 4, 4]));
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

    it('should interpolate green over 2x2 image with GRBG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GRBG});

        green(rgb).should.eql(Buffer.from([1, 3, 3, 4]));
    });

    it('should interpolate green over 2x2 image with GBRG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GBRG});

        green(rgb).should.eql(Buffer.from([1, 3, 3, 4]));
    });

    it('should interpolate green over 2x2 image with BGGR bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.BGGR});

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

    it('should interpolate blue over 2x2 image with GRBG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GRBG});
        blue(rgb).should.eql(Buffer.from([3, 3, 3, 3]));
    });

    it('should interpolate blue over 2x2 image with GBRG bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.GBRG});
        blue(rgb).should.eql(Buffer.from([2, 2, 2, 2]));
    });

    it('should interpolate blue over 2x2 image with BGGR bayer CFA', () => {
        let raw = Buffer.from(range(1, 5));
        let rgb = Demosaic.bilinear({width: 2, height: 2, data: raw, bayer: Demosaic.Bayer.BGGR});
        blue(rgb).should.eql(Buffer.from([1, 1, 1, 1]));
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
});

