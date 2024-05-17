const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'electron-main',
    entry: {
        index: './src/index.ts',
        renderer: './src/renderer/renderer.ts',
        file_management_preload: './src/fileManagementBackend/fileManagementPreload.ts'
    },
    devServer: {
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css/,
                type: 'asset/resource',
                include: [path.resolve(__dirname, 'src/assets')]
            },
            {
                test: /\.json/,
                type: 'asset/resource',
                include: [path.resolve(__dirname, 'src/assets')]
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        assetModuleFilename: 'assets/[name][ext]',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/assets/index.html'
    })]
}