
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (config) {
    return {
        entry: {
            main: './src/renderer/main.js',
        },
        output: {
            path: path.resolve(__dirname, "dist/renderer"),
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: 'file-loader',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'static/index.html',
                title: 'Marvin',
                filename: 'main.html',
                chunks: ['main'],
            }),
        ],
        devServer: {
            contentBase: [
                '/home/roland/Workspace/marvin/static',
                '/home/roland/Workspace/marvin/dist/renderer-dll'
            ],
            host: 'localhost',
            port: '9080',
            hot: true,
            overlay: true
        },
    };
}