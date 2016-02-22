const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config.js');

gulp.task('default', function() {
  // builds the client into build/

  return gulp.src('client/js/index.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/'));
});
