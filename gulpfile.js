const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
}

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true,
  };
  return gulp
    .src('**/*.html')
    .pipe(plumber())
    .on('data', function (file) {
      const buferFile = Buffer.from(
        htmlMinify.minify(file.contents.toString(), options)
      );
      return (file.contents = buferFile);
    })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp
    .src(['fonts/**/*.{woff,woff2,ttf,otf}', 'fonts/**/*.css'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src('styles/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp
    .src('images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp
    .src('scripts/**/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['**/*.html'], html);
  gulp.watch(['styles/**/*.css'], css);
  gulp.watch(['images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['scripts/**/*.js'], scripts);
}

const build = gulp.series(
  clean,
  gulp.parallel(html, fonts, css, images, scripts)
);
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.fonts = fonts;
exports.css = css;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
