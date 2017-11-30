/*
 * @Author: lptTao 
 * @Date: 2017-08-12 14:25:59 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 16:31:25
 */
'use strict';
require('./list.css'); //样式
var productService = require('service/productService.js'); //service模块
var util = require('util/util.js'); //工具模块
var templateList = require('./list.string'); //模板
var Pagination = require('util/pagination/pagination.js');
var list = {
    data: {
        listParam: {
            keyword: util.getUrlParam('keyword') || '',
            categoryId: util.getUrlParam('categoryId') || '',
            orderBy: util.getUrlParam('orderBy') || 'default',
            pageNum: util.getUrlParam('pageNum') || 1,
            pageSize: util.getUrlParam('pageSize') || 20
        }
    },
    init: function () {
        this.loadList();
        this.bindEvent();
        this.changTitle();
    },
    changTitle: function(){
        var title = $.trim($('.search-input').attr('placeholder')) + ' - TaoMall电商平台';
        if(util.getUrlParam('categoryId')){ 
           title = '商品列表2 - TaoMall电商平台';
        }else{
            $('title').html(title);
        }
        
    },
    // 页面事件
    bindEvent: function () {
        var _this = this;
        // 排序的点击事件
        $('.sort-item').click(function () {
            var $this = $(this);
            _this.data.listParam.pageNum = 1;
            // 点击默认排序
            if ($this.data('type') === 'default') {
                // 已经是active样式
                if ($this.hasClass('active')) {
                    return;
                }
                // 其他
                else {
                    $this.addClass('active').siblings('.sort-item')
                        .removeClass('active asc desc');
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 点击价格排序
            else if ($this.data('type') === 'price') {
                // active class 的处理
                $this.addClass('active').siblings('.sort-item')
                    .removeClass('active asc desc');
                // 升序、降序的处理
                if (!$this.hasClass('asc')) {
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                } else {
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                }
            }
            // 重新加载列表
            _this.loadList();
        });
    },
    //加载list数据
    loadList: function () {
        var $listCon = $('.p-list-con'),
            _this = this,
            listHtml = '',
            listParam = this.data.listParam;
        //显示加载中
       var load = layer.load(2);
        //删除参数中不惜要的字段
        listParam.categoryId ? delete listParam.keyword : delete listParam.categoryId;
        //请求数据
        productService.getProductList(listParam, function (res) {
            listHtml = util.renderHtml(templateList, {
                list: res.list
            });
            $listCon.html(listHtml);
            _this.loadPagination({
                hasPreviousPage: res.hasPreviousPage,
                prePage: res.prePage,
                hasNextPage: res.hasNextPage,
                nextPage: res.nextPage,
                pageNum: res.pageNum,
                pages: res.pages
            });
            layer.close(load);
        }, function (errMsg) {
            layer.msg('商品加载错误' + errMsg);
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
                _this.loadList();
            }
        }));
    }
};
$(function () {
    list.init();
});