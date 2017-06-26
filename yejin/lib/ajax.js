/**
 * Created by JavieChan on 2016/5/7.
 * Updated by JavieChan on 2017/1/19.
 */

window.proUrl='/';
window.nsmUrl='http://nsm.cniotroot.cn';
window.cmsUrl='http://cms.cniotroot.cn';
window.wnlUrl='http://183.63.152.237:9898';
window.imgUrl='/message/image';
var mpHostname = window.location.hostname;
if((mpHostname=='172.31.1.200') || (mpHostname=='112.94.162.4')){
    wnlUrl = '';
    cmsUrl = '';
    imgUrl = '/wnl/fs/';
}

// AC
function acAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'acs/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 计费
function billAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'paypolicy/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 上网类型
function billWebTypeFunc(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'webtype/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 资源
function resAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'resources/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 光纤
function fiberAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'fibers/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 施工图
function planAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/map/ap/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 监控组
function sensGroupAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/list/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(err);
    });
}

// 感知人员列表
function sensMemberAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/member/list/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 在线用户列表
function userOnlineAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/online/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 在线访客列表
function userGuestAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/guest/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}


// 上网用户列表
function userAccountAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/account/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 缴费用户列表
function userPayAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/pay/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 专网用户列表
function userPnAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/pn/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}
// 专网充值-套餐列表
function chargeOfflineAjax(param, callback, errFunc){
    $.ajax({
        method: 'post',
        url: proUrl+'user/pn/charge-offline',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}
// 专网充值
function policyListAjax(param, callback, errFunc){
    $.ajax({
        method: 'get',
        url: proUrl+'user/pn/pay-policy-list',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 内网用户列表
function userInnerAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/inner/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 平面图感知人员
function planMemberAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/map/member/list/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 平面图开关
function planEnableAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/ap/enable/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// app推送
function appPushAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'app/push/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 总用户管理
function userAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'pn/users/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 账户管理
function accountAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'admin/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 角色管理
function roleAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'role/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 网络配置管理
function pnAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'pns/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// portal
function portalAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: wnlUrl+'/wnl/portal/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 感知
function sensAjax(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/'+id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 施工图组
function planQvAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/map/group/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 施工图图
function planImgAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'sens/map/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 施工图AP
function planAPAjax(param, callback, errFunc){
    $.ajax({
        method: 'get',
        url: proUrl+'sens/map/ap/list/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// AP批量绑定
function apbindAjax(param, callback, errFunc){
    $.ajax({
        method: "put",
        url: proUrl+'aps/batch/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// AC批量绑定
function acbindAjax(param, callback, errFunc){
    $.ajax({
        method: "put",
        url: proUrl+'gw',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 充值统计查询
function billFunc(param, callback, errFunc){
    $.ajax({
        method: "get",
        url: proUrl+'payrecord/stat',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 缴费纪录
function payrecordFunc(type, id, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'payrecord2/' + id,
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 上网纪录
function onlineRecordFunc(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'user/connect/record/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 上网纪录
function urlRecordFunc(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'webhistory/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 支付宝
function payFunc(param, callback, errFunc){
    $.ajax({
        method: "put",
        url: proUrl+'payaccount/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// AP
function apAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'aps/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// AP组所有
function apgroupAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'apgroup/',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// AP组列表
function apgrouplistAjax(type, param, callback, errFunc){
    $.ajax({
        method: type,
        url: proUrl+'apgroup/list',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 发送上网账号
function sendAccountAjax(mobile, param, callback, errFunc){
    $.ajax({
        method: 'post',
        url: window.location.protocol+'//wnl.bidongwifi.com:9899/mobile/'+mobile+'/notify',
        data: param,
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc(error);
    });
}

// 图片上传
function ajaxImg(fileElementId, imgElementId, $tis){
    $tis.parent().find('.loading').show();
    $.ajaxFileUpload({
        url: proUrl+'image',
        //url: 'http://10.20.1.34:9092/image',
        secureuri: false,
        fileElementId: fileElementId,
        dataType: 'json',
        success: function(data){
            var $id = $('#' + imgElementId);
            $id.attr('src', data.imgurl);
            $id.parent().show();
            $id.parent().prev().find('.loading').hide();
            $id.parent().prev().find('input[type=hidden]').removeClass('error').val(data.imgurl);
            $id.parent().prev().find('.errormsg').remove();
        },
        error: function(data, status, e){
            console.log(e);
        }
    });
}

// 图片上传2
function ajaxImgSec(fileElementId, $tis){
    $tis.parent().find('.loading, .delsgt').show();
    $.ajaxFileUpload({
        url: proUrl+'image',
        secureuri: false,
        fileElementId: fileElementId,
        dataType: 'json',
        success: function(data){
            var $id = $('#'+fileElementId);
            $id.siblings('em').text(data.imgurl);
            $id.siblings('input[type=hidden]').val(data.imgurl).removeClass('error');
            $id.siblings('.loading').hide();
            $id.siblings('.errormsg').remove();
        },
        error: function(data, status, e){
            console.log(e);
        }
    });
}

// 图片上传3
function ajaxImgThd(fileElementId){
    var $id=$('#'+fileElementId);
    $id.parent().find('.loading').show();
    $.ajaxFileUpload({
        url: proUrl+'image',
        secureuri: false,
        fileElementId: fileElementId,
        dataType: 'json',
        success: function(data){
            var $id = $('#' + fileElementId);
            var idx = $('.adsnav li.on').index();
            if(idx==0){
                $id.parent().parent().parent().next('div').find('.bg').attr('src', data.imgurl);
            }else if(idx==1){
                $id.parent().parent().parent().next('div').find('.ptBody').css('background-image', 'url("'+data.imgurl+'")');
            }
            $id.siblings('input[type=hidden]').val(window.location.protocol+'//'+window.location.hostname+data.imgurl);
            $id.siblings('.loading').hide();
        },
        error: function(data, status, e){
            console.log(e);
        }
    });
}

// 图片上传4
function wnlajaxImgThd(fileElementId){
    var $id=$('#'+fileElementId);
    $id.parent().find('.loading').show();
    $.ajaxFileUpload({
        url: wnlUrl+'/wnl/fs/',
        secureuri: false,
        fileElementId: fileElementId,
        //dataType: 'json',
        success: function (data, status){
            console.log(data);
            var str = $(data).find("body").text();//获取返回的字符串
            var json = $.parseJSON(str);//把字符串转化为json对象
            var $id = $('#' + fileElementId);
            var idx = $('.adsnav li.on').index();
            if(idx==0){
                //$('.pt_h5 .ptD img.hidbg').attr('src', wnlUrl + json.url);
                //loadImage(wnlUrl + json.url, function(){
                //    console.log(this);
                //    $('.pt_h5 .ptD img.bg').attr('src', $(this).attr('src'));
                //});
                $('.pt_h5 .ptD img.hidbg').attr('src', json.url).load(function(){
                    console.log("load h5");
                    $('.pt_h5 .ptD img.bg').attr('src', json.url);
                });
            }else if(idx==1){
                //$('.pt_pc .ptD img.hidbg').attr('src', wnlUrl + json.url);
                //loadImage(wnlUrl + json.url, function(){
                //    console.log(this);
                //    $('.pt_pc .ptD .ptBody').attr('style', 'background-image:url('+wnlUrl+json.url+')');
                //});
                $('.pt_pc .ptD img.hidbg').attr('src', json.url).load(function(){
                    console.log("load pc");
                    $('.pt_pc .ptD .ptBody').attr('style', 'background-image:url('+json.url+')');
                });
            }
            //$id.siblings('input[type=hidden]').val(window.location.protocol+'//'+window.location.hostname+data.url);
            $id.siblings('input[type=hidden]').val(json.url);
            $id.siblings('.loading').hide();
        },
        error: function (data, status, e){
            console.log(e);
        }
    });
}

//小文件上传-支付宝
function uploadfile(id){
    var $id = $('#' + id);
    $id.parent().find('.loading').show();

    $.ajaxFileUpload({
        url: '/file',
        secureuri: false,
        fileElementId: id,
        dataType: 'json',
        success: function(data, status){
            console.log(data);
            var $tid = $('#' + id);
            console.log($tid);
            $tid.parent().find('.loading').hide();
            $tid.parent().find('i.errormsg').remove();
            $tid.parent().find('em').text(data.url);
            $tid.parent().find('input[type=hidden]').val(data.url);
        },
        error: function(data, status, e){
            console.log(data);
            console.log(status);
            console.log(e);
        }
    });
}

// 多文件上传
function mutiUpload(id, limit){
    var $id=$('#'+id);
    $id.uploadify({
        swf: '/static/js/lib/uploadify/uploadify.swf',
        uploader: '/fs/',
        width: 100,
        height: 40,
        buttonClass: 'btnGreen',
        buttonText: '选择图片',
        fileTypeDesc : 'Image Files',
        fileTypeExts : '*.jpg; *.png',
        //formData      : {'someKey' : 'someValue', 'someOtherKey' : 1},
//            queueID  : 'some_file_queue',
        //removeCompleted : false,    // 上传队列不自动消失
        //removeTimeout : 10,
        //successTimeout : 5,
        queueSizeLimit: limit,
        //'onSelect' : function(file) {
        //    $id.next('.imgShow').html('');
        //},
        onUploadSuccess : function(file, data, response) {
            var $data=$.parseJSON(data);
            $id=$('#'+id);
            var imgHtml = function(a, limit){
                if(a.length>limit){a.splice(0, a.length-limit);}
                for(var h='', k='', i=0; i<a.length; i++){
                    h+='<img src="'+a[i]+'" />';
                    if(i==0){
                        k=a[i];
                    }else{
                        k=k+','+a[i];
                    }
                }
                return [h, k];
            };
            var v = $id.parent().find('.imgShow').data('value');
            var a = (v=='') ? [] : v.split(',');
            a.push($data.url);
            $id.parent().find('.imgShow').html(imgHtml(a, limit)[0]);
            $id.parent().find('.imgShow').data('value', imgHtml(a, limit)[1]);
        },
        onUploadError : function(file, errorCode, errorMsg, errorString) {
            console.log('The file ' + file.name + ' could not be uploaded: ' + errorString);
        }
    });
}