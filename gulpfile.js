const gulp = require('gulp');
const less = require('gulp-less');
const gulpautoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const { parallel, series, watch, src } = require('gulp');

const PUBLIC_DIST = 'public/';
const PUBLIC_COMPONENTS = 'public/components';
const CSS_DIST = `${PUBLIC_DIST}/css`;
const JS_DIST = `${PUBLIC_DIST}/js`;
const TOOLS_DIST = `${PUBLIC_DIST}/tools`;

const lessFiles = "src/less/*.less";
const jsFiles = "src/js/*.js";
const imgsFiles = "src/assets/*";
const imgsDist = `${PUBLIC_DIST}/assets`;
const toolsFilesJS = "src/tools/**/*.js";
const toolsFilesLess = "src/tools/**/*.less";

const componentsFiles = "src/components/**/*";

//task para o less main
function lessMain() {
  return gulp.src(lessFiles)
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpautoprefixer())
    .pipe(gulp.dest(CSS_DIST));
}

//task para o less tools
function lessTools() {
  return gulp.src(toolsFilesLess)
    .pipe(less())
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpautoprefixer())
    .pipe(gulp.dest(TOOLS_DIST));
}

//task para minificação do js main
function jsMain() {
  return gulp.src(jsFiles)
    .pipe(minify())
    .pipe(gulp.dest(JS_DIST));
}

//task para minificação do js tools
function jsTools() {
  return gulp.src(toolsFilesJS)
    .pipe(minify())
    .pipe(gulp.dest(TOOLS_DIST));
}

//task para comprimir as imagens
// FIXME: A task está levando muito tempo e dá timeout na Umbler.
function imagem() {
  return gulp.src(imgsFiles)
    // .pipe(imagemin())
    .pipe(gulp.dest(imgsDist))
}

//task de cano do components
function components() {
  return gulp.src(componentsFiles)
    .pipe(gulp.dest(PUBLIC_COMPONENTS));
}

//task para o watch
function watchFiles() {
  watch(lessFiles, lessMain);
  watch(toolsFilesLess, lessTools);
  watch(jsFiles, jsMain);
  watch(toolsFilesJS, jsTools);
  watch(imgsFiles, parallel(imagem));
  watch(componentsFiles, components);
}

function cleanPublicDirectory() {
  return src(PUBLIC_DIST, {read: false, allowEmpty: true}).pipe(clean());
}

const buildForDev = series(
  cleanPublicDirectory,
  parallel(lessMain, lessTools, jsMain, jsTools, imagem, components)
);

const buildForProd = series(
  buildForDev
);

const dev = series(buildForDev, watchFiles);

//task default 
exports.build = buildForProd;
exports.dev = dev;
exports.watch = watchFiles;
exports.default = buildForProd;