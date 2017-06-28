let flatmap = require('flatmap');
let range = require('lodash.range');
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

    it('should exist', () => {
        Demosaic.bilinear({width: 0, height: 0, data: Buffer.from([])});
    });

    it('should interpolate red over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data});
        red(img).should.eql(Buffer.from([1, 1, 1, 1]));
    });

    it('should interpolate red over 2x2 16-bit image with RGGB bayer CFA', () => {
        let data = Buffer.from(flatmap(range(1, 5), x => [2, x]));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data}, {depth: 16});
        red(img, 2).should.eql(Buffer.from([2, 1, 2, 1, 2, 1, 2, 1]));
    });

    it('should interpolate green over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data});

        green(img).should.eql(Buffer.from([3, 2, 3, 3]));
    });

    it('should interpolate green over 2x2 16-bit image with RGGB bayer CFA', () => {
        let data = Buffer.from(flatmap(range(1, 5), x => [3, x]));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data}, {depth: 16});

        green(img, 2).should.eql(Buffer.from([3, 3, 3, 2, 3, 3, 3, 3]));
    });

    it('should interpolate blue over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data});
        blue(img).should.eql(Buffer.from([4, 4, 4, 4]));
    });

    it('should interpolate red over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data});
        red(img).should.eql(Buffer.from([1, 2, 3, 3, 5, 6, 7, 7, 9, 10, 11, 11, 9, 10, 11, 11]));
    });

    it('should interpolate green over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data});

        green(img).should.eql(Buffer.from([4, 2, 5, 4, 5, 6, 7, 8, 10, 10, 11, 12, 13, 12, 15, 14]));
    });

    it('should interpolate blue over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data});
        blue(img).should.eql(Buffer.from([6, 6, 7, 8, 6, 6, 7, 8, 10, 10, 11, 12, 14, 14, 15, 16]));
    });

    it('should interpolate red over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data});
        red(img).should.eql(Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    });

    it('should interpolate green over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data});

        green(img).should.eql(Buffer.from([3, 2, 4, 4, 5, 6, 6, 8, 7]));
    });

    it('should interpolate blue over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1, 10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data});
        blue(img).should.eql(Buffer.from([5, 5, 5, 5, 5, 5, 5, 5, 5]));
    });

});

