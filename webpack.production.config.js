/*
 * @Author: lpTao 
 * @Date: 2017-07-23 20:09:22 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 17:47:05
 */

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function (name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', name]
    };
};
var NODE_ENV = process.env.NODE_ENV || false;
// webpack config
module.exports = {
    entry: {
        'index': ['./src/page/index/index.js'],
        'list': ['./src/page/list/list.js'],
        'detail': ['./src/page/detail/detail.js'],
        'cart': ['./src/page/cart/cart.js'],
        'order-confirm': ['./src/page/order-confirm/order-confirm.js'],
        'order-list': ['./src/page/order-list/order-list.js'],
        'order-detail': ['./src/page/order-detail/order-detail.js'],
        'payment': ['./src/page/payment/payment.js'],
        'common': ['./src/page/common/common.js'],
        'login': ['./src/page/login/login.js'],
        'regist': ['./src/page/regist/regist.js'],
        'result': ['./src/page/result/result.js'],
        'reset-password': ['./src/page/reset-password/reset-password.js'],
        'user-center': ['./src/page/user-center/user-center.js'],
        'user-center-update': ['./src/page/user-center-update/user-center-update.js'],
        'user-update-pass': ['./src/page/user-update-pass/user-update-pass.js']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: NODE_ENV = 'production' ? '//s.happymmall.com/mmall-fe/dist/' : '/dist/',
        filename: 'js/[name].js'
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    resolve: {
        extensions: ['', '.js', '.css'],
        alias: {
            util: __dirname + '/src/utill',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            imgage: __dirname + '/src/imgage',
            node_modules: __dirname + '/node_modules'
        }
    },
    module: {
        loaders: [{
                test: /\.css$/,
                exclude: path.resolve(__dirname, '/node_modules/'),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
            },
            {
                test: /\.(png|gif|jpg|jpeg|bmp)\??.*$/,
                loader: 'url-loader?limit=100&name=imgage/[name].[ext]'
            },
            {
                test: /\.(woff2|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=fonts/[name].[ext]'
            },
            {
                test: /\.string$/,
                loader: 'html-loader',
                query: {
                    minimize: true, //最小化压缩
                    removeAttributeQuotes: false //是否删除属性中的引号
                }
            }
        ]
    },
    plugins: [
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),

        // 把css单独打包到文件里
        new ExtractTextPlugin('css/[name].css'),

        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '最NX的电商平台')),
        new HtmlWebpackPlugin(getHtmlConfig('list', '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail', '商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm', '订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list', '我的订单')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail', '订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('payment', '支付')),
        new HtmlWebpackPlugin(getHtmlConfig('cart', '购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('login', '欢迎登陆')),
        new HtmlWebpackPlugin(getHtmlConfig('regist', '个人注册')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('reset-password', '找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center', '个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-update-pass', '修改密码')),

        // 定义为生产环境，编译 时压缩到最小
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),

        // webpack 内置的 banner-plugin
        new webpack.BannerPlugin("Copyright by 34290585@qq.com"),

        // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        new webpack.optimize.OccurenceOrderPlugin(),

        //压缩js和CSS
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        })
    ]
};