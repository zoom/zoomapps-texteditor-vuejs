const path = require('path');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: path.resolve(__dirname, '../dist/public'),
});
