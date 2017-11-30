/*
 * @Author: lpTao 
 * @Date: 2017-08-08 21:21:36 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 17:03:30
 */
'use strict';
require('./user-center-update.css');
var navSide = require('../common/nav-side/nav-side'); //左侧菜单
var userService = require('service/userService.js'); //service模块
var templateHtml = require('./user-center-update.string'); //模板
var util = require('util/util.js');
var userCenterUpdate = {
    init: function () {
        navSide.init({
            name: 'user-center'
        });
        this.loadUserInfo();
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 点击提交按钮后的动作
        $(document).on('click', '.btn-submit', function () {
            var userInfo = {
                    phone: $.trim($('#phone').val()),
                    email: $.trim($('#email').val()),
                    question: $.trim($('#question').val()),
                    answer: $.trim($('#answer').val())
                },
            
            validateResult = _this.validateForm(userInfo);
            if (validateResult.status) {
                // 更改用户信息
                userService.updateUserInfo(userInfo, function (res, msg) {
                    util.successTips(msg);
                    window.location.href = './user-center.html';
                }, function (errMsg) {
                    util.errorTips(errMsg);
                });
            } else {
                util.errorTips(validateResult.msg);
            }
        });
    },
    loadUserInfo: function () {
        var load = layer.load(2);
        var userHtml = '';
        userService.getUserInfo(function (res) {
            userHtml = util.renderHtml(templateHtml, res);
            $('.panel-body').html(userHtml);
            layer.close(load);
        }, function (errMsg) {
            $('.loading').hide();
            $('.error').show().find('span').html(errMsg);
            layer.close(load);
        });
    },
    // 验证字段信息
    validateForm: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        // 验证手机号
        if (!util.validate(formData.phone, 'phone')) {
            result.msg = '手机号格式不正确';
            return result;
        }
        // 验证邮箱格式
        if (!util.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        // 验证密码提示问题是否为空
        if (!util.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题答案是否为空
        if (!util.validate(formData.answer, 'require')) {
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function () {
    userCenterUpdate.init();
});