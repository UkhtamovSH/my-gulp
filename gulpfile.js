const { src, dest, series, watch } = require('gulp');
// const sass = require('gulp-sass')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();

function html() {
  return src('src/**.html')
    .pipe(
      include({
        prefix: '@@',
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('dist'));
}

function css() {
  return src('src/scss/**.css').pipe(dest('dist/css/'));
}

function img() {
  return src(['src/images/**/*.*']).pipe(dest('dist/images/'));
}

function js() {
  return src('src/js/**.js').pipe(dest('dist/js/'));
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('css/style.css'))
    .pipe(dest('dist'));
}

// function clear() {
//   return del('dist')
// }

function serve() {
  sync.init({
    server: './dist',
  });

  watch('src/images/**/*.*', series(img)).on('change', sync.reload);
  watch('src/**.html', series(html)).on('change', sync.reload);
  watch('src/parts/**.html', series(html)).on('change', sync.reload);
  watch('src/js/**.js', series(js)).on('change', sync.reload);
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload);
}

exports.build = series(scss, css, img, js, html);
exports.serve = series(scss, css, img, js, html, serve);
// exports.clear = clear
