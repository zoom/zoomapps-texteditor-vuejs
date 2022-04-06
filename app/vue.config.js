const path = require('path');
const { defineConfig } = require('@vue/cli-service');

const port = '3000';

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            '^/app': {
                target: `http://localhost:${port}`,
                changeOrigin: true,
                logLevel: 'debug',
                pathRewrite: { '^/app': '/api' },
            },
        },
    },
});
