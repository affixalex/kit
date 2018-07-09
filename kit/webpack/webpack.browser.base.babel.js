/**
 * COMMON WEBPACK CONFIGURATION
 */
// Webpack 4 is our bundler of choice.
import webpack from 'webpack';
// We'll use `webpack-config` to create a 'base' config that can be
// merged/extended from for further configs
import WebpackConfig from 'webpack-config';
import path from 'path';
// Our local path configuration, so webpack knows where everything is/goes.
// Since we haven't yet established our module resolution paths, we have to
// use the full relative path
import PATHS from '../../config/paths';
// Disable deprecation warnings.
process.noDeprecation = true;

export default new WebpackConfig().merge({
  output: Object.assign({ // Compile into 'dist'
    path: path.resolve(process.cwd(), 'dist/public/'),
    publicPath: '/',
  }), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
          ],
          plugins: [
            "transform-class-properties",
            "transform-decorators-legacy",
            "transform-object-rest-spread",
            "dynamic-import-node",
            "graphql-tag",
            "import-graphql",
            "transform-react-remove-prop-types",
            "transform-react-constant-elements",
            "transform-react-inline-elements"
          ],
        },
      },
      {
        // Preprocess our own .scss files
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['css-loader', 'style-loader'],
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                gifsicle: {
                  interlaced: true
                },
                mozjpeg: {
                  progressive: true
                },
                optipng: {
                  optimizationLevel: 7
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                }
              }
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch'
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
    })
  ],
  resolve: {
    modules: ['src', 'node_modules', '.'],
    extensions: [
      '.js',
      '.jsx',
      '.scss',
      '.react.js'
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main'
    ]
  },
  optimization: {
    namedModules: true,
    splitChunks: {
      minChunks: 2,
      cacheGroups: {
        commons: { 
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
          enforce: true
        }
      }
    }
  },
  node: {
    __dirname: false,
  }
});
