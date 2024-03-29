
$(function () {
    //1 注册，2忘记密码
    var from_which = 0;
//            !!!!!旋转操作无论如何根据都是根据开始位置！！！
    //将四个面进行旋转
    $('.enter_password').hide(0);       //确保将要出现的页面暂时不可见
    $('.flip_to_register').bind('click', function () {
        $('.enter_password').show(500);
        css3Transform(document.getElementsByClassName('content')[0], "rotateY(-90deg)");
        $('.forget_password').hide(500);
    });
    $('.go_to_forget').bind('click', function () {
        $('.enter_password').show(500);
        css3Transform(document.getElementsByClassName('content')[0], "rotateY(90deg)");
        $('.register_page').hide(500);
    });

    $('.go_back_login_from_forget').bind('click', function () {
        $('.enter_password').hide(500);
        css3Transform(document.getElementsByClassName('content')[0], "rotateY(0deg)");
        $('.register_page').show(500);
    });
    $('a.go_back_login').bind('click', function () {
        $('.forget_password').show(500);
        css3Transform(document.getElementsByClassName('content')[0], "rotateY(0deg)");
        $('.enter_password').hide(500);
    });

    // 跳转到注册输入密码
    $('.go_enter_password_button').bind('click', function () {
        from_which = 1;
        var name = $('.input_nickname').val();
        var phone = $('.register_input_phone').val();
        var code = $('.register_input_vcode').val();
        var token = $('.token').val();               //获得了token
        //未填写信息则
        if (name===''||phone===''||code===''){
            alert('请填写信息');
            return;
        }

        //将验证码发送到后端进行检测
        $.ajax({
            url: 'checkCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {name: name, phone: phone, code: code,token:token},
            success: function (data) {
                var result = data.result;
                if (result === 0) {
                    alert('验证码错误');
                } else if (result === 1) {
                    // 成功后执行以下代码进行跳转,(跳转动画)
                    $('.forget_password').show(1000);
                    css3Transform(document.getElementsByClassName('content')[0], "rotateY(-180deg)");
                    $('.login').hide(1000);
                    $('.confirm_register_button').html('注册');
                }
            }
        });
    });
    //填写密码然后登录
    $('.confirm_register_button').click(function () {
        var password = $('.first_enter_password_input').val();
        var password2 = $('.confirm_password_input').val();
        var token = $('.token').val();
        if (password ===''||password2===''){
            alert('请填写信息');
            return;
        }

        if (password !== password2) {
            alert('输入两次的密码不一致');
            return;
        }
        if (from_which === 1) {
            $.ajax({
                url: 'insertUser.do',
                dataType: 'JSON',
                type: 'post',
                data: {password: password, token: token},
                success: function (data) {
                    var result = data.result;
                    if (result === 1) {
                        window.location.href = '../../../../home.do';     //成功后进入主页
                    } else if (result === 0) {
                        alert('发送了错误，0但是我不说');
                    } else {
                        alert('发送了错误，但是我不说');
                    }
                }

            });
        }
        //用于更新密码的js
        else {
            $.ajax({
                url: 'updatePassword.do',
                dataType: 'JSON',
                type: 'post',
                data: {password: password, token: token},
                success: function (data) {
                    var result = data.result;
                    if (result === 1) {
                        window.location.href = '../../../../home.do';
                    } else if (result === 0) {
                        alert('发送了错误，0但是我不说');
                    } else {
                        alert('发送了错误，但是我不说');
                    }
                }

            });
        }
    });

// 跳转到重置密码输入
    $('.forget_password_button').bind('click', function () {
        from_which = 2;
        // var name = $('.input_nickname').val();
        var phone = $('.forget_input_phone').val();
        var code = $('.forget_input_vcode').val();
        var token = $('.token').val();
        if (phone===''||code===''){
            alert('请填写信息');
            return;
        }
        $.ajax({
            url: 'checkCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone, code: code,token:token},
            success: function (data) {
                var result = data.result;
                if (result === 0) {
                    alert('验证码错误');
                } else if (result === 1) {
                    // 成功后执行以下代码执行旋转
                    $('.register_page').show(1000);
                    css3Transform(document.getElementsByClassName('content')[0], "rotateY(180deg)");
                    $('.login').hide(1000);
                    $('.confirm_register_button').html('重置密码');
                }
            }
        });
    });
//修改密码成功


    //点击上一步，按情况执行不同的跳转
    $('.go_back_up').bind('click', function () {
        if (from_which == 1) {
            $('.login').show(1000);
            css3Transform(document.getElementsByClassName('content')[0], "rotateY(-90deg)");
            $('.forget_password').hide(1000);
        } else if (from_which == 2) {
            $('.login').show(1000);
            css3Transform(document.getElementsByClassName('content')[0], "rotateY(90deg)");
            $('.register_page').hide(1000);
        }
    });


    //设置两个图标的大小，并且在输入框获得聚焦后逐渐缩小消失
    $('.login_icon').animate({width: '10%'}, 0);
    $('.password_icon').animate({width: '10%'}, 0);
    $('.input_username').bind('focus', function () {
        $('.login_icon').animate({width: '0%'}, 500);
    });
    $('.input_username').bind('blur', function () {
        $('.login_icon').animate({width: '10%'}, 500);
    });
    $('.input_password').bind('focus', function () {
        $('.password_icon').animate({width: '0%'}, 500);
    });
    $('.input_password').bind('blur', function () {
        $('.password_icon').animate({width: '10%'}, 500);
    });

    //编写一个用于旋转的函数
    function css3Transform(element, value) {
        var arrPriex = ["o", "ms", "Moz", "webkit", ""];
        var length = arrPriex.length;
        for (var i = 0; i < length; i += 1) {
            element.style[arrPriex[i] + "Transform"]
                = value;
        }
    }
//以下也为聚焦后图标缩小的js
    $('.n_span').animate({width: '10%', height: '70%'}, 0);
    $('.register_phone_svg').animate({width: '10%'}, 0);
    $('.input_nickname').bind('focus', function () {
        $('.n_span').animate({width: '0%', height: '0%'}, 500);
        $('.n_span').html('');
    });
    $('.input_nickname').bind('blur', function () {
        $('.n_span').html('N');
        $('.n_span').animate({width: '10%', height: '70%'}, 500);
    });
    $('.register_input_phone').bind('focus', function () {
        $('.register_phone_svg').animate({width: '0%'}, 500);
    });
    $('.register_input_phone').bind('blur', function () {
        $('.register_phone_svg').animate({width: '10%'}, 500);
    });
    $('.first_enter_password_icon').animate({width: '10%'}, 0);
    $('.confirm_password_icon').animate({width: '10%'}, 0);
    $('.first_enter_password_input').bind('focus', function () {
        $('.first_enter_password_icon').animate({width: '0%'}, 500);
    });
    $('.first_enter_password_input').bind('blur', function () {
        $('.first_enter_password_icon').animate({width: '10%'}, 500);
    });
    $('.confirm_password_input').bind('focus', function () {
        $('.confirm_password_icon').animate({width: '0%'}, 500);
    });
    $('.confirm_password_input').bind('blur', function () {
        $('.confirm_password_icon').animate({width: '10%'}, 500);
    });

    $('.register_phone_svg').animate({width: '10%'}, 0);
    $('.forget_input_phone').bind('focus', function () {
        $('.register_phone_svg').animate({width: '0%'}, 500);
    });
    $('.forget_input_phone').bind('blur', function () {
        $('.register_phone_svg').animate({width: '10%'}, 500);
    });


    //点击登录后上传
    $('.login_button').click(function () {
        var login_name = $('.input_username').val();
        var login_password = $('.input_password').val();
        // var login_token = $('.token').val();
        if (login_name===''||login_password===''){
            alert('请填写信息');
            return;
        }
        $(this).submit();

    });

//注册获取验证码
    $('.get_vcode_button').click(function () {
        var phone = $('.register_input_phone').val();
        var token = $('.token').val();
        if (phone===''){
            alert('请填写校园邮箱');
            return;
        }
        $.ajax({
            url: 'sendCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone, token: token, action: 'register'},
            success: function (date) {
                var result = date.result;
                if (result == '1') {
                    alert('已经发送到该校园邮箱，请查收');
                } else if (result == '0') {
                    alert('请填写正确的校园邮箱');
                    alert('请填写正确的校园邮箱');
                } else if (result == '-1') {
                    alert('该校园邮箱号码已经被注册了');
                } else {
                    alert('发送了错误，但是我不告诉你');
                }
            }

        });
    });
//忘记密码获得校园邮箱验证码
    $('.forget_get_vcode_button').click(function () {
        var phone = $('.forget_input_phone').val();
        var token = $('.token').val();
        if (phone===''){
            alert('请填写校园邮箱号码');
            return;
        }
        $.ajax({
            url: 'sendCode.do',
            dataType: 'JSON',
            type: 'post',
            data: {phone: phone, token: token, action: 'forget'},
            success: function (date) {
                var result = date.result;
                if (result == '1') {
                    alert('已经发送到该校园邮箱，请查收');
                } else if (result == '0') {
                    alert('请填写正确的校园邮箱');
                } else if (result == '-1') {
                    alert('不存在该校园邮箱的用户');
                } else {
                    alert('发送了错误，但是我不告诉你');
                }
            }

        });
    });
})
;