/*
 * @Author: lptTao 
 * @Date: 2017-08-14 12:42:46 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-23 16:32:54
 */
'use strict';
require('./detail.css'); //样式
var templateIndex = require('./detail.string'); //模板
var util = require('util/util.js'); //工具模块
var prductService = require('service/productService.js'); //service模块
var cartService = require('service/cartService.js');
var detail = {
    data: {
        productId: util.getUrlParam('productId') || ''
    },
    init: function () {
        this.loadDetail();
        this.bindEvent();
        this.magnifying();
    },
    //放大镜
    magnifying: function () {

        $(document).on('mouseenter mouseleave', '.move', function (e) {
            if (e.type === 'mouseenter') {
                $(".mirror,.bigimg").show();
            }
            if (e.type === 'mouseleave') {
                $(".mirror,.bigimg").hide();
            }
        });
        $(document).on('mousemove', '.move', function (e) {
            //元素距离浏览器的位置
            var ex = e.pageX;
            var ey = e.pageY;
            //获得到box1的偏移量
            var boxx = $(this).offset().left;
            var boxy = $(this).offset().top;
            ////获得到浮窗的宽高
            var fuw = $(".mirror").width();
            var fuh = $(".mirror").height();
            //获得box的宽高
            var boxw = $(this).width();
            var boxh = $(this).height();
            //获得box2的宽高
            var box2w = $(".bigimg").width();
            var box2h = $(".bigimg").height();
            //获得放大的img的宽高
            var imgw = $(".main-img2").width();
            var imgh = $(".main-img2").height();
            //求得偏移量
            var left = ex - boxx - fuw / 2;
            var top = ey - boxy - fuh / 2;
            //判断边界区域
            if (left < 0) {
                left = 0;
            } else if (left > (boxw - fuw)) {
                left = boxw - fuw;
            }
            if (top < 0) {
                top = 0;
            } else if (top > boxh - fuh) {
                top = boxh - fuh;
            }
            //求得比率
            var psx = left / (boxw - fuw);
            var psy = top / (boxh - fuh);;
            $(".mirror").css({
                "left": left,
                "top": top
            });
            $(".main-img2").css({
                "left": -psx * (imgw - box2w),
                "top": -psy * (imgh - box2h)
            });
        });
    },
    //页面事件、交互
    bindEvent: function () {
        var _this = this;
        //鼠标滑过切换商品展示图片
        $(document).on('mouseenter', '.p-img-item', function () {
            var imageUrl = $(this).find('.p-img').attr('src');
            $('.main-img,.main-img2').attr('src', imageUrl);
        });
        // count的操作
        $(document).on('click', '.p-count-btn', function () {
            var type = $(this).hasClass('plus') ? 'plus' : 'minus',
                $pCount = $('.p-count'),
                currCount = parseInt($pCount.val()),
                minCount = 1,
                maxCount = _this.data.detailInfo.stock || 1;
            if (type === 'plus') {
                $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
            } else if (type === 'minus') {
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
            }
        });
        // 加入购物车
        $(document).on('click', '.cart-add', function () {

            cartService.addToCart({
                productId: _this.data.productId,
                count: $('.p-count').val()
            }, function () {
                layer.msg('添加购物车成功', {
                    icon: 1,
                    time: 1300,
                    anim: 5
                });
                _this.loadCartCount();
                $('.shopping-count').addClass('late');
                setTimeout(function () {
                    $('.shopping-count').removeClass('late');
                }, 300);
            }, function (errMsg) {
                layer.msg('加入购物车发生错误' + errMsg, {
                    icon: 2,
                    time: 1300,
                    anim: 5
                });
            });
        });
    },
    // 加载购物车数量
    loadCartCount: function () {
        cartService.getCartCount(function (res) {
            $('.shopping-count').text(res || 0);
        }, function () {
            $('.shopping-count').text(0);
        });
    },
    // 加载商品详情的数据
    loadDetail: function () {
        var load = layer.load(2);
        var _this = this,
            html = '',
            $pageWrap = $('.page-wrap2');
        // 请求detail信息
        prductService.getProductDetail(this.data.productId, function (res) {
            _this.filter(res);
            // 缓存住detail的数据
            _this.data.detailInfo = res;
            // render
            html = util.renderHtml(templateIndex, res);
            $pageWrap.html(html);
            layer.close(load);
        }, function () {
            $pageWrap.html('<p class="err-tip">此商品太淘气，找不到了</p>');
            layer.close(load);
        });
    },
    // 数据匹配
    filter: function (data) {
        data.subImages = data.subImages.split(',');
    }
};
$(function () {
    detail.init();
});