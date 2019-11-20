const config = {
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json', 'bower.json'],
    alias: {
      handlebars: 'handlebars/dist/handlebars.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          /bower_components/,
          /src\/assets\/js\/templates/
        ],
        loader: 'babel-loader',
        query: {
          presets: [['env', { modules: false }]]
        }
      }
    ]
  }
};

module.exports = config;
