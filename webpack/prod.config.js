/**
 * Imports
 */
var path = require('path');
var webpack = require('webpack');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var strip = require('strip-loader');
var autoprefixer = require('autoprefixer');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CompressionPlugin = require("compression-webpack-plugin")
var TerserPlugin = require('terser-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/**
 * Settings
 */
var dist = path.resolve(__dirname, '../static/dist');

/**
 * Production Settings
 */
var config = {
    mode: 'production',
    // devtool: 'source-map',
    devtool: false,
    entry: './src/client.js',
    output: {
        path: dist,
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/static/dist/'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                test: /\.js$/,
                cache: true,
                terserOptions: {
                    mangle: {
                        eval: true,
                        toplevel: true,
                    },
                    warnings: true,
                    output: {comments: false}
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ['default', { discardComments: { removeAll: true } }],
                },
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                exclude: /node_modules/,
                use: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: strip.loader('debug')
                }, {
                    loader: 'babel-loader',
                }],
            },
            {
                test: /\.sc?ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        },
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                 autoprefixer("last 3 version"),
                            ],
                        }
                    }, {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        minetype: 'application/font-woff',
                    }
                }]
            },
            {
                test: /\.(eot|woff|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [

        // css files from the extract-text-plugin loader
        new MiniCssExtractPlugin({
            filename: '[name]-[chunkhash].css'
        }),

        new CompressionPlugin({
            test: /\.(js|css|png|jp?eg)/,
            exclude: /node_modules/,
            algorithm: 'gzip',
            filename: '[path].gz[query]',
            cache: true,
        }),

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // set global vars
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('production'),
                ATLAS_BASE_URL: JSON.stringify(process.env.ATLAS_BASE_URL),
                GOOGLE_ANALYTICS_TRACKING_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_ID),
                FACEBOOK_PIXEL_ID: JSON.stringify(process.env.FACEBOOK_PIXEL_ID),
                CRISP_WEBSITE_ID: JSON.stringify(process.env.CRISP_WEBSITE_ID),
                MAILCHIMP_SIGNUP_FORM_POST_URL: JSON.stringify(process.env.MAILCHIMP_SIGNUP_FORM_POST_URL),
                SWITCH_PUBLIC_KEY: JSON.stringify(process.env.SWITCH_PUBLIC_KEY)
            }
        }),

        // Write out stats.json file to build directory.
        new StatsWriterPlugin({
            transform: function (data) {
                return JSON.stringify({
                    css: data.assetsByChunkName.main[0],
                    main: data.assetsByChunkName.main[1],
                });
            }
        }),
    ]
};

/**
 * Export
 */
module.exports = config;
