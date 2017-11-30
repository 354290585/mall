/*
 * @Author: lptTao 
 * @Date: 2017-07-29 17:49:52 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-12 16:49:11
 */
//用户模块 service
'use strict';
var util = require('util/util.js'); //工具类
var productService = {
    // 获取商品列表
    getProductList: function (listParam, resolve, reject) {
        util.request({
            url: util.getServerUrl('/product/list.do'),
            data: listParam,
            success: resolve,
            error: reject
        });
    },
    // 获取商品详细信息
    getProductDetail: function (productId, resolve, reject) {
        util.request({
            url: util.getServerUrl('/product/detail.do'),
            data: {
                productId: productId
            },
            success: resolve,
            error: reject
        });
    }
};
module.exports = productService;