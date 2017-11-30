/*
 * @Author: lpTao 
 * @Date: 2017-08-20 19:48:34 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-21 17:23:19
 */
'use strict';
var util = require('util/util.js'); //工具模块
var orderService = require('service/orderService'); //service模块；
var templateModal = require('./modal.string'); //地址列表模板
var city = require('util/city.js'); //省市二级联动工具
var templateAddress = require('./address-list.string'); //订单列表模板
var modal = {
    option: {},
    //加载modal
    loadModal: function (option) {
        this.option = option;
        if(option.isUpdate){
            var modaUpdateAddresslHtml = util.renderHtml(templateModal,{data: option.data});
            return modaUpdateAddresslHtml;
        }else{
             var modaAddAddresslHtml = util.renderHtml(templateModal);
             return modaAddAddresslHtml;
        }
    },
    //模态框弹出之后的回调 加载省份 城市信息及交互事件
    loadModalProvinceCity: function () {
        this.loadProvince();

        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        //二级联动
        $('#receiver-province').change(function () {
            _this.loadCity($(this).val());
        });
    },
    //保存收货地址
    submitAddress: function (index) {
        var result = this.verification();
        var _this = this;
        if (result.state) { 
            var load = layer.load(2);
            layer.close(index);
            orderService.saveNewAddress(result.data, function () {
                layer.close(load);
                _this.loadAddressList();
                layer.msg('新建地址成功', {time: 1000});
            }, function (errMsg) {
                layer.close(load);
                layer.close(index); 
                layer.msg('新建地址失败' + errMsg, {time: 1000});    
            });
        } else {
            layer.msg(result.msg, {time: 1000});
        }
    },
    //更新收货地址
    updateAddress: function (index) {
        var result = this.verification();
        var _this = this;
        if (result.state) { 
            result.data.id = $.trim($('#receiver-id').data('id'));
            var load = layer.load(2);
            layer.close(index);
            orderService.update(result.data, function () {
                layer.close(load);
                _this.loadAddressList();
                layer.msg('更新地址成功', {time: 1000});
            }, function (errMsg) {
                layer.close(load);
                layer.close(index); 
                layer.msg('更新地址失败' + errMsg, {time: 1000});    
            });
        } else {
            layer.msg(result.msg, {time: 1000});
        }
    },
    // 加载地址列表
    loadAddressList: function () {
        orderService.getAddressList(function (res) {
            var addRessListHtml = util.renderHtml(templateAddress, res);
            $('.address-con').html(addRessListHtml);
        }, function (errMsg) {
            layer.msg('没有地址信息' + errMsg, {
                time: 1000
            });
        });
    },
    //模态框输入框验证
    verification: function () {
        var result = {
                state: false,
                msg: ''
            },
            addressInfo = {};
        addressInfo.receiverName = $.trim($('#receiver-name').val());
        addressInfo.receiverProvince = $.trim($('#receiver-province').val());
        addressInfo.receiverCity = $.trim($('#receiver-city').val());
        addressInfo.receiverAddress = $.trim($('#receiver-address').val());
        addressInfo.receiverPhone = $.trim($('#receiver-phone').val());
        addressInfo.receiverZip = $.trim($('#receiver-zip').val());
        if (!addressInfo.receiverName) {
            result.msg = '请输入收件人姓名';
            return result;
        }
        if (!addressInfo.receiverProvince) {
            result.msg = '请选择省份';
            return result;
        }
        if (!addressInfo.receiverCity) {
            result.msg = '请选择城市';
            return result;
        }
        if (!addressInfo.receiverAddress) {
            result.msg = '请输入详细地址';
            return result;
        }
        if (!addressInfo.receiverPhone) {
            result.msg = '请输入手机号';
            return result;
        }
        if (addressInfo.receiverPhone && !(/^1[34578]\d{9}$/.test(addressInfo.receiverPhone))) {
            result.msg = '手机号格式错误';
            return result;
        }
        if (addressInfo.receiverZip && !/^[0-9][0-9]{5}$/.test(addressInfo.receiverZip)) {
            result.msg = '邮政编码格式错误';
            return result;
        } else {
            result.state = true;
            result.data = addressInfo;
        }

        return result;
    },
    //加载省份
    loadProvince: function () {
        var province = city.getProvince();
        $('#receiver-province').html(this.loadSelectOption(province));
        if(this.option.isUpdate && this.option.data.receiverProvince){
            $('#receiver-province').val(this.option.data.receiverProvince);
            this.loadCity(this.option.data.receiverProvince);
        }
    },
    //加载城市
    loadCity: function (province) {
        var citys = city.getCity(province);
        $('#receiver-city').html(this.loadSelectOption(citys));
        if(this.option.isUpdate && this.option.data.receiverCity){
            $('#receiver-city').val(this.option.data.receiverCity);
        }
    },
    //加载select
    loadSelectOption: function (optionArray) {
        var html = '<option value="">请选择</option>';
        for (var i = 0, len = optionArray.length; i < len; i++) {
            html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
        }
        return html;
    }
};
module.exports = modal;