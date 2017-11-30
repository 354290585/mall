/*
 * @Author: lptTao 
 * @Date: 2017-08-02 11:01:16 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 17:12:43
 */
'use strict';
require('./result.css'); //样式文件
var util = require('util/util.js');
$(function () {
    var type = util.getUrlParam('type');
    var url = null;
    var orderNumber = util.getUrlParam('orderNumber');
    if (type == 'regist') {
        $('#regist').show();
        url = 'login';
        $('title').html('注册成功 - TaoMall电商平台');
        router();
    }
    if (type == 'resetpassword') {
        $('#resetPassword').show();
        url = 'login';
        $('title').html('修改密码成功 - TaoMall电商平台');
        router();
    }
    if (type == 'payment') {
        $('#resetPayment').show();
        $('title').html('支付成功 - TaoMall电商平台');
        var href = $('.orderNum').attr('href');
        $('.orderNum').attr('href',href+orderNumber);
    }

    function router() {
        setInterval(function () {
            var count = $('.count').html();
            var count1 = count - 1;
            $('.count').html(count1);
            if ($('.count').html() < 1) {
                window.location.href = './' + url + '.html';
            }
        }, 1000);
    }
});