var webpack = require('webpack');
var path = require('path');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
  //Report the first error as a hard error instead of tolerating it.
  //The base directory (absolute path!) for resolving the entry option
  // context: path.resolve(__dirname , ".."),
  entry: [
    './src/entry.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".json"],
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    root: [
      path.join(__dirname, "bower_components")
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          "presets": ["stage-2"]
        }
      },
      { test: /\.s[c|a]ss$/, loader: 'style!css' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|jpg|jpeg)$/, loader: 'url-loader?limit=8192' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  presets: ["es2015"],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    )
  ]
};