const path = require('path');

const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require("copy-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const fs = require('fs');

const version = "4.0.4";

let entries = {
    '/js/dd.min.js': './src/js/index.ts',
    '/css/dd': './src/scss/style.scss',
    '/js/dd.react.min.js': './src/frameworks/react/MsDropdown.tsx',
    '/js/dd.vue.min.js': './src/frameworks/vue/MsDropdown.vue',
    '/js/dd.bootstrap.min.js': './src/frameworks/bootstrap/MsDropdownBootstrap.ts'
};

let copyFolders = [
    { from: "./src/images", to: "./images" },
    { from: "./src/css/flags.css", to: "./css/flags.css" }
];

module.exports = {
    entry: entries,
    output: {
        path:path.resolve(__dirname, './dist'),
        filename:'[name]',
        clean: true
    },
    
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.vue', '.json']
    },
    
    devServer: {
        static: [
            { directory: path.join(__dirname, 'dist') },
            { directory: path.join(__dirname) }
        ],
        compress: true,
        port: 9000,
        hot: true,
        open: 'index-dev.html',
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        isCustomElement: tag => tag.startsWith('ms-')
                    },
                    transpileOptions: {
                        transforms: {
                            dangerousTaggedTemplateString: true
                        }
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Load the CSS, set url = false to prevent following urls to fonts and images.
                    { loader: "css-loader", options: { url: false, importLoaders: 1 } },
                    // Add browser prefixes and minify CSS.
                    { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer(), cssnano()], }, }},
                    // Load the SCSS/SASS
                    { loader: 'sass-loader' }
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test:/\.jsx$/,
                use:'babel-loader',
                exclude:/node_modules/
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),

        new CopyPlugin({
            patterns: copyFolders,
            options: {
                concurrency: 100,
            },
        }),

        new webpack.BannerPlugin({
            banner: `/**
 * MSDropdown - dd.js
 * @author: Marghoob Suleman
 * @website: https://www.marghoobsuleman.com/
 * @version: ${version} 
 * @date: ${new Date()}
 * msDropdown is free web component: you can redistribute it and/or modify
 * it under the terms of the either the MIT License or the Gnu General Public License (GPL) Version 2
 */`
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }, function () {

        }),
        {
            apply: (compiler) => {
                compiler.hooks.done.tap('everythingIsDone', (compilation) => {

                    for(let i in entries) {
                        let hasExnt = i.indexOf(".") > 0;
                        if(!hasExnt) {
                            fs.unlink(path.resolve(__dirname, './dist')+i, function () {

                            });
                        }
                    }

                });

            }
        }
    ]
};
