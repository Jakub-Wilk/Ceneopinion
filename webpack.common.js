/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "src/dev/ts/index.tsx"),
        product_details: path.resolve(__dirname, "src/dev/ts/product_details.tsx"),
        extract: path.resolve(__dirname, "src/dev/ts/extract.tsx"),
        list: path.resolve(__dirname, "src/dev/ts/list.tsx"),
        about: path.resolve(__dirname, "src/dev/ts/about.tsx"),
        charts: path.resolve(__dirname, "src/dev/ts/charts.tsx")
    },
    module: {
        rules: [
            {
                test: /\.ts?x?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "src", "static", "js"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/[name].css",
            chunkFilename: "../css/[id].css",
        }),
    ],
};