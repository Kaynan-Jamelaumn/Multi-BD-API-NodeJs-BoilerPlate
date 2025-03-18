import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  target: 'node',
  entry: './src/server.ts',
  externals: [nodeExternals()], // Exclude node_modules from bundle
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(html|cs)$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.json', '.mjs'],
    alias: {
      // Add any path aliases you're using in tsconfig.json
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$|^\.\/locale$/,
    }),
    new webpack.DefinePlugin({
      __dirname: JSON.stringify(__dirname), // Preserve __dirname
    }),
  ],
  stats: {
    errorDetails: true,
  },
  node: {
    __dirname: false, // Preserve Node.js __dirname behavior
    __filename: false, // Preserve Node.js __filename behavior
  },
};