const path = require('path');
module.exports = {
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
        // config.rule('js').include.add(/node_modules\/(dom7|swiper)\/.*/)
    },
    lintOnSave: false,
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        proxy: {
            [process.env.VUE_APP_BASE_API_URL]: {
                // target: 'http://47.98.220.100', 
                target: 'http://www.keeplong.vip', 
                // target: 'http://www.jinchengdong.top', 
                // target: 'http://127.0.0.1:8000', //擦,这里不写http://会出错
                // 允许跨域
                changeOrigin: true,
                ws: true,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        }
    },
    publicPath: './',
    outputDir: 'dist',
    // assetsDir:'static'
};

//配置全局less文件
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, "./src/assets/css/init.less")]
        });
}