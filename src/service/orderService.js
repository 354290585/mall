/*
 * @Author: lptTao 
 * @Date: 2017-08-15 08:51:57 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-22 21:16:45
 */
'use strict';

var util = require('util/util.js');

var orderService = {
    // 获取地址列表
    getAddressList: function (resolve, reject) {
        util.request({
            url: util.getServerUrl('/shipping/list.do'),
            data: {
                pageSize: 50
            },
            success: resolve,
            error: reject
        });
    },
    //获取订单列表
    getProductList: function (resolve, reject) {
        util.request({
            url: util.getServerUrl('/order/get_order_cart_product.do'),
            success: resolve,
            error: reject
        });
    },
    //提交订单
    createOrder: function (orderInfo, resolve, reject) {
        util.request({
            url: util.getServerUrl('/order/create.do'),
            data: orderInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //添加新地址
    saveNewAddress: function (orderInfo, resolve, reject) {
        util.request({
            url: util.getServerUrl("/shipping/add.do"),
            method: 'POST',
            data: orderInfo,
            success: resolve,
            error: reject
        });
    },
    //删除地址
    deleteAddress: function (shippingId, resolve, reject) {
        util.request({
            url: util.getServerUrl("/shipping/del.do"),
            data: {
                shippingId: shippingId
            },
            success: resolve,
            error: reject
        });
    },
    //获取一个地址
    getAddress: function (shippingId, resolve, reject) {
        util.request({
            url: util.getServerUrl("/shipping/select.do"),
            data: {
                shippingId: shippingId
            },
            success: resolve,
            error: reject
        });
    },
    //编辑地址
    update: function (addressInfo, resolve, reject) {
        util.request({
            url: util.getServerUrl("/shipping/update.do"),
            data: addressInfo,
            success: resolve,
            error: reject
        });
    },
    //获取订单列表
    getOrderList: function (listParam, resolve, reject) {
        util.request({
            url: util.getServerUrl("/order/list.do"),
            data: listParam,
            success: resolve,
            error: reject
        });
    },
    //获取订单详情
    getOrderDetail: function (orderNumber, resolve, reject) {
        util.request({
            url: util.getServerUrl("/order/detail.do"),
            data: {
                orderNo: orderNumber
            },
            success: resolve,
            error: reject
        });
    },
    //取消订单
    cancelOrder: function (orderNumber, resolve, reject) {
        util.request({
            url: util.getServerUrl("/order/cancel.do"),
            data: {
                orderNo: orderNumber
            },
            success: resolve,
            error: reject
        });
    }
};
module.exports = orderService;