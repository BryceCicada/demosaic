function bilinear(img, bayer) {
    let result = Buffer.alloc(img.height * img.width * 3);

    let reflect = (x, p1, p2) => {
        if (x >= p1 && x <= p2) {
            return x;
        }
        if (x < p1) {
            return p1 + Math.abs(p1 - x);
        }
        if (x > p2) {
            return p2 - Math.abs(p2 - x);
        }
    };

    let p = (i, j) => {
        let x = reflect(i, 0, img.height - 1);
        let y = reflect(j, 0, img.width - 1);
        return img.data[x * img.width + y];
    };

    let red = (i, j) => {
        if (i % 2 === 0 && j % 2 === 1) return Math.round((p(i, j - 1) + p(i, j + 1)) / 2);
        if (i % 2 === 1 && j % 2 === 0) return Math.round((p(i - 1, j) + p(i + 1, j)) / 2);
        if (i % 2 === 1 && j % 2 === 1) return Math.round((p(i - 1, j - 1) + p(i - 1, j + 1) + p(i + 1, j - 1) + p(i + 1, j + 1)) / 4);
        return p(i, j);
    };

    let green = (i, j) => {
        if (i % 2 === j % 2) return Math.round((p(i, j - 1) + p(i, j + 1) + p(i - 1, j) + p(i + 1, j)) / 4);
        return p(i, j);
    };

    let blue = (i, j) => {
        if (i % 2 === 0 && j % 2 === 0) return Math.round((p(i - 1, j - 1) + p(i - 1, j + 1) + p(i + 1, j - 1) + p(i + 1, j + 1)) / 4);
        if (i % 2 === 0 && j % 2 === 1) return Math.round((p(i - 1, j) + p(i + 1, j)) / 2);
        if (i % 2 === 1 && j % 2 === 0) return Math.round((p(i, j - 1) + p(i, j + 1)) / 2);
        return p(i, j);
    };

    for (let i = 0; i < img.height; i++) {
        for (let j = 0; j < img.width; j++) {
            result[i * img.width * 3 + j * 3] = red(i, j);
            result[i * img.width * 3 + j * 3 + 1] = green(i, j);
            result[i * img.width * 3 + j * 3 + 2] = blue(i, j);
        }
    }

    return result;
}

let Bayer = {
    RGGB: 1,
    GRBG: 2,
    GBRG: 3,
    BGGR: 4
};

module.exports = {
    Bayer: Bayer,
    bilinear: bilinear
};