
$(function () {
    var typeList = getTypeList();
    var curFirst = 0;    //一级选项 ， 默认第一个
    var curSecond = 0;   //二级选项
    updateSecondSelect();


    //两个输入框在聚焦时放大，在失去聚焦后缩小
    $('.title_input').bind('focus',function () {
        $(this).animate({width: "60%"}, 500);
    });
    $('.title_input').bind('blur',function () {
        $(this).animate({width: "27%"}, 500);
    });
    $('.detail_textarea').bind('focus',function () {
        $(this).animate({width: "60%", height: "8em"}, 500);
    });
    $('.detail_textarea').bind('blur',function () {
        if ($(this).val() == ''){
            $(this).animate({width: "27%", height: "5em"}, 500);
        }
    });
    var temp = 1;
    $(".upload_img_input").change(function(){
        var objUrl = getObjectURL(this.files[0]);
        $('.show_choose_img').attr("src", objUrl);//预览图片
        //图片渐显动画
        $('.show_choose_img').css({opacity: 0});
        $('.show_choose_img').show(0).animate({opacity:1},1000);
    });
    // 获取图片的url。是临时文件
    function getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }

    //choose_first_type 类和 .choose_second_type 类的选择框绑定了 change 事件。
    // 当选择框的值发生变化时，会更新第二和第三个选择框的选项
    $('.choose_first_type').change(function () {
        var getSelect = $(this).children('option:selected').attr("id");    //获取选择id
        switch (getSelect) {
            case "type_1":
                curFirst = 0;
                break;
            case "type_2":
                curFirst = 1;
                break;
            case "type_3":
                curFirst = 2;
                break;
            case "type_4":
                curFirst = 3;
                break;
            case "type_5":
                curFirst = 4;
                break;
            case "type_6":
                curFirst = 5;
                break;
        }
        curSecond = 0;
        updateSecondSelect();
    });
    $('.choose_second_type').change(function () {
        var getSelect = $(this).children('option:selected').attr("id");
        curSecond = (getSelect-10000);
        updateThirdSelect();
    });
    function updateThirdSelect() {
        var temp = typeList[curFirst];
        var thirdText = "";
        var which = temp[curSecond];
        var res = which.content;
        for(j = 0;j<res.length;j++) {
            var rel_type = res[j];
            if(j==0) {
                thirdText+="<option id = '"+rel_type.id+
                    "' value="+rel_type.id+" selected='selected'>"+rel_type.name+"</option>";
            }else{
                thirdText+="<option id = '"+rel_type.id+
                    "' value="+rel_type.id+">"+rel_type.name+"</option>";
            }
        }
        $('.choose_third_type').html(thirdText);
    }
    function updateSecondSelect() {
        var temp = typeList[curFirst];
        var secondText = "";
        var thirdText = "";
        for(i = 0;i<temp.length;i++) {
            var which = temp[i];       //第二级标签
            secondText += "<option id = '"+(10000+i)+"'>"+which.name+"</option>";    //更新html中的二级选项卡    10000是为了防止id和其他页面重复
            if(i==curSecond) {                          //根据当前
                var res = which.content;
                for(j = 0;j<res.length;j++) {
                    var rel_type = res[j];
                    if(j==0) {
                        thirdText+="<option id = '"+rel_type.id+
                            "' value="+rel_type.id+" selected='selected'>"
                            +rel_type.name+"</option>";
                    }else{
                        thirdText+="<option id = '"+rel_type.id+"' value="
                            +rel_type.id+">"+rel_type.name+"</option>";
                    }
                }
            }
        }
        $('.choose_second_type').html(secondText);
        $('.choose_third_type').html(thirdText);
    }

});
$(function () {
   if (($('.show_tip').is(':hidden'))){
       alert("请输入正确的格式！！！！");
   }
});