const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // css单独打包
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressbarWebpack = require('progress-bar-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const APP_PATH = path.resolve(__dirname, '../src');

process.env.NODE_ENV = 'production'; // 设置为生产环境
/* 此配置是生产环境下的极质打包模式 */

console.log('极质打包进行中......');

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/app.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/', // 编译好的文件，在服务器的路径,域名会自动添加到前面
    filename: 'static/js/[name].[chunkhash:8].bundle.js', // 编译后的文件名字
    chunkFilename: 'static/js/[name]-[id].[chunkhash:8].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              ['import', { libraryName: 'antd', style: 'css' }],
            ],
          },
        }, // loader的名称（必须）
        include: [APP_PATH],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader'],
        }),
      },
      {
        test: /\.less$/,
        exclude: /^node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
        }),
        include: [APP_PATH],
      },
      {
        test: /\.scss$/,
        exclude: /^node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader', 'sass-loader'],
        }),
        include: [APP_PATH],
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        use: 'file-loader?name=[name].[ext]',
        include: [APP_PATH],
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /^node_modules$/,
        use: 'url-loader?limit=8192&name=static/img/[hash:8].[name].[ext]',
        // 注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
        include: [APP_PATH],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 源模板文件
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件【注意：这里的根路径是module.exports.output.path】
      showErrors: true,
      inject: 'body',
    }),
    new ExtractTextPlugin('static/css/[name].[hash].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        if (module.resource && (/^.*\.(css|scss|less)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new CleanWebpackPlugin(
      ['dist/static/css/*.css', 'dist/static/js/*.js'], // 匹配删除的文件
      {
        root: path.resolve(__dirname, '../'),
        verbose: true, // 开启在控制台输出信息
        dry: false, // 启用删除文件
      } // 此处逗号eslint检查加了，无法打包0.0
    ),
    new ProgressbarWebpack(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'], // 后缀名自动补全
  },
};

