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

const defaultTask = cb => {
  cb();
};

const browserSyncTask = cb => {
  browserSync.init({
    server: {
      baseDir: './',
      browser: 'google chrome canary',
    },
  });
  cb();
};

const html = () =>
  src(['./src/views/*.pug', '!./src/views/_?*.pug'])
  .pipe(
    pug({
      pretty: true,
    })
  )
  .pipe(dest('./'))
  .pipe(browserSync.stream());

const prodhtml = () =>
  src(['./src/views/*.pug', '!./src/views/_?*.pug'])
  .pipe(
    pug({
      pretty: true,
    })
  )
  .pipe(dest('./dist'));

const prodjs = () =>
  src('./src/js/index.js')
  // .pipe(browserify())
  .pipe(dest('./dist/js/'));

const js = () =>
  src('./src/js/index.js')
  // .pipe(browserify())
  .pipe(dest('./js/'))
  .pipe(browserSync.stream());

const prodimg = () => src('./src/img/*.*').pipe(dest('./dist/img'));
const prodimgwebp = () => src('./src/img/*.*').pipe(webp()).pipe(dest('./dist/img/webp'));

const optimizeImage = () => src('./src/img-not/*.*').pipe(imagemin()).pipe(image({
  optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
  pngquant: ['--speed=1', '--force', 256],
  zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
  jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
  mozjpeg: ['-optimize', '-progressive'],
  guetzli: ['--quality', 85],
  gifsicle: ['--optimize'],
  svgo: ['--enable', 'cleanupIDs', '--disable', 'convertColors']
})).pipe(dest('./src/img/'));

const prodcleanimg = cb => {
  del(['./dist/img/*.*']);
  cb();
};

const cleanCSS = cb => {
  del(['./css/']);
  cb();
};

const prodcleanCSS = cb => {
  del(['./dist/css/']);
  cb();
};

const prodcleanJS = cb => {
  del(['./dist/js/']);
  cb();
};

const cleanJS = cb => {
  del(['./js/index.js']);
  cb();
};

const cleanHTML = cb => {
  del(['./*.html']);
  cb();
};

const prodcleanHTML = cb => {
  del(['./dist/*.html']);
  cb();
};

const style = () => {
  log(color.green('Da SASS a CSS'));
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
    // .pipe(
    //   combineMq({
    //     beautify: false,
    //   })
    // )
    // .pipe(cssnano())
    .pipe(dest('./css/'))
    .pipe(browserSync.stream())
  );
};

const prodstyle = () =>
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
  .pipe(dest('./dist/css/'));

const watchFiles = () => {
  watch('./src/scss/**/*.scss', series(cleanCSS, style));
  watch('./src/views/**/*.pug', series(cleanHTML, html));
  // watch('./src/js/*.js', series(cleanJS, js));
};

exports.dev = parallel(watchFiles, browserSyncTask);
exports.img = optimizeImage;

exports.build = parallel(
  series(prodcleanHTML, prodhtml),
  series(prodcleanCSS, prodstyle),
  series(prodcleanJS, prodjs),
  series(prodcleanimg, prodimg, prodimgwebp)
);

