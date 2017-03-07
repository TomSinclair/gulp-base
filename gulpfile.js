var gulp = require('gulp'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    nunjucksMd = require('gulp-nunjucks-md'),
    nunjucksRender = require('gulp-nunjucks-render'),
    postcss = require('gulp-postcss'),
    rev = require('gulp-rev'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var autoprefixer = require('autoprefixer');
var cssNano = require('cssnano');
var del = require('del');
var lazypipe = require('lazypipe');
var merge = require('merge-stream');
var mqpacker = require('css-mqpacker');
var runSequence = require('run-sequence');

// Base file paths
var basePath = {
  src   : '_client/',
  dest  : 'build/',
  views : 'views/'
};

// View paths
var viewAssets = {
  root        : basePath.views,
  components  : basePath.views + 'components/',
  elements    : basePath.views + 'elements/'
};

// Source paths
var srcAssets = {
  root       : basePath.src,
  images     : basePath.src + 'images/',
  scripts    : basePath.src + 'scripts/',
  styles     : basePath.src + 'styles/'
};

// Destination paths
var destAssets = {
  root    : basePath.dest,
  images  : basePath.dest + 'img/',
  scripts : basePath.dest + 'js/',
  styles  : basePath.dest + 'css/'
};

// Sass file paths
var sassFiles = [
  srcAssets.styles
];

// Nunjucks file paths
var viewFiles = [
  viewAssets.root,
  viewAssets.components,
  viewAssets.elements
];

// CSS
gulp.task('styles', function() {
  var plugins = [
    autoprefixer({browsers: ['last 2 versions', 'ie >= 10', 'ios 8']}),
    mqpacker({sort: true})
  ];

  gulp.src(srcAssets.styles + '/screen.scss')
    .pipe(sass({ 
      outputStyle: 'uncompressed',
      includePaths: sassFiles
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(destAssets.styles))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// JS
gulp.task('scripts', function () {
  // gulp.src(scriptFiles)
  // .pipe(concat('main.js'))
  // .pipe(uglify())
  // .pipe(gulp.dest(destAssets.scripts));
});

// Clean assets
gulp.task('clean', function() {
  return del([
    destAssets.root
  ]);
});

// Local server
gulp.task('browserSync', ['styles'], function() {
  browserSync.init({
      server: {
          baseDir: destAssets.root
      }
  });
});

// Images
gulp.task('images', function() {
  return gulp.src(srcAssets.images + '**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest(destAssets.images))
});

// Copy
gulp.task('copy', function() {
  return gulp.src(srcAssets.images + '**/*.+(png|jpg|gif|svg)')
  .pipe(gulp.dest(destAssets.images))
});

// Template
gulp.task('template', function() {
  return gulp.src(viewAssets.root + 'templates/**/*.+(html|nunjucks|njk)')
  .pipe(nunjucksMd({
    path: viewFiles,
    data: 'config.json'
  }))
  .pipe(gulp.dest(destAssets.root))
});

// Watch
gulp.task('watch', ['browserSync', 'styles', 'template', 'copy'], function() {
  gulp.watch(srcAssets.images + '**/*.+(png|jpg|gif|svg)', ['copy']);
  gulp.watch([srcAssets.styles + '**/*.+(scss|sass|css)', viewAssets.root + '**/*.scss'], ['styles']);
  gulp.watch(srcAssets.scripts + '**/*.js', ['scripts',browserSync.reload]);
  gulp.watch(viewAssets.root + '**/*.+(html|nunjucks|njk)', ['template', browserSync.reload]);
});

// Default
gulp.task('default', function() {
  runSequence(
    'clean', 
    ['template', 'styles', 'images'], 
    'watch'
  );
});