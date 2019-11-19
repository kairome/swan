const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const nodeEnv = isProduction ? 'production' : 'development';

const getAppVersion = () => {
  const packageFile = fs.readFileSync(`${__dirname}/package.json`, 'utf8');
  const parsed = JSON.parse(packageFile);
  return parsed ? parsed.version : '1.0.0';
};

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
        APP_VERSION: JSON.stringify(getAppVersion()),
      },
    }),
    new CopyPlugin([
      {
        from: './icons',
        to: 'icons/',
      },
      {
        from: './app/menu',
        to: 'menu/',
      },
    ]),
  ],
};

module.exports = electronConfig;
