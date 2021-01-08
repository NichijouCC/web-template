const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const pathsMap = require("./config");
const { DefinePlugin } = require('webpack');

module.exports = {
    entry: {
        app: path.resolve(pathsMap.appPath, "index.tsx"),
        vendor: ['react', 'react-dom']
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: pathsMap.buildPath,
        publicPath: pathsMap.assetBasePath,
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(j|t)sx?$/,
                        include: pathsMap.appPath,
                        exclude: pathsMap.node_modules_path,
                        use: "babel-loader",
                    },
                    {
                        test: /\.(html)$/,
                        loader: 'html-loader'
                    },
                    {
                        test: /\.(less|css)$/,
                        use: ["style-loader", "css-loader",
                            {
                                loader: "less-loader",
                                options: {
                                    lessOptions: {
                                        javascriptEnabled: true,
                                    }
                                }
                            }]
                    },
                    {
                        test: /\.(svg|jpg|jpeg|bmp|png|webp|gif|ico|ttf)$/,
                        loader: 'url-loader',
                        options: {
                            name: 'img/[name].[hash:8].[ext]',
                            outputPath: pathsMap.buildPath,
                        }
                    },
                    {
                        loader: 'file-loader',
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        options: {
                            name: 'media/[name].[hash:8].[ext]',
                        },
                    }
                ]
            }

        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        plugins: [
            new TsconfigPathsPlugin({
                extensions: [".ts", ".tsx", ".js"]
            }),
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'public', ignore: ['index.html'] },
        ]),
        new HtmlWebpackPlugin({
            template: pathsMap.indexHtmlPath,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeOptionalTags: false,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeAttributeQuotes: true,
                removeCommentsFromCDATA: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new CleanWebpackPlugin(),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
            APP_VERSION: JSON.stringify(`Version_${new Date().toUTCString()}`),
        })
    ]
}