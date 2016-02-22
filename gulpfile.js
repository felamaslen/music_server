const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');

var webpackConfig = require('./webpack.config.js');

webpackConfig.module.loaders[0].loaders.unshift('uglify-loader');

gulp.task('default', function() {
  // builds the client into build/

  return gulp.src('client/js/index.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build/'));
});
