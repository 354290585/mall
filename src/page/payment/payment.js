/*
 * @Author: lptTao 
 * @Date: 2017-08-23 12:47:26 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 14:15:44
 */
'use strict';
require('./payment.css'); //样式
var paymentService = require('service/paymentService.js'); //service模块
var templatePayment = require('./payment.string'); //模板
var util = require('util/util.js'); //工具模块
var payment = {
    data: {
        orderNumber: util.getUrlParam('orderNumber')
    },
    init: function () {
        this.loadPayment();
    },
    //获取支付二维码
    loadPayment: function () {
        var load = layer.load(2);
        var paymentHtml = '',
            _this = this,
            $paymentCon = $('.page-wrap2');
        paymentService.getPatmentInfo(this.data.orderNumber, function (res) {
            paymentHtml = util.renderHtml(templatePayment, res);
            $paymentCon.html(paymentHtml);
            layer.close(load);
            _this.listenOrderstatus();
        }, function (errMsg) {
            layer.msg('获取支付信息失败,请从新提交订单' +errMsg, {
                time: 1000
            });
            $paymentCon.html('<div class="err-con"><i class="err-icon"></i><span class="err-text">获取支付信息失败,请从新提交订单</span></div>');
            layer.close(load);
        });
    },
    listenOrderstatus: function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            paymentService.getPaymentStatus(_this.data.orderNumber,function(res){
                if(res){
                    window.location.href = './result.html?type=payment&orderNumber= ' + this.data.orderNumber;                     
                }
            },function(){
                layer.msg('获取结果错误,支付完成后请刷新页面');
            });
        },5000);
    }
};
$(function () {
    payment.init();
});