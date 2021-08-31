// vue.config.js
module.exports = {
    publicPath: "/znjhweb",
    css: {
        loaderOptions: {
            less: {
                /* modifyVars: {
                    'primary-color': '#1DA57A',
                    'link-color': '#1DA57A',
                    'border-radius-base': '2px',
                }, */
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        open: true,
        port: "8080",
        proxy: {
            "/gsznkf/apibk": {
                // target: 'https://dev.bcop.com:31186',  // 苏研
                // target: 'https://172.31.191.3:30443',  // 信息港
                target: "http://117.156.26.173:30000", // 甘肃
                // target: 'http://172.31.232.106:7777',
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/gsznkf/apibk': '/'
                }
            }
        }
    },
    transpileDependencies: ["ant-design-vue"]
};
