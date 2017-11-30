/*
 * @Author: lptTao 
 * @Date: 2017-07-26 09:40:44 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-19 14:15:46
 */
'use strict';
require('./header.css'); //header样式
var util = require('../../../utill/util'); //工具模块
var cartService = require('service/cartService'); //service模块；
var templatecart = require('./header-cart.string');
var userService = require('service/userService.js');
//通用页面header
var header = {
    init: function () {
        this.onLoad();
        this.bindEvent();
        this.showShoppingCar();
        this.hiddenShoppingCar();
        this.loadCartCount();
    },
    //搜索框数据会填
    onLoad: function () {
        var keyword = util.getUrlParam('keyword');
        //keyword存在，则回填搜索框
        if (keyword) {
            $('.search-input').attr('placeholder', keyword);
        }
    },
    // 搜索提交
    bindEvent: function () {
        var _this = this;
        //点击搜索按钮后做搜索提交
        $('.btn-s').click(function () {
            _this.searchSubmit();
        });
        //回车提交
        $('.search-input').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.searchSubmit();
            }
        });
        // 删除单个商品
        $(document).on('click', '.cart-delete1', function () {
            var productId = $(this).parents('.table')
                .data('product-id');
            var $this = $(this);
            cartService.deleteProduct(productId, function (res) {
                // _this.renderCart(res);
                $this.parents('.table').remove();
                _this.loadCartCount();
            }, function () {
                layer.msg('删除商品出错', {
                    time: 1000
                });
            });
        });
    },
    //提交方法
    searchSubmit: function () {
        var value = $.trim($('.search-input').val());
        var placeholder = $.trim($('.search-input').attr('placeholder'));

        var keyword = value || placeholder;
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        }
        //如果keyword为空,直接返回首页
        else {
            util.goHome();
        }
    },
    //鼠标移入显示购物车下拉菜单.shopping-car
    showShoppingCar: function () {
        var _this = this;
        $(document).on('mouseenter', '.shopping-car', function () {
            _this.loadCartCount();
            $('.shopping-car').addClass('ac');
            $('.shaopping-content').show();
            userService.checkLogin(function () {
                $('.shaopping-content').html('加载中&nbsp;.&nbsp;.&nbsp;.');
                //加载购物车信息
                cartService.getCartList(function (res) {
                    _this.renderCart(res);
                }, function (errMsg) {
                    layer.msg('加载预览购物车出错' + errMsg);
                });
            }, function () {
                $('.shaopping-content').html('<i class="car-img"></i>您还没有登录无法查看购物车');
            });
        });
    },

    hiddenShoppingCar: function () {
        $(document).on('mouseleave', '.shopping-car', function () {
            $('.shaopping-content').hide();
            $('.shopping-car').removeClass('ac');
        });
    },
    // 加载购物车数量
    loadCartCount: function () {
        cartService.getCartCount(function (res) {
            $('.shopping-count,.count-tatol').text(res || 0);
        }, function () {
            $('.shopping-count,.count-tatol').text(0);
        });
    },
    //渲染购物车
    renderCart: function (data) {
        this.filter(data);
        // 生成HTML
        var cartHtml = util.renderHtml(templatecart, data);
        $('.shaopping-content').html(cartHtml);
    },
    // 数据匹配
    filter: function (data) {
        data.notEmpty = !!data.cartProductVoList.length;
    }
};
header.init();