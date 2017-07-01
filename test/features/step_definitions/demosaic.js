let sharp = require('sharp');
let defaults = require('lodash.defaults');
let range = require('lodash.range');
let zipWith = require('lodash.zipwith');
let zip = require('lodash.zip');
let sum = require('lodash.sum');
let mosaic = require('../../util/mosaic');
let Demosaic = require('../../../Demosaic');
let chai = require('chai');
let {defineSupportCode} = require('cucumber');

chai.should();

defineSupportCode(function (context) {
    'use strict';

    let Given = context.Given;
    let When = context.When;
    let Then = context.Then;

    Given(/^RGB pixels from image (.*)$/, function (imageName) {
        let image = sharp(`test/resources/${imageName}`);
        return image
            .metadata()
            .then(metadata => image.raw().toBuffer().then(rgbPixels => this.rgb = defaults({pixels: rgbPixels}, metadata)));
    });

    Given(/^I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment$/, function () {
        let rawPixels = mosaic(this.rgb.pixels, this.rgb.width, this.rgb.height);
        this.raw = defaults({pixels: rawPixels}, this.rgb);
    });

    Given(/^I save the raw pixels as (.*) as a test artifact$/, function (imageName) {
        return sharp(this.raw.pixels, {raw: {width: this.raw.width, height: this.raw.height, channels: 1}})
            .jpeg()
            .toFile(`test/artifacts/${imageName}`);
    });

    When(/^I demosaic the raw pixels with bilinear demosaic$/, function () {
        let demosaicPixels = Demosaic.bilinear({data: this.raw.pixels, width: this.raw.width, height: this.raw.height});
        this.demosaic = defaults({pixels: demosaicPixels}, this.raw);
    });

    When(/^I save the demosaiced pixels as (.*) as a test artifact$/, function (imageName) {
        return sharp(this.demosaic.pixels, {
            raw: {
                width: this.demosaic.width,
                height: this.demosaic.height,
                channels: 3
            }
        })
            .jpeg()
            .toFile(`test/artifacts/${imageName}`);
    });

    Then(/^the original and demosaiced pixels should have mean-squared-error under (\d+)$/, function (mseUpperBound) {
        // Some pre-requisites for the calculation of mean-squared-error.
        this.rgb.width.should.equal(this.demosaic.width);
        this.rgb.height.should.equal(this.demosaic.height);
        this.rgb.pixels.length.should.equal(this.rgb.width * this.rgb.height * 3);
        this.demosaic.pixels.length.should.equal(this.demosaic.width * this.demosaic.height * 3);

        let rgb = [...this.rgb.pixels.values()];
        let demosaic = [...this.demosaic.pixels.values()];
        meanSquaredError(rgb, demosaic).should.be.below(mseUpperBound);
    });

    Then(/^the original and demosaiced colour histograms should have mean-squared-error under (\d+)$/, function (mseUpperBound) {
        this.rgb.pixels.length.should.equal(this.rgb.width * this.rgb.height * 3);
        this.demosaic.pixels.length.should.equal(this.demosaic.width * this.demosaic.height * 3);

        let rgbHistograms = range(3).map(x => new RGBHistogram(this.rgb, x).toArray());
        let demosaicHistograms = range(3).map(x => new RGBHistogram(this.demosaic, x).toArray());

        let mse = sum(zip(rgbHistograms, demosaicHistograms).map(([h1, h2]) => meanSquaredError(h1, h2)));
        mse.should.be.below(mseUpperBound);
    });

    function meanSquaredError(xs, ys) {
        let squareSum = sum(zipWith(xs, ys, (x, y) => (x - y) * (x - y)));
        return squareSum / Math.min(xs.length, ys.length);
    }

    class RGBHistogram extends Map {
        constructor(img, channel) {
            super();
            for (let i = 0; i < 256; i++) {
                this.set(i, 0);
            }

            for (let i = 0; i < img.height; i++) {
                for (let j = 0; j < img.width; j++) {
                    this.increment(img.pixels[i * img.width * 3 + j * 3 + channel]);
                }
            }
        }

        increment(index) {
            this.set(index, this.get(index) + 1);
        }

        toArray() {
            return [...this.entries()]
                .sort(([key1], [key2]) => key1 - key2)
                .map(([key, value]) => value);
        }
    }
});