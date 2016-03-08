var path = require('path');
var indexHtml = path.join(__dirname, 'src', 'app', 'index.html');
console.log(indexHtml);

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|gulp)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: indexHtml,
        loaders: [
            "file?name=[name].[ext]",
            "extract",
            "html?" + JSON.stringify({
                attrs: ["img:src", "link:href"]
            })
        ]
      }
    ],
  },
  entry: ["./src/app/app", indexHtml],
  output: {
    path: 'build',
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js"
  }
}
