/*
 * @Author: lptTao 
 * @Date: 2017-08-22 19:33:58 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-22 21:24:15
 */
'use strict';
require('./order-detail.css'); //样式
var navSide = require('../common/nav-side/nav-side'); //左侧菜单
var orderService = require('service/orderService.js'); //service模块
var templateOrderDetail = require('./order-deatil.string'); //模板
var util = require('util/util.js'); //工具模块
var orderDetail = {
    data: {
        orderNumber: util.getUrlParam('orderNumber')
    },
    init: function () {
        navSide.init({
            name: 'order-list'
        });
        this.bindEvent();
        this.loadOrderDetail();
    },
    //页面交互事件
    bindEvent: function () {
        //取消支付
        var _this = this;
        $(document).on('click','.order-cancel', function () {
            layer.confirm('确定要取消该订单吗？', function () {
                orderService.cancelOrder(_this.data.orderNumber, function (res) {
                    layer.msg('订单取消成功');
                    _this.loadOrderDetail();
                }, function (errMsg) {
                    layer.msg('取消订单失败' + errMsg);
                });
            }, function () {

            });
        });
    },
    //获取订单详情
    loadOrderDetail: function () {
        var load = layer.load(2);
        var orderDetailHtml = '',
            _this = this,
            $detailCon = $('.order-content');
        orderService.getOrderDetail(this.data.orderNumber, function (res) {
            _this.FilterDate(res);
            orderDetailHtml = util.renderHtml(templateOrderDetail, res);
            $detailCon.html(orderDetailHtml);
            layer.close(load);
        }, function (errMsg) {
            layer.msg(errMsg, {
                time: 1000
            });
            $detailCon.html('<div class="err-con"><i class="err-icon"></i><span class="err-text">获取订单详情失败</span></div>');
            layer.close(load);
        });
    },
    FilterDate: function (data) {
        data.needPay = data.status == 10;
        data.isCanceLable = data.status == 10;
    }
};
$(function () {
    orderDetail.init();
});