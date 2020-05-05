const tinify = require('tinify');
const { existsSync, readdirSync} = require('fs');

tinify.key = '';

let root = existsSync('./dist/images') ? './dist/images/' : './dist/';

let files = readdirSync(root);

let imagesArr = files.filter(ext => ext.match(/.+\.(png|jpe?g)$/i)).map(i => i = root + i);

let imgArrLimit = [];

for (let i in imagesArr) {
  if (i >= 0 && i < 500) {
    imgArrLimit.push(imagesArr[i]);
  }
}

imgArrLimit.forEach(file => tinify.fromFile(file).toFile(file));

console.log(imagesArr.length + ' images compression ...')