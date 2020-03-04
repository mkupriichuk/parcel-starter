/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');

const dirPath = './dist';
const cssDir = './dist/css';
const jsDir = './dist/js';
const imagesDir = './dist/images';
const fontsDir = './dist/fonts';


function getFiles(dirPath, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dirPath);
  files.forEach(file => files_.push(file))
  return files_;
}


let files = getFiles(dirPath);

const css = files.filter(ext => ext.endsWith('.css'));
const js = files.filter(ext => ext.endsWith('.js'));
const html = files.filter(ext => ext.endsWith('.html'));
const fonts = files.filter(RegExp.prototype.test, /(woff|woff2)/);
const images = files.filter(RegExp.prototype.test, /(^(?!favicon-32x32.\w|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/);


function htmlPath() {

  for (let i in html) {
    let file = html[i];
    fs.readFile(dirPath + '/' + file, 'utf-8', function (err, data) {
      if (err) throw err;

      const result = data
        .replace(/link rel="stylesheet" href="/g, 'link rel="stylesheet" href="css/')
        .replace(/script src="/g, 'script src="js/')
        .replace(/background:url\(/g, 'background:url(images/')
        .replace(/background-image:url\(/g, 'background-image:url(images/')
        .replace(/img src="/g, 'img src="images/')
        .replace(/" src="/g, '" src="images/')
        .replace(/use xlink:href="sprite/g, 'use xlink:href="images/sprite');

      fs.writeFile(dirPath + '/' + file, result, 'utf-8', function (err) {
        if (err) throw err;
        console.log('htmlPath complete');
      });
    });
  }

}

htmlPath();

function cssPath() {

  for (let i in css) {
    let file = css[i];

    fs.readFile(dirPath + '/' + file, 'utf-8', function (err, data) {
      if (err) throw err;

      const result = data
        .replace(/src:url\(/g, 'src:url(../fonts/')
        .replace(/,url\(/g, ',url(../fonts/')
        .replace(/ url\(/g, ' url(../images/')
        .replace(/background:url\(/g, 'background:url(../images/')
        .replace(/background-image:url\(/g, 'background-image:url(../images/');

      fs.writeFile(dirPath + '/' + file, result, 'utf-8', function (err) {
        if (err) throw err;
        console.log('cssPath complete');
      });
    });
  }
}

fs.ensureDir(cssDir)
  .then(() => {
    for (let i in css) {
      let file = css[i];
      fs.move(dirPath + '/' + file, cssDir + '/' + file, err => {
        if (err) return console.error(err);
        console.log('success!');
      });
    }
  })
  .then(cssPath)
  .catch(err => {
    console.error(err);
  });


fs.ensureDir(jsDir)
  .then(() => {
    for (let i in js) {
      let file = js[i];
      fs.move(dirPath + '/' + file, jsDir + '/' + file, err => {
        if (err) return console.error(err);
        console.log('success!');
      });
    }
  })
  .catch(err => {
    console.error(err);
  });

fs.ensureDir(imagesDir)
  .then(() => {
    for (let i in images) {
      let file = images[i];
      fs.move(dirPath + '/' + file, imagesDir + '/' + file, err => {
        if (err) return console.error(err);
        console.log('success!');
      });
    }
  })
  .catch(err => {
    console.error(err);
  });

if (fonts.length != 0) {
  fs.ensureDir(fontsDir)
    .then(() => {
      for (let i in fonts) {
        let file = fonts[i];
        fs.move(dirPath + '/' + file, fontsDir + '/' + file, err => {
          if (err) return console.error(err);
          console.log('success!');
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
}
