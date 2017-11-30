/*
 * @Author: lptTao 
 * @Date: 2017-08-19 14:39:09 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-22 19:09:52
 */
'use strict';
require('./order-confirm.css');
var util = require('util/util.js'); //工具模块
var orderService = require('service/orderService'); //service模块；
var templatePrdouct = require('./product-list.string'); //地址列表模板
var templateAddress = require('./address-list.string'); //订单列表模板
var modal = require('./address-modal.js');
var orderList = {
    data: {
        selecteAddressId: null
    },
    init: function () {
        this.bindEvent();
        this.onload();
    },
    // 页面交互事件
    bindEvent: function () {
        var _this = this;
        //地址的选择
        $(document).on('click', '.address-item', function () {
            $(this).addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selecteAddressId = $(this).data('id');
        });
        //删除地址
        $(document).on('click', '.address-delete', function (e) {
            e.stopPropagation();
            var load1 = layer.load(2);
            var shippingID = $(this).parents('.address-item').data('id');
            layer.confirm('确定要删除吗', function () {
                orderService.deleteAddress(shippingID, function () {
                    layer.close(load1);
                    layer.msg('删除成功', {
                        time: 1000
                    });
                    _this.loadAddressList();
                }, function (errMsg) {
                    layer.close(load1);
                    layer.msg('删除失败' + errMsg, {
                        time: 1000
                    });
                });
            }, function () {
                layer.close(load1);
            });

        });
        //订单的提交
        $(document).on('click', '.order-submit', function () {
            var shippingID = _this.data.selecteAddressId;
            if (shippingID) {
                orderService.createOrder({
                    shippingID: shippingID
                }, function (res) {
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function (errMsg) {
                    layer.msg(errMsg);
                });
            } else {
                layer.msg('请选择地址');
            }
        });
        //添加地址 
        $(document).on('click', '.address-add', function () {
            layer.open({
                type: 1,
                title: ['使用新地址', 'font-weight:bold;font-size:17px;color:#555'],
                content: modal.loadModal({isUpdate: false,data: {}}),
                move: false,
                area: '480px',
                btn: ['添加地址'],
                btnAlign: 'c',
                skin: 'demo-class',
                success: function () {
                    modal.loadModalProvinceCity();
                },
                yes: function (index) {
                    modal.submitAddress(index);
                }
            });
        });
        //编辑地址
        $(document).on('click', '.address-update', function (e) {
            e.stopPropagation();
            var load = layer.load(2);
            var shippingID = $(this).parents('.address-item').data('id');
            orderService.getAddress(shippingID,function(res){
                layer.open({
                    type: 1,
                    title: ['编辑地址', 'font-weight:bold;font-size:17px;color:#555'],
                    content: modal.loadModal({isUpdate: true,data: res}),
                    move: false,
                    area: '480px',
                    btn: ['保存地址'],
                    btnAlign: 'c',
                    skin: 'demo-class',
                    success: function () {
                        modal.loadModalProvinceCity();
                    },
                    yes: function (index) {
                        modal.updateAddress(index);
                    }
                });
                layer.close(load);
            },function(errMsg){
                layer.msg('编辑地址失败' + errMsg);
            });

        });
    },
    // 加载地址 订单信息
    onload: function () {
        this.loadAddressList();
        this.loadProductList();
    },
    // 加载地址列表
    loadAddressList: function () {
        var _this = this;
        orderService.getAddressList(function (res) {
            _this.addressDataFilter(res);
            var addRessListHtml = util.renderHtml(templateAddress, res);
            $('.address-con').html(addRessListHtml);
        }, function (errMsg) {
            layer.msg('没有地址信息' + errMsg, {
                time: 1000
            });
        });
    },
    //数据过滤 保存删除地址钱选中地址的信息
    addressDataFilter: function(data){
        if(this.data.selecteAddressId){
            var selecteAddressIdFlag = false;
            for(var i = 0,len = data.list.length;i<len;i++){
                if(data.list[i].id === this.data.selecteAddressId){
                    data.list[i].isActive = true;
                    selecteAddressIdFlag = true;
                }
            }
            if(!selecteAddressIdFlag){
                this.data.selecteAddressId = null;
            }
        }
        return data;
    },
    // 加载订单列表
    loadProductList: function () {
        orderService.getProductList(function (res) {
            var ProductListHtml = util.renderHtml(templatePrdouct, res);
            $('.product-con').html(ProductListHtml);
        }, function (errMsg) {
            $('.product-con').html(' <div class="err-con"><i class="err-icon"></i><span class="err-text">请先去挑选商品</span></div>');
        });
    }
};
module.exports = orderList;
$(function () {
    orderList.init();
});