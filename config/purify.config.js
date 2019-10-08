const purify = require('purify-css');
const fs = require('fs-extra');

let root = fs.pathExistsSync('./dist/css/') ? './dist/css/' : './dist';

let cssArr = getFiles(root);

function getFiles(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (let i in files) {
    let name = dir + '/' + files[i];
    if (~name.indexOf('.css')) {
      files_.push(name);
    }
  }
  return files_.join();
}

let whiteListClass = [
  'is-open',
  'dropdown',
  'active',
  '*owl*',
  '*mfp*'
];

const content = ['./dist/*.js', './dist/js/*.js', './dist/*.html'];
const css = [cssArr];
const options = {
  output: cssArr,
  whitelist: whiteListClass,
  info: true,
  minify: true
};

purify(content, css, options);
