const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/list.html',
  filename: 'list.html',
  inject: 'body'
})

module.exports = {
  entry: './client/list.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
devServer: {
  publicPath: path.join(__dirname, "/build"),
  port: 8080,
  hot: true
},
  plugins: [HtmlWebpackPluginConfig]
}
