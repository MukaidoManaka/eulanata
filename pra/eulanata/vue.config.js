const path = require('path');
module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        lintOnSave: false,
        proxy: {
            '/api': {
                // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
                target: 'https://www.baidu.com/',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    }
};

//配置全局less文件
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, "./src/assets/css/init.less")]
        });
}