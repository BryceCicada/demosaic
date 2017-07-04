let Canvas = require('canvas');
let fs = require('fs');

let height = 270;
let width = 340;

let canvas = new Canvas(width, height);
let ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);

ctx.font = '30px Impact';
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.fillText("Demosaic Sample", width/2, 30);

let shapes = (x,y,h,w) => {
    ctx.fillStyle = 'red';

    ctx.fillRect(x, y, h, w);

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(x+w*1.1, y+h);
    ctx.lineTo(x+w*1.6, y);
    ctx.lineTo(x+w*2.1, y+h);
    ctx.fill();

    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(x+w*2.7, y+h*0.5, h/2, 0, Math.PI * 2, true);
    ctx.fill();
};

shapes(10, 45, 100, 100);
shapes(10, 155, 100, 100);
ctx.fillStyle = 'white';

for (let i = 0; i < 10; i++) {
    ctx.fillRect(10+i*i+1, 155, i, 100);
    ctx.fillRect(120+i*i+1, 155, i, 100);
    ctx.fillRect(230+i*i+1, 155, i, 100);
}


let out = fs.createWriteStream(__dirname + '/sample.png');
let stream = canvas.pngStream();

stream.on('data', function(chunk){
    out.write(chunk);
});

stream.on('end', function(){
    console.log('saved png');
});