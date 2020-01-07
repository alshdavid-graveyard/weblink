const path = require("path")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const fs = require('fs-extra')

const environments = {
  prod: "production",
  dev: "development"
}
const mode = process.argv.includes("--prod")
  ? environments.prod
  : environments.dev

if (mode === environments.prod) {
  process.env.NODE_ENV = environments.prod
}

const statsPlugin = process.argv.includes("--stats")
  ? [new BundleAnalyzerPlugin()]
  : []

function getDirectories(path){
  let filesAndDirectories = fs.readdirSync(path);

  let directories = [];
  filesAndDirectories.map(name =>{
      const result = fs.statSync(path + '/' + name)
      if(result.isDirectory()) {
        directories.push(name)
      }
  })
  return directories;
}

module.exports = {
  entry: {
    'index': path.join(__dirname, "/src/cmd/gui/main.ts"),
    'worker': path.join(__dirname, "/src/cmd/worker/main.ts"),
    'client': path.join(__dirname, "/src/cmd/client/main.ts"),
    'frame': path.join(__dirname, "/src/cmd/frame/main.ts")
  },
  mode,
  output: {
    path: path.join(__dirname, "static"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      '~': path.resolve('./src')
    }
  },
  plugins: [
    ...statsPlugin,
  ],
  externals: {

  }
}
