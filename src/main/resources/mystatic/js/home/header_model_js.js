//如果左边三条横杠点开后的菜单或者用户下拉菜单可见，点击空白处使其消失
$(function () {
    $('body').click(function (e) {
        if (e.clientX > 50 || e.clientY > 100) {
            if ($('.short_nav_show').is(":visible")) {
                $('.short_nav_show').animate({
                    opacity: 0,
                    height: 0                                        //逐渐隐藏并改变高度为0。
                }, 500, function () {
                    $(this).hide(0);
                });
            }
            if ($('.personal_nav').is(":visible")) {
                $(this).animate({height: '0%'}, 300).hide(0); //高度改变为0并隐藏
            }
        }
    });



    $(window).scroll(function () {
        //输出垂直的滚动距离
            var scroll_length = $(this).scrollTop();
//                根据滚动的距离分别修改透明度
        if (scroll_length > 5 && scroll_length < 80) {
            var op_length = (80 - scroll_length);
            if (op_length >= 0) {
                var opacity_o = op_length / 80;     //滑动距离和透明度的映射关系
                if (opacity_o < 0.2) {
                    opacity_o = 0.2;
                }
                $('.my_nav').css({opacity: (opacity_o - 0.2)});
                $('.short_nav').css({opacity: (1 - opacity_o)});
            }
        } else if (scroll_length < 5) {
            $('.my_nav').css({opacity: 1});
            $('.short_nav').css({opacity: (0)});
        } else if (scroll_length > 80 && scroll_length < 550) {        //将 .short_nav 元素的透明度设为1，
            // 根据滚动距离计算透明度，并应用于 .my_slider 元素。
            $('.short_nav').css({opacity: (1)});
            var op_length = 550 - scroll_length;
            var op = op_length / 480;
            if (op < 0) {
                op = 0;
            }
            $('.my_slider').css({opacity: op});
        }
    });
//搜索框获得焦点后放大
    $('.nav_search_input').bind("focus", function () {
        $(this).animate({width: "15%", marginLeft: "20%"}, 800);
    });
//搜索框失去焦点后缩小
    $('.nav_search_input').bind("blur", function () {
        if ($(this).val() == '' )
            $(this).animate({width: "5em", marginLeft: "25%"}, 800);
    });

//左边的窗口通过点击展开
    $('.short_nav').click(function () {
        if ($('.short_nav').css('opacity') > 0.5) {
            if ($('.short_nav_show').is(":visible")) {
                $('.short_nav_show').animate({
                    opacity: 0,                                           //如果已经展开,就收起
                    height: 0
                }, 500, function () {
                    $(this).hide(0);
                });
            } else {
                $('.short_nav_show').show(0).css({opacity: 0, height: 0}).animate({
                    opacity: 1,
                    height: "30%"                                 //如果未展开,就展开
                }, 500).show(0);
            }
        }
    });



    //右边的窗口通过划入展开
    $('.user_name_a').mouseenter(function () {
        if (!$('.personal_nav').is(":visible")) {
            $('.personal_nav').show(0).animate({height: '41%'}, 500);     //如果未展开,就展开
        }
    });
    $('.personal_nav').mouseleave(function () {
        if ($('.personal_nav').is(":visible")) {
            $(this).animate({height: '0%'}, 300).hide(0);       //如果已经展开,就收起
        }
    });
    //搜索功能跳转
    $('.search_icon').click(function () {
        var name = $('.nav_search_input').val();
        window.location.href = '/findShopByName.do?name=' + name;
});
jQuery(document).ready(function ($) {

    //监听关闭事件
    //当用户关闭窗口时，这个处理程序会将页面重定向到/logout.do，即执行注销操作。
    window.onbeforeunload =(function () {
        window.location.href='/logout.do';
    });

    //检查是否异地登录        每两秒钟问询一次
    var host = window.location.host;
    var me = new Date().getTime();
    var websocket = new WebSocket("ws://" + host + "/sockjs/webSocketIMServer");
    var phone = $('#user_name_a').attr('value');
    if (phone !== 'wsk') {
        websocket.onopen = function () {
            console.log("websocket连接上");
            websocket.send(phone+","+me+",start");  //对要传输的数据进行排队。
        };
        websocket.onmessage = function (evnt) {
            // console.log(evnt.data);
            var result = evnt.data;
            if (result == "error"){
                window.location.href='/logout.do';                          //登出
                alert("该账号在其他地方登录了，请检查是否为本人操作，防止密码丢失！！！");
                return;
            }
            setTimeout(function () {
                messageHandle();
            }, 2000);
        };
        websocket.onerror = function () {
            console.log("websocket错误");
        };
        websocket.onclose = function () {
            console.log("websocket关闭");
        };
        function messageHandle() {
            // alert(phone);
            websocket.send(phone+","+me+",send");
        };
    }
});

})
