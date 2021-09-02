const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const fs = require('fs');


const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");


let entries = {
    '/js/dd.min.js': './src/js/index.js',
    '/css/style': './src/scss/style.scss'
};

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
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }, function () {
            console.log("========= call back =======")
        }),
        ()=>{
            //Delete unwanted files
            /*for(let i in entries) {
                let hasExnt = i.indexOf(".") > 0;
                if(!hasExnt) {
                    fs.unlink(path.resolve(__dirname, './dist')+i, function () {

                    });
                }
            }*/
        },
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
