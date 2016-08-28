var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

console.log(process.cwd())
var srcDir = path.resolve(process.cwd(), 'assets/');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    var apps = fs.readdirSync(srcDir)
    var files = {}
    apps.forEach(appName => {
        var appsrcDir = srcDir.concat('/', appName)
        console.log(appsrcDir)

        var jsPath = path.resolve(appsrcDir, 'js');
        try {
            var dirs = fs.readdirSync(jsPath);
            var matchs = [];
            dirs.forEach(function (item) {
                matchs = item.match(/(.+)\.js$/);
                console.log(matchs);
                if (matchs) {
                    files[`/${appName}/js/${matchs[1]}`] = path.resolve(appsrcDir, 'js', item);
                }
            });
        } catch(e) {
            console.log(e)
        }
    })
    return files;

}

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: getEntry(),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            jquery: srcDir + "/js/lib/jquery.min.js",
            core: srcDir + "/js/core",
            ui: srcDir + "/js/ui"
        }
    },
    plugins: [
        // new CommonsChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
