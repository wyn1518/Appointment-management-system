const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin


module.exports = {
  mode: 'development',
  entry: './frontend/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './backend/public/js'),
  },
  optimization: {
    
    minimize: true,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      `...`,
      // new CssMinimizerPlugin(),
      // new BundleAnalyzerPlugin()
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'styles.css', // Name of the output CSS file
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, './backend/public'),
    },
    port: 3333,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, './frontend/css'),
        exclude: /node_modules/,
        // use: ['postcss-loader'],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
};