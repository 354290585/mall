/*
 * @Author: lpTao 
 * @Date: 2017-08-21 22:48:59 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-22 19:11:59
 */
'use strict';
require('./order-list.css'); //样式
var navSide = require('../common/nav-side/nav-side'); //左侧菜单
var orderService = require('service/orderService.js'); //service模块
var templateOrderList = require('./order-list.string'); //模板
var util = require('util/util.js'); //工具模块
var Pagination = require('util/pagination/pagination.js'); //分页模块
var orderList = {
    data: {
        listParam: {
            pageNum: 1,
            pageSize: 10
        }
    },
    init: function () {
        navSide.init({
            name: 'order-list'
        });
        this.loadOrderList();
    },
    loadOrderList: function () {
        var load = layer.load(2);
        var _this = this,
            orderListHtml = '',
            $listCon = $('.order-list-con');
        orderService.getOrderList(this.data.listParam, function (res) {
            orderListHtml = util.renderHtml(templateOrderList, res);
            $listCon.html(orderListHtml);
            _this.loadPagination({
                hasPreviousPage: res.hasPreviousPage,
                prePage: res.prePage,
                hasNextPage: res.hasNextPage,
                nextPage: res.nextPage,
                pageNum: res.pageNum,
                pages: res.pages
            });
            layer.close(load);
        }, function () {
             $listCon.html('<div class="err-con"><i class="err-icon"></i><span class="err-text">您没有订单信息</span></div>');
            layer.close(load);             
        });
    },
    //加载分页信息
    loadPagination: function (pageInfo) {
        var _this = this;
        this.pagination ? '' : this.pagination = new Pagination();
        this.pagination.render($.extend({}, pageInfo, {
            container: $('.pagination'),
            onSelectPage: function (pageNum) {
                _this.data.listParam.pageNum = pageNum;
                _this.loadOrderList();
            }
        }));
    }
};

$(function () {
    orderList.init();
});