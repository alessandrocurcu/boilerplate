// const gulp = require('gulp');
const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp');
const browserSync = require('browser-sync').create();
const log = require('fancy-log');
const color = require('ansi-colors');
const del = require('del');
const postcss = require('gulp-postcss');

// HTML
const pug = require('gulp-pug');

// CSS
const sass = require('gulp-sass');
const gulpStylelint = require('gulp-stylelint');
const moduleImporter = require('sass-module-importer');
const cssbeautify = require('gulp-cssbeautify');
const shortcss = require('postcss-short');
const cssnext = require('postcss-cssnext');
const cssnano = require('gulp-cssnano');
const combineMq = require('gulp-combine-mq');

// IMG
const imagemin = require('gulp-imagemin');
const image = require('gulp-image');
const webp = require('gulp-webp');

// JS
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');


const browserSyncTask = cb => {
  browserSync.init({
    server: {
      baseDir: './',
      browser: 'google chrome canary',
    },
  });
  cb();
};


//** HTML TASKS **// 

const html = () => {
  log(color.green('Compilo Pug in HTML'));
  return (
    src(['./src/views/*.pug', '!./src/views/_?*.pug'])
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest('./'))
    .pipe(browserSync.stream())
  );
};

const cleanHTML = cb => {
  log(color.green('Pulisco file HTML'));
  del(['./*.html']);
  cb();
};

const prodhtml = () => {
  log(color.green('Compilo Pug in HTML'));
  return (
    src(['./src/views/*.pug', '!./src/views/_?*.pug'])
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest('./dist')));
};

const prodcleanHTML = cb => {
  log(color.green('Pulisco file HTML'));
  del(['./dist/*.html']);
  cb();
};

//** FINE - HTML TASKS **//


//** CSS TASKS **//

const CSS = () => {
  log(color.green('Compilo file SCSS in CSS'));
  return (
    src('./src/scss/main.scss')
    .pipe(sass({
      importer: moduleImporter()
    }))
    .pipe(
      postcss([
        shortcss({
          skip: '-'
        }),
        cssnext({
          features: {
            autoprefixer: {
              grid: true,
              cascade: false,
            },
          },
        }),
      ])
    )
    .pipe(
      cssbeautify({
        indent: '  ',
      })
    )
    .pipe(
      gulpStylelint({
        reporters: [{
          formatter: 'string',
          console: true
        }],
      })
    )
    .pipe(dest('./css/'))
    .pipe(browserSync.stream())
  );
};

const cleanCSS = cb => {
  log(color.green('Pulisco file CSS'));
  del(['./css/']);
  cb();
};

const prodCSS = () => {
  log(color.green('Compilo file SCSS in CSS'));
  return (
    src('./src/scss/main.scss')
    .pipe(sass({
      importer: moduleImporter()
    }))
    .pipe(
      postcss([
        shortcss({
          skip: '-'
        }),
        cssnext({
          features: {
            autoprefixer: {
              grid: true,
              cascade: false,
            },
          },
        }),
      ])
    )
    .pipe(
      combineMq({
        beautify: false,
      })
    )
    .pipe(cssnano())
    .pipe(dest('./dist/css/')));
};

const prodcleanCSS = cb => {
  log(color.green('Pulisco file CSS'));
  del(['./dist/css/']);
  cb();
};

//** FINE - CSS TASKS **//


//** JAVASCRIPT TASKS **//  

const js = () => {
  log(color.green('Concateno file JS'));
  return (
    src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(dest('./js/'))
    .pipe(browserSync.stream()));
};

const cleanJS = cb => {
  log(color.green('Pulisco file JS'));
  del(['./js/index.js']);
  cb();
};

const prodjs = () => {
  log(color.green('Concateno file JS'));
  return (
    src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(dest('./dist/js/')));
};

const prodcleanJS = cb => {
  log(color.green('Pulisco file JS'));
  del(['./dist/js/']);
  cb();
};

//** FINE - JAVASCRIPT TASKS **//


//** IMAGES TASKS **// 

const optimizeImage = () => src('./src/img-not/*.*').pipe(imagemin()).pipe(image({
  optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
  pngquant: ['--speed=1', '--force', 256],
  zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
  jpegRecompress: ['--strip'],
  mozjpeg: ['-optimize', '-progressive'],
  guetzli: ['--quality', 85],
  gifsicle: ['--optimize'],
  svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
})).pipe(dest('./src/img/'));

const devimg = () => {
  log(color.green('Creo immagini'));
  return (src('./src/img-not/*.*').pipe(dest('./img')));
};

const devimgwebp = () => {
  log(color.green('Creo immagini webp'));
  return (src('./src/img-not/*.{jpg,png}').pipe(webp()).pipe(dest('./img/webp')));
}

const cleanIMG = cb => {
  log(color.green('Pulisco immagini'));
  del(['./img/*.*', './dist/img/webp/*.*']);
  cb();
};

const prodimg = () => {
  log(color.green('Creo immagini'));
  return (src('./src/img/*.*').pipe(dest('./dist/img')));
};

const prodimgwebp = () => {
  log(color.green('Creo immagini webp'));
  return (src('./src/img/*.{jpg,png}').pipe(webp()).pipe(dest('./dist/img/webp')));
};

const prodcleanimg = cb => {
  log(color.green('Pulisco immagini'));
  del(['./dist/img/*.*', './dist/img/webp/*.*']);
  cb();
};

//** FINE - IMAGES TASKS **// 


//** ELENCO TASK **//

const watchFiles = () => {
  watch('./src/scss/**/**/*.scss', series(cleanCSS, CSS));
  watch('./src/views/**/*.pug', series(cleanHTML, html));
  watch('./src/js/*.js', series(cleanJS, js));
  watch('./src/img-not/*.*', series(cleanIMG, devimg, devimgwebp));
};

exports.optimizeImage = optimizeImage;

// Lancia questo durante il development // 

exports.dev = series(series(cleanCSS, cleanHTML, cleanJS, cleanIMG), series(html, CSS, js, devimg, devimgwebp), parallel(watchFiles, browserSyncTask));

// Lancia questo per la build //
exports.build = parallel(
  series(prodcleanHTML, prodhtml),
  series(prodcleanCSS, prodCSS),
  series(prodcleanJS, prodjs),
  series(prodcleanimg, prodimg, prodimgwebp)
);