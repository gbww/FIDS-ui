'use strict';

module.exports = {
  plumber: require('gulp-plumber'),
  sourcemaps: require('gulp-sourcemaps'),
  uglify: require('gulp-uglify'),
  rename: require('gulp-rename'),
  minifyHtml: require('gulp-minify-html'),
  csso: require('gulp-csso'),
  inject: require('gulp-inject'),
  imagemin: require('gulp-imagemin'),
  ngAnnotate: require('gulp-ng-annotate'),
  jshint: require('gulp-jshint'),
  sass: require('gulp-sass'),
  es6: require('gulp-babel'),
  filter: require('gulp-filter'),
  // 给js和css加后缀
  rev: require('gulp-rev'),
  // 将压缩后的js和css同步到html中
  revReplace: require('gulp-rev-replace'),
  runSequence: require('run-sequence'),
  mainBowerFiles: require('main-bower-files'),
  sort: require('sort-stream'),
  if: require('gulp-if'),
  filter: require('gulp-filter'),
  // 压缩html中的js、css
  useref: require('gulp-useref'),
  wiredep: require('wiredep').stream,
  angularFileSort: require('gulp-angular-filesort'),
  ngHtml2js: require('gulp-ng-html2js'),
  concat: require('gulp-concat'),
  manifest: require('gulp-manifest')
};
