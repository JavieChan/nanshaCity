/**
 * Created by JaiveChan on 2016/5/11.
 */

(function($){
    $.fn.activiTag = function(opts) {
        opts = $.extend({
            move_step:1,    // 元素移动步长--px
            move_speed:40,    // 元素移动速度--ms
            init_speed:1000,// 元素创建速度--ms
            min_opacity:0,    // 元素最低透明度--0-1小数
            max_grain: 10,    // 最大粒度
            // a标签数组
            a_List: ['<a href="javascript:;"><span><em>无线城市</em></span></a>',
                '<a href="javascript:;"><span><em>众拓科技</em></span></a>',
                '<a href="javascript:;"><span><em>智能小区</em></span></a>',
                '<a href="javascript:;"><span><em>厦门鼓浪屿WiFi覆盖</em></span></a>',
                '<a href="javascript:;"><span><em>白云皮具批发市场</em></span></a>',
                '<a href="javascript:;"><span><em>南横村出租房</em></span></a>',
                '<a href="javascript:;"><span><em>十二道科技</em></span></a>',
                '<a href="javascript:;"><span><em>番禺女子学院</em></span></a>',
                '<a href="javascript:;"><span><em>热砂科技</em></span></a>',
                '<a href="javascript:;"><span><em>风信子无线覆盖</em></span></a>',
                '<a href="javascript:;"><span><em>南沙无线城市</em></span></a>'
            ],    // a标签字符串数组
            // 背景颜色数组
            bg_List: ['url("../static/images/hots_blue.png")', 'url("../static/images/hots_orange.png")'], // 标签颜色数组
            color_List: ['#0e5bcf', '#d55500']    // 标签颜色数组
        },opts||{});

        var aTag = $(this); // 当前容器对象
        var T_width = aTag.width(), T_height = aTag.height(); // 容器高度、宽度
        var flag = true;   // 初始有元素

        return this.each(function(){

            function setATagCss() {    // 设置容器相应css
                //aTag.css({position:'relative',overflow:'hidden'});
                aTag.css({background: 'url("../static/images/hots_blue.png")'});
            }

            function getRandomNum(Min, Max){ // 获取两个区间之内随机数
                Min = new Number(Min);Max = new Number(Max);
                var Range = Max - Min + 1;
                var Rand = Math.random();
                return Min + Math.floor(Rand * Range);   // 向下取整
            }

            function getRandomXY(num) {    // 随机返回一个 正/负参数
                num = new Number(num);
                if(Math.random()<=0.5)
                num = -num;
                return num;
            }

            /**
             * 随机创建a标签，宽度为容器宽度的三分之一，然后在自身基础上+-五分之一宽度
             * 高度自身宽度的三分之一，然后+-三分之一
             */
            function createATag() {    // 随机选择一个a标签
                var i = getRandomNum(0,opts.a_List.length-1);
                var a = $(opts.a_List[i]);    // 每个标签元素
                aTag.append(a);
                return a;
            }

            /** 设置a标签css样式 **/
            function setCss(a) {
                var w = Math.ceil(T_width/3) + getRandomXY(T_width/60);   // 向上取整
                var h = Math.ceil(w/3) + getRandomXY(w/36); // 行高
                var zIndex = Math.ceil(Math.random()*400);    // 400以内层数
                var rdmOpcy = getRandomNum(new Number(opts.min_opacity),0);
                // 行高、层数、透明度
                a.css({
                    opacity:rdmOpcy,
                    zIndex: zIndex
                });
                return a;
            }

            /** 计算标签相对于容器的初始化位置(X_Y 坐标) **/
            function setXY(a, b) {
                var x = getRandomNum(0,(T_width-a.width()));
                var y = getRandomNum(0,T_height/b);
                a.css({left:x+'px', bottom:y+'px'});
                return a;
            }

            /** 设置随机背景颜色 **/
            function setColor(a) {
                var i = Math.ceil(Math.random()*opts.color_List.length -1);
                a.css({backgroundImage:opts.bg_List[i], color:opts.color_List[i]});
            }

            /** 构造函数入口 **/
            function construct(b) {
                var a = createATag();
                setCss(a);    // css
                setColor(a); // color
                setXY(a, b);    // 坐标位置
                return a;
            }

            /** 动画定时器函数 **/
            function interVal(a,s_opcy,botm,n,btop,s) {
                var opcy = a.css('opacity');  // 透明度
                var botm_ = a.css('bottom').replace('px',''); // 实时底部距离
                var opcy_ = parseFloat(new Number(a.css('opacity'))) + s_opcy;  // ++透明度
                var _opcy_ = parseFloat(new Number(a.css('opacity'))) - s_opcy; // --透明度
                var fall = botm_ - botm;  // 已移动的距离
                botm_ = new Number(botm_) + new Number(opts.move_step);
                a.css({
                    display: 'block',
                    bottom: botm_
                });

                if(fall < n)
                { a.css({opacity: opcy_}) }
                else if(2*n < fall)
                { a.css({opacity: _opcy_}) }

                if (botm_ >= btop)
                {
                    clearInterval(s);
                    a.remove();
                    init();
                }
            }

            function init() {
                if(aTag.children('a').length >= new Number(opts.max_grain))
                return;
                var a = construct(5);
                scrollTag(a);
            }

            function scrollTag(a){
                var opcy = a.css('opacity');  // 透明度
                var zInx = a.css('z-index');      // 层数
                var botm = a.css('bottom').replace('px',''); // 初始到底部距离
                var btop = T_height - a.height();  // 顶部消失距离底部的距离
                var space = T_height - a.height() - a.css('bottom').replace('px','');  // 要移动的距离

                var n = space/3;    // 变换透明度距离
                var step = 1-opcy;    // 要变化透明度值
                var sec = n/opts.move_step*opts.move_speed/1000; // 距离/单步长 * 单步长秒数 = 需要秒数
                var s_opcy = opts.move_speed/1000/sec * step;  // 每次循环需要变换的透明度值
                var speed_ = getRandomNum(new Number(opts.move_speed)-30, new Number(opts.move_speed)+30);
                var currOpcy;    // 记录鼠标移入时透明度
                /** 元素移动循环 **/
                var s = setInterval(function(){
                    interVal(a,s_opcy,botm,n,btop,s);
                }, speed_);

                a.mouseover(function(){    // 鼠标移入
                    currOpcy = a.css('opacity');
                    clearInterval(s);
                    $(this).css({
                        zIndex: 401,
                        opacity: 1
                    });
                });

                a.mouseout(function(){ // 鼠标移出
                    $(this).css({
                        zIndex: zInx,
                        opacity: currOpcy
                    });
                    s= setInterval(function(){
                        interVal(a,s_opcy,botm,n,btop,s);
                    },speed_);
                });
            }

            //aTag.find('a').each(function(i, m){
            //    scrollTag($(m));
            //});

            for(var i=0; i<opts.max_grain; i++){
                var a = construct(1);
                scrollTag(a);
            }

            //setATagCss();
            //setInterval(init,opts.init_speed);
        });
    }
})(jQuery);