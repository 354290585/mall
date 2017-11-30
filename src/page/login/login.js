/*
 * @Author: lptTao 
 * @Date: 2017-07-27 15:08:14 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-15 15:56:47
 */
'use strict';
require('./login.css'); //登录页面样式
var util = require('util/util.js');
var userService = require('service/userService.js');
//错误提示信息的显示和隐藏
var error = {
    show: function (msg) {
        $('.hint-error').show().find('.error-text').text(msg);
    },
    hidden: function (msg) {
        $('.hint-error').hide().text(msg);
    }
};
var login = {
    init: function () {
        this.show();
        this.hidden();
        this.clearInput();
        this.emwAnimation();
        this.hiddenError();
        this.bindEvent();
    },
    //切换登录框和扫码框
    show: function () {
        $('.login-d2').click(function () {
            $('.dp').show();
            $('.dp2').hide();
            $('.login-d2').addClass('ac');
            $('.login-d1').removeClass('ac');
            if($('.login-input').val().length === 0){
                error.hide();
            }else{
                error.show();
            }
        });
    },
    //切换登录框和扫码框
    hidden: function () {
        $('.login-d1').click(function () {
            $('.dp').hide();
            $('.dp2').show();
            $('.login-d1').addClass('ac');
            $('.login-d2').removeClass('ac');
            error.hidden();
        });
    },
    //清空input  clear按钮显示和隐藏
    clearInput: function () {
        $('.login-input-name').keyup(function () {
            var val = $.trim($('.login-input-name').val());
            if (val) {
                $('.btn1').show();
            }
        });
        $('.btn1').click(function () {
            $('.login-input-name').val('');
            $('.btn1').hide();
            error.hidden();
        });
        $('.login-input-psd').keyup(function () {
            var val = $('.login-input-psd').val();
            if (val) {
                $('.btn2').show();
            }
        });
        $('.btn2').click(function () {
            $('.login-input-psd').val('');
            $('.btn2').hide();
            error.hidden();
        });
    },
    //扫码登陆提示切换
    emwAnimation: function () {
        $('.ewm').mouseover(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.left').css('left', '0');
            $('.right').show();

        });
        $('.ewm').mouseout(function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.left').css('left', '80px');
            $('.right').hide();
        });
    },
    //输入框获得焦点隐藏错误提示信息
    hiddenError: function () {
        $('.login-input').focus(function () {
            error.hidden();
        });
    },
    bindEvent: function () {
        var _this = this;
        //点击按钮的提交
        $('.login-button2').click(function () {
            _this.submit();

        });
        //在密码框回车提交
        $('.login-input-psd').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        });
    },
    //提交表单
    submit: function () {
        //拿到用户输入数据
        var fromData = {
            username: $.trim($('.login-input-name').val()),
            password: $.trim($('.login-input-psd').val())
        };
        //做验证
        var validateResult = this.fromValidate(fromData);
        if (validateResult.status) {
            //成功,提交
            userService.login(fromData, function (res) {
                window.location.href = util.getUrlParam('router') || './index.html';
            }, function (errMsg) {
                error.show(errMsg);
            });
        } else {
            //失败 显示提示信息
            error.show(validateResult.msg);
        }
    },
    // 表单字段的验证
    fromValidate: function (data) {
        var result = {
            status: false,
            msg: ''
        };
        if (!util.validate(data.password, 'require') && !util.validate(data.username, 'require')) {
            result.msg = '请输入用户名和密码';
            $('.login-input-name').focus();
            return result;
        }
        if (!util.validate(data.username, 'require')) {
            result.msg = '请输入用户名';
            $('.login-input-name').focus();
            return result;
        }
        if (!util.validate(data.password, 'require')) {
            result.msg = '请输入密码';
            $('.login-input-psd').focus();
            return result;
        }
        //通过验证 
        result.status = true;
        return result;
    }
};
$(function () {
    login.init();
});