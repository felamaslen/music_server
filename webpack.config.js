const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './client/js/index.jsx',
  output: { path: __dirname + '/build', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        exclude: '/node_modules/'
      }
    ]
  }
};


