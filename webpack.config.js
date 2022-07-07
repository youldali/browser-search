const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

module.exports = [{
    mode: 'development',
    entry: {
      index: './src/index.ts',
    },
    devtool: 'source-map', 
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      library: 'browserSearch',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
            }
          },
          exclude: /node_modules/,
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ReplaceInFileWebpackPlugin([{
          dir: 'dist',
          files: ['index.js'],
          rules: [{
              search: '//@worker',
              replace: function(){
                return fs.readFileSync(path.resolve(__dirname, 'dist/worker.js'));
              }
          }]
      }])
    ]
  },
];