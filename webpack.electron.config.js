const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const nodeEnv = isProduction ? 'production' : 'development';
const electronConfig = {
  target: 'electron-main',
  entry: ['@babel/polyfill', './app/main.ts'],
  output: {
    filename: 'main.js',
    path: `${__dirname}/build`,
    publicPath: '/',
  },
  mode: nodeEnv,
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ['babel-loader'],
        include: [`${__dirname}/app`],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve('./app'),
      path.resolve('./node_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
        REDIRECT_URI: JSON.stringify(process.env.REDIRECT_URI),
      },
    }),
  ],
};

module.exports = electronConfig;
