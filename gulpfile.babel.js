'use strict';

import autoprefixer from 'autoprefixer';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import handlebars from 'gulp-handlebars';
import imagemin from 'gulp-imagemin';
import panini from 'panini';
import postcss from 'gulp-postcss';
import mqpacker from 'css-mqpacker';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import webpackStream from 'webpack-stream';

// Base file paths
const basePath = {
  src: 'src',
  assets: 'assets',
  dest: 'dist'
};

// View paths
const viewAssets = {
  pages: `${basePath.src}/pages`,
  partials: `${basePath.src}/partials`,
  data: `${basePath.src}/data`,
  layouts: `${basePath.src}/layouts`
};

// Source paths
const srcAssets = {
  root: `${basePath.src}/${basePath.assets}/`,
  images: `${basePath.src}/${basePath.assets}/images`,
  scripts: `${basePath.src}/${basePath.assets}/js`,
  styles: `${basePath.src}/${basePath.assets}/scss`
};

// Destination paths
const destAssets = {
  root: `${basePath.dest}/`,
  images: `${basePath.dest}/img/`,
  scripts: `${basePath.dest}/js/`,
  styles: `${basePath.dest}/css/`
};

// Sass file paths
const sassFiles = [srcAssets.styles];

// Hanelbars file paths
const viewFiles = [viewAssets.root, viewAssets.components, viewAssets.elements];

// Load updated HTML templates and partials into Panini
gulp.task('refresh', () => {
  panini.refresh();
});

// Delete the "dist" folder
gulp.task('clean', () => {
  return del([destAssets.root]);
});

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Copy page templates into finished HTML files
gulp.task('pages', () => {
  return gulp
    .src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(
      panini({
        root: 'src/pages/',
        layouts: 'src/layouts/',
        partials: 'src/partials/',
        data: 'src/data/'
      })
    )
    .pipe(gulp.dest(destAssets.root));
});

// CSS
gulp.task('styles', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 2 versions', 'ie >= 11', 'ios 8'] }),
    mqpacker({ sort: true })
  ];

  gulp
    .src(`${srcAssets.styles}/screen.scss`)
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

// Local server
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: destAssets.root
    }
  });
});

// Images
gulp.task('images', () => {
  return gulp
    .src(`${srcAssets.images}/**/*.+(png|jpg|gif|svg)`)
    .pipe(imagemin())
    .pipe(gulp.dest(destAssets.images));
});

// Copy
gulp.task('copy', () => {
  return gulp
    .src(`${srcAssets.images}/**/*.+(png|jpg|gif|svg)`)
    .pipe(gulp.dest(destAssets.images));
});

// Watch
gulp.task('watch', ['browserSync'], () => {
  gulp.watch(`${srcAssets.images}/**/*.+(png|jpg|gif|svg)`, ['copy']);
  gulp.watch(
    [
      `${srcAssets.styles}/**/*.+(scss|sass|css)`,
      `${viewAssets.root}**/*.scss`
    ],
    ['styles', browserSync.reload]
  );
  gulp.watch(`${srcAssets.scripts}/**/*.js`, ['scripts', browserSync.reload]);
  gulp.watch(`${basePath.src}/**/*.{html,hbs}`, [
    'pages',
    'refresh',
    browserSync.reload
  ]);
});

// Build
gulp.task('build', () => {
  runSequence('clean', 'scripts', 'pages', 'styles', 'images');
});

// Default
gulp.task('default', () => {
  runSequence('build', 'watch');
});
