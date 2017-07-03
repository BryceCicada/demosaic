let nearestNeighbour = require('./src/nearestNeighbour');
let bilinear = require('./src/bilinear');
let Bayer = require('./src/Bayer');

module.exports = {
    Bayer: Bayer,
    nearestNeighbour: nearestNeighbour,
    bilinear: bilinear
};