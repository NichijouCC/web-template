const baseConfig = require('./webpack.base');

const config = require("./config");

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    ...baseConfig,
    mode: "production",
    output: {
        ...baseConfig.output,
        filename: 'static/js/[name].[contenthash:8].js'
    },
    module: {
        ...baseConfig.module,
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(j|t)sx?$/,
                        include: config.appPath,
                        exclude: config.node_modules_path,
                        use: "babel-loader",
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [MiniCssExtractPlugin.loader, "css-loader",
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
                        type: 'asset/resource',
                        parser: {
                            dataUrlCondition: {
                                maxSize: 8 * 1024,
                            },
                        },
                        generator: {
                            filename: 'images/[name].[contenthash:8].[ext]',
                        },
                    },
                    {
                        type: 'asset/resource',
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        generator: {
                            filename: 'resources/[name].[contenthash:8].[ext]',
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
        ...baseConfig.plugins,
        // gzip压缩
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 10240, // 大于这个大小的文件才会被压缩
            minRatio: 0.8
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:8].css"
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minChunks: 2,
            maxInitialRequests: 5,
            cacheGroups: {
                // 提取公共模块
                commons: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name: 'common'
                }
            },
        },
        runtimeChunk: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: { map: { inline: false } }
            }),
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            })
        ]
    }
}

