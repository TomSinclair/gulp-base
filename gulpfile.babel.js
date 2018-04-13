'use strict';

import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import nunjucksMd from 'gulp-nunjucks-md';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import autoprefixer from 'autoprefixer';
import del from 'del';
import mqpacker from 'css-mqpacker';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import babel from 'gulp-babel';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';

const reload = browserSync.reload;

// Base file paths
const basePath = {
  src: '_client/',
  dest: 'dist/',
  views: 'views/'
};

// View paths
const viewAssets = {
  root: basePath.views,
  components: basePath.views + 'components/',
  elements: basePath.views + 'elements/'
};

// Source paths
const srcAssets = {
  root: basePath.src,
  images: basePath.src + 'images/',
  scripts: basePath.src + 'scripts/',
  styles: basePath.src + 'styles/'
};

// Destination paths
const destAssets = {
  root: basePath.dest,
  images: basePath.dest + 'img/',
  scripts: basePath.dest + 'js/',
  styles: basePath.dest + 'css/'
};

// Sass file paths
const sassFiles = [srcAssets.styles];

// Nunjucks file paths
const viewFiles = [viewAssets.root, viewAssets.components, viewAssets.elements];

// CSS
gulp.task('styles', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 2 versions', 'ie >= 10', 'ios 8'] }),
    mqpacker({ sort: true })
  ];

  gulp
    .src(srcAssets.styles + '/screen.scss')
    .pipe(
      sass({
        outputStyle: 'uncompressed',
        includePaths: sassFiles
      }).on('error', sass.logError)
    )
    .pipe(postcss(plugins))
    .pipe(gulp.dest(destAssets.styles))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// JS
gulp.task('scripts', () => {
  gulp
    .src(`${srcAssets.scripts}/**`)
    .pipe(sourcemaps.init())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(destAssets.scripts));
});

// Clean assets
gulp.task('clean', () => {
  return del([destAssets.root]);
});

// Local server
gulp.task('browserSync', ['styles'], () => {
  browserSync.init({
    server: {
      baseDir: destAssets.root
    }
  });
});

// Images
gulp.task('images', () => {
  return gulp
    .src(`${srcAssets.images}**/*.+(png|jpg|gif|svg)`)
    .pipe(imagemin())
    .pipe(gulp.dest(destAssets.images));
});

// Copy
gulp.task('copy', () => {
  return gulp
    .src(`${srcAssets.images}**/*.+(png|jpg|gif|svg)`)
    .pipe(gulp.dest(destAssets.images));
});

// Template
gulp.task('template', () => {
  return gulp
    .src(`${viewAssets.root}templates/**/*.+(html|nunjucks|njk)`)
    .pipe(
      nunjucksMd({
        path: viewFiles,
        data: 'config.json'
      })
    )
    .pipe(gulp.dest(destAssets.root));
});

// Watch
gulp.task('watch', ['browserSync', 'styles', 'template', 'copy'], () => {
  gulp.watch(`${srcAssets.images}**/*.+(png|jpg|gif|svg)`, ['copy']);
  gulp.watch(
    [`${srcAssets.styles}**/*.+(scss|sass|css)`, `${viewAssets.root}**/*.scss`],
    ['styles']
  );
  gulp.watch(`${srcAssets.scripts}**/*.js`, ['scripts', browserSync.reload]);
  gulp.watch(`${viewAssets.root}**/*.+(html|nunjucks|njk)`, [
    'template',
    browserSync.reload
  ]);
});

// Default
gulp.task('default', () => {
  runSequence('clean', ['template', 'styles', 'images', 'scripts'], 'watch');
});
