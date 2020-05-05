/* eslint-disable */

const { readdir, existsSync, mkdirSync, rename} = require('fs');
const { join } = require('path');
const replace = require('replace-in-file');
const escapeRegExp = require('lodash.escaperegexp');

let baseDir = 'dist'
let imagesDir = 'images'
let jsDir = 'js'
let cssDir = 'css'
let fontsDir = 'fonts'

readdir(`./${baseDir}`, (err, files) => {


  let css = files.filter(ext => ext.endsWith('.css'));
  let js = files.filter(ext => ext.endsWith('.js'));
  let maps = files.filter(file => file.match(/.+\.(map)$/));
  let html = files.filter(ext => ext.endsWith('.html'));
  let fonts = files.filter(ext => ext.match(/.+\.(woff|woff2)$/));
  let images = files.filter(RegExp.prototype.test, /(^(?!favicon-32x32.\w|apple-icon-180x180.\w).+\.(webp|png|svg|jpg|jpeg|JPG|gif)$)/);
  let favicons = files.filter(file => file.match(/(favicon.\w|apple-icon-180x180.\w)/));


  let assetsForCss = [...images, ...fonts];
  let assetsForHtml = [...css, ...js, ...assetsForCss];
  let filesToMove = [...assetsForHtml, ...maps];


  const createDir = (dir, arr) => {
    if (!existsSync(join(__dirname, `../${baseDir}`, dir)) && arr.length != 0) {
      mkdirSync(join(__dirname, `../${baseDir}`, dir));
    }
  }

  createDir(jsDir, js);
  createDir(cssDir, css);
  createDir(imagesDir, images);
  createDir(fontsDir, fonts);

  // replace links in html
  html.forEach(
    file => {
      assetsForHtml.forEach(name => {
        let dir;
        // if (images.includes(name)) {
        //   dir = imagesDir + '/'
        // } else if (favicons.includes(name)) {
        //   dir = ''
        // } else if (fonts.includes(name)) {
        //   dir = fontsDir + '/'
        // } else if (css.includes(name)) {
        //   dir = cssDir + '/'
        // } else if (js.includes(name)) {
        //   dir = jsDir + '/'
        // }
        switch (true) {
          case images.includes(name):
            dir = imagesDir + '/'
            break
          case fonts.includes(name):
            dir = fontsDir + '/'
            break
          case css.includes(name):
            dir = cssDir + '/'
            break
          case js.includes(name):
            dir = jsDir + '/'
            break
        }
        const results = replace.sync({
          files: join(baseDir, file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: dir + name
        })
      })
    }
  )

  // replace map links in js

  // js.forEach(
  //   file => {
  //     maps.forEach(name => {
  //       let options = {
  //         files: join(baseDir, file),
  //         from: name,
  //         to: '../' + jsDir + '/' + name
  //       }
  //       try {
  //         let changedFiles = replace.sync(options);
  //       } catch (error) {
  //         console.error('Error occurred:', error);
  //       }
  //     })
  //   }
  // )

  // replace links in css
  css.forEach(
    file => {
      assetsForCss.forEach(name => {
        let dir;
        switch (true) {
          case images.includes(name):
            dir = imagesDir
            break
          case fonts.includes(name):
            dir = fontsDir
            break
        }
        const results = replace.sync({
          files: join(baseDir, file),
          from: new RegExp(escapeRegExp(name), 'g'),
          to: '../' + dir + '/' + name
        })
      })
    }
  )

  // move files
  filesToMove.forEach(
    name => {
      let assetPath;
      switch (true) {
        case images.includes(name):
          assetPath = imagesDir
          break
        case fonts.includes(name):
          assetPath = fontsDir
          break
        case name.endsWith('.js.map'):
        case name.endsWith('.js'):
          assetPath = jsDir
          break
        case name.endsWith('.css.map'):
        case name.endsWith('.css'):
          assetPath = cssDir
          break
      }
      rename(join(__dirname, `../${baseDir}`, name), join(__dirname, `../${baseDir}`, assetPath, name), function (err) {
        if (err) throw err
        console.log(`Successfully moved ${name}`)
      })
    }
  )

});
