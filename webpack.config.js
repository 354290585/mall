/*
 * @Author: Rosen
 * @Date:   2017-05-08 15:28:19
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 14:49:25
 */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// 获取html-webpack-plugin参数的方法 
var getHtmlConfig = function (name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common',name]
    };
};
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
        path: './dist',
        publicPath: '/dist',
        filename: 'js/[name].js'
    },
    externals: {
        'jquery': 'window.jQuery'
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
                loader: 'html-loader'
            }
        ]
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
    plugins: [
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        // 把css单独打包到文件里
        new ExtractTextPlugin('css/[name].css'),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
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
        //启动浏览器
        new OpenBrowserPlugin({
            url: 'http://localhost:8080/dist/view/'
        }),
        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV) == 'dev' || 'false'))
        })
    ],
    devServer: {
        // proxy: {
        //     // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3000 上，由 koa 提供 mock 数据。
        //     // koa 代码在 ./mock 目录中，启动命令为 npm run mock
        //     '/user/login.do': {
        //         target: 'http://www.happymmall.com/user/login.do',
        //         secure: false
        //     }
        // },
        //contentBase: path.join(__dirname, "/dist"), //本地服务器所加载的页面所在的目录
        //historyApiFallback: true, //不跳转，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true //实时刷新
        //hot: true // 使用热加载插件 HotModuleReplacementPlugin
    }
};