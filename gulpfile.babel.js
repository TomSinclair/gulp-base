'use strict';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import compression from 'compression';
import mqpacker from 'css-mqpacker';
import del from 'del';
import gulp from 'gulp';
import concat from 'gulp-concat';
import declare from 'gulp-declare';
import handlebars from 'gulp-handlebars';
import imagemin from 'gulp-imagemin';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
// import uglify from 'gulp-uglify';
import wrap from 'gulp-wrap';
import panini from 'panini';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';

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
  fonts: `${basePath.src}/${basePath.assets}/fonts`,
  images: `${basePath.src}/${basePath.assets}/img`,
  scripts: `${basePath.src}/${basePath.assets}/js`,
  styles: `${basePath.src}/${basePath.assets}/scss`
};

// Destination paths
const destAssets = {
  root: `${basePath.dest}/`,
  fonts: `${basePath.dest}/fonts/`,
  images: `${basePath.dest}/img/`,
  scripts: `${basePath.dest}/js/`,
  styles: `${basePath.dest}/css/`
};

// Sass file paths
const sassFiles = [srcAssets.styles];

// Load updated HTML templates and partials into Panini
gulp.task('refresh', () => {
  panini.refresh();
});

// Delete the "dist" folder
gulp.task('clean', () => {
  return del([destAssets.root]);
});

// Precompile Handlebars templates
gulp.task('precompile', () => {
  return gulp
    .src('src/partials/**/precompile/*.hbs')
    .pipe(
      handlebars({
        handlebars: require('handlebars')
      })
    )
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(
      declare({
        namespace: 'templates',
        noRedeclare: true,
        root: 'Handlebars'
      })
    )
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(`${srcAssets.scripts}/templates`));
});

// Copy page templates into finished HTML files
gulp.task('pages', () => {
  return gulp
    .src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(
      panini({
        root: 'src/pages/',
        layouts: 'src/layouts/',
        partials: 'src/partials/',
        data: 'src/data/',
        helpers: 'src/helpers/'
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
    .src(`${srcAssets.styles}/app.scss`)
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
    .src(`${srcAssets.scripts}/**/*`)
    .pipe(sourcemaps.init())
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(destAssets.scripts));
});

// Local server
gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: destAssets.root,
      middleware: [compression()]
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

// Fonts
gulp.task('fonts', () => {
  gulp
    .src(`${srcAssets.fonts}/**.+(woff|woff2|ttf)`)
    .pipe(gulp.dest(destAssets.fonts));
});

// Copy
gulp.task('copy', () => {
  return gulp
    .src(`${srcAssets.images}/**/*.+(png|jpg|gif|svg)`)
    .pipe(gulp.dest(destAssets.images));
});

// Watch
gulp.task('watch', ['browserSync'], () => {
  gulp.watch(`${srcAssets.fonts}/**/*.+(woff|woff2|ttf)`, ['fonts']);
  gulp.watch(`${srcAssets.images}/**/*.+(png|jpg|gif|svg)`, ['copy']);
  gulp.watch(`${srcAssets.root}/**/*.scss`, ['styles', browserSync.reload]);
  gulp.watch(`${srcAssets.scripts}/**/*.js`, ['scripts', browserSync.reload]);
  gulp.watch(
    [`${viewAssets.partials}/**/*.hbs`, `${viewAssets.layouts}/**/*.hbs`],
    ['pages', 'refresh', browserSync.reload]
  );
  gulp.watch(`${viewAssets.pages}/*.html`, [
    'pages',
    'refresh',
    browserSync.reload
  ]);
  gulp.watch(`${viewAssets.data}/**/*.json`, [
    'pages',
    'refresh',
    browserSync.reload
  ]);
});

// Build
gulp.task('build', () => {
  runSequence(
    'clean',
    'precompile',
    'fonts',
    'scripts',
    'pages',
    'styles',
    'images'
  );
});

// Default
gulp.task('default', () => {
  runSequence('build', 'watch');
});
