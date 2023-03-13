/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        hot: false,
        host: "0.0.0.0",
        port: 9091,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        devMiddleware: {
            writeToDisk: true,
        },
        watchFiles: [
            path.join(__dirname, "src/**/*.py"),
            path.join(__dirname, "src/**/*.html"),
        ],
    },
});
