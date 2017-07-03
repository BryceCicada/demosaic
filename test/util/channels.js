'use strict';
let range = require('lodash.range');

// Helper functions for indexing the values of the resulting interleaved rgb
// x = rgb, d = depth (1 = 8-bit, 2 = 16-bit, etc).
let red = (x, d = 1) => x.filter((p, i) => range(0, d).includes(i % (3 * d)));
let green = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + d).includes(i % (3 * d)));
let blue = (x, d = 1) => x.filter((p, i) => range(0, d).map(x => x + 2 * d).includes(i % (3 * d)));


module.exports = {
    red: red,
    green: green,
    blue: blue
};
