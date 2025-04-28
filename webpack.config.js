const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

const mainConfig = {
  mode: 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.ELEVENLABS_API_KEY': JSON.stringify(process.env.ELEVENLABS_API_KEY)
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true
  }
};

const overlayConfig = {
  ...mainConfig,
  entry: './src/overlay/index.tsx',
  output: {
    filename: 'overlay.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/overlay/index.html',
      filename: 'overlay.html'
    })
  ],
  devServer: {
    ...mainConfig.devServer,
    port: 3001
  }
};

module.exports = [mainConfig, overlayConfig]; 