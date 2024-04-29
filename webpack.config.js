const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'electron-main',
    entry: {
        index: './src/index.ts',
        renderer: './src/renderer/renderer.ts'
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
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.txt/,
                type: 'asset/source'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        publicPath: 'auto',
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html'
    })]
}