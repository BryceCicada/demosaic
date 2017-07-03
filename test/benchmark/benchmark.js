let Benchmark = require('benchmark');
let sharp = require('sharp');
let Demosaic = require('../../Demosaic');
let mosaic = require('../util/mosaic');


(function () {
    'use strict';

    let suite = new Benchmark.Suite();

    let image = sharp(`test/resources/poppy.jpg`);

    image
        .metadata()
        .then(metadata => image.raw().toBuffer().then(rgb => ({rgb, metadata})))
        .then(({rgb, metadata}) => {
            let raw = mosaic(rgb, metadata.width, metadata.height);
            return ({raw, metadata});
        })
        .then(({raw, metadata}) => {
            suite
                .add('nearestNeighbour', () => {
                    Demosaic.nearestNeighbour({data: raw, width: metadata.width, height: metadata.height});
                })
                .add('bilinear', () => {
                    Demosaic.bilinear({data: raw, width: metadata.width, height: metadata.height});
                })
                .on('complete', function () {
                    console.log(this.map(x => x.toString()).join('\n'));
                })
                .on('error', function (err) {
                    console.error(err);
                })
                .run({'async': true});
        })
        .catch(err => console.error(err));
})();