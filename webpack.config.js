
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const devtool = process.env.NODE_ENV === 'production' ? undefined : 'inline-source-map';

const commonConfig = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
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
    entry: path.join(__dirname, 'src', 'main', 'main.ts'),
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'bundle'),
    },
    target: 'electron-main',
};

const rendererMainConfig = {
    ...commonConfig,
    entry: path.join(__dirname, 'src', 'app', 'app.ts'),
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'bundle'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'static/index.html',
            title: 'Marvin',
            filename: 'app.html',
        }),
    ],
    target: 'electron-renderer',
};

const rendererSettingsConfig = {
    ...commonConfig,
    entry: path.join(__dirname, 'src', 'settings', 'settings.ts'),
    output: {
        filename: 'settings.js',
        path: path.join(__dirname, 'bundle'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'static/index.html',
            title: 'Marvin Settings',
            filename: 'settings.html',
        }),
    ],
    target: 'electron-renderer',
}

module.exports = [mainConfig, rendererMainConfig, rendererSettingsConfig];

