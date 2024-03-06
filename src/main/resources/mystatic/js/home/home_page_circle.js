/**
 * 轮播图的js实现，以及加入购物车后的token传递
 */
$(function () {
    var time_out = setTimeout(moveToRight, 3500);    //创建一个定时器 time_out  ,定时调用 moveToRight 函数来实现自动轮播
    var isMove = false;                              //isMove 用于标识轮播动画是否正在进行中
    $('.right_turn').click(function () {
        if (!isMove) {
            clearTimeout(time_out);
            isMove = true;
            moveToRight();
        }
    });
    $('.left_turn').click(function () {
        if (!isMove) {
            clearTimeout(time_out);
            isMove = true;
            currentMoveToLeft();
        }
    });
    //实现向右移动轮播图的动画效果。先通过 nextPrepare 函数准备下一个轮播项的显示效果，
    // 然后依次对当前轮播项的标题、描述和图片进行动画效果的处理，最后调用 moveToNext 函数切换到下一个轮播项
    function moveToRight() {
        clearTimeout(time_out);
        nextPrepare();
        $('.current h1').animate({left: 250}, 300, function () {
            $('.current p').animate({left: 250}, 300, function () {
                $(this).animate({left: -200, opacity: 0}, 500, function () {
                    $(this).hide(0);
                });
                // 标题先动，正文再动，正文先隐藏
                $('.current .slide_img').animate({left: "70%"}, 300, function () {
                    $('.current .slide_img').animate({left: -200, opacity: 0}, 800, function () {
                        moveToNext();
                        $(this).hide(0);
                        //图片先隐藏
                    });
                })
            });
            $('.current h1').animate({left: -200, opacity: 0}, 500, function () {
                $(this).hide(0);//标题隐藏
            });
        })
    }
//切换到下一个轮播项的动画效果。首先获取下一个轮播项，并检查是否已经到达最后一个轮播项，如果是，则切换到第一个轮播项。
// 然后对下一个轮播项进行动画效果的处理，同时隐藏当前轮播项，切换CSS类名和更新定时器
    function moveToNext() {
        var temp = $('.current').next();
        if (temp.attr("class") != "my_slide") {           //attr:属性操作      此时说明查询已经进行到底
            temp = $('.my_slide:first');    //选择同类元素的第一个
        }
        temp.css({left: "80%"}).show(0).animate({left: "10%", opacity: 1}, 1000, function () {
            $('.current').hide(0);
            $('.current').removeClass("current");        //！！！ 移除当前元素的"current"类
            temp.addClass("current").css({"z-index": 0});   //给下一个元素添加current类    ,并且放置到图层最底层
            time_out = setTimeout(moveToRight, 3500);
            isMove = false;           //表示动画已经完成
        });
    }
//准备 下一个轮播项的显示效果。首先获取下一个轮播项，并将其设置为透明并显示出来。
// 然后对下一个轮播项的标题、描述和图片进行设置，使其处于显示状态。
    function nextPrepare() {
        var temp = $('.current').next();       //得到下一个同胞元素
        if (temp.attr("class") != "my_slide") {
            temp = $('.my_slide:first');                  //如果是最后一项（即下一项的结果为undefined），就跳到第一项
        }
        temp.css({opacity: 0}).show(0);
        temp.children("h1").css({left: "10%", opacity: 1}).show(0);
        temp.children("p").css({left: "10%", opacity: 1}).show(0);
        temp.children(".slide_img").css({left: "60%", opacity: 1}).show(0);
    }
//实现向左移动轮播图的动画效果。首先清除定时器，然后通过 prevPrepare 函数准备上一个轮播项的显示效果。
// 接着依次对当前轮播项的图片、标题和描述进行动画效果的处理，最后调用 moveToPrev 函数切换到上一个轮播项
    function currentMoveToLeft() {
        clearTimeout(time_out);
        prevPrepare();
        $('.current .slide_img').animate({left: "41%"}, 400, function () {
            $('.current h1').animate({left: "15%"}, 400);
            $('.current p').animate({left: "0%"}, 400, function () {
                $('.current h1').animate({left: "5%"}, 600, function () {
                    $(this).animate({left: "120%", opacity: 0}, 800, function () {
                        $(this).hide(0);
                    });
                });
                $(this).animate({left: "120%", opacity: 0}, 800, function () {
                    $(this).hide(0);
                    moveToPrev();
                });
            });
            $(this).animate({left: "120%", opacity: 0}, 800, function () {
                $(this).hide(0);
            });
        });
    }
//准备上一个轮播项的显示效果。首先获取上一个轮播项，并将其设置为透明并显示出来。
// 然后对上一个轮播项的标题、描述和图片进行设置，使其处于显示状态。
    function prevPrepare() {
        var temp = $('.current').prev();
        if (temp.attr("class") != 'my_slide') {
            temp = $('.my_slide:last');
        }
        temp.css({opacity: 0}).show(0);
        temp.children("h1").css({left: "10%", opacity: 1}).show(0);
        temp.children("p").css({left: "10%", opacity: 1}).show(0);
        temp.children(".slide_img").css({left: "60%", opacity: 1}).show(0);
    }
//切换到上一个轮播项的动画效果。首先获取上一个轮播项，并检查是否已经到达第一个轮播项，
// 如果是，则切换到最后一个轮播项。然后对上一个轮播项进行动画效果的处理，同时隐藏当前轮播项，
// 切换CSS类名和更新定时器。
    function moveToPrev() {
        var temp = $('.current').prev();
        if (temp.attr("class") != 'my_slide') {
            temp = $('.my_slide:last');
        }
        temp.css({left: "-70%"}).show(0).animate({left: "10%", opacity: 1}, 800, function () {
            $('.current').hide(0);
            $('.current').removeClass("current");
            temp.addClass("current").css({"z-index": 0});
            time_out = setTimeout(moveToRight, 3500);
            isMove = false;
        });
    }

    //当点击购买按钮时，通过AJAX请求将商品信息插入购物车。根据请求返回的结果，弹出相应的提示信息
    $('.buy').click(function () {
        var id = $(this).attr('value');
        $.ajax({
            url:'/insertGoodsCar.do',
            dataType:'JSON',
            type:'post',
            data:{id:id},
            success:function (data) {
                var result = data.result;
                if (result == '2'){
                    alert('您还未登录，请先登录！！！');
                } else if (result == '1'){
                    alert('加入购物车成功');
                } else if (result == '0'){
                    alert('加入购物车失败');
                } else {
                    alert('发生了错误，请检测网络');
                }
            }
        })
    });


});
