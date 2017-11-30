/*
 * @Author: lpTao 
 * @Date: 2017-08-03 20:34:57 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 17:02:03
 */
'use strict';
require('./user-center.css');//样式
var navSide = require('../common/nav-side/nav-side');//左侧菜单
var userService = require('service/userService.js');//service模块
var templateHtml = require('./user-center.string');//模板
var util = require('util/util.js');
var userCenter = {
    init: function(){
        navSide.init({name: 'user-center'});
        this.loadUserInfo();
    },
    loadUserInfo: function(){
        var load = layer.load(2);
        var userHtml = '';
        userService.getUserInfo(function(res){
            userHtml = util.renderHtml(templateHtml, res);
            $('.panel-body').html(userHtml);
            layer.close(load);
        },function(errMsg){
            $('.loading').hide();
            $('.error').show().find('span').html(errMsg);
        });
    }
};

$(function(){
    userCenter.init();
});