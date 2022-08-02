const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: {
      worker: './src/controllers/main.worker.ts'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
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
    ]
  },
];