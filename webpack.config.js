
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const devtool = process.env.NODE_ENV === 'production' ? undefined : 'inline-source-map';

fs.rmSync(path.join(__dirname, 'bundle'), {
    force: true,
    recursive: true,
})

const commonConfig = {
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'bundle'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.(woff2|svg|png|jpe?g|gif)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin(),
        ],
    },
    mode,
    node: false,
    devtool,
    externals: {
        sqlite3: 'commonjs sqlite3',
    },
};

const mainConfig = {
    ...commonConfig,
    entry: {
        'main': path.join(__dirname, 'src', 'main', 'main.ts'),
        'msg': path.join(__dirname, 'src', 'main', 'msg.ts'),
        'worker': path.join(__dirname, 'src', 'main', 'execution', 'worker.ts'),
    },
    target: 'electron-main',
};

const rendererConfig = {
    ...commonConfig,
    entry: {
        'app': path.join(__dirname, 'src', 'renderer', 'main', 'app.ts'),
        'settings': path.join(__dirname, 'src', 'renderer', 'settings', 'settings.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'static/index.html',
            title: 'Marvin',
            filename: 'app.html',
            chunks: [ 'app' ],
        }),
        new HtmlWebpackPlugin({
            template: 'static/index.html',
            title: 'Marvin Settings',
            filename: 'settings.html',
            chunks: [ 'settings' ],
        }),
    ],
    target: 'electron-renderer',
};

module.exports = [ mainConfig, rendererConfig ];

