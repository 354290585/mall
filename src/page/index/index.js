/*
 * @Author: lptTao 
 * @Date: 2017-07-24 15:38:42 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-11 20:23:09
 */
'use strict';
require('./index.css'); //样式
require('util/slider/slider.js'); //轮播图
var templateBanner = require('./banner.string'); //轮播图结构
var util = require('util/util.js'); //工具
$(function () {
    // 渲染banner的html
    var bannerHtml = util.renderHtml(templateBanner);
    $('.banner-content').html(bannerHtml);
  
    // 初始化banner
    var $slider = $('.banner').unslider({
        autoplay: true,
        speed: 550,
        delay: 3000,
        animation: 'fade'
    });  
    $('.next ').html('<i class="fa fa-angle-right" aria-hidden="true"></i>');
    $('.prev ').html('<i class="fa fa-angle-left" aria-hidden="true"></i>');
    // 前一张和后一张操作的事件绑定
    $('.banner-content .banner-arrow').click(function () {
        var forward = $(this).hasClass('prev') ? 'prev' : 'next';
        $slider.data('unslider')[forward]();
    });
});