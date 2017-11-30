/*
 * @Author: lptTao 
 * @Date: 2017-08-02 16:43:39 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-11 14:48:21
 */
'use strict';
require('./reset-password.css');
var util = require('util/util.js');
var userService = require('service/userService.js');
var reset = {
    init: function () {
        this.submit();
        this.bindEvent();
    },
    data: {
        username: '',
        question: '',
        token: ''
    },
    bindEvent: function () {
        //输入框获取焦点时隐藏错误信息
        $('.input').focus(function () {
            $(this).parent().prev().children('.error').hide();
        });
    },
    submit: function () {
        //用户名提交
        var _this = this;
        $('.username-submit').click(function () {
            //判断是否为空 空显示错误信息
            if (!$.trim($('.username').val())) {
                $('.username-submit').prev().prev().children('.error').show();
            } else {
                //提交用户名做验证
                var username = $.trim($('.username ').val());
                userService.getQuestion(username, function (res) {
                    //成功 保存用户名和问题 调用loadQusetion显示下一步
                    _this.data.username = username;
                    _this.data.question = res;
                    _this.loadQuestion(res);
                }, function (errMsg) {
                    //失败  显示错误信息
                    $('.username-submit').prev().prev().children('.error').show().html('<i></i>' + errMsg);
                });
            }
        });
        //验证问题答案
        $('.answer-submit').click(function () {
            if (!$.trim($('.answer').val())) {
                $('.answer-submit').prev().prev().children('.error').show();
            } else {
                //验证问题答案
                var answer = $.trim($('.answer').val());
                userService.checkAnswer({
                    username: _this.data.username,
                    question: _this.data.question,
                    answer: answer
                }, function (res) {
                    //成功保存token 显示下一步
                    _this.data.token = res;
                    _this.loadPasswordNew();
                }, function (errMsg) {
                    //失败  显示错误信息
                    $('.answer-submit').prev().prev().children('.error').show().html('<i></i>' + errMsg);
                });
            }
        });
        //修改新密码
        $('.passwordNew-submit').click(function () {
            var password = $.trim($('.passwordNew ').val());
            if (!password) {
                //为空 显示错误信息
                $('.passwordNew-submit').prev().prev().children('.error').show().html('<i></i>请输入新密码');
            }
            if (password.length < 6 && password.length > 0) {
                $('.passwordNew-submit').prev().prev().children('.error').show().html('<i></i>密码长度不得少于6位大于16位');
            }
            if (password.length > 16) {
                $('.passwordNew-submit').prev().prev().children('.error').show().html('<i></i>密码长度不得少于6位大于16位');
            }
            if(password.length > 5 && password.length < 17 ){
                userService.resetPassword({
                    username: _this.data.username,
                    password: password,
                    forgetToken: _this.data.token
                }, function (res) {
                    window.location.href = './result.html?type=resetpassword';
                }, function (errMsg) {
                    $('.passwordNew-submit').prev().prev().children('.error').show().html('<i></i>' + errMsg);
                });
            }
        });
    },
    loadQuestion: function (res) {
        //隐藏用户名输入框 显示答案输入框 并把返回的问题写入到DOM中
        $('.username-reset').hide();
        $('.answer-reset').show();
        $('.answer-reset').find('.question').text(res);
    },
    loadPasswordNew: function () {
        $('.answer-reset').hide();
        $('.passwordNew-reset').show();
    }
};
reset.init();