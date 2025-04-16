module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime'
  ]
};
