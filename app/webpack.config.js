const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
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
        alias: {
            hiredis: path.resolve(__dirname, 'alias', 'hiredis.js'),
        },
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
            {
                test: /\.ts$/,
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /env\(\'APP_VERSION\'\)/ig,
                            replacement: function (match, p1, offset, string) {
                                return '\'' + (process.env.CI_COMMIT_REF_SLUG ? process.env.CI_COMMIT_REF_SLUG : 'dev-master-dirty') +'\'';
                            }
                        }
                    ]})
            }
        ]
    },
    target: 'node',
    devtool: "source-map",
   plugins: [
       //new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
       new StringReplacePlugin()
   ],
    stats: {
        colors: true,
        warnings: false
    }
};

function getEntryPoints() {
//    const fs = require('fs');
//    let modules = fs.readdirSync(path.resolve(context, 'modules'));
    let result = {
         app: './index.ts',
    };

//    modules.forEach((module) => result[module] = `./modules/${module}/index.ts`);

    return result;
}
