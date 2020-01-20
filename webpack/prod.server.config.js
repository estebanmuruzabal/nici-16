/**
 * Imports
 */
var path = require('path');
var webpack = require('webpack');
var strip = require('strip-loader');
var autoprefixer = require('autoprefixer');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserPlugin = require('terser-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/**
 * Settings
 */
var dist = path.resolve(__dirname, '../static/server');

/**
 * Production Settings
 */
var config = {
    mode: 'production',
    devtool: false,
    entry: './index.js',
    target: 'node',
    output: {
        path: dist,
        filename: 'server.js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/static/server/'
    },
    optimization: {
        minimizer: [
            // new TerserPlugin({
            //     test: /\.js$/,
            //     cache: true,
            //     terserOptions: {
            //         output: {comments: false}
            //     }
            // }),
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
                    options: {
                      "presets": [
                        [
                          "@babel/preset-env",
                          {
                            "targets": {
                                "node": "current",
                                "esmodules": false,
                            },
                            "modules": "commonjs",
                            "useBuiltIns": "usage",
                            "debug": true,
                          }
                        ],
                        "@babel/preset-react"
                      ],
                      "plugins": [
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-syntax-import-meta",
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-proposal-json-strings",
                        [
                          "@babel/plugin-proposal-decorators",
                          {
                            "legacy": true
                          }
                        ],
                        "@babel/plugin-proposal-function-sent",
                        "@babel/plugin-proposal-export-namespace-from",
                        "@babel/plugin-proposal-numeric-separator",
                        "@babel/plugin-proposal-throw-expressions",
                        "@babel/plugin-proposal-export-default-from",
                        "@babel/plugin-proposal-logical-assignment-operators",
                        "@babel/plugin-proposal-optional-chaining",
                        [
                          "@babel/plugin-proposal-pipeline-operator",
                          {
                            "proposal": "minimal"
                          }
                        ],
                        "@babel/plugin-proposal-nullish-coalescing-operator",
                        "@babel/plugin-proposal-do-expressions",
                        "@babel/plugin-proposal-function-bind"
                      ]
                    }
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

        // ignore dev config
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

        // set global vars
        new webpack.DefinePlugin({
            'global.GENTLY': false,
            'process.env': {
                BROWSER: JSON.stringify(false),
                NODE_ENV: JSON.stringify('production'),
                ATLAS_BASE_URL: JSON.stringify(process.env.ATLAS_BASE_URL),
                GOOGLE_ANALYTICS_TRACKING_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_ID),
                FACEBOOK_PIXEL_ID: JSON.stringify(process.env.FACEBOOK_PIXEL_ID),
                CRISP_WEBSITE_ID: JSON.stringify(process.env.CRISP_WEBSITE_ID),
                MAILCHIMP_SIGNUP_FORM_POST_URL: JSON.stringify(process.env.MAILCHIMP_SIGNUP_FORM_POST_URL),
                SWITCH_PUBLIC_KEY: JSON.stringify(process.env.SWITCH_PUBLIC_KEY)
            }
        }),
    ]
};

/**
 * Export
 */
module.exports = config;
