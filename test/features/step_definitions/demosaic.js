let sharp = require('sharp');
let defaults = require('lodash.defaults');
let zipWith = require('lodash.zipwith');
let mosaic = require('../../util/mosaic');
let Demosaic = require('../../../src/Demosaic');
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

    Then(/^the demosaiced pixels and original RGB pixels should have mean-squared-error under (\d+)$/, function (mseUpperBound) {
        // Some pre-requisites for the calculation of mean-squared-error.
        this.rgb.width.should.equal(this.demosaic.width);
        this.rgb.height.should.equal(this.demosaic.height);
        this.rgb.pixels.length.should.equal(this.rgb.width * this.rgb.height * 3);
        this.demosaic.pixels.length.should.equal(this.demosaic.width * this.demosaic.height * 3);

        let rgb = [...this.rgb.pixels.values()];
        let demosaic = [...this.demosaic.pixels.values()];
        let mse = zipWith(rgb, demosaic, (a, b) => (a - b) * (a - b))
                .reduce((acc, x) => acc + x, 0) / (rgb.length);
        mse.should.below(mseUpperBound);
    });


});