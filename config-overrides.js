const { override, fixBabelImports, addLessLoader } = require('customize-cra');
// 针具antd实现按需打包：根据import来打包(使用bable-plugin-import)
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, //自动打包相关的样式
    }),
    // 使用less-loader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' }, //主题颜色
    })
);