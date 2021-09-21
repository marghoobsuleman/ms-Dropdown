const path = require('path');

const webpack = require('webpack');

const CopyPlugin = require("copy-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const fs = require('fs');

const version = "4.0.2";

const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");


let entries = {
    '/js/dd.min.js': './src/js/index.js',
    '/css/dd': './src/scss/style.scss'
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

    module: {
        rules: [
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
                test:/\.jsx$/,
                use:'babel-loader',
                exclude:/node_modules/
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new FixStyleOnlyEntriesPlugin(),

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
