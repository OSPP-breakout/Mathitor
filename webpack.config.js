const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devServer: {
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    output: {
        publicPath: 'auto',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}