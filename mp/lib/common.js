/**
 * Created by JavieChan on 2016/1/5.
 * Updated by JavieChan on 2016/12/28.
 */

function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2].replace(/\+/g, "+"));return null;
}

//遍历
function getStat(data, flag){
    var a=[], b=[], c=[], d=[];
    $.each(data, function(k, v){
        if(flag==0){
            a.push(k.substr(-2, 2));
        }else{
            a.push(k);
        }
        b.push(v.conns);
        c.push(v.onlines);
        d.push(v.offlines);
    });
    return {
        a: a,
        b: b,
        c: c,
        d: d
    }
}

//日期截取
function dateSub(str){
    return str.substr(-2,2);
}

//表单
function checkInput(elem){
    var $elem = elem.find('input.shouldVerify');
    $elem.each(function(i,n){
        if($(n).hasClass('checkFile') && $(n).siblings('em').text()==''){
            inputError('*上传文件/图片', n);
        }else if($(n).val()=='' || $(n).val()==null){
            if(!$(n).hasClass('error')){
                inputError('*必填', n);
            }
        }else {
            if($(n).hasClass('error')){
                inputError('', n);
            }
        }
    });
    return elem.find('input.shouldVerify.error').length;
}

function checkIpu(elem){
    var $elem = elem.find('input'), len=0;
    $elem.each(function(i,n){
        if($(n).val()=='' || $(n).val()==null){
            len++;
        }
    });
    return len;
}

//错误提示
function inputError(msg, elem){
    if(msg==''){
        $(elem).parent().find('i.errormsg').remove();
        $(elem).removeClass('error');
    }else{
        $(elem).parent().find('i.errormsg').remove();
        var h = '<i class="errormsg">'+msg+'</i>';
        $(elem).parent().append(h);
        $(elem).addClass('error');
    }
}

function lastStr(str){
    var arr=str.split(',');
    return arr[arr.length-1];
}

// select特殊处理
function changeSelectFunc(id, val){
    var func = eval('change'+id);
    return func(val);
}

function changevendor(vendor){
    var v = $.trim(vendor);
    if(v=='hanming' || v=='Hanming'){
        var h = '<i class="vendor hanming"></i>';
    }else if(v=='ruijie' || v=='Ruijie'){
        var h = '<i class="vendor ruijie"></i>';
    }else if(v=='h3c' || v=='H3C'){
        var h = '<i class="vendor h3c"></i>';
    }else if(v=='huawei' || v=='Huawei'){
        var h = '<i class="vendor huawei"></i>';
    }else if(v=='xinrui' || v=='Xinrui'){
        var h = '<i class="vendor xinrui"></i>';
    }else if(v=='shenxinfu' || v=='Shenxinfu'){
        var h = '<i class="vendor shenxinfu"></i>';
    }else{
        var h = v;
    }
    return h;
}

function changepri(pri){
    return pri==0?'否':'是';
}

// loading
function addLoad(msg){
    if($('.wrapLoad').is(':hidden')) {
        $('.wrapLoad p').html(msg);
        $('.wrapLoad').show();
    }
}

function removeLoad(){
    $('.wrapLoad').hide();
}

// 格式化日期
function dateFormate(){
    var d = new Date();
    var vYear = d.getFullYear();
    var vMon = d.getMonth() + 1;
    vMon = (vMon<10 ? '0'+vMon : vMon);
    var vDay = d.getDate();
    vDay = (vDay<10 ? '0'+vDay : vDay);
    var s = vYear+'-'+vMon+'-'+vDay;
    return s;
}

// h5定位
function resizeZW(){
    var h = $('#zw').height();
    $('#zw').css('margin-top', -Math.ceil(h/2)+'px');
}

//function LoadImg(cls){
//    this.cls = cls;
//    this.t_img = '';
//    this.isLoad = true;
//}
//LoadImg.prototype.ImgLoad = function(callback){
//    var self = this;
//    // 查找所有封面图，迭代处理
//    $(self.cls).each(function(i, n){
//        // 找到为0就将isLoad设为false，并退出each
//        if(this.height === 0){
//            self.isLoad = false;
//            return false;
//        }else{
//            var h=$(n).height(),
//                w=$(n).width();
//            console.log(h);
//            $('.pt_h5 .ptD img.bg').attr('src',  $('.pt_h5 .ptD img.hidbg').attr('src') );
//            //$(n).parent().css({'margin-top': -Math.floor(h/2)+'px', 'margin-left': -Math.floor(w/2)+'px'});
//        }
//    });
//    // 为true，没有发现为0的。加载完毕
//    if(self.isLoad){
//        clearTimeout(self.t_img); // 清除定时器
//        // 回调函数
//        callback();
//    // 为false，因为找到了没有加载完成的图，将调用定时器递归
//    }else{
//        self.isLoad = true;
//        self.t_img = setTimeout(function(){
//            self.ImgLoad(callback); // 递归扫描
//        },500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
//    }
//};

//function loadImage(url, callback) {
// var img = new Image(); //创建一个Image对象，实现图片的预下载
// img.src = url;
//
// if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
//   callback.call(img);
//   return; // 直接返回，不用再处理onload事件
//  }
// img.onload = function () { //图片下载完毕时异步调用callback函数。
//    callback.call(img);//将回调函数的this替换为Image对象
//  };
//}