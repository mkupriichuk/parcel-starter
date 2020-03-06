/* eslint-disable */

const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const escapeRegExp = require('lodash.escaperegexp');

let baseDir = 'dist'
let imagesDir = 'images'
let jsDir = 'js'
let cssDir = 'css'
let fontsDir = 'fonts'

fs.readdir(`./${baseDir}`, (err, files) => {


  let css = files.filter(ext => ext.endsWith('.css'));
  let js = files.filter(ext => ext.endsWith('.js'));
  let maps = files.filter(file => file.match(/.+\.(map)$/));
  let html = files.filter(ext => ext.endsWith('.html'));
  let fonts = files.filter(ext => ext.match(/.+\.(woff|woff2)$/));
  let images = files.filter(RegExp.prototype.test, /(^(?!favicon-32x32.\w|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/);


  let assetsForCss = [...images, ...fonts];
  let assetsForHtml = [...css, ...js, ...images, ...fonts];
  let filesToMove = [...css, ...js, ...fonts, ...images, ...maps];


  if (!fs.existsSync(path.join(__dirname, `../${baseDir}`, jsDir)) && js.length != 0) {
    fs.mkdirSync(path.join(__dirname, `../${baseDir}`, jsDir));
  }
  if (!fs.existsSync(path.join(__dirname, `../${baseDir}`, cssDir)) && css.length != 0) {
    fs.mkdirSync(path.join(__dirname, `../${baseDir}`, cssDir));
  }
  if (!fs.existsSync(path.join(__dirname, `../${baseDir}`, imagesDir)) && images.length != 0 ) {
    fs.mkdirSync(path.join(__dirname, `../${baseDir}`, imagesDir));
  }
  if (!fs.existsSync(path.join(__dirname, `../${baseDir}`, fontsDir)) && fonts.length != 0 ) {
    fs.mkdirSync(path.join(__dirname, `../${baseDir}`, fontsDir));
  }


  // replace links in html
  html.forEach(
    file => {
      assetsForHtml.forEach(name => {
        let dir;
        if (name.match(/.+\.(woff|woff2)$/)) {
          dir = fontsDir + '/';
        } else if (name.match(/.+\.(css)$/)) {
          dir = cssDir + '/';
        }
        else if (name.match(/.+\.(js)$/)) {
          dir = jsDir + '/';
        }
        else if (name.match(/(^(?!favicon-32x32.\w|.ico|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/)) {
          dir = imagesDir + '/';
        }
        else if (name.match(/(favicon-32x32.\w|.ico|apple-icon-180x180.\w)/)) {
          dir = '';
        }
        let options = {
          files: path.join(baseDir, file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: dir + name
        }
        try {
          let changedFiles = replace.sync(options);
        } catch (error) {
          console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace map links in js
  js.forEach(
    file => {
      maps.forEach(name => {
        let options = {
          files: path.join(baseDir, file),
          from: name,
          to: '../' + jsDir + '/' + name
        }
        try {
          let changedFiles = replace.sync(options);
        } catch (error) {
          console.error('Error occurred:', error);
        }
      })
    }
  )

  // replace links in css
  css.forEach(
    file => {
      assetsForCss.forEach(name => {
        let dir;
        if (name.match(/.+\.(woff|woff2)$/)) {
          dir = fontsDir;
        } else if (name.match(/(^(?!favicon-32x32.\w|.ico|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/)) {
          dir = imagesDir;
        }
        let options = {
          files: path.join(baseDir, file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: '../' + dir + '/' + name
        }
        try {
          let changedFiles = replace.sync(options);
        } catch (error) {
          console.error('Error occurred:', error);
        }
      })
    }
  )

  // move files
  filesToMove.forEach(
    name => {
      let assetPath;
      if (name.endsWith('.js.map') || name.endsWith('.js')) {
        assetPath = jsDir;
      } else if (name.endsWith('.css.map') || name.endsWith('.css')) {
        assetPath = cssDir;
      } else if (name.match(/.+\.(woff|woff2)$/)) {
        assetPath = fontsDir;
      } else if (name.match(/(^(?!favicon-32x32.\w|.ico|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/)) {
        assetPath = imagesDir;
      }
      fs.rename(path.join(__dirname, `../${baseDir}`, name), path.join(__dirname, `../${baseDir}`, assetPath, name), function (err) {
        if (err) throw err
        console.log(`Successfully moved ${name}`)
      })
    }
  )

});
