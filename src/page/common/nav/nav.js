/*
 * @Author: lptTao 
 * @Date: 2017-07-25 13:26:25 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-18 18:28:43
 */
'use strict';
require('./nav.css'); //导航样式
var util = require('util/util.js');
var userService = require('service/userService.js');
var nav = {
    init: function () {
        this.show();
        this.hidden();
        this.bindEvent();
        this.loadUserInfo();
    },
    //导航下拉菜单显示
    show: function () {
        $('.myMall').mouseover(function () {
            $('.drop').show();

        });
        $('.kehu').mouseover(function () {
            $('.drop2').show();

        });
    },
    //导航下拉菜单隐藏
    hidden: function () {
        $('.myMall').mouseout(function () {
            $('.drop').hide();

        });
        $('.kehu').mouseout(function () {
            $('.drop2').hide();

        });
    },
    bindEvent: function () {
        // 登录点击事件
        $('.js-login').click(function () {
            util.doLogin();
        });
        // 注册点击事件
        $('.js-register').click(function () {
            window.location.href = './regist.html';
        });
        // 退出点击事件
        $('.js-logout').click(function () {
            userService.logout(function () {
                window.location.reload();
            }, function (errMsg) {
                layer.msg('退出时发生未知错误' + errMsg);
            });
        });
        //个人中心
        $('.js-user-center').click(function () {
            window.location.href = './user-center.html';
        });   
    },
    // 加载用户信息
    loadUserInfo: function () {
        userService.checkLogin(function (res) {
            $('.user-login').hide().siblings('.user-info1').show()
                .find('.username').text(res.username);
        }, function () {
            // do nothing
        });
    }
};
nav.init();
