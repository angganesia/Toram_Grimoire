var path = require('path');
var webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    'grimoire': './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'public', 'dist'),
    filename: '[name].min.js',
    publicPath: 'dist/'
  },
  devServer: {
    contentBase: './public/',
    hot: true,
    inline: true,
    historyApiFallback: true
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue': path.join(__dirname, 'src', 'lib', 'plugin', 'vue.esm.browser.js'),
      '@global-vue-components': path.join(__dirname, 'src', 'components', 'global'),
      '@vue-components': path.join(__dirname, 'src', 'components'),
      '@views': path.join(__dirname, 'src', 'views'),
      '@store': path.join(__dirname, 'src', 'store'),
      '@global-modules': path.join(__dirname, 'src', 'lib', 'main', 'module'),
      '@css': path.join(__dirname, 'src', 'assets', 'css'),
      '@Grimoire': path.join(__dirname, 'src', 'lib', 'main', 'Grimoire.js'),
      '@lib': path.join(__dirname, 'src', 'lib')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin()
  ]
};