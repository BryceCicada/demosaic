let range = require('lodash.range');
let chai = require('chai');
let Demosaic = require('../src/Demosaic');

chai.should();

describe('Bilinear', () => {
    'use strict';

    let red = x => x.filter((p, i) => i % 3 === 0);
    let green = x => x.filter((p, i) => i % 3 === 1);
    let blue = x => x.filter((p, i) => i % 3 === 2);

    it('should exist', () => {
        Demosaic.bilinear({width: 0, height: 0, data: Buffer.from([])});
    });

    it('should interpolate red over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data}, {cfa: Demosaic.Bayer.RGGB});
        red(img).should.eql(Buffer.from([1,1,1,1]));
    });

    it('should interpolate green over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data}, {cfa: Demosaic.Bayer.RGGB});

        green(img).should.eql(Buffer.from([3,2,3,3]));
    });

    it('should interpolate blue over 2x2 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,5));
        let img = Demosaic.bilinear({width: 2, height: 2, data: data}, {cfa: Demosaic.Bayer.RGGB});
        blue(img).should.eql(Buffer.from([4,4,4,4]));
    });

    it('should interpolate red over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data}, {cfa: Demosaic.Bayer.RGGB});
        red(img).should.eql(Buffer.from([1,2,3,3,5,6,7,7,9,10,11,11,9,10,11,11]));
    });

    it('should interpolate green over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data}, {cfa: Demosaic.Bayer.RGGB});

        green(img).should.eql(Buffer.from([4,2,5,4,5,6,7,8,10,10,11,12,13,12,15,14]));
    });

    it('should interpolate blue over 4x4 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,17));
        let img = Demosaic.bilinear({width: 4, height: 4, data: data}, {cfa: Demosaic.Bayer.RGGB});
        blue(img).should.eql(Buffer.from([6,6,7,8,6,6,7,8,10,10,11,12,14,14,15,16]));
    });

    it('should interpolate red over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data}, {cfa: Demosaic.Bayer.RGGB});
        red(img).should.eql(Buffer.from([1,2,3,4,5,6,7,8,9]));
    });

    it('should interpolate green over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data}, {cfa: Demosaic.Bayer.RGGB});

        green(img).should.eql(Buffer.from([3,2,4,4,5,6,6,8,7]));
    });

    it('should interpolate blue over 3x3 image with RGGB bayer CFA', () => {
        let data = Buffer.from(range(1,10));
        let img = Demosaic.bilinear({width: 3, height: 3, data: data}, {cfa: Demosaic.Bayer.RGGB});
        blue(img).should.eql(Buffer.from([5,5,5,5,5,5,5,5,5]));
    });
});

