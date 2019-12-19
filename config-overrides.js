const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#00C5D7',
      'error-color': '#d71200',
      '@success-color': '#00d77d',
      '@info-color': '#0059d7'
    }
  })
);
