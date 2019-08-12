const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const devConfig = require('./webpack/dev');
const prodConfig = require('./webpack/prod');

const isProduction = process.env.NODE_ENV === 'production';

const nodeEnv = isProduction ? 'production' : 'development';
const fixNedbForElectronRenderer = {
  apply(resolver) {
    resolver
    // Plug in after the description file (package.json) has been
    // identified for the import, which makes sure we're not getting
    // mixed up with a different package.
      .getHook('beforeDescribed-relative')
      .tapAsync(
        'FixNedbForElectronRenderer',
        (request, resolveContext, callback) => {
          // When a require/import matches the target files, we
          // short-circuit the Webpack resolution process by calling the
          // callback with the finalized request object -- meaning that
          // the `path` is pointing at the file that should be imported.
          const isNedbImport = request.descriptionFileData.name === 'nedb-core';

          if (isNedbImport && /storage(\.js)?/.test(request.path)) {
            const newRequest = Object.assign({}, request, {
              path: resolver.join(
                request.descriptionFileRoot,
                'lib/storage.js',
              ),
            });
            callback(null, newRequest);
          } else if (
            isNedbImport
            && /customUtils(\.js)?/.test(request.path)
          ) {
            const newRequest = Object.assign({}, request, {
              path: resolver.join(
                request.descriptionFileRoot,
                'lib/customUtils.js',
              ),
            });
            callback(null, newRequest);
          } else {
            // Calling `callback` with no parameters proceeds with the
            // normal resolution process.
            return callback();
          }
        },
      );
  },
};
const clientConfig = {
  target: 'electron-renderer',
  entry: ['@babel/polyfill', './src/index.tsx'],
  output: {
    filename: 'app.[hash].js',
    path: `${__dirname}/build/public`,
    publicPath: isProduction ? undefined : '/',
  },
  mode: nodeEnv,
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ['babel-loader'],
        include: [`${__dirname}/src`],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'base64-inline-loader?limit=1000&name=[name].[ext]',
        ],
      },
      {
        test: /\.svg$/i,
        use: [
          'svg-inline-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
    plugins: [fixNedbForElectronRenderer],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ENV_NAME: JSON.stringify(process.env.ENV_NAME),
      },
    }),
  ],
};

module.exports = isProduction ? merge(clientConfig, prodConfig) : merge(clientConfig, devConfig);
