const path = require('path');
const webpack = require('webpack');

const babelSettings = {
  presets: ['es2015', 'react']
};

module.exports = {
  entry: './app/index.jsx',
  output: { path: __dirname + '/build', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?' + JSON.stringify(babelSettings)],
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        exclude: '/node_modules/'
      }
    ]
  }
};


