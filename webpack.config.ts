import glob from 'glob'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import PurgeCSSPlugin from 'purgecss-webpack-plugin'
import * as webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

function ignore() {
  new PurgeCSSPlugin({
    paths: glob.sync(PATHS.src('/**/*{.ts,.js,.pug}'), {nodir: true})
  })
}

interface Configuration extends webpack.Configuration {
  devServer?: webpackDevServer.Configuration
}

function pathMaker(segment: string) {
  const _base = path.resolve(__dirname, segment)
  return (...segments: string[]) => path.join(_base, ...segments)
}

const PATHS = {
  src: pathMaker('src'),
  webworkers: pathMaker('src/workers'),
  dist: pathMaker('dist')
}

const config: Configuration = {
  mode: 'production',
  entry: {
    index: PATHS.src('index.ts'),
    'service-worker': PATHS.webworkers('service-worker.ts')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
        options: {
          instance: 'main'
        },
        exclude: {
          or: [
            PATHS.webworkers(),
            /node_modules/,
            /webpack\.config\.ts/
          ]
        }
      },
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
        options: {
          instance: 'webworkers'
        },
        include: PATHS.webworkers()
      },
      {test: /\.pug$/i, loader: 'simple-pug-loader'},
      {test: /\.s[ac]ss$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: PATHS.dist()
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: PATHS.src('index.pug'),
      minify: false,
      chunks: ['index']
    }),
    new MiniCssExtractPlugin({filename: '[name].css'})
  ],
  devServer: {
    https: true,
    devMiddleware: {
      writeToDisk: false
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}

export default config
