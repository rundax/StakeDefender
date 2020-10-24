const path = require('path');
const {IgnorePlugin} = require('webpack');
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const context = path.resolve(__dirname, 'src');

module.exports = {
    context,
    mode: "development",
    entry: getEntryPoints(),
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname , 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js', '.node', '.json'],
        modules: ['node_modules', path.resolve(__dirname, 'src')],
        plugins: [
            new TSConfigPathsPlugin({
                configFile: "./tsconfig.json",
                logLevel: "debug",
                extensions: [".ts", ".tsx"]
            }),
        ]
    },
    externals: ['node_modules'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                exclude: /(node_modules|bower_components|\.spec\.js)/,
                use: [
                    {
                        loader: 'webpack-strip-block'
                    }
                ]
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFile: path.resolve(__dirname, 'tsconfig.json')
                },
                exclude: [/node_modules/, path.resolve('dist')]
            },
            {
                test: /\.node$/,
                loader: 'node-loader'
            },

            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
        ],

    },
    target: 'node',
    devtool: "source-map",
    plugins: [
        //new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
        /**
         * [project dependent]
         * Fixes for this one:
         * ERROR in ../node_modules/redis-parser/lib/hiredis.js
         * Module not found: Error: Can't resolve 'hiredis' in '/path/to/project/node_modules/redis-parser/lib'
         * @see https://github.com/NodeRedis/node_redis/issues/790#issuecomment-501869990
         */
        new IgnorePlugin(/^hiredis$/),
    ],
    stats: {
        colors: true,
        warnings: false
    }
};

function getEntryPoints() {
    let result = {
        app: './index.ts',
    };
    return result;
}
