const { src, dest, watch, parallel, series } = require('gulp');
const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
/* const del          = require('del');
 */const browserSync  = require('browser-sync').create();
/* const autoprefixer = require('gulp-autoprefixer'); */

const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');

function browsersync() {
   browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notofy: false
   })
}



function styles() {
  return src('app/scss/style.scss')
  .pipe(scss({outputStyle: 'compressed'}))
  .pipe(concat('style.min.css'))
  /* .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  })) */
  .pipe(dest('app/css'))
  .pipe(browserSync.stream())

}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/mixitup/dist/mixitup.js',
    'node_modules/slick-carousel/slick/slick.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
   
}
function images(){
  return src('app/images/**/*.*')
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: true
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      })
    ]))
    .pipe(dest('dist/images'))
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

/* function cleanDist() {
  return del('dist')
} */

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
  watch(['app/images/icons/*.svg'], svgSprites);
}

function svgSprites() {
  return src('app/images/icons/*.svg')
    .pipe(cheerio({
      run: ($) => {
        $("[fill]").removeAttr("fill"); // очищаем цвет у иконок по умолчанию, чтобы можно было задать свой
        $("[stroke]").removeAttr("stroke"); // очищаем, если есть лишние атрибуты строк
        $("[style]").removeAttr("style"); // убираем внутренние стили для иконок
      },
      parserOptions: { xmlMode: true },
    })
    )
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(dest('app/images'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.svgSprites = svgSprites;
/* exports.cleanDist = cleanDist;
 */exports.build = series(/* cleanDist ,*/ images, build);


exports.default = parallel(svgSprites, styles, scripts, browsersync, watching); 
