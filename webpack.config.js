const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
  rules: [
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "ts-loader",
      },
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      }
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
    {
      test: /\.s[ac]ss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    },
    {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|png|jpg|jpeg|svg|gif)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "assets/",
        },
      },
    },
  ],
},

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/locales/en/translation.json",
          to: "locales/en/[name].[contenthash][ext]",
        },
        {
          from: "public/locales/gu/translation.json",
          to: "locales/gu/[name].[contenthash][ext]",
        },
        {
          from: "public/locales/hi/translation.json",
          to: "locales/hi/[name].[contenthash][ext]",
        },
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "build"),
          globOptions: {
            ignore: [
              "**/index.html",
              "**/locales/hi/translation.json",
              "**/locales/gu/translation.json",
              "**/locales/en/translation.json",
            ],
          },
        },
      ],
    }),
    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: "/",
      writeToFileEmit: true,
    }),
  ],
};
