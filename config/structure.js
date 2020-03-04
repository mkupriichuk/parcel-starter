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
    fs.readFile(dirPath + '/' + file, 'utf-8', function(err, data) {
      if (err) throw err;
  
      let css = 'link rel="stylesheet" href="';
      let js = 'script src="';
      let background = 'background:url(';
      let backgroundImage = 'background-image:url(';
      let img = 'img src="';
      let imgClass = '" src="';
      let spriteUse = 'use xlink:href="sprite';
      let mapObj = {
        [css]: 'link rel="stylesheet" href="css/',
        [js]: 'script src="js/',
        [background]: 'background:url(images/',
        [backgroundImage]: 'background-image:url(images/',
        [img]: 'img src="images/',
        [imgClass]: '" src="images/',
        [spriteUse]: 'use xlink:href="images/sprite'
      };
  
      let newValue = data.replace(/link rel="stylesheet" href="|script src="|background-image:url\(|background:url\(|img src="|" src="|use xlink:href="sprite/gi, function(matched) {
        return mapObj[matched];
      });
  
      fs.writeFile(dirPath + '/' + file, newValue, 'utf-8', function(err) {
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

    fs.readFile(dirPath + '/' + file, 'utf-8', function(err, data) {
      if (err) throw err;
  
      let fontSrc = 'src:url(';
      let fontUrl = ',url(';
      let background = ' url(';
      let background2 = 'background:url(';
      let backgroundImage = 'background-image:url(';
  
      let mapObj = {
        [fontSrc]: 'src:url(../fonts/',
        [fontUrl]: ',url(../fonts/',
        [background]: ' url(../images/',
        [background2]: 'background:url(../images/',
        [backgroundImage]: 'background-image:url(../images/'
      };
  
      let newValue = data.replace(/src:url\(|,url\(| url\(|background:url\(|background-image:url\(/gi, function(matched) {
        return mapObj[matched];
      });
  
      fs.writeFile(dirPath + '/' + file, newValue, 'utf-8', function(err) {
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
