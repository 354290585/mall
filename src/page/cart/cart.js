/*
 * @Author: lpTao 
 * @Date: 2017-08-15 22:14:22 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 16:37:33
 */
'use strict';
require('./cart.css'); //样式
var util = require('util/util.js'); //工具模块
var cartService = require('service/cartService'); //service模块；
var templatecart = require('./cart.string');
var cart = {
    data: {

    },
    init: function () {
        this.loadCart();
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 商品的选择 / 取消选择
        $(document).on('click', '.cart-select', function () {
            var $this = $(this),
                productId = $this.parents('.cart-table').data('product-id');
            // 选中
            if ($this.is(':checked')) {
                cartService.selectProduct(productId, function (res) {
                    _this.renderCart(res);
                }, function () {
                    _this.showCartError();
                });
            }
            // 取消选中
            else {
                cartService.unselectProduct(productId, function (res) {
                    _this.renderCart(res);
                }, function () {
                    _this.showCartError();
                });
            }
        });
        // 商品的全选 / 取消全选
        $(document).on('click', '.cart-select-all', function () {
            var $this = $(this);
            // 全选
            if ($this.is(':checked')) {
                cartService.selectAllProduct(function (res) {
                    _this.renderCart(res);
                }, function () {
                    _this.showCartError();
                });
            }
            // 取消全选
            else {
                cartService.unselectAllProduct(function (res) {
                    _this.renderCart(res);
                }, function () {
                    _this.showCartError();
                });
            }
        });
        // 商品数量的变化
        $(document).on('click', '.count-btn', function () {
            var $this = $(this),
                $pCount = $this.siblings('.count-input'),
                currCount = parseInt($pCount.val()),
                type = $this.hasClass('plus') ? 'plus' : 'minus',
                productId = $this.parents('.cart-table').data('product-id'),
                minCount = 1,
                maxCount = parseInt($pCount.data('max')),
                newCount = 0;
            if (type === 'plus') {
                if (currCount >= maxCount) {
                    layer.msg('该商品数量已达到上限', {
                        time: 1000
                    });
                    return;
                }
                newCount = currCount + 1;
            } else if (type === 'minus') {
                if (currCount <= minCount) {
                    return;
                }
                newCount = currCount - 1;
            }
            // 更新购物车商品数量
            cartService.updateProduct({
                productId: productId,
                count: newCount
            }, function (res) {
                _this.renderCart(res);
            }, function () {
                _this.showCartError();
            });
        });
        // 删除单个商品
        $(document).on('click', '.cart-delete', function () {
            var productId = $(this).parents('.cart-table')
                .data('product-id');
            console.log(productId);
            layer.confirm('确定要删除商品吗', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                _this.deleteCartProduct(productId);
                layer.msg('删除成功', {
                    icon: 1
                });
            }, function () {

            });
        });
        // 删除选中商品
        $(document).on('click', '.delete-selected', function () {
            layer.confirm('确定要删除选中商品吗', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var arrProductIds = [],
                    $selectedItem = $('.cart-select:checked');
                // 循环查找选中的productIds
                for (var i = 0, iLength = $selectedItem.length; i < iLength; i++) {
                    arrProductIds
                        .push($($selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if (arrProductIds.length) {
                    _this.deleteCartProduct(arrProductIds.join(','));
                    $('.shopping-count').addClass('late');
                    setTimeout(function () {
                        $('.shopping-count').removeClass('late');
                    }, 300);
                    layer.msg('删除成功', {
                        icon: 1
                    });
                } else {
                    layer.msg('您还没有选中要删除的商品', {
                        time: 1000
                    });
                }
            }, function () {});
        });
        // 提交购物车
        $(document).on('click', '.btn-submit', function () {
            // 总价大于0，进行提交
            if (_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0) {
                window.location.href = './order-confirm.html';
            } else {
                layer.msg('请选择商品后再提交', {
                    time: 1000
                });
            }
        });
    },
    // 删除指定商品，支持批量，productId用逗号分割
    deleteCartProduct: function (productIds) {
        var _this = this;
        cartService.deleteProduct(productIds, function (res) {
            _this.renderCart(res);
        }, function () {
            _this.showCartError();
        });
    },
    // 加载购物车信息
    loadCart: function () {
        var load = layer.load(2);
        var _this = this;
        // 获取购物车列表
        cartService.getCartList(function (res) {
            _this.renderCart(res);
            layer.close(load);
        }, function (errMsg) {
            layer.msg('加载购物车出错' + errMsg);
            layer.close(load);
        });
    },
    // 渲染购物车
    renderCart: function (data) {
        this.filter(data);
        // 缓存购物车信息
        this.data.cartInfo = data;
        // 生成HTML
        var cartHtml = util.renderHtml(templatecart, data);
        $('.page-wrap2').html(cartHtml);
        // 通知导航的购物车更新数量
        this.loadCartCount();
    },
    // 加载购物车数量
    loadCartCount: function () {
        cartService.getCartCount(function (res) {
            $('.shopping-count').text(res || 0);
        }, function () {
            $('.shopping-count').text(0);
        });
    },
    // 数据匹配
    filter: function (data) {
        data.notEmpty = !!data.cartProductVoList.length;
    },
    // 显示错误信息
    showCartError: function () {
        $('.page-wrap2').html('<p class="err-tip">哪里不对了，刷新下试试吧。</p>');
    }
};
$(function () {
    cart.init();
});