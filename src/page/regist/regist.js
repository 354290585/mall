/*
 * @Author: lptTao 
 * @Date: 2017-07-28 17:52:08 
 * @Last Modified by: lptTao
 * @Last Modified time: 2017-08-11 14:43:31
 */
'use strict';
require('./regist.css'); //注册页面样式
var util = require('util/util.js'); //工具类
var userService = require('service/userService'); //请求

var regist = {

    init: function () {
        this.bindEvent();
        this.submit();
    },
    //获取表单数据
    fromData: function () {
        return {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val()),
            passwordAgin: $.trim($('#passwordAgin').val()),
            email: $.trim($('#email').val()),
            phone: $.trim($('#phone').val()),
            question: $.trim($('#question').val()),
            key: $.trim($('#key').val()),
            checkbox: $('#checkbox').is(":checked")
        };

    },
    //验证格式
    dataRules: {
        username: {
            rule: /^[0-9a-zA-z-_]+$/,
            rule2: /^[0-9a-zA-z-_]{4,16}$/,
            errorMsg: ['长度只能在4-16个字符之间', '格式错误，仅支持字母、数字、“-”“_”的组合'],
            state: false
        },
        password: {
            rule: /^[a-zA-Z0-9_-]{6,16}$/,
            rule2: /^[0-9]+$/,
            errorMsg: ['长度只能在6-16个字符之间', '有被盗风险,建议使用字母、数字和符号两种及以上组合'],
            state: false
        },
        passwordAgin: {
            errorMsg: ['两次密码不一致'],
            state: false
        },
        email: {
            rule: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            errorMsg: ['格式不正确'],
            state: false
        },
        phone: {
            rule: /^1[34578]\d{9}$/,
            errorMsg: ['格式不正确'],
            state: false
        },
        question: {
            rule: /^[a-zA-Z\u4e00-\u9fa5 ]{1,20}$/,
            errorMsg: ['不能使用特殊字符'],
            state: false
        },
        key: {
            errorMsg: ['请填写问题答案'],
            state: false
        },
        checkbox: {
            errorMsg: ['请阅读并同意Mall协议'],
            state: false
        }
    },
    //表单事件 交互效果
    bindEvent: function () {
        var _this = this;
        //当用户没有输入信息,点击输入框显示输入提示信息   并隐藏错误信息
        $('.regist-input').click(function () {
            if (!$(this).val()) {
                $(this).parent().next().children('.hint-tip').show();
                $(this).parent().next().children('.hint-error').hide();
            }
        });
        //当输入框没有输入信息 失去焦点时,隐藏输入提示信息 和错误信息
        $('.regist-input').blur(function () {
            if (!$(this).val()) {
                $(this).parent().next().children('.hint-tip').hide();
            }
            if ($(this).val().length === 0) {
                $(this).parent().next().children('.hint-error').hide();
                $(this).parent().removeClass('ac');
                $(this).parent().children('.right-icon').hide();
            }
        });
        //用户输入时  时时检查输入框的值是否合法
        $('.regist-input').bind('input propertychange', function (e) {
            if ($(e.target).attr('id') === 'username') {
                if (_this.dataRules.username.rule.test($('#username').val()) == false) {
                    $('#username').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.username.errorMsg[1]);
                    _this.dataRules.username.state = false;
                    $('#username').parent().next().children('.hint-tip').hide();
                    $('#username').parent().children('.right-icon').hide();
                }
                if (_this.dataRules.username.rule.test($('#username').val()) && $('#username').val().length < 4) {
                    $('#username').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.username.errorMsg[0]);
                    _this.dataRules.username.state = false;
                    $('#username').parent().next().children('.hint-tip').hide();
                    $('#username').parent().children('.right-icon').hide();
                }
                if (_this.dataRules.username.rule.test($('#username').val()) && ($('#username').val().length > 3 && $('#username').val().length < 17)) {
                    $('#username').parent().next().children('.hint-error').hide();
                    $('#username').parent().removeClass('ac');
                }
                if ($('#username').val().length === 0) {
                    $('#username').parent().next().children('.hint-error').hide();
                    $('#username').parent().removeClass('ac');
                    $('#username').parent().children('.right-icon').hide();
                }
            }
            if ($(e.target).attr('id') === 'password') {
                if ($('#password').val().length > 5 && $('#password').val().length < 17) {
                    $('#password').parent().children('.right-icon').show();
                    if (_this.dataRules.password.rule2.test($('#password').val())) {
                        $('#password').parent().removeClass('ac').next().children('.hint-error').show().html('<i class="error2"></i>' + _this.dataRules.password.errorMsg[1]);
                        $('#password').parent().next().children('.hint-tip').hide();
                    } else {
                        $('#password').parent().removeClass('ac').next().children('.hint-error').hide();
                    }
                }
                if ($('#password').val().length === 0) {
                    $('#password').parent().children('.right-icon').hide();
                }
            }
        });
        //输入完成，失去焦点时判断值是否合法  合法则把状态置为真;
        $('.regist-input').change(function (e) {
            if ($(e.target).attr('id') === 'username') {
                if (_this.dataRules.username.rule.test($('#username').val()) && $('#username').val().length < 4) {
                    $('#username').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.username.errorMsg[0]);
                    _this.dataRules.username.state = false;
                    $('#username').parent().next().children('.hint-tip').hide();
                    $('#username').parent().children('.right-icon').hide();
                }
                if (_this.dataRules.username.rule.test($('#username').val()) && $('#username').val().length > 16) {
                    $('#username').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.username.errorMsg[0]);
                    _this.dataRules.username.state = false;
                    $('#username').parent().next().children('.hint-tip').hide();
                }
                if (_this.dataRules.username.rule2.test($('#username').val())) {
                    $('#username').parent().children('.right-icon').show();
                    _this.dataRules.username.state = true;
                    var username = $.trim($('#username').val());
                    userService.checkUsername(username, function (res) {}, function (errMsg) {
                        $('#username').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + errMsg);
                        $('#username').parent().children('.right-icon').hide();
                    });
                }
            }
            if ($(e.target).attr('id') === 'password') {
                if ($('#password').val().length < 6 || $('#password').val().length > 16) {
                    $('#password').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.password.errorMsg[0]);
                    $('#password').parent().next().children('.hint-tip').hide();
                    $('#password').parent().children('.right-icon').hide();
                    _this.dataRules.password.state = false;
                } else {
                    _this.dataRules.password.state = true;
                    $('#password').parent().children('.right-icon').show();


                }
                if ($('#password').val() != $('#passwordAgin').val()) {
                    $('#passwordAgin').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.passwordAgin.errorMsg[0]);
                    $('#passwordAgin').parent().next().children('.hint-tip').hide();
                    $('#passwordAgin').parent().children('.right-icon').hide();
                    _this.dataRules.passwordAgin.state = false;
                } else {
                    $('#passwordAgin').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.passwordAgin.state = true;
                    $('#passwordAgin').parent().children('.right-icon').show();
                }
            }
            if ($(e.target).attr('id') === 'passwordAgin') {
                if ($('#passwordAgin').val() != $('#password').val()) {
                    $('#passwordAgin').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.passwordAgin.errorMsg[0]);
                    $('#passwordAgin').parent().next().children('.hint-tip').hide();
                    $('#passwordAgin').parent().children('.right-icon').hide();
                    _this.dataRules.passwordAgin.state = false;
                } else {
                    $('#passwordAgin').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.passwordAgin.state = true;
                    $('#passwordAgin').parent().children('.right-icon').show();
                }
            }
            if ($(e.target).attr('id') === 'email') {
                if (!_this.dataRules.email.rule.test($('#email').val())) {
                    $('#email').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.email.errorMsg[0]);
                    $('#email').parent().next().children('.hint-tip').hide();
                    $('#email').parent().children('.right-icon').hide();
                    _this.dataRules.email.state = false;
                } else {
                    $('#email').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.email.state = true;
                    var email = $('#email').val();
                    userService.checkEmail(email, function (res) {
                        $('#email').parent().removeClass('ac').next().children('.hint-error').hide();
                        $('#email').parent().children('.right-icon').show();
                    }, function (errorMsg) {
                        $('#email').parent().next().children('.hint-tip').hide();
                        $('#email').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + errorMsg);
                    });
                }
            }
            if ($(e.target).attr('id') === 'phone') {
                if (!_this.dataRules.phone.rule.test($('#phone').val())) {
                    $('#phone').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.phone.errorMsg[0]);
                    $('#phone').parent().next().children('.hint-tip').hide();
                    $('#phone').parent().children('.right-icon').hide();
                    _this.dataRules.phone.state = false;
                } else {
                    $('#phone').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.phone.state = true;
                    $('#phone').parent().children('.right-icon').show();
                }
            }
            if ($(e.target).attr('id') === 'question') {
                if ($('#question').val().length === 0) {
                    $('#question').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.question.errorMsg[0]);
                    $('#question').parent().next().children('.hint-tip').hide();
                    $('#question').parent().children('.right-icon').hide();
                    _this.dataRules.question.state = false;
                } else {
                    $('#question').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.question.state = true;
                    $('#question').parent().children('.right-icon').show();
                }
            }
            if ($(e.target).attr('id') === 'key') {
                if ($('#key').val().length === 0) {
                    $('#key').parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.key.errorMsg[0]);
                    $('#key').parent().next().children('.hint-tip').hide();
                    $('#key').parent().children('.right-icon').hide();
                    _this.dataRules.key.state = false;
                } else {
                    $('#key').parent().removeClass('ac').next().children('.hint-error').hide();
                    _this.dataRules.key.state = true;
                    $('#key').parent().children('.right-icon').show();
                }
            }
        });
        //检查单选框是否选中
        $('#checkbox').click(function () {
            if (!$('#checkbox').is(":checked")) {
                $('#checkbox').parent().next().children('.hint-error').show().html('<i class="error"></i>' + _this.dataRules.checkbox.errorMsg[0]);
                _this.dataRules.checkbox.state = false;
            } else {
                $('#checkbox').parent().next().children('.hint-error').hide();
                _this.dataRules.checkbox.state = true;
            }
        });
    },
    submit: function () {
        var _this = this;
        $('.subimt-button').click(function () {
            //判断验证是否通过
            var validateResult = _this.fromValidate();
            var inputState = [];
            $.each(_this.dataRules, function (index, item) {
                if (item.state != true) {
                    inputState.push(item);
                }
                return;
            });
            if (validateResult.status && (inputState.length == 0)) {
                //验证通过提交表单
                var fromData = {
                    username: $.trim($('#username').val()),
                    password: $.trim($('#password').val()),
                    passwordConfirm: $.trim($('#passwordAgin').val()),
                    email: $.trim($('#email').val()),
                    phone: $.trim($('#phone').val()),
                    question: $.trim($('#question').val()),
                    answer: $.trim($('#key').val())
                };
                userService.register(fromData, function () {
                    window.location.href = './result.html?type=regist';
                }, function () {});
            } else {
                //验证不通过,显示错误信息
                if (validateResult.input == 'checkbox') {
                    $('#' + validateResult.input).parent().next().children('.hint-error').show().html('<i class="error"></i>' + validateResult.msg);
                } else {
                    $('#' + validateResult.input).focus().parent().addClass('ac').next().children('.hint-error').show().html('<i class="error"></i>' + validateResult.msg);
                }
            }
        });
    },
    fromValidate: function () {
        var error = {
            status: false,
            msg: '',
            input: ''
        };
        var _this = this;
        var data = _this.fromData();
        if (!util.validate(data.username, 'require')) {
            error.msg = '请输入用户名';
            error.input = 'username';
            return error;
        }
        if (!util.validate(data.password, 'require')) {
            error.msg = '请输入密码';
            error.input = 'password';
            return error;
        }
        if (!util.validate(data.passwordAgin, 'require')) {
            error.msg = '请再次输入密码';
            error.input = 'passwordAgin';
            return error;
        }
        if (!util.validate(data.email, 'require')) {
            error.msg = '请输入邮箱';
            error.input = 'email';
            return error;
        }
        if (!util.validate(data.phone, 'require')) {
            error.msg = '请输入手机号';
            error.input = 'phone';
            return error;
        }
        if (!util.validate(data.question, 'require')) {
            error.msg = '请输入密码问题';
            error.input = 'question';
            return error;
        }
        if (!util.validate(data.key, 'require')) {
            error.msg = '请输入密码问题答案';
            error.input = 'key';
            return error;
        }
        if (!data.checkbox) {
            error.msg = '请阅读并同意Mall协议';
            error.input = 'checkbox';
            return error;
        }
        error.status = true;
        return error;
    }


};
regist.init();
module.exports = regist;