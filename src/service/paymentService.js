/*
 * @Author: lptTao 
 * @Date: 2017-08-23 12:50:00 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 13:23:50
 */
'use strict';
var util = require('util/util.js');
var paymentService = {
    // 获取支付二维码
    getPatmentInfo: function (orderNumber, resolve, reject) {
        util.request({
            url: util.getServerUrl('/order/pay.do'),
            data: {
                orderNo: orderNumber
            },
            success: resolve,
            error: reject
        });
    },
    //获取订单状态
    getPaymentStatus: function (orderNumber, resolve, reject) {
        util.request({
            url: util.getServerUrl('/order/query_order_pay_status.do'),
            data: {
                orderNo: orderNumber
            },
            success: resolve,
            error: reject
        });
    }
};
module.exports = paymentService;