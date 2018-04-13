export const output = {
  filename: 'bundle.js'
};
export const resolve = {
  modules: ['node_modules', 'bower_components'],
  descriptionFiles: ['package.json', 'bower.json']
};
export const module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: [['latest', { modules: false }]]
      }
    }
  ]
};
