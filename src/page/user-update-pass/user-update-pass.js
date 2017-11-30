/*
 * @Author: lptTao 
 * @Date: 2017-08-09 10:28:48 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 17:10:05
 */
'use strict';
require('./user-update-pass.css');
var navSide = require('../common/nav-side/nav-side'); //左侧菜单
var util = require('util/util.js');
var userService =require('service/userService.js');
var userUpdataPass = {
    init: function () {
        navSide.init({
            name: 'user-update-pass'
        });
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 点击提交按钮后的动作
        $('.btn-submit').click(function () {
            var userInfo = {
                    password: $.trim($('#password').val()),
                    passwordNew: $.trim($('#password-new').val()),
                    passwordConfirm: $.trim($('#password-confirm').val())
                },
                validateResult = _this.validateForm(userInfo);
            if (validateResult.status) {
                // 更改用户密码
                userService.updatePassword({
                    passwordOld: userInfo.password,
                    passwordNew: userInfo.passwordNew
                }, function (res, msg) {
                     layer.msg(msg,{time: 1000});
                     $('.input').val('');
                }, function (errMsg) {
                     layer.msg(errMsg,{time: 1000});
                });
            } else {
              layer.msg(validateResult.msg,{time: 1000});
            }
        });
    },
    // 验证字段信息
    validateForm: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        // 验证原密码是否为空
        if (!util.validate(formData.password, 'require')) {
            result.msg = '原密码不能为空';
            return result;
        }
        // 验证新密码长度
        if (!formData.passwordNew || formData.passwordNew.length < 6) {
            result.msg = '密码长度不得少于6位';
            return result;
        }
        // 验证两次输入的密码是否一致
        if (formData.passwordNew !== formData.passwordConfirm) {
            result.msg = '两次输入的密码不一致';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};
$(function () {
    userUpdataPass.init();
});