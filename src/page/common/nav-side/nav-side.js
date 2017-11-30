/*
 * @Author: lpTao 
 * @Date: 2017-08-03 20:36:21 
 * @Last Modified by: lpTao
 * @Last Modified time: 2017-08-21 23:00:33
 */
'use strict';
require('./nav-side.css');//样式
var util = require('util/util.js');//工具类
var templateNavSide = require('./nav-side.string');//模板
var navSide = {
    option: {
        name: '',
        navList: [
            {name: 'user-center', desc: '个人中心', href: './user-center.html'},
            {name: 'order-list', desc: '我的订单', href: './order-list.html'},
            {name: 'user-update-pass', desc: '修改密码', href: './user-update-pass.html'},
            {name: 'cart', desc: '购物车', href: './cart.html'}
        ]
    },
    init: function(option){
        //合并选项
        $.extend(this.option,option);
        this.renderNav();
    },
    //渲染导航
    renderNav: function(){
        //计算active数据
        for(var i = 0,length = this.option.navList.length;i<length;i++){
            if(this.option.navList[i].name === this.option.name){
                this.option.navList[i].isActive = true;
            }
        }
        //渲染list数据
        var navHtml = util.renderHtml(templateNavSide,{
            navList: this. option.navList
        });
        //插入
        $('.nav-side').html(navHtml);
    }
};
module.exports = navSide;