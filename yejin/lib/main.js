/**
 * Created by JavieChan on 2015/12/29.
 * Updated by JavieChan on 2017/1/20.
 */

;$(function(){
    // 加载loading
    $('body').append('<div class="wrapLoad"><img src="../static/images/wrapload.gif" /><p>正在加载中...</p></div>');
    addLoad('正在加载中');

    var $trThis;
    $('.amount').amount();   // 终端数
    // 返回顶部
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();      //滚动高度

        if(scrollTop > 200){
            $('.uptotop').fadeIn();
        }else{
            $('.uptotop').fadeOut();
        }
    });
    $(document).on('click', '.uptotop', function(){
        $('body,html').animate({scrollTop: 0}, 700);
    });

    // 子项目列表-更多
    $(document).on('click', '.ns_subtab .more', function(){
        var $div = $(this).parent().siblings('.areabox');
        var len = $div.find('.magnet').length;
        if($div.hasClass('showall')){
            $div.css('height', '53px').removeClass('showall');
            $(this).html('更多<i class="aDwn"></i>');
        }else{
            $div.css('height', (Math.floor(len/4)+1)*53+'px').addClass('showall');
            $(this).html('收起<i class="aUp"></i>');
        }
    });
    // 子项目列表-搜索
    $(document).on('click', '.ns_subtab .search button', function(){
        var sk=$.trim($(this).siblings('input').val()), count=0;
        $('.magnet').each(function(i, n){
            var name=$(n).find('.name').text();
            if(sk==''){
                $(n).show();
                count++;
            }else if(name.indexOf(sk)>=0){
                $(n).show();
                count++;
            }else{
                $(n).hide();
            }
        });
        if(count==0){
            $('.magnet').show();
            $('.ns_subtab .more').show();
            alert('没有匹配项！');
            return false;
        }
        if(count>4){
            $('.ns_subtab .more').show();
        }else{
            $('.ns_subtab .more').hide();
        }
    });
    // 子项目列表-删除
    var forbinACFlag = true;
    $(document).on('click', '.forbinAC', function(){
        if(forbinACFlag){
            $(this).text('启用');
            $('.magnet').each(function(i, n){
                $(n).append('<i title="删除"></i>');
            });
            forbinACFlag=false;
        }else{
            $(this).text('禁用');
            $('.magnet').each(function(i, n){
                $(n).find('i').remove();
            });
            forbinACFlag=true;
        }
    });
    $(document).on('click', '.magnet i', function(e){
        var $this=$(this);
        if(confirm("确定要删除该项目吗？")){
            resAjax("delete", {location: $this.siblings('input').val()}, function(data){
                if(data.code==200){
                    $this.parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    console.log(data);
                    alert("删除失败！");
                }
            });
        }
        return false;
    });

    // tip
    //$('.pwdtip').tip();
    // tip
    $(document).on('mouseenter', '.pwdtip', function(){
        var tip = $(this).attr('data-tip'),
            offsetTop = $(this).offset().top,
            offsetLeft = $(this).offset().left;
        var html = '<span class="tip">'+tip+'</span>';
        $('body').append(html);
        var w = $('.tip').outerWidth(), h = $('.tip').outerHeight();

        $('.tip').css({'left': offsetLeft-(w/2)+'px', 'top': offsetTop-h-5+'px'});
    });
    $(document).on('mouseleave', '.pwdtip', function(){
        $('.tip').remove();
    });

    //可用套餐类型选择projectbill.html
    $(document).on('mouseenter', '.packageType .bill_tab span', function(){
        var tip = $(this).attr('data-title'),
            offsetTop = $(this).offset().top,
            offsetLeft = $(this).offset().left;
        var html = '<span class="tip">'+tip+'</span>';
        $('body').append(html);
        var w = $('.tip').outerWidth(), h = $('.tip').outerHeight();

        $('.tip').css({'left': offsetLeft-(w/2)+'px', 'top': offsetTop-h-5+'px'});
    });
    $(document).on('mouseleave', '.packageType .bill_tab span', function(){
        $('.tip').remove();
    });

    $(document).on('click', '#AP001', function(){$(this).next('div').toggle();});
    // 禁用链接
    $(document).on('click', '.preventUrl', function(e){
        e.preventDefault();
        alert("只有在本地服务器可以使用本功能！");
    });
    if($('.tabbox').length==1){
        $('.tabbox').css('min-height', '833px');
    }else{
        $('.tabbox:last-child').css('padding-bottom', '90px');
    }
    // 表格换行样式
    $('.table_td:even').css('background', '#eff8f9');
    $('.tabnav li:last').hide();


    $(document).on('click', '.checklist dd', function(){
        $(this).find('i').toggleClass('on');
    });
    $(document).on('click', '.uncheck_s', function(e){
        $(this).toggleClass('on');
        e.stopPropagation();
    });
    $(document).on('click', '.checktabs dd', function(){
        $(this).addClass('on').siblings().removeClass('on');
    });

    // 表单验证
    $(document).on('focus', '.matchVerify', function(){
        //if($(this).parent().find('.errormsg').length>0){
        //    $(this).val('');
        //}
        inputError('', this);
    });
    $(document).on('blur', '.matchVerify', function(){
        var m = $.trim($(this).val());
        if($(this).hasClass('checkPhone') && !/^1[0-9]{10}$/.test(m)){
            inputError("*输入有效的手机号", this);
        }else if($(this).hasClass('checkFloat')){
            if(!/^[0-9]+([.][0-9]+){0,1}$/.test(m)){
                inputError("*输入有效值", this);
            }else{
                $(this).val(m.match(/^\d+(\.\d{1,2})?/)[0]);
            }
        }else if($(this).hasClass('checkInt')){
            if(!/^[0-9]+$/.test(m)){
                inputError("*输入整数", this);
            }else{
                $(this).val(m.match(/[1-9][0-9]*/)[0]);
            }
        }else if($(this).hasClass('checkEng')){
            if(/^[\u4e00-\u9fa5]*$/.test(m)){
                inputError("*不能是中文", this);
            }
        }else if($(this).hasClass('checkMac')){
            if(!/^[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}$/.test(m)){
                inputError("*格式不正确", this);
            }
        }
        //else if(m=='' || m==null){
        //    inputError("*必填", this);
        //}
    });
    $(document).on('click', '.errormsg', function(){
        $(this).parent().find('input[type=text]').trigger('focus');
    });

    // 广告列表
    $(document).on('click', '.adsnav li', function(){
        var positionLeft = $(this).position().left;
        $('.adskpi i').css('left', positionLeft+35+'px');
    });

    // 感知分析
    // 监控组下拉
    $(document).on('click', '#sensMemTable .st, #sensTable .st', function(e){
        e.stopPropagation();
        var $div=$(this).parents('.ouTable').next('.siTable').find('div');
        var $i=$(this).parents('.ouTable').next('.siTable').find('i');
        if($div.is(":hidden")){
            $(this).addClass('on');
            $i.show();
            $div.slideDown();
        }else{
            $(this).removeClass('on');
            $div.slideUp('normal', function(){$i.hide();});
        }
    });
    // 监控组外链
    $(document).on('click', '#sens table tbody tr', function(e){
        e.stopPropagation();
        var location=$('#location').val(), groupId=$(this).data('group-id');
        window.location.href = '/projectsensgroup.html?location='+location+'&group_id='+groupId;
    });
    $(document).on('click', '#sensRoom .ouTable', function(e){
        e.stopPropagation();
        var param ={
            location:$('#location').val(),
            sta_mac:$(this).data('mac'),
            start:$('#dateStart').val(),
            end:$('#dateEnd').val(),
            group_id:$('#groupId').val()
        };
        window.location.href = '/projectsensmember.html?'+$.param(param);
    });

    // 删除监视组
    $(document).on('click', '#sensTable .delete', function(e){
        e.stopPropagation();
        var $this = $(this);
        if(confirm("确定要删除该感知组吗？")) {
            var groupId = $(this).parents('.ouTable').data('group-id');
            console.log(groupId);
            sensAjax("delete", groupId, '', function (data) {
                if (data.code == 200) {
                    $this.parents('tbody').fadeOut(function(){
                        $(this).remove();
                    });
                } else {
                    alert("删除失败");
                }
            });
        }
    });
    // 新增监视组
    $(document).on('click', '#sens .addbtn', function(){$('#modalSens').modal('open');});
    $(document).on('click', '#modalSens, #modalSens .closed', function(){
        $('.checktabs dd:eq(2)').addClass('on').siblings().removeClass('on');
        $('#modalSens').modal('closed');
    });
    $(document).on('click', '#modalSens .add', function(){
        var aps=[], location=$('#location').val();
        //var unit=$('#unit dd.on').attr('data-value');
        $('.checklist dd i').each(function(i, n){
            if($(n).hasClass('on')){
                aps.push($(n).next('em').attr("data-id"));
            }
        });
        if(checkInput($(this).parent().parent())>0){
            return false;
        }else if(aps.length==0){
            $('.msg').text('至少选择一个AP');
        }else{
            $('.msg').text('');
            var param={
                page_size: -1,
                location: location,
                group: $('input[name=group]').val(),
                aps: aps.join(','),
                //unit: unit,
                scale: $('input[name=scale]').val(),
                warning: $('input[name=warning]').val()
            };
            sensAjax('post', '', param, function(data){
                if(data.code==200){
                    window.location.href='/projectsens.html?location='+location;
                }
            });
        }
    });
    // 编辑监视组AP
    $(document).on('click', '#sensRoom .editbtn', function(){$('#modalAP').modal('open');});
    $(document).on('click', '#modalAP, #modalAP .closed', function(){$('#modalAP').modal('closed');});
    $(document).on('click', '#modalAP .add', function(){
        var aps=[], objAP=[], location=$('#location').val(), groupId=$('#groupId').val();
        $('.checklist dd i').each(function(i, n){
            if($(n).hasClass('on')){
                var obj={};
                aps.push($(n).next('em').attr("data-id"));
                obj.id = $(n).next('em').attr("data-id");
                obj.name = $(n).next('em').text();
                objAP.push(obj);
            }
        });

        if(aps.length==0){
            $('.msg').text('至少选择一个AP');
        }else{
            $('.msg').text('');
            $.ajax({
                method: "post",
                url: proUrl+'sens/aps?page_size=-1',
                dataType: "json",
                data: {
                    location: location,
                    group_id: groupId,
                    aps: aps.join(',')
                },
                success: function(data){
                    if(data.code==200){
                        $('#modalAP').modal('closed');
                        $('.sensContent .sensap').remove();
                        var h='';
                        for(var i=0, len=objAP.length; i<len; i++){
                            var t='<div class="sensap">' +
                                '<div>' +
                                    '<label>AP名称：</label>' +
                                    '<span>'+objAP[i].name+'</span>' +
                                '</div>' +
                                '<em data-ap-id="'+objAP[i].id+'">删除</em>' +
                            '</div>';
                            h+=t;
                        }
                        $('.sensContent').append(h);
                    }
                }
            });
        }
    });
    $(document).on('click', '.sensap em', function(){
        var location=$('#location').val(), groupId=$('#groupId').val(), apId=$(this).attr('data-ap-id'), $this=$(this);
        if(confirm('确定要删除吗？')){
            $.ajax({
                method: "delete",
                url: proUrl+'sens/aps',
                dataType: "json",
                data: {
                    location: location,
                    group_id: groupId,
                    ap_id: apId
                },
                success: function(data){
                    if(data.code==200){
                        $this.parent().remove();
                    }
                }
            });
        }
    });
    // 导出感知人员
    $(document).on('click', '#sensExport', function(){
        var param={
            location: $('#location').val(),
            group_id: $('#groupId').val(),
            start: $('#dateStart').val(),
            end: $('#dateEnd').val(),
            keyword: $('#search input').val()
        };
        if(confirm("是否导出所有mac?")){
            param.mac = 1;
        }else{
            param.mac = 0;
        }
        $('#sensExportHref').attr('href', '/sensmembers.xls?'+$.param(param));
        $('#sensExportHref span').click();
    });
    // 导出漫游纪录
    $(document).on('click', '#connectRecordExport', function(){
        var param={
            user: $('#userHid').val(),
            mobile: $('#mobileHid').val(),
            start: $('#dateStart').val(),
            end: $('#dateEnd').val(),
            mac: $('#macHid').val()
        };
        $(this).attr('href', '/connect_record.xls?'+$.param(param));
    });

    // 自定义
    $(document).on('click', '#custom', function(){$('#modalCustom').modal('open');});
    $(document).on('click', '#modalCustom, #modalCustom .closed', function(){$('#modalCustom').modal('closed');});
    // 隐藏
    //$(document).on('click', '.forkIco', function(){
    //    $(this).parent().animate({'opacity':'0'}, 300, function(){
    //        $(this).slideUp();
    //    });
    //});
    // 自定义按钮
    //$(document).on('click', '#custom', function(){
    //    $('.ns_modal').fadeIn(150, function(){
    //        $(this).addClass('in');
    //    });
    //});
    //$(document).on('click', '.modalClose', function(){
    //    $('.ns_modal').removeClass('in');
    //    setTimeout(function(){
    //        $('.ns_modal').hide();
    //    }, 300);
    //});

    // 计费-设置
    $(document).on('mouseenter', '.bill_tab span', function(){$(this).find('i').show();});
    $(document).on('mouseleave', '.bill_tab span', function(){$(this).find('i').hide();});
    $(document).on('click', '.userType .addbtn', function(){
        $('#modalUserType').modal('open');
    });
    $(document).on('click', '#modalUserType, #modalUserType .closed', function(){
        $('#modalUserType').modal('closed');
    });
    $(document).on('click', '.packageType .addbtn', function(){
        var len=$('.userType .bill_tab span.on').length;
        if(len>0){
            $('#modalPackageType').modal('open');
        }else{
            alert('请选择一个【上网类型】！没有【上网类型】，请新增一个！');
        }
    });
    $(document).on('click', '#modalPackageType, #modalPackageType .closed', function(){
        $('#modalPackageType').modal('closed');
    });
    // 包天
    $(document).on('click', '#modalPackageType .adsnav li', function(){
        var idx=$(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        if(idx>0){//学期套餐
            $('.vtime label').html("<i>*</i>日期：");
            $('.vtime input').removeClass('checkInt').addClass('datepickerbill');
            $(".datepickerbill").datepicker({
                dateFormat: 'yy-mm-dd'
            });
            $('.vtime input').attr('placeholder', '选择学期结束日期').val('');
            $("input[name='expired']").addClass("matchVerify shouldVerify").attr('placeholder', '选择套餐有效期');
        }else{//月套餐
            $('.vtime label').html("<i>*</i>时间<em>（天数）</em>：");
            $('.vtime input').removeClass('datepickerbill').addClass('checkInt');
            $('.vtime input').attr('placeholder', '输入天数').val('');
            $("input[name='expired']").removeClass("matchVerify shouldVerify").attr('placeholder', '长期');
        }
        $('.vtime .errormsg').remove();
        $('.vtime input').removeClass('error');
    });
    // 新增上网套餐
    $(document).on('click', '#modalPackageType .add', function(){
        var userTypeId=$('.userType .bill_tab span.on').attr('data-user-type-id'), idx=$('#modalPackageType .adsnav li.on').index(), guest=$('.userType span.on').index();

        var price=$('input[name=price]').val(),
            time=$('input[name=time]').val(),
            // ends=$('input[name=ends]').val()==""?2:$('input[name=ends]').val(),
            expired=$('input[name=expired]').val(),
            // package_expired=$('input[name=package_expired]').val(),
            label=$('input[name=label]').val();

        if(checkInput($('#modalPackageType .verify'))==0){
            var param={
                location: $('#location').val(),
                price: price,
                // ends: ends,
                expired: expired,
                label: label,
                web_type_id: userTypeId
            };
            if(guest==0){param.isguest=1;}
            if(idx>0){//学期套餐
                // param.time = time*24;
                param.mask = 2;
                param.package_expired = time;
                if( Date.parse(new Date(param.package_expired)) < Date.parse(new Date(param.expired)) ){
                    alert("套餐有效期不能早于学期结束日期。");
                    return;
                }
            }else{//月套餐
                param.time = time;
                param.mask = 1;
            }
            billAjax("post", param, function(data){
                if(data.code==200){
                    if(typeof(data["_code"])!="undefined" && data["_code"]!=200){//错误码
                        alert(data.reason);
                        return;
                    }
                    $('#modalPackageType').modal('closed');
                    window.location.reload();
                    if(label==''){
                        if(idx>0){
                            var h='<span data-pay-id="'+data.pay_policy_id+'">'+price+'元 = '+time+'天<i></i></span>';
                        }else{
                            var h='<span data-pay-id="'+data.pay_policy_id+'">'+price+'元 = '+time+'小时<i></i></span>';
                        }
                    }else{
                        var h='<span data-pay-id="'+data.pay_policy_id+'">'+label+'<i></i></span>';
                    }
                    $('.packageType .bill_tab').append(h);
                }
            },function(data){
                if(typeof(data["_code"])!="undefined" && data["_code"]!=200){//错误码
                    alert(data.reason);
                }
            });
        }
    });
    // 删除上网套餐
    $(document).on('click', '.packageType span i', function(e){
        e.stopPropagation();
        var $this=$(this), payId=$(this).parent().attr('data-pay-id');
        if(confirm("确定要删除？")){
            billAjax("delete", {pay_policy_id: payId}, function(data){
                if(data.code==200){
                    $this.parent().remove();
                }
            });
        }
    });
    $(document).on('click', '#sensTable .edit', function(e){
        console.log(e);
        e.stopPropagation();
    });
    // 查询上网套餐
    $(document).on('click', '.userType .bill_tab span', function(){
        var userTypeId=$(this).attr('data-user-type-id'), $this=$(this);
        billAjax("get", {web_type_id: userTypeId}, function(data){
            if(data.code==200){
                $this.addClass('on').siblings().removeClass('on');
                var h='';
                for(var i=0, len=data.policys.length; i<len; i++){
                    if(data.policys[i].label==''){
                        if(data.policys[i].mask==2){
                            var t='<span data-pay-id="'+data.policys[i].id+'">'+data.policys[i].price+'元 = '+(data.policys[i].time/24)+'天<i></i></span>';
                        }else{
                            var t='<span data-pay-id="'+data.policys[i].id+'">'+data.policys[i].price+'元 = '+data.policys[i].time+'小时<i></i></span>';
                        }
                    }else{
                        var t='<span data-pay-id="'+data.policys[i].id+'">'+data.policys[i].label+'<i></i></span>';
                    }
                    h+=t;
                }
                $('.packageType .bill_tab').html(h);
            }
        });
    });
    // 新增上网类型
    $(document).on('click', '#modalUserType .add', function(){
        var nameType=$('input[name=nameType]').val(), len=parseInt($('#userTypeLen').val()), location=$('#location').val();

        if(checkInput($(this).parent().parent())==0){
            var param={
                location: location,
                name: nameType
            };
            billWebTypeFunc("post", param, function(data){
                if(data.code==200){
                    $('#modalUserType').modal('closed');
                    var h='<span data-user-type-id="'+data.web_type_id+'">类型'+(len+1)+'：'+nameType+'<i></i></span>';
                    $('.userType .bill_tab').append(h);
                    $('#userTypeLen').val(len+1);
                }
            });
        }
    });
    // 删除上网类型
    $(document).on('click', '.userType span i', function(e){
        e.stopPropagation();
        var $this=$(this), idx=$(this).parent().index();
        if(confirm("确定要删除？")){
            if(idx>0){
                billWebTypeFunc("delete", {web_type_id: $(this).parent().attr('data-user-type-id')}, function(data){
                    if(data.code==200){
                        if($this.hasClass('on')){
                            $('.packageType .bill_tab').empty();
                        }
                        $this.parent().remove();
                    }
                });
            }
        }
    });
    // 支付宝
    $(document).on('click', '#modalpay .edit', function(){
        var location=$('#location').val(), id=$('#modalpay input[name=id]').val(), pid=$('#modalpay input[name=pid]').val(), key=$('#modalpay input[name=skey]').val(), rsa=$('#modalpay #rsakey').siblings('input[name=rsa]').val();

        if(checkInput($('#modalpay .veright'))==0){
            var param={
                location: location,
                seller_id: id,
                partner: pid,
                key: key,
                rsa_private_key_url: rsa,
                platform: 'alipay'
            };
            payFunc(param, function(data){
                if(data.code==200){
                    $('#alipay div span').text(id);
                    $('#modalpay input[name=id]').parent().parent().data('value', id);
                    $('#modalpay input[name=pid]').parent().parent().data('value', pid);
                    $('#modalpay input[name=key]').parent().parent().data('value', key);
                    $('#modalpay input[name=rsa]').parent().parent().data('value', rsa);
                    $('#modalpay').modal('closed');
                }else{
                    console.log(data);
                }
            });
        }
    });
    $(document).on('click', '#alipay div button', function(){
        $('#modalpay input[name=payHid]').val('alipay');
        $('#modalpay .veright').each(function(i, n){
            var v=$(n).data('value');
            $(n).find('input').eq(0).val(v);
        });
        $('#modalpay').modal('open');
    });
    $(document).on('click', '#modalpay, #modalpay .closed', function(){
        $('#modalpay').modal('closed');
    });
    // 小文件上传-支付宝
    $(document).on('change', '.profile', function(){uploadfile($(this).attr('id'));});

    // 微信支付
    $(document).on('click', '#modalwxpay .edit', function(){
        var location=$('#location').val(), appid=$('#modalwxpay input[name=appid]').val(), mchid=$('#modalwxpay input[name=mchid]').val(), key=$('#modalwxpay input[name=key]').val();

        if(checkInput($('#modalwxpay .veright'))==0){
            var param={
                location: location,
                appid: appid,
                mch_id: mchid,
                key: key,
                platform: 'wxpay'
            };
            payFunc(param, function(data){
                if(data.code==200){
                    $('#wechat div span').text(appid);
                    $('#modalwxpay input[name=appid]').parent().parent().data('value', appid);
                    $('#modalwxpay input[name=mchid]').parent().parent().data('value', mchid);
                    $('#modalwxpay input[name=key]').parent().parent().data('value', key);
                    $('#modalwxpay').modal('closed');
                }else{
                    console.log(data);
                }
            });
        }
    });
    $(document).on('click', '#wechat div button', function(){
        $('#modalwxpay input[name=payHid]').val('alipay');
        $('#modalwxpay .veright').each(function(i, n){
            var v=$(n).data('value');
            if(!$(n).find('input[type=file]').length>0){
                $(n).find('input').val(v);
            }
        });
        $('#modalwxpay').modal('open');
    });
    $(document).on('click', '#modalwxpay, #modalwxpay .closed', function(){
        $('#modalwxpay').modal('closed');
    });

    // 上传文件
    $('#uploadfile').on('click', function(e) {
        e.preventDefault();
        $('#xlsfile').trigger('click');
    });
    $('#xlsfile').change(function(){
        var location=$('#location').val(), fileElementId=$(this).attr('id'), $span=$(this).parent();
        var eme='<em style="color:#67d58e;"><i class="loading"></i>正在上传...</em>';
        $span.append(eme);

        $.ajaxFileUpload({
            type: "post",
            url: proUrl+'user_template',
            data: {location: location},
            secureuri: false,
            fileElementId: fileElementId,
            dataType: 'json',
            success: function(data, status){
                if(typeof(data["_code"])!="undefined" && data["_code"]==400){//错误码
                    alert(data.errors.toString());
                    return;
                }
                window.location.reload();
            },
            error: function(data, status, e){
                console.log(e);
                if(typeof(data["_code"])!="undefined" && data["_code"]==400){//错误码
                    alert(data.errors.toString());
                }
            }
        });
    });
    $('#uploadfileInner').on('click', function(e) {
        e.preventDefault();
        $('#xlsfileInner').trigger('click');
    });
    $('#xlsfileInner').change(function(){
        var location=$('#location').val(), fileElementId=$(this).attr('id'), $span=$(this).parent();
        var eme='<em style="color:#67d58e;"><i class="loading"></i>正在上传...</em>';
        $span.append(eme);

        $.ajaxFileUpload({
            type: "post",
            url: proUrl+'inneruser_template.xls',
            data: {location: location},
            secureuri: false,
            fileElementId: fileElementId,
            dataType: 'json',
            success: function(data, status){
                window.location.reload();
            },
            error: function(data, status, e){
                console.log(e);
            }
        });
    });

    // 图片大小适配
    var checkImgNone=function(n){
        var src = $(n).attr('src');
        if(src=='None'){
            $(n).attr('src', '/static/images/cover/defaultImg.jpg');
        }
    };
    checkImgNone('.surveyImg img');
    $('.protab .tabimg img').map(function(i, n){
        checkImgNone(n);
        var rw, rh, cw=290, ch;   // rw:real width, rh:real height
        $('<img/>').attr('src', $(n).attr('src')).load(function(){
            rw = this.width;
            rh = this.height;
            if(rw>=cw){
                $(n).css('width', cw+'px');
                ch = Math.floor((cw*rh)/rw);
                if(ch<92){
                    $(n).css('height', '92px');
                }
            }
        });
    });
    $('.pubtab .tabimg img').each(function(i, n){
        var rw;   // rw:real width, rh:real height
        $('<img/>').attr('src', $(n).attr('src')).load(function(){
            rw = this.width;
            if(rw>=200){
                $(n).css('height', '220px');
            }
        });
    });

    // 图片缩放
    $(document).on('click', '.veright img', function(){
        if(!$(this).hasClass('staySize')) {
            $('#modalImg img').attr('src', $(this).attr('src')).load(function () {
                var w = this.width;
                $('.modal_img').css({'width': w + 'px', 'margin-left': -Math.ceil(w / 2) + 'px'});
            });
            //$('.modal_img').css({'width': '800px', 'margin-left':'-400px'});
            //$('#modalImg img').attr('src', $(this).attr('src'));
            $('#modalImg').modal('open');
        }
    });
    $(document).on('click', '#modalImg, #modalImg .closed', function(){
        $('#modalImg').modal('closed');
    });
    $(document).on('click', '.defaultportal img', function(){
        $('#modalImg img').attr('src', $(this).data('src')).load(function(){
            var w = this.width;
            $('.modal_img').css({'width': w+'px', 'margin-left':-Math.ceil(w/2)+'px'});
        });
        $('#modalImg').modal('open');
    });
    // 图片上传
    $(document).on('click', '.file button', function(e) {
        e.preventDefault();
        $(this).prev('input[type=file]').trigger('click');
    });
    $('#uploadImg').change(function(){
        $('.loading').show();
        $.ajaxFileUpload({
            url: imgUrl,
            secureuri: false,
            fileElementId: 'uploadImg',
            //dataType: 'json',
            success: function (data, status){
                console.log(data);
                $('.loading').hide();
                var str = $(data).find("body").text();
                var json = $.parseJSON(str);
                $('.imgVal').val(json.url);
                $('.showImg img').attr('src', cmsUrl+json.url);
                $('.showImg').show();
            },
            error: function (data, status, e){
                console.log(e);
            }
        });
        return false;
    });
    // 图片操作
    $(document).on('click', '.deluploadImg', function(){
        $(this).parent().prev().find('input:eq(0)').val('');
        $(this).prev('img').attr('src', '');
        $(this).parent().hide();
    });
    $('.proImg').change(function(){
        ajaxImg($(this).attr('id'), $(this).attr('imgElementId'), $(this));
    });

    // 消息发送
    $(document).on('click', '.usermem .areabox button', function(){
        var index=$(this).index();
        $('.proMobileCls').eq(index).show().siblings().hide();
        $('.news').eq(index).show().siblings('.news').hide();
        $(this).addClass('on').siblings().removeClass('on');
    });
    // 新增新闻分组
    $(document).on('click', '#addnewsgroup', function() {
        $trThis = $(this);
        $('#modalnewsgroup').modal('open');
    });
    $(document).on('click', '#modalnewsgroup, #modalnewsgroup .closed', function(){
        $('#modalnewsgroup').modal('closed');
    });
    $(document).on('click', '#modalnewsgroup .add', function(){
        if(checkInput($('#modalnewsgroup .veright'))==0){
            var name = $('#modalnewsgroup input[name=name]').val();
            var h = '<button type="button" class="btnGraySmall">'+name+'</button>';
            $trThis.parents('.toolnav').next('.areabox').append(h);
            $('#modalnewsgroup').modal('closed');
        }
    });

    // chart
    $('.sel_date:eq(0)').show();
    $(document).on('change', '.dateorhour', function(){
        var v=$(this).val();
        $('.sel_date').eq(v).show().siblings('.sel_date').hide();
    });
    $(document).on('click', '#cmpTime', function(){
        var v=$('.dateorhour').val();
        if(v==0){
            var d=$('#datepicker').val();
            var url='date='+d;
        }else{
            var start=$('#dateStart').val(), end=$('#dateEnd').val();
            var url='start='+start+'&end='+end;
        }
        myLine = echarts.init(document.getElementById('chartLineContent'), 'macarons');
        myLine.showLoading();
        $.ajax({
            method: "get",
            url: proUrl+'aps/stat/?'+url,
            dataType: "json",
            success: function(data){
                myLine.hideLoading();
                var stat = getStat(data.stat, v);
                opLine(stat.b, stat.c, stat.d, stat.a, v);
            }
        });
    });

    // AC列表
    var chkpwd=function(password){
        if(password==''){
            var h = '<td data-value="'+password+'"></td>';
        }else{
            var h = '<td data-value="'+password+'" data-tip="'+password+'" class="pwdtip">***</td>';
        }
        return h;
    };
    // 编辑AC-modal
    $(document).on('click', '#aclist .edit', function(){
        $trThis = $(this).parent().parent().find('td');
        var id=$(this).siblings('input[name=id]').val();
        var num = parseInt($trThis.eq(-1).find('input[name=mask]').val()).toString(2);
        var mask = ("000"+num).substr(-3).match(/\d/g);
        $('#modalAC #account').val(parseInt(mask[0]));
        $('#modalAC #auto').val(parseInt(mask[1]));
        $('#modalAC #mask').val(parseInt(mask[2]));
        if(parseInt(mask[2])==1){
            $('#modalAC .autoInput').parent().parent().show();
            $('#modalAC .autoInput em').text($trThis.eq(-1).find('input[name=locate]').attr('title'));
            $('#modalAC .autoInput').attr('title', $trThis.eq(-1).find('input[name=locate]').attr('title'));
            $('#modalAC .autoInput').attr('data-locate', $trThis.eq(-1).find('input[name=locate]').attr('data-locate'));
        }else{
            $('#modalAC .autoInput').parent().parent().hide();
        }
        $('#modalAC .fill').each(function(i, n){
            $(n).val($trThis.eq(i).data('value'));
        });
        $('#modalAC input[name=secret]').val($trThis.eq(-1).find('input[name=secret]').val());

        $('#modalAC input[name=id]').val(id);
        $('#modalAC h3').text('编辑AC');
        $('#modalAC .autoInput').addClass('autoAC');
        $('#modalAC .btngroups').html('<button type="button" class="btnBlue save">保存</button>');
        $('#modalAC').modal('open');
    });
    // 新增AC-modal
    $(document).on('click', '#aclist .add', function(){
        $('#modalAC h3').text('新增AC');
        $('#modalAC #mask').val(0);
        $('#modalAC #auto').val(0);
        $('#modalAC #account').val(0);
        $('#modalAC .autoInput em').text('请选择');
        $('#modalAC .autoInput').removeClass('autoAC').attr({'title': '', 'data-locate': ''}).parent().parent().hide();
        $('#modalAC .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalAC').modal('open');
    });
    $(document).on('click', '#modalAC, #modalAC .closed', function(){$('#modalAC').modal('closed');});
    // 保存AC
    $(document).on('click', '#modalAC .save', function(){
        var secret=$('#modalAC input[name=secret]').val(), mask=$('#modalAC #mask').val(), auto=$('#modalAC #auto').val(), account=$('#modalAC #account').val();
        var autoMask=parseInt(account.toString()+auto.toString()+mask.toString(), 2);

        if(checkInput($(this).parent().parent())==0){
            var param={
                name: $('#modalAC input[name=name]').val(),
                ip: $('#modalAC input[name=ip]').val(),
                vendor: $('#vendor').val(),
                model: $('#modalAC input[name=model]').val(),
                user: $('#modalAC input[name=user]').val(),
                password: $('input[name=password]').val(),
                pri: $('#prisq').val(),
                ac_id: $('#modalAC input[name=id]').val(),
                mask: autoMask,
                secret: secret
            };

            acAjax("put", param, function(data){
                if(data.code==200){
                    $('#modalAC .fill').each(function(i, n){
                        $trThis.eq(i).data('value', $(n).val());
                        if($(n).is('select')){
                            $trThis.eq(i).html(changeSelectFunc($(n).attr('id'), $(n).val()));
                        }else if($(n).attr('name')=='password'){
                            $trThis.eq(i).data('tip', $(n).val());
                            $trThis.eq(i).text('***');
                        }else{
                            $trThis.eq(i).text($(n).val());
                        }
                    });
                    $trThis.eq(-1).find('input[name=mask]').val(autoMask);
                    $trThis.eq(-1).find('input[name=secret]').val(secret);
                    $('#modalAC').modal('closed');
                }
            });
        }
    });
    // 新增AC
    $(document).on('click', '#modalAC .add', function(){
        var name=$('#modalAC input[name=name]').val(),
            ip=$('#modalAC input[name=ip]').val(),
            vendor=$('#vendor').val(),
            model=$('#modalAC input[name=model]').val(),
            user=$('#modalAC input[name=user]').val(),
            password=$('#modalAC input[name=password]').val(),
            pri=$('#prisq').val(),
            mask=$('#mask').val(),
            auto=$('#auto').val(),
            account=$('#account').val(),
            secret=$('#modalAC input[name=secret]').val();

        var m=parseInt(account.toString()+auto.toString()+mask.toString(), 2);

        if(checkInput($(this).parent().parent())==0){
            var param={
                name: name,
                ip: ip,
                vendor: vendor,
                model: model,
                user: user,
                password: password,
                pri: pri,
                mask: m,
                secret: secret
            };

            acAjax("post", param, function(data){
                if(data.code==200){
                    if(mask==1){
                        var locate=$('.autoInput').attr('data-locate'), locateName=$('.autoInput').attr('title'), id=data.ac_id;
                        var param={
                            id: id,
                            location: locate
                        };
                        acbindAjax(param, function(data){
                            if(data.code==200){
                                var h='<tr>' +
                                    '<td data-value="'+name+'">'+name+'</td>' +
                                    '<td data-value="'+ip+'">'+ip+'</td>' +
                                    '<td data-value="'+vendor+'">'+changevendor(vendor)+'</td>' +
                                    '<td data-value="'+model+'">'+model+'</td>' +
                                    '<td data-value="'+user+'">'+user+'</td>' +
                                    chkpwd(password) +
                                    '<td><span class="edit">编辑</span><span class="delete">删除</span><input type="hidden" value="'+id+'" name="id" /><input type="hidden" value="'+m+'" name="mask" /><input type="hidden" value="'+secret+'" name="secret" /><input type="hidden" name="locate" data-locate="'+locate+'" data-name="'+locateName+'" /></td>' +
                                    '</tr>';
                                $('#aclist table tr:eq(0)').after(h);
                                $('#modalAC').modal('closed');
                            }
                        });
                    }else{
                        var h='<tr>' +
                            '<td data-value="'+name+'">'+name+'</td>' +
                            '<td data-value="'+ip+'">'+ip+'</td>' +
                            '<td data-value="'+vendor+'">'+changevendor(vendor)+'</td>' +
                            '<td data-value="'+model+'">'+model+'</td>' +
                            '<td data-value="'+user+'">'+user+'</td>' +
                            chkpwd(password) +
                            '<td><span class="edit">编辑</span><span class="delete">删除</span><input type="hidden" value="'+data.ac_id+'" name="id" /><input type="hidden" value="'+m+'" name="mask" /><input type="hidden" value="'+secret+'" name="secret" /><input type="hidden" name="locate" data-locate="" data-name="" /></td>' +
                            '</tr>';
                        $('#aclist table tr:eq(0)').after(h);
                        $('#modalAC').modal('closed');
                    }
                }
            });
        }
    });
    // 删除AC
    $(document).on('click', '#aclist .delete', function(){
        var $this=$(this);
        if(confirm("确定要删除吗?")){
            acAjax("delete", {ac_id: $(this).parent().find('input[name=id]').val()}, function(data){
                if(data.code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    alert('删除失败！');
                }
            });
        }
    });
    // mask
    $(document).on('change', '#modalAC #mask', function(){
        if($(this).val()==1){
            $('#modalAC .autoInput').parent().parent().show();
        }else{
            $('#modalAC .autoInput').parent().parent().hide();
        }
    });

    // AP列表
    // 新增AP
    var selop = $('.selHid').prop("outerHTML");   // 所有项目
    // 编辑AP
    $(document).on('click', '#aplist .edit', function(){
        var $td=$(this).parent().parent().find('td');
        for(var i=0; i<$td.length-1; i++){
            var td = $td.eq(i);
            if(i==2){
                td.html('<div class="autoInput autoDom" title="'+td.attr("data-title")+'" data-locate="'+td.attr("data-value")+'"><em>'+ td.attr("data-title")+'</em></div>');
                $('.autoDom').mySelect();
            }
            if(i==5){td.html('<input type="text" value="'+ td.data("value")+'" style="width:250px;" />');}
        }
        $td.eq($td.length-1).find('span').hide();
        $td.eq($td.length-1).find('button').show();
    });
    // 取消AP
    $(document).on('click', '#aplist .cancel', function(){
        var $td=$(this).parent().parent().find('td');
        for(var i=0; i<$td.length-1; i++){
            var td = $td.eq(i);
            if(i==2){td.html(td.attr('data-title'));}
            if(i==5){td.html(td.data('value'));}
        }
        $td.eq($td.length-1).find('button').hide();
        $td.eq($td.length-1).find('span').show();
    });
    // 保存AP
    $(document).on('click', '#aplist .save', function(){
        var $td=$(this).parent().parent().find('td');
        var accountName=$td.eq(2).find('div em').text(), locate=$td.eq(2).find('.autoInput').attr('data-locate'), mac=$td.eq(1).data('value'), position=$td.eq(5).find('input').val();

        var param={
            location: locate,
            mac: mac,
            address: position
        };

        apAjax("put", param, function(data){
            if(data.code==200){
                for(var i=0; i<$td.length-1; i++){
                    var td = $td.eq(i);
                    if(i==2){
                        td.html(accountName);
                        td.attr('data-title', accountName);
                        td.attr('data-value', locate);
                    }
                    if(i==5){
                        td.html(position);
                        td.data('value', position);
                    }
                }
                $td.eq($td.length-1).find('button').hide();
                $td.eq($td.length-1).find('.edit').show();
            }else{
                console.log(data);
            }
        });
    });
    // 编辑AP
    $(document).on('click', '#apslist .edit', function(){
        var $td=$(this).parent().parent().find('td');
        for(var i=0; i<$td.length-1; i++){
            var td = $td.eq(i);
            if(i==1){
                td.html('<div class="autoInput autoDom" title="'+td.attr("data-title")+'" data-locate="'+td.attr("data-value")+'"><em>'+ td.attr("data-title")+'</em></div>');
                $('.autoDom').mySelect();
            }
            if(i==4){td.html('<input type="text" value="'+ td.data("value")+'" style="width:200px;" />');}
        }
        $td.eq($td.length-1).find('span').hide();
        $td.eq($td.length-1).find('button').show();
    });
    // 取消AP
    $(document).on('click', '#apslist .cancel', function(){
        var $td=$(this).parent().parent().find('td');
        for(var i=0; i<$td.length-1; i++){
            var td = $td.eq(i);
            if(i==1){td.html(td.attr('data-title'));}
            if(i==4){td.html(td.data('value'));}
        }
        $td.eq($td.length-1).find('button').hide();
        $td.eq($td.length-1).find('span').show();
    });
    // 保存AP
    $(document).on('click', '#apslist .save', function(){
        var $td=$(this).parent().parent().find('td');
        var accountName=$td.eq(1).find('div em').text(), locate=$td.eq(1).find('.autoInput').attr('data-locate'), mac=$td.eq(0).data('value'), position=$td.eq(4).find('input').val();

        var param={
            location: locate,
            mac: mac,
            address: position
        };

        apAjax("put", param, function(data){
            if(data.code==200){
                for(var i=0; i<$td.length-1; i++){
                    var td = $td.eq(i);
                    if(i==1){
                        td.html(accountName);
                        td.attr('data-title', accountName);
                        td.attr('data-value', locate);
                    }
                    if(i==4){
                        td.html(position);
                        td.data('value', position);
                    }
                }
                $td.eq($td.length-1).find('button').hide();
                $td.eq($td.length-1).find('span').show();
            }else{
                console.log(data);
            }
        });
    });
    // 绑定AP
    $(document).on('click', '.headunchk', function(e){
        e.stopPropagation();
        $(this).toggleClass('headchk');
    });
    $(document).on('click', '.unchk', function(e){
        e.stopPropagation();
        $(this).toggleClass('chk');
    });
    $(document).on('click', '.allchk', function(){
        if($(this).hasClass('chk')){
            $('#aplist tr:gt(0) .unchk').addClass('chk');
        }else{
            $('#aplist tr:gt(0) .unchk').removeClass('chk');
        }
    });
    $(document).on('click', '#apbind', function(){
        var $autoDom = $(this).prev('.autoInput');
        if($autoDom.attr('data-locate')){
            $(this).next('i').hide();
            var macArr = [];
            $('#aplist tr:gt(0) .chk').each(function(i, n){
                var mac = $(n).parent().parent().find('td:eq(1)').data('value');
                macArr.push(mac);
            });
            if(macArr.length>0){
                if(confirm("绑定选中AP")){
                    var param = {
                        location: $autoDom.attr('data-locate'),
                        macs: macArr.join(',')
                    };
                    apbindAjax(param, function(data){
                        if(data.code==200){
                            window.location.reload();
                        }else{
                            alert('批量绑定失败！');
                        }
                    });
                }
            }else{
                $(this).next('i').text('*请勾选需要批量绑定的AP').show();
            }
        }else{
            $(this).next('i').text('*请选择所属项目').show();
        }
    });

    // AP组管理
    $(document).on('click', '.unchk_b', function(e){
        e.stopPropagation();
        $(this).toggleClass('chk_b');
    });
    $(document).on('click', '.allchk_b', function(){
        if($(this).hasClass('chk_b')){
            $('.aptable tr:gt(0) .unchk_b').addClass('chk_b');
        }else{
            $('.aptable tr:gt(0) .unchk_b').removeClass('chk_b');
        }
    });
    // 新增AP组
    $(document).on('click', '#apeditgroup .add', function(){
        var macs = [];
        if(checkInput($('#apeditgroup .veright'))==0){
            $('.aptable tr:gt(0) .chk_b').each(function(i, n){
                var mac = $(n).parent().parent().find('td:eq(1)').text();
                macs.push(mac);
            });
            var param = {
                location: $('#location').val(),
                name: $('#apeditgroup input[name=name]').val(),
                macs: macs.join(',')
            };
            apgroupAjax('post', param, function(data){
                if(data.code==200){
                    window.location.href = '/apgroups.html?location='+$('#location').val();
                }else{
                    alert("新增失败");
                }
            });
        }
    });
    // 编辑AP组
    $(document).on('click', '#apeditgroup .edit', function(){
        var macs = [];
        if(checkInput($('#apeditgroup .veright'))==0){
            $('.aptable tr:gt(0) .chk_b').each(function(i, n){
                var mac = $(n).parent().parent().find('td:eq(1)').text();
                macs.push(mac);
            });
            var param = {
                ap_group_id: $('#apgroupId').val(),
                name: $('#apeditgroup input[name=name]').val(),
                macs: macs.join(',')
            };
            apgroupAjax('put', param, function(data){
                if(data.code==200){
                    window.location.href = '/apgroups.html?location='+$('#location').val();
                }else{
                    alert("新增失败");
                }
            });
        }
    });
    // 删除AP组
    $(document).on('click', '#apgroups .delbtn', function(){
        if(confirm("确定要删除此AP组吗？")){
            var id=$('#apgroups .navlink .act').data('id');
            apgroupAjax('delete', {ap_group_id: id}, function(data){
                if(data.code==200){
                    window.location.reload();
                }else{
                    alert("删除失败!");
                }
            });
        }
    });
    // 返回
    $(document).on('click', '#apeditgroup .reback, .userinfoReback', function(){
        history.back();
    });

    // 角色管理
    $(document).on('click', '.ns_role .headunchk', function(){
        if($(this).hasClass('headchk')){
            $(this).parent().parent().next('div').find('.unchk').addClass('chk');
        }else{
            $(this).parent().parent().next('div').find('.unchk').removeClass('chk');
        }
    });
    $(document).on('click', '.ns_role .unchk', function(){
        var $div=$(this).parent().parent();
        var len=$div.find('.chk').length;
        if(len==0){
            $div.prev('p').find('.headunchk').removeClass('headchk');
        }else{
            $div.prev('p').find('.headunchk').addClass('headchk');
        }
    });
    var checkRole=function($i){
        var acl=[];
        for(var i=0; i<$i.length; i++){
            if($i.eq(i).hasClass('headchk')){
                var obj={}, operation=[];
                obj.resource = $i.eq(i).parent().data('resource');
                var $div=$i.eq(i).parent().parent().next('div');
                for(var j= 0, $j=$div.find('i'); j<$j.length; j++){
                    if($j.eq(j).hasClass('chk')){
                        operation.push($j.eq(j).parent().data('operation'));
                    }
                    obj.operation = operation;
                }
                acl.push(obj);
            }
        }
        return acl;
    };
    // 角色新增
    $(document).on('click', '#roleAdd', function(){
        var roleName=$('input[name=roleName]').val(), location=$('#location').val();
        if(roleName==''){alert('请输入角色名称！'); return false;}
        var acl = checkRole($('#roleOpra .headunchk'));
        var param={
            role: roleName,
            acl: JSON.stringify(acl)
        };
        roleAjax("post", param, function(data){
            if(data.code==200){
                window.location.href='/admin.html?location='+location;
            }else{
                console.log(data);
                alert('新增失败');
            }
        });
    });
    // 角色编辑
    $(document).on('click', '#roleSave', function(){
        var acl=checkRole($('#roleOpra .headunchk')), location=$('#location').val();
        var param={
            role: $('#role').val(),
            acl: JSON.stringify(acl)
        };
        roleAjax("put", param, function(data){
            if(data.code==200){
                window.location.href = '/admin.html?location='+location;
            }else{
                console.log(data);
                alert('保存失败');
            }
        })
    });
    // 角色切换
    $(document).on('change', '#role', function(){
        console.log("已触发");
        roleAjax("get", {role: $(this).val()}, function(data){
            if(data.code==200){
                $('#roleOpra p label i').removeClass('headchk');
                $('#roleOpra div label i').removeClass('chk');
                data.acl.map(function(item){
                    for(var i=0, $i=$('#roleOpra p label'); i<$i.length; i++){
                        if(item.resource==$i.eq(i).data('resource')){
                            $i.eq(i).find('i').addClass('headchk');
                            var $div=$i.eq(i).parent().next('div');
                            item.operation.map(function(op){
                                for(var j=0, $j=$div.find('label'); j<$j.length; j++){
                                    if(op==$j.eq(j).data('operation')){
                                        $j.eq(j).find('i').addClass('chk');
                                    }
                                }
                            });
                        }
                    }
                });
            }else{
                console.log(data);
            }
        });
    });

    // 光纤管理
    $(document).on('click', '#fiberlist .add', function(){
        $('#modalFiber h3').text('新增宽带');
        $('#modalFiber .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalFiber').modal('open');
    });
    $(document).on('click', '#fiberlist .edit', function(){
        var td = $(this).parent().parent().find('td'), id=$(this).siblings('input').val(), idx=$(this).parent().parent().index();
        $('#modalFiber .veright input').each(function(i, n){
            $(n).val(td.eq(i).data('value'));
        });

        $('#modalFiber input[name=id]').val(id);
        $('#modalFiber input[name=idx]').val(idx);
        $('#modalFiber h3').text('编辑宽带');
        $('#modalFiber .btngroups').html('<button type="button" class="btnBlue save">保存</button>');
        $('#modalFiber').modal('open');
    });
    $(document).on('click', '#modalFiber, #modalFiber .closed', function(){$('#modalFiber').modal("closed");});
    // 保存fiber
    $(document).on('click', '#modalFiber .save', function(){
        var idx=$('#modalFiber input[name=idx]').val();

        if(checkInput($('#modalFiber .veright'))==0){
            var param={
                type_id: $('#fiberlist .adsnav li.on').data('id'),
                line: $('input[name=line]').val(),
                start: $('input[name=start]').val(),
                end: $('input[name=end]').val(),
                telecom: $('input[name=telecom]').val(),
                fiber_id: $('#modalFiber input[name=id]').val()
            };
            fiberAjax("put", param, function(data){
                if(data.code==200){
                    $('#modalFiber .veright input').each(function(i, n){
                        $('#fiberlist table tr').eq(idx).find('td').eq(i).data('value', $(n).val());
                        $('#fiberlist table tr').eq(idx).find('td').eq(i).text($(n).val());
                    });
                    $('#modalFiber').modal('closed');
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 新增fiber
    $(document).on('click', '#modalFiber .add', function(){
        var line=$('input[name=line]').val(),
            start=$('input[name=start]').val(),
            end=$('input[name=end]').val(),
            telecom=$('input[name=telecom]').val();

        if(checkInput($('#modalFiber .verify'))==0){
            var param={
                type_id: $('#fiberlist .adsnav li.on').data('id'),
                line: line,
                start: start,
                end: end,
                telecom: telecom
            };
            fiberAjax("post", param, function(data){
                if(data.code==200){
                    var h='<tr><td data-value="'+line+'">'+line+'</td><td data-value="'+start+'">'+start+'</td><td data-value="'+end+'">'+end+'</td><td data-value="'+telecom+'">'+telecom+'</td><td><span class="edit">编辑</span><span class="delete">删除</span><input type="hidden" value="'+data.fiber_id+'" /></td></tr>';
                    $('#fiberlist table tr:eq(0)').after(h);
                    $('#modalFiber').modal("closed");
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 删除fiber
    $(document).on('click', '#fiberlist .delete', function(){
        var $this=$(this);
        if(confirm("确定要删除吗?")){
            fiberAjax("delete", {fiber_id: $(this).siblings('input').val()}, function(data){
                if(data.code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 切换fiber
    $(document).on('click', '#fiberlist .adsnav li', function(){
        var $this=$(this);
        if(!$this.hasClass('on')){
            fiberAjax("get", {type_id: $this.data("id")}, function(data){
                if(data.code==200){
                    $this.addClass('on').siblings().removeClass('on');
                    var len=data.fibers.length, h='';
                    for(var i=0; i<len; i++){
                        var t='<tr>'+
                            '<td data-value="'+data.fibers[i].line+'">'+data.fibers[i].line+'</td>'+
                            '<td data-value="'+data.fibers[i].start+'">'+data.fibers[i].start+'</td>'+
                            '<td data-value="'+data.fibers[i].end+'">'+data.fibers[i].end+'</td>'+
                            '<td data-value="'+data.fibers[i].telecom+'">'+data.fibers[i].telecom+'</td>'+
                            '<td><span class="edit">编辑</span><span class="delete">删除</span><input type="hidden" value="'+data.fibers[i].id+'" /></td>'+
                        '</tr>';
                        h+=t;
                    }
                    $('#fiberlist table tr:gt(0)').remove();
                    $('#fiberlist table').append(h);
                }else{
                    console.log(data);
                }
            });
        }
    });

    // 编辑pn
    $(document).on('click', '#pnlist .edit', function(){
        $trThis = $(this).parent().parent().find('td');   // td
        var id=$trThis.eq(-1).find('input.id').val(); // 表格位置
        var num = parseInt($trThis.eq(-1).find('input.policy').val()).toString(2);
        var policy = ("00000000000"+num).substr(-11).match(/\d/g);

        $('#modalPn input[name=id]').val(id);
        $('#modalPn input[name=idx]').val(0);
        $('#modalPn #mobileRZ').val(policy[0]);
        $('#modalPn #wechatRZ').val(policy[1]);
        $('#modalPn #accountRZ').val(policy[2]);
        $('#modalPn #pri').val(policy[9]);
        $('#modalPn #policy').val(policy[10]);
        $('#modalPn input[name=ssid]').val($trThis.eq(3).text());
        $('#modalPn input[name=note]').val($trThis.eq(4).text());
        $('#modalPn #portal').val($trThis.eq(5).data('value'));
        $('#modalPn input[name=appid]').val($trThis.eq(6).text());
        $('#modalPn input[name=shopid]').val($trThis.eq(7).text());
        $('#modalPn input[name=secret]').val($trThis.eq(8).text());
        $('#modalPn input[name=duration]').val($trThis.eq(9).text());
        $('#modalPn input[name=stout]').val($trThis.eq(-1).find('input.stout').val());

        $('#modalPn h3').text('编辑网络配置');
        $('#modalPn .btngroups').html('<button type="button" class="btnBlue edit">保存</button>');
        $('#modalPn').modal('open');
    });
    // 新增pn
    $(document).on('click', '#pnlist .addbtn', function(){
        $('#modalPn h3').text('新增网络配置');
        $('#modalPn #accountRZ').val(1);
        $('#modalPn #wechatRZ').val(1);
        $('#modalPn #mobileRZ').val(1);
        $('#modalPn #pri').val(0);
        $('#modalPn #policy').val(0);
        $('#modalPn .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalPn').modal('open');
    });
    $(document).on('click', '#modalPn, #modalPn .closed', function(){$('#modalPn').modal('closed');});
    // 新增pn
    $(document).on('click', '#modalPn .add', function(){
        var pri=$('#pri').val(),
            policy=$('#policy').val(),
            accountRZ=$('#accountRZ').val(),
            wechatRZ=$('#wechatRZ').val(),
            mobileRZ=$('#mobileRZ').val();

        if(checkInput($(this).parent().parent())==0){
            var param={
                location: $('#location').val(),
                policy: parseInt(mobileRZ.toString()+wechatRZ.toString()+accountRZ.toString()+'000000'+pri.toString()+policy.toString(), 2),
                ssid: $('input[name=ssid]').val(),
                note: $('input[name=note]').val(),
                portal: $('#portal').val(),
                appid: $('input[name=appid]').val(),
                shopid: $('input[name=shopid]').val(),
                secret: $('input[name=secret]').val(),
                duration: $('input[name=duration]').val()
            };

            pnAjax("post", param, function(data){
                if(data.code==200){
                    window.location.reload();
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 删除pn
    $(document).on('click', '#pnlist .delete', function(){
        var $this=$(this);
        if(confirm("确定要删除吗?")){
            pnAjax("delete", {policy_id: $this.parent().find('input').val()}, function(data){
                if(data.code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    console.log(data);
                }
            });
        }
    });

    // 网络列表
    $(document).on('click', '#policylist .smore', function(){
        var $div=$(this).parent().parent().next('.insideTable').find('div');
        if($div.is(':hidden')){
            $(this).parent().parent().next('.insideTable').find('div').slideDown();
            $(this).html('收起<i class="aUp"></i>');
        }else{
            $(this).parent().parent().next('.insideTable').find('div').slideUp();
            $(this).html('展开<i class="aDwn"></i>');
        }
    });
    // 编辑网络列表
    var ycselect='';
    $(document).on('click', '#policylist .edit', function(){
        $trThis = $(this).parent().parent().find('td');   // td
        var id=$trThis.eq(-1).find('input.id').val(); // 表格位置
        var num = parseInt($trThis.eq(-1).find('input.policy').val()).toString(2);
        var policy = ("00000000000"+num).substr(-11).match(/\d/g);

        $('#modalPn input[name=id]').val(id);
        $('#modalPn input[name=idx]').val(1);
        $('#modalPn #mobileRZ').val(policy[0]);
        $('#modalPn #wechatRZ').val(policy[1]);
        $('#modalPn #accountRZ').val(policy[2]);
        $('#modalPn #pri').val(policy[9]);
        $('#modalPn #policy').val(policy[10]);
        $('#modalPn input[name=ssid]').val($trThis.eq(3).text());
        $('#modalPn input[name=note]').val($trThis.eq(4).text());
        $('#modalPn input[name=appid]').val($(this).siblings('.appid').val());
        $('#modalPn input[name=shopid]').val($(this).siblings('.shopid').val());
        $('#modalPn input[name=secret]').val($(this).siblings('.secret').val());
        $('#modalPn input[name=stout]').val($trThis.eq(-1).find('input.stout').val());

        var location = $trThis.eq(0).text();
        if(location==29946){
            $('#modalPn .durationRZ').html('<label><i>*</i>免认证(小时) </label>'+
                '<span class="veright"><div class="verify">'+
                '<input type="text" name="duration" placeholder="输入小时，例如：5" class="matchVerify shouldVerify checkInt" />'+
                '</div></span>');
            if(ycselect==''){
                portalAjax("get", '', '', function(data){
                    console.log(data);
                    if(data.Code==200){
                        ycselect='<select id="portal"><option value="login_yczone.html">login_yczone.html</option>';
                        for(var i=0; i<data.templates.length; i++){
                            var tpl = data.templates[i];
                            ycselect+='<option value="'+tpl+'">'+tpl+'</option>';
                        }
                        ycselect+='</select>';
                        $('#modalPn .portalRZ .verify').html(ycselect);
                    }else{
                        console.log(data);
                    }
                });
            }else{
                $('#modalPn .portalRZ .verify').html(ycselect);
            }
        }else{
            $('#modalPn .durationRZ').html('<label><i>*</i>免认证(天) </label>'+
                '<span class="veright"><div class="verify">'+
                '<input type="text" name="duration" placeholder="输入天数，例如：5" class="matchVerify shouldVerify checkInt" />'+
                '</div></span>');
            $('#modalPn .portalRZ .verify').html('<input type="text" class="matchVerify shouldVerify" id="portal" />');
        }
        $('#modalPn #portal').val($trThis.eq(5).data('value'));
        $('#modalPn input[name=duration]').val($(this).siblings('.duration').val());

        $('#modalPn h3').text('编辑网络配置');
        $('#modalPn .btngroups').html('<button type="button" class="btnBlue edit">保存</button>');

        $('#modalPn').modal('open');
    });
    $(document).on('click', '#modalPn .edit', function(){
        var idx=$('#modalPn input[name=idx]').val();

        var pri=$('#modalPn #pri').val(), priTxt=$('#modalPn #pri option:selected').text(),
            policy=$('#modalPn #policy').val(), policyTxt=$('#modalPn #policy option:selected').text(),
            accountRZ=$('#modalPn #accountRZ').val(),
            wechatRZ=$('#modalPn #wechatRZ').val(),
            mobileRZ=$('#modalPn #mobileRZ').val(),
            ssid=$('#modalPn input[name=ssid]').val(),
            note=$('#modalPn input[name=note]').val(),
            portal=$('#modalPn #portal').val(),
            appid=$('#modalPn input[name=appid]').val(),
            shopid=$('#modalPn input[name=shopid]').val(),
            secret=$('#modalPn input[name=secret]').val(),
            duration=$('#modalPn input[name=duration]').val(),
            stout=$('#modalPn input[name=stout]').val();

        var policyRZ = parseInt(mobileRZ.toString()+wechatRZ.toString()+accountRZ.toString()+'000000'+pri.toString()+policy.toString(), 2);

        if(checkInput($('#modalPn .veright'))==0){
            var param={
                policy_id: $('#modalPn input[name=id]').val(),
                policy: policyRZ,
                ssid: ssid,
                note: note,
                portal: portal,
                appid: appid,
                shopid: shopid,
                secret: secret,
                duration: duration,
                session_timeout: stout
            };
            console.log(param);

            pnAjax("put", param, function(data){
                if(data.code==200){
                    if(idx==1){
                        $trThis.eq(1).html(priTxt+'<input type="hidden" value="'+pri+'" />');
                        $trThis.eq(2).html(policyTxt+'<input type="hidden" value="'+policy+'" />');
                        $trThis.eq(3).text(ssid);
                        $trThis.eq(4).text(note);
                        $trThis.eq(5).text(portal);
                        $trThis.eq(5).data('value', portal);
                        $trThis.eq(-1).find('.appid').val(appid);
                        $trThis.eq(-1).find('.shopid').val(shopid);
                        $trThis.eq(-1).find('.secret').val(secret);
                        $trThis.eq(-1).find('.duration').val(duration);
                        $trThis.eq(-1).find('.policy').val(policyRZ);
                        $trThis.eq(-1).find('.stout').val(stout);
                    }else{
                        $trThis.eq(1).html(priTxt+'<input type="hidden" value="'+pri+'" />');
                        $trThis.eq(2).html(policyTxt+'<input type="hidden" value="'+policy+'" />');
                        $trThis.eq(3).text(ssid);
                        $trThis.eq(4).text(note);

                        $trThis.eq(5).text(portal);
                        $trThis.eq(5).data('value', portal);
                        $trThis.eq(6).text(appid);
                        $trThis.eq(7).text(shopid);
                        $trThis.eq(8).text(secret);
                        $trThis.eq(9).text(duration);
                        $trThis.eq(-1).find('input.policy').val(policyRZ);
                        $trThis.eq(-1).find('input.stout').val(stout);
                    }
                    $('#modalPn').modal('closed');
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 删除网络列表
    $(document).on('click', '#policylist .delete', function(){
        var $this=$(this);
        if(confirm("确定要删除吗?")){
            pnAjax("delete", {policy_id: $this.parent().find('input.id').val()}, function(data){
                if(data.code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    console.log(data);
                }
            });
        }
    });

    // 新增资源
    // 施工图新增
    $(document).on('click', '.delsgt', function(){
        if(confirm('确定要删除吗？')){
            $(this).parent().parent().remove();
        }
    });
    $(document).on('click', '#addsgt', function(){
        var r=Math.round(Math.random()*100000);
        var h='<tr>' +
            '<td><input type="text" class="sgtName" /></td>' +
            '<td class="file">' +
                '<input type="hidden" />' +
                '<input type="file" class="uploadImg sgtImg" id="sgtImg'+r+'" name="uploadImg" />' +
                '<button type="button" class="btnGreen">上传施工图</button>' +
                '<div class="loading"></div>' +
                '<em></em>' +
                '<div class="delsgt"></div>' +
            '</td></tr>';
        if($('.sgt tr').length<2 || $('.sgtName').val()!=''){
            $('.sgt').append(h);
        }
    });
    $(document).on('change', '.sgtName', function(){
        if($.trim($(this).val())==''){
            $(this).parent().next('.file').find('input[type=hidden]').removeClass('shouldVerify checkFile');
        }else{
            $(this).parent().next('.file').find('input[type=hidden]').addClass('shouldVerify checkFile');
        }
    });
    $(document).on('change', '.sgtImg', function(){ajaxImgSec($(this).attr('id'), $(this));});
    // 附加字段新增
    $(document).on('click', '#addFields', function(){
        if(checkIpu($('.exwords'))==0){
            var h='<tr class="extr"><td><i class="uncheck_s on"></i></td><td><input type="text" class="title" /></td><td><input type="text" class="column matchVerify checkEng" /></td><td><select class="extype"><option value="string">字符串(String)</option><option value="int">整型(Int)</option><option value="float">浮点型(Float)</option><option value="datetime">日期(Date)</option><option value="password">密码(Password)</option><option value="img">图片(Img)</option></select></td></tr>';
            $('.exwords').append(h);
        }
    });
    var exfield = false;   // 附件字段标记
    $(document).on('change', '#resId', function(){
        if($(this).val()==8){
            $('.exfields').show();
            exfield = true;
        }else{
            $('.exfields').hide();
            $('.exfields .errormsg').remove();
            exfield = false;
        }
    });
    $(document).on('click', '#addRes', function(){
        var location=$('#location').val(), plans=[], fields=[];
        if(location.indexOf('29946')==0){
            fields = [
                {type: 'string', column: 'mobile', title: '电话号码', is_profile: 1},
                {type: 'string', column: 'name', title: '姓名', is_profile: 1},
                {type: 'string', column: 'department', title: '部门', is_profile: 1},
                {type: 'string', column: 'position', title: '职位', is_profile: 1},
                {type: 'string', column: 'mail', title: '邮箱', is_profile: 1},
                {type: 'int', column: 'mask', title: 'mask', is_profile: 0},
                {type: 'string', column: 'user', title: 'user', is_profile: 0}
            ];
        }else{
            fields = [
                {type: 'string', column: 'mobile', title: '电话号码', is_profile: 1}
            ];
        }
        var arrayFields = [
            {type: 'string', column: 'room', title: '房间号', is_profile: 1},
            {type: 'string', column: 'mobile', title: '电话号码', is_profile: 1},
            {type: 'string', column: 'user', title: '上网账号', is_profile: 1},
            {type: 'password', column: 'password', title: '密码', is_profile: 1},
            {type: 'datetime', column: 'expired', title: '到期时间', is_profile: 1}
        ];

        if(checkInput($('.veright'))>0){return false;}
        if(exfield){
            $(".exfields .innerTable table tr.extr").each(function(i, n){
                var obj={};
                if(checkIpu($(n))==0){
                    obj.title=$(n).find('.title').val();
                    obj.type=$(n).find('.extype').val();
                    obj.column=$(n).find('.column').val();
                    obj.is_profile=$(n).find('i').hasClass('on')? 1 : 0;
                    fields.push(obj);
                }
            });
            arrayFields = fields;
        }
        $('.sgt tr:gt(0)').each(function(i, n){
            var obj={};
            var name = $(n).find('.sgtName').val(),
                pic = $(n).find('input[type=hidden]').val();
            obj.name=name;
            obj.imgurl=pic;
            plans.push(obj);
        });
        var param={
            location: location,
            type_id: $('#resId').val(),
            note: $('#note').val(),
            name: $('input[name=resName]').val(),
            owner: $('input[name=resOwner]').val(),
            mobile: $('input[name=resMobile]').val(),
            address: $('input[name=resAddress]').val(),
            logo: $('input[name=resLogo]').val(),
            license: $('input[name=license]').val(),
            topology: $('input[name=topology]').val(),
            tracepoint: $('input[name=tracepoint]').val(),
            fieldphoto: $('input[name=fieldphoto]').val(),
            schemes: JSON.stringify(arrayFields),
            plans: JSON.stringify(plans)
        };
        resAjax("post", param, function(data){
            if(data.code==200){
                if(location==''){
                    window.location.href='/index.html';
                }else{
                    window.location.href='/projectcard.html?location='+location;
                }
            }else{
                console.log(data);
            }
        });
    });
    $(document).on('click', '#editRes', function(){
        var location=$('#location').val(), plans=[];

        if(checkInput($('.veright'))==0){
            $('.sgt tr:gt(0)').each(function(i, n){
                var obj={};
                var name = $(n).find('.sgtName').val(),
                    pic = $(n).find('input[type=hidden]').val();
                obj.name=name;
                obj.imgurl=pic;
                plans.push(obj);
            });
            var param={
                location: location,
                type_id: $('#resId').data('resid'),
                note: $('#note').val(),
                name: $('input[name=resName]').val(),
                owner: $('input[name=resOwner]').val(),
                mobile: $('input[name=resMobile]').val(),
                address: $('input[name=resAddress]').val(),
                logo: $('input[name=resLogo]').val(),
                license: $('input[name=license]').val(),
                topology: $('input[name=topology]').val(),
                tracepoint: $('input[name=tracepoint]').val(),
                fieldphoto: $('input[name=fieldphoto]').val(),
                plans: JSON.stringify(plans)
            };

            resAjax("put", param, function(data){
                if(data.code==200){
                    window.location.href='/projectcard.html?location='+location;
                }else{
                    console.log(data);
                }
            });
        }
    });

    // 总用户管理
    // 新增按钮
    $('#totallist .addbtn').click(function(){
        $('#modalUser').modal('open');
    });
    $(document).on('click', '#modalUser, #modalUser .closed', function(){
        $('#modalUser').modal('closed');
    });
    // 新增用户
    var userHtml=function(user, projectId, projectname, exTime, password, selop){
        var h = '<tr><td>'+user+'</td>' +
            '<td>'+password+'</td>' +
            '<td><span>'+projectname+'</span>'+selop+'<input type="hidden" value="'+projectId+'" /></td>' +
            '<td>0</td>' +
            '<td>'+exTime+'</td>' +
            '<td>0</td>' +
            '<td>0</td>' +
            '<td><span class="changePwd">修改密码</span><span class="forbin">停用</span><span class="delete">删除</span><button type="button" class="btnGrayAutoMin save">保存</button><button type="button" class="btnGrayAutoMin cancel">取消</button><input type="hidden" value="'+user+'" </td></tr>';
        return h;
    };
    $(document).on('click', '#modalUser .add', function(){
        var projectId=$('.autoDom').attr('data-locate'),
            projectname=$('.autoDom').attr('title'),
            exTime=$('#exTime').val(),
            password=$('#password').val(),
            expassword=$('#expassword').val();

        if(projectId==''){
            $('.msg').text('选择所属项目');
            return false;
        }
        if(password!=expassword){
            $('.msg').text('两次密码不相同');
            return false;
        }
        $('.msg').html('');
        $.ajax({
            method: "post",
            url: proUrl+'users/',
            dataType: "json",
            data: {
                project_id: projectId,
                expire_date: exTime,
                password: password
            },
            success: function(data){
                if(data.code==200){
                    $('#modalUser').modal('closed');
                    var h = userHtml(data.user, projectId, projectname, exTime, password, selop);
                    $('#totallist table tr:eq(0)').after(h);
                }else{
                    console.log(data);
                    //$('.msg').text('连接服务器出错');
                }
            },
            error: function(error){
                console.log(error);
            }
        });
    });
    // 修改密码按钮
    $(document).on('click', '#totallist .changePwd', function(){
        var $td=$(this).parent().parent().find('td');
        var h='<input type="text" value="'+$td.eq(1).data('value')+'" />';
        $td.eq(1).html(h);
        $td.eq($td.length-1).find('span').hide();
        $td.eq($td.length-1).find('button').show();
    });
    // 保存密码修改
    $(document).on('click', '#totallist .save', function(){
        var $td=$(this).parent().parent().find('td');
        var pwd = $td.eq(1).find('input').val();
        var param = {
            user_id: $(this).parent().find('input').val(),
            password: pwd
        };
        userAjax("put", param, function(data){
            if(data.code==200){
                $td.eq(1).html('<em data-tip="'+pwd+'" class="pwdtip">***</em>');
                $td.eq(1).data('value', pwd);
                $td.eq($td.length-1).find('button').hide();
                $td.eq($td.length-1).find('span').show();
            }else{
                alert('修改密码失败！');
            }
        });
    });
    // 取消修改密码
    $(document).on('click', '#totallist .cancel', function(){
        var $td=$(this).parent().parent().find('td');
        $td.eq(1).html('<em data-tip="'+$td.eq(1).data('value')+'" class="pwdtip">***</em>');
        $td.eq($td.length-1).find('button').hide();
        $td.eq($td.length-1).find('span').show();
    });
    // 删除用户
    $(document).on('click', '#totallist .delete', function(){
        var $this=$(this);
        if(confirm("确定要删除吗?")){
            userAjax("delete", {user: $this.parent().find('input').val()}, function(data){
                if(data.code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    alert('删除失败！');
                }
            });
        }
    });

    // 账户管理
    // 修改密码
    $(document).on('click', '.accountInfo .edit', function(){
        $trThis = $(this);
        $('#modalPassword').modal('open');
    });
    $(document).on('click', '#modalPassword, #modalPassword .closed', function(){
        $('#modalPassword').modal('closed');
    });
    $(document).on('click', '#modalPassword .save', function(){
        if(checkInput($('#modalPassword .vertical'))==0){
            var oldpwd = $('input[name=oldpwd]').val(),
                newpwd = $('input[name=newpwd]').val(),
                new2pwd = $('input[name=new2pwd]').val();

            if(newpwd!=new2pwd){$('#modalPassword .msg').text('两次新密码不一致！');return false;}

            $('#modalPassword .msg').text('');
            var param={
                name: $trThis.data('value'),
                password: newpwd,
                oldpassword: oldpwd
            };
            accountAjax("put", param, function(data){
                if(data.code==200){
                    $('#modalPassword').modal('closed');
                }else{
                    console.log(data);
                    $('#modalPassword .msg').text(data.reason);
                }
            });
        }
    });
    // 新增账户
    $(document).on('click', '#accountlist .addbtn', function(){
        $('#modalAccount h3').text("新增账户");
        $('#modalAccount .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalAccount .autoInput em').text('所属');
        $('#modalAccount .autoInput').attr('data-locate', '');
        $('#modalAccount .autoInput').attr('title', '');
        $('#modalAccount li:eq(0) .verify').html('<input type="text" name="name" class="matchVerify shouldVerify" />');
        $('#modalAccount li:eq(3) .verify input').addClass('shouldVerify');
        $('#modalAccount').modal('open');
    });
    $(document).on('click', '#modalAccount, #modalAccount .closed', function(){
        $('#modalAccount').modal('closed');
    });
    $(document).on('click', '#modalAccount .add', function(e){
        var name=$('#modalAccount input[name=name]').val(),
            location=$('#modalAccount .autoInput').attr('data-locate'),
            locationName=$('#modalAccount .autoInput').attr('title'),
            roleName=$('#role option:selected').text(),
            role=$('#role').val(),
            password=$('#modalAccount input[name=password]').val();

        if(location==''){$('.msg').text('选择所属项目');return false;}
        $('.msg').text('');
        if(checkInput($('#modalAccount .veright'))==0){
            var param={
                name: name,
                location: location,
                role: role,
                password: password
            };
            accountAjax("post", param, function(data){
                if(data.code==200){
                    window.location.reload();
                }else{
                    $('#modalAccount .msg').text(data.reason);
                }
            });
        }
    });
    // 编辑账户
    $(document).on('click', '#accountlist .edit', function(){
        var idx = $(this).parent().parent().index(), $td=$(this).parent().parent().find('td');
        $('#modalAccount input[name=idx]').val(idx);
        $('#modalAccount input[name=id]').val($td.eq(0).data('value'));
        $('#modalAccount li:eq(0) .verify').html($td.eq(0).data('value'));
        $('#modalAccount input[name=password]').removeClass('shouldVerify');
        $('#modalAccount .autoInput em').text($td.eq(2).text());
        $('#modalAccount .autoInput').attr('title', $td.eq(2).text());
        $('#modalAccount .autoInput').attr('data-locate', $td.eq(2).data('value'));
        $('#modalAccount #role').val($td.eq(3).data('value'));
        $('#modalAccount h3').text("编辑账户");
        $('#modalAccount .btngroups').html('<button type="button" class="btnBlue save">保存</button>');
        $('#modalAccount').modal('open');
    });
    $(document).on('click', '#modalAccount .save', function(e){
        var name = $('#modalAccount input[name=id]').val(),
            password = $('#modalAccount input[name=password]').val(),
            location = $('#modalAccount .autoInput').attr('data-locate'),
            locationName = $('#modalAccount .autoInput').attr('title'),
            role = $('#role').val(),
            roleName = $('#role option:selected').text(),
            idx = $('#modalAccount input[name=idx]').val();
        if(location==''){$('.msg').text('选择所属项目');return false;}
        $('.msg').text('');
        if(checkInput($('#modalAccount .veright'))==0) {
            var param = {
                name: name,
                location: location,
                role: role
            };
            if(password!=''){param.password=password;}
            accountAjax("put", param, function (data) {
                if (data.code == 200) {
                    window.location.reload();
                } else {
                    $('#modalAccount .msg').text(data.reason);
                }
            });
        }
    });
    // 停用账户
    $(document).on('click', '#accountlist .forbin', function(){
        var $this=$(this);
        if(confirm("确定停用该账户吗？")){
            accountAjax("put", {name:$(this).siblings('input[name=name]').val(), mask:0}, function(data){
                $this.parent().parent().addClass('dab');
                $this.text('启用').addClass('unforbin').removeClass('forbin');
            });
        }
    });
    // 启用账户
    $(document).on('click', '#accountlist .unforbin', function(){
        var $this=$(this);
        accountAjax("put", {name:$(this).siblings('input[name=name]').val(), mask:1}, function(data){
            $this.parent().parent().removeClass('dab');
            $this.text('停用').addClass('forbin').removeClass('unforbin');
        });
    });
    // 在线用户导出
    $(document).on('click', '#export', function(){
        var param={
            mask: $('#userlist .adsnav li.on').data('mask'),
            location: $('#location').val(),
            start: $('.time #dateStart').data('start'),
            end: $('.time #dateEnd').data('end'),
            keyword: $('.toolbox .search input').data('search'),
            sort: $('#userlist table').data('sort')
        };
        $(this).attr('href', '/export/onlineusers/?'+$.param(param));
    });

    // 内网账户
    // 新增用户
    $(document).on('click', '#userlistInner .add', function(){$('#modalRoomInner').modal('open');});
    $(document).on('click', '#modalRoomInner, #modalRoomInner .closed', function(){$('#modalRoomInner').modal('closed');});

    // 上网账户
    // 新增用户
    $(document).on('click', '#userlistAccount .add', function(){$('#modalRoomAccount').modal('open');});
    $(document).on('click', '#modalRoomAccount, #modalRoomAccount .closed', function(){$('#modalRoomAccount').modal('closed');});
    // 停用用户
    $(document).on('click', '#userlistAccount .forbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()|(1<<30);
        if(confirm("确定要停用该用户吗？")){
            userAccountAjax("put", $(this).siblings('input.id').val(), {mask: mask}, function(data){
                if(data.code==200){
                    $this.siblings('input.mask').val(mask);
                    $this.parent().parent().addClass('dab');
                    $this.text('启用').addClass('unforbin').removeClass('forbin');
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 启用用户
    $(document).on('click', '#userlistAccount .unforbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()&(~(1<<30));
        userAccountAjax("put", $(this).siblings('input.id').val(), {mask: mask}, function(data){
            if(data.code==200){
                $this.siblings('input.mask').val(mask);
                $this.parent().parent().removeClass('dab');
                $this.text('停用').addClass('forbin').removeClass('unforbin');
            }else{
                console.log(data);
            }

        });
    });
    $(document).on('click', '#userlistAccount .send', function(){
        var $tr = $(this).parents('tr'), $this = $(this);
        var mobile = $tr.find('td:eq(0)').text(),
            user = $tr.find('td:eq(1)').text(),
            password = $tr.find('td:eq(2)').data('tip');
        sendAccountAjax(mobile, {user: user, password: password}, function(data){
            $this.addClass('sendDis').removeClass('send');
            alert('已发送!');
        }, function(error){
            if(error.status == 200){
                $this.addClass('sendDis').removeClass('send');
                alert('已发送!');
            }else{
                try{
                    alert('发送失败：'+error.responseJSON.Msg);
                }catch (e){
                    alert('发送失败');
                }
            }
        });

    });
    // 专网用户
    // 充值
    window.curRechargingId = null;
    $(document).on('click', '#userlistPn .recharge', function(e){
        var thisUserId = $(this).siblings('input.id').val(), location = $('#location').val();
        policyListAjax({location: location}, function(data){
            if(data.code==200){
                var optionStr = "";
                if(typeof(data.paypolicys)=="undefined" || data.paypolicys.length==0){return;}
                for(var i=0;i<data.paypolicys.length;i++){
                    optionStr+="<option value='"+data.paypolicys[i].id+"'>"+data.paypolicys[i].label+"("+data.paypolicys[i].price+"元)</option>";
                }
                $('#modalRecharge #comboList').html(optionStr);
            }else{
                console.log(data);
            }
        });
        $('#modalRecharge').modal('open');
        curRechargingId = thisUserId;
        $('#modalRecharge .add').attr('data-userid',thisUserId);
        $(this).addClass("recharging");
    });
    $(document).on('click', '#modalRecharge, #modalRecharge .closed', function(){$('#modalRecharge').modal('closed');});

    $(document).on('click', '#modalRecharge .add', function(e){
        var thisUserId=$(this).data("userid"),
            myPay_policy_id=$('#modalRecharge #comboList').val();
        if(myPay_policy_id=="" ||myPay_policy_id==null){
            alert("请选择套餐");
        }

        if(confirm("确定要充值该套餐吗？")){
            var param={
                userid: curRechargingId,//thisUserId,
                pay_policy_id: myPay_policy_id
                // location: location,
            };
            chargeOfflineAjax(param, function(data){
                if(data.code==200){
                    // window.location.reload();
                    if(typeof(data.expired)=="undefined"){return;}
                    $(".recharging").parent().parent().find("td:eq(5)").html(data.expired);
                    $(".recharging").removeClass("recharging");
                    $('#modalRecharge').modal('closed');
                    alert("充值成功。");
                }else{
                    $('#modalRecharge .msg').text(data.reason);
                }
            });
        }
    });
    // 新增用户
    $(document).on('click', '#userlistPn .add', function(){$('#modalRoomPn').modal('open');});
    $(document).on('click', '#modalRoomPn, #modalRoomPn .closed', function(){$('#modalRoomPn').modal('closed');});
    // 停用用户
    $(document).on('click', '#userlistPn .forbin', function(e){
        e.stopPropagation();
        var $this=$(this),
            location=$('#location').val(),
            id=$(this).siblings('input.id').val(),
            mask=$(this).siblings('input.mask').val(),
            param={};
        param.mask = mask|(1<<30);
        if(confirm("确定要停用该用户吗？")){
            userPnAjax("put", id, {location: location, params: JSON.stringify(param)}, function(data){
                if(data.code==200){
                    $this.siblings('input.mask').val(mask);
                    $this.parent().parent().addClass('dab');
                    $this.text('启用').addClass('unforbin').removeClass('forbin');
                    window.location.reload();
                }else{
                    console.log(data);
                }
            });
        }

    });
    // 启用用户
    $(document).on('click', '#userlistPn .unforbin', function(e){
        e.stopPropagation();
        var $this=$(this),
            location=$('#location').val(),
            id=$(this).siblings('input.id').val(),
            mask=$(this).siblings('input.mask').val(),
            param={};
        param.mask = mask&(~(1<<30));
        userPnAjax("put", id, {location: location, params: JSON.stringify(param)}, function(data){
            if(data.code==200){
                $this.siblings('input.mask').val(mask);
                $this.parent().parent().removeClass('dab');
                $this.text('停用').addClass('forbin').removeClass('unforbin');
                window.location.reload();
            }else{
                console.log(data);
            }

        });
    });

    // 在线用户
    // 停用用户
    $(document).on('click', '#userlistOnline .forbin, #apslist .siTable .forbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()|(1<<30);

        if(confirm("确定要停用该用户吗？")){
            userOnlineAjax("put", $(this).siblings('input.id').val(), {mask: mask, mac: $(this).siblings('input.mac').val()}, function(data){
                if(data.code==200){
                    $this.siblings('input.mask').val(mask);
                    $this.parent().parent().addClass('dab');
                    $this.text('启用').addClass('unforbin').removeClass('forbin');
                }else{
                    console.log(data);
                }
            });
        }

    });
    // 启用用户
    $(document).on('click', '#userlistOnline .unforbin, #apslist .siTable .unforbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()&(~(1<<30));
        userOnlineAjax("put", $(this).siblings('input.id').val(), {mask: mask, mac: $(this).siblings('input.mac').val()}, function(data){
            if(data.code==200){
                $this.siblings('input.mask').val(mask);
                $this.parent().parent().removeClass('dab');
                $this.text('停用').addClass('forbin').removeClass('unforbin');
            }else{
                console.log(data);
            }

        });
    });
    // 访客用户
    // 停用用户
    $(document).on('click', '#userlistGuest .forbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()|(1<<30);
        if(confirm("确定要停用该用户吗？")){
            userGuestAjax("put", $(this).siblings('input.id').val(), {mask: mask, mac: $(this).siblings('input.mac').val()}, function(data){
                if(data.code==200){
                    $this.siblings('input.mask').val(mask);
                    $this.parent().parent().addClass('dab');
                    $this.text('启用').addClass('unforbin').removeClass('forbin');
                }else{
                    console.log(data);
                }
            });
        }

    });
    // 启用用户
    $(document).on('click', '#userlistGuest .unforbin', function(e){
        e.stopPropagation();
        var $this=$(this);
        var mask = $this.siblings('input.mask').val()&(~(1<<30));
        userGuestAjax("put", $(this).siblings('input.id').val(), {mask: mask, mac: $(this).siblings('input.mac').val()}, function(data){
            if(data.code==200){
                $this.siblings('input.mask').val(mask);
                $this.parent().parent().removeClass('dab');
                $this.text('停用').addClass('forbin').removeClass('unforbin');
            }else{
                console.log(data);
            }

        });
    });
    // 切换用户
    $(document).on('click', '#userlistOnline .adsnav li', function(){
        if(!($(this).find('a').length>0)){
            alert('开发中...');
        }
    });

    // 用户详情
    var userinfoFlag = true;
    // 用户详情-编辑
    $(document).on('click', '#userinfoEdit', function(){
        if(userinfoFlag){
            $(this).hide().siblings().show();   // 显示保存、取消按钮
            $('.sue').each(function(i, n){
                var v = $(n).data('value');
                if($(n).attr('name')=='ends'){
                    var h='<div class="amount">'+
                        '<button type="button" class="btnWhiteSmall reduceOne">-</button>'+
                        '<input type="text" value="'+ v +'" />'+
                        '<button type="button" class="btnWhiteSmall addOne">+</button>'+
                    '</div>';
                }else if($(n).data('type')=='datetime'){
                    var h='<div class="verify"><input type="text" value="'+ v +'" class="datepicker" /></div>';
                }else if($(n).attr('name')=='mobile'){
                    var h='<div class="verify"><input type="text" class="matchVerify shouldVerify checkPhone" value="'+ v +'" /></div>';
                }else if($(n).attr('name')=='name'){
                    var h='<div class="verify"><input type="text" class="matchVerify shouldVerify" value="'+ v +'" /></div>';
                }else if($(n).attr('name')=='mac'){
                    var h='<div class="verify"><input type="text" class="matchVerify shouldVerify" value="'+ v +'" /><span style="font-size:14px;color:#777">*MAC格式 xx:xx:xx:xx:xx:xx，以逗号(","）隔开多个MAC</span></div>';
                }else if($(n).data('type')=='password'){
                    $(n).removeClass('pwdtip');
                    var h='<div class="verify"><input type="text" value="'+ v +'" /></div>';
                }else if($(n).data('type')=='img'){
                    $(n).find('.uploadify').show();
                    $(n).find('i').show();
                }else{
                    var h='<div class="verify"><input type="text" value="'+ v +'" /></div>';
                }
                $(n).html(h);
            });
            $('.datepicker').datetimepicker({
                dateFormat: 'yy-mm-dd',
                stepMinute: 10
            });
            $('.amount').amount();
            userinfoFlag = false;
        }
    });
    // 上网用户详情-保存
    $(document).on('click', '#userinfoAccountSave', function(){
        if(!userinfoFlag){
            var obj={}, id=$('.widget input.id').val(), arr=[];
            $('.sue').each(function(i, n){
                var sn=$(n).attr('name'), dtype=$(n).data('type'), objInner={};
                if(dtype=='int'){
                    obj[sn]=parseInt($(n).find('input').val());
                }else if(dtype=='img'){
                    obj[sn]=$(n).find('.imgShow').data('value');
                }else{
                    obj[sn]=$(n).find('input').val();
                }
                objInner.type=dtype;
                objInner.value=obj[sn];
                arr.push(objInner);
            });

            if(checkInput($('.sue'))==0){
                userAccountAjax("put", id, obj, function(data){
                    if(data.code==200){
                        //$.each(arr, function(i, n){
                        //    $('.sue').eq(i).data('value', n.value);
                        //    if(n.type=='password'){
                        //        $('.sue').eq(i).data('tip', n.value).addClass('pwdtip').text('***');
                        //    }else if(n.type=='img'){
                        //        if(n.value!=''){
                        //            $('.sue').eq(i).find('i').hide();
                        //            $('.sue').eq(i).data('value', n.value);
                        //            $('.sue').eq(i).find('.uploadify').hide();
                        //        }
                        //    }else{
                        //        $('.sue').eq(i).text(n.value);
                        //    }
                        //});
                        //$('.userinfoSave').hide();$('#userinfoQuit').hide();$('#userinfoEdit').show();
                        //userinfoFlag = true;
                        window.location.reload();
                    }else{
                        console.log(data);
                    }
                });
            }
        }
    });
    // 内网用户详情-保存
    $(document).on('click', '#userinfoInnerSave', function(){
        if(!userinfoFlag){
            var obj={}, id=$('.widget input.id').val(), arr=[];
            $('.sue').each(function(i, n){
                var sn=$(n).attr('name'), dtype=$(n).data('type'), objInner={};
                if(dtype=='int'){
                    obj[sn]=parseInt($(n).find('input').val());
                }else if(dtype=='img'){
                    obj[sn]=$(n).find('.imgShow').data('value');
                }else{
                    obj[sn]=$(n).find('input').val();
                }
                objInner.type=dtype;
                objInner.value=obj[sn];
                arr.push(objInner);
            });

            if(checkInput($('.sue'))==0){
                userInnerAjax("put", id, obj, function(data){
                    if(data.code==200){
                        window.location.reload();
                    }else{
                        console.log(data);
                    }
                });
            }
        }
    });
    // 缴费用户详情-保存
    $(document).on('click', '#userinfoPaySave', function(){
        if(!userinfoFlag){
            var obj={}, id=$('.widget input.id').val(), arr=[];
            $('.sue').each(function(i, n){
                var sn=$(n).attr('name'), dtype=$(n).data('type'), objInner={};
                if(dtype=='int'){
                    obj[sn]=parseInt($(n).find('input').val());
                }else if(dtype=='img'){
                    obj[sn]=$(n).find('.imgShow').data('value');
                }else{
                    obj[sn]=$(n).find('input').val();
                }
                objInner.type=dtype;
                objInner.value=obj[sn];
                arr.push(objInner);
            });

            if(checkInput($('.sue'))==0){
                userPayAjax("put", id, obj, function(data){
                    if(data.code==200){
                        $.each(arr, function(i, n){
                            $('.sue').eq(i).data('value', n.value);
                            if(n.type=='password'){
                                $('.sue').eq(i).data('tip', n.value).addClass('pwdtip').text('***');
                            }else if(n.type=='img'){
                                if(n.value!=''){
                                    $('.sue').eq(i).find('i').hide();
                                    $('.sue').eq(i).data('value', n.value);
                                    $('.sue').eq(i).find('.uploadify').hide();
                                }
                            }else{
                                $('.sue').eq(i).text(n.value);
                            }
                        });
                        $('.userinfoSave').hide();$('#userinfoQuit').hide();$('#userinfoEdit').show();
                        userinfoFlag = true;
                    }else{
                        console.log(data);
                    }
                });
            }
        }
    });
    // 专网用户详情-保存
    $(document).on('click', '#userinfoPnSave', function(){
        if(!userinfoFlag){
            var obj={}, param={}, location=$('#location').val(), id=$('.widget input.id').val(), arr=[];
            $('.sue').each(function(i, n){
                var sn=$(n).attr('name'), dtype=$(n).data('type'), objInner={};
                if(dtype=='int'){
                    obj[sn]=parseInt($(n).find('input').val());
                }else if(dtype=='img'){
                    obj[sn]=$(n).find('.imgShow').data('value');
                }else{
                    obj[sn]=$(n).find('input').val();
                }
                objInner.type=dtype;
                objInner.value=obj[sn];
                arr.push(objInner);
            });
            param.location = location;
            param.params = JSON.stringify(obj);

            if(checkInput($('.sue'))==0){
                userPnAjax("put", id, param, function(data){
                    if(data.code==200){
                        $.each(arr, function(i, n){
                            $('.sue').eq(i).data('value', n.value);
                            if(n.type=='password'){
                                $('.sue').eq(i).data('tip', n.value).addClass('pwdtip').text('***');
                            }else if(n.type=='img'){
                                if(n.value!=''){
                                    $('.sue').eq(i).find('i').hide();
                                    $('.sue').eq(i).data('value', n.value);
                                    $('.sue').eq(i).find('.uploadify').hide();
                                }
                            }else{
                                $('.sue').eq(i).text(n.value);
                            }
                        });
                        $('.userinfoSave').hide();$('#userinfoQuit').hide();$('#userinfoEdit').show();
                        userinfoFlag = true;
                    }else{
                        console.log(data);
                    }
                });
            }
        }
    });
    // 用户详情-取消
    $(document).on('click', '#userinfoQuit', function(){
        $(this).hide();$('.userinfoSave').hide();$('#userinfoEdit').show();
        userinfoFlag = true;
        $('.sue').each(function(i, n){
            var v = $(n).data('value');
            if($(n).data('type')=='password'){
                $(n).text('***');
                $(n).addClass('pwdtip');
            }else if($(n).attr('name')=='mac'){
                var $em = '';
                var macs = v.split(',');
                $.each(macs, function(j, k){
                    $em += '<em class="bz">'+k+'</em>';
                });
                $(n).html($em);
            }else if($(n).data('type')=='img'){
                $(n).find('.uploadify').hide();
                var a = v.split(','), h='';
                if(a.length>0){
                    for(var j=0; j<a.length; j++){
                        h+='<div><img src="'+a[j]+'" /><i></i></div>';
                    }
                }
                $(n).find('.imgShow').html(h);
            }else{
                $(n).text(v);
            }
        });
    });
    // 用户详情-删除图片
    $(document).on('click', '.imgShow i', function(){
        var $img=$(this).parents('.imgShow');
        var a=$img.data('value').split(','), idx=$(this).parent().index();
        a.splice(idx, 1);
        for(var i=0, k=''; i<a.length; i++){
            if(i==0){
                k=a[i];
            }else{
                k=k+','+a[i];
            }
        }
        $img.data('value', k);
        $(this).parent().remove();
    });
    // 用户详情-审核
    $(document).on('click', '#userCheck', function(){
        var location=$('#location').val(),
            id = $(this).siblings('input.id').val(),
            mask=$(this).siblings('input.mask').val(),
            param = {};
        param.mask = mask|(1<<25);
        userPnAjax('put', id, {location: location, params: JSON.stringify(param)}, function(data){
            if(data.code==200){
                alert("审核成功！");
                window.location.reload();
            }
        }, function(err){
            alert("审核失败！");
        });
    });
    // 用户详情-驳回
    $(document).on('click', '#userReback, #userlistPn table .reject', function(){
        $trThis = $(this);
        $('#modalReback').modal('open');
    });
    $(document).on('click', '#modalReback, #modalReback .closed', function(){
        $('#modalReback').modal('closed');
    });
    $(document).on('click', '#modalReback .add', function(){
        var location=$('#location').val(),
            id = $trThis.siblings('input.id').val(),
            mask = $trThis.siblings('input.mask').val(),
            param = {};
        param.mask = mask&(~(1<<25));
        if(checkInput($('#modalReback .veright'))==0){
            userPnAjax('put', id, {location: location, params: JSON.stringify(param)}, function(data){
                if(data.code==200){
                    var obj = {
                        location:location,
                        mobile:$trThis.data('mobile'),
                        title:"个人资料审核失败",
                        text:$('input[name=reason]').val(),
                        type:'system',
                        create_notice: 1,
                        use_notificate:0,
                        flag:"fail"
                    };
                    appPushAjax("post", obj, function(data){
                        if(data.code==200){
                            alert('退回成功');
                            $('#modalReback').modal('closed');
                            if($trThis.parent().find('.sta').length>0){
                                $trThis.parent().find('.sta').text('已驳回').attr('class', 'sta hasreject');
                            }
                        }
                    });
                }
            }, function(err){
                alert("操作失败！");
            });
        }
    });

    // 计费管理
    // 导出
    $(document).on('click', '.ns_bill .monthExport', function(){
        var param={
            location: $('#location').val(),
            start: $('#dateStart').val(),
            end: $('#dateEnd').val(),
            by_month: 1
        };
        $(this).attr('href', '/financial_report.xls?'+$.param(param));
    });
    $(document).on('click', '.ns_bill .allExport', function(){
        var param={
            location: $('#location').val(),
            start: $('#dateStart').val(),
            end: $('#dateEnd').val()
        };
        $(this).attr('href', '/financial_report.xls?'+$.param(param));
    });
    // 查询统计
    var bill_webType=[], bill_fee=[], bill_platform=[];
    $('.bill_check span:eq(1), .bill_check span:eq(2), .bill_check span:eq(3)').each(function(i, n){
        $(n).find('em:gt(0)').each(function(i, n){
            var id=$(n).parent().attr('id');
            var arr = eval('bill_'+id);
            arr.push($(n).data('value'));
        });
    });
    $(document).on('click', '#webType em', function(){
        var emIdx=$(this).index(), len=$(this).parent().find('em:gt(0).on').length, v=$(this).data('value');
        if(emIdx==0){
            $(this).addClass('on').siblings('em').removeClass('on');
            bill_webType=[];
            $(this).parent().find('em:gt(0)').each(function(i, n){
                bill_webType.push($(n).data('value'));
            });
        }else{
            if(len==0){$(this).siblings('em:eq(0)').removeClass('on'); bill_webType=[];}
            if($(this).hasClass('on') && len>1){
                $(this).removeClass('on');
                bill_webType.splice($.inArray(v, bill_webType), 1);
            }else{
                $(this).addClass('on');
                bill_webType.push(v);
            }
        }
    });
    $(document).on('click', '#fee em', function(){
        var emIdx=$(this).index(), len=$(this).parent().find('em:gt(0).on').length, v=$(this).data('value');
        if(emIdx==0){
            $(this).addClass('on').siblings('em').removeClass('on');
            bill_fee=[];
            $(this).parent().find('em:gt(0)').each(function(i, n){
                bill_fee.push($(n).data('value'));
            });
        }else{
            if(len==0){$(this).siblings('em:eq(0)').removeClass('on'); bill_fee=[];}
            if($(this).hasClass('on') && len>1){
                $(this).removeClass('on');
                bill_fee.splice($.inArray(v, bill_fee), 1);
            }else{
                $(this).addClass('on');
                bill_fee.push(v);
            }
        }
    });
    $(document).on('click', '#platform em', function(){
        var emIdx=$(this).index(), len=$(this).parent().find('em:gt(0).on').length, v=$(this).data('value');
        if(emIdx==0){
            $(this).addClass('on').siblings('em').removeClass('on');
            bill_platform=[];
            $(this).parent().find('em:gt(0)').each(function(i, n){
                bill_platform.push($(n).data('value'));
            });
        }else{
            if(len==0){$(this).siblings('em:eq(0)').removeClass('on'); bill_platform=[];}
            if($(this).hasClass('on') && len>1){
                $(this).removeClass('on');
                bill_platform.splice($.inArray(v, bill_platform), 1);
            }else{
                $(this).addClass('on');
                bill_platform.push(v);
            }
        }
    });
    $(document).on('click', '#mode em', function(){
        var emIdx=$(this).index(), len=$(this).parent().find('em:gt(0).on').length, v=$(this).data('value');
        if(emIdx==0){
            $(this).addClass('on').siblings('em').removeClass('on');
        }else{
            if(len==0){$(this).siblings('em:eq(0)').removeClass('on');}
            if($(this).hasClass('on') && len>1){
                $(this).removeClass('on');
            }else{
                $(this).addClass('on');
            }
        }
    });
    $(document).on('click', '#billSearch', function(){
        var billParam={location: $('#location').val()};
        billParam.start=$('#dateStart').val();
        billParam.end=$('#dateEnd').val();
        if(bill_webType.length>0){ billParam.web_type_id=bill_webType.join(','); }
        if(bill_fee.length>0){ billParam.fee=bill_fee.join(','); }
        if(bill_platform.length>0){ billParam.platform=bill_platform.join(','); }
        billFunc(billParam, function(data){
            if(data.code==200){
                $('.bill_total span:eq(0) em').text(data.current);
                $('.bill_total span:eq(1) em').text(data.last);
                $('.bill_total span:eq(2) em').text(data.total);
            }else{
                console.log(data);
            }
        })
    });

    // 施工平面图
    var checkXY=function(x, y, dw, dh){     // 检查坐标是否超出显示区域
        var cx, cy, cxy={}, dotw=17;
        if(x<dotw){
            cx=0;
        }else if(x>(dw-dotw)){
            cx=dw-2*dotw;
            console.log(cx);
        }else{
            cx=x-dotw;
        }
        if(y<dotw){
            cy=0;
        }else if(y>(dh-dotw)){
            cy=dh-2*dotw;
        }else{
            cy=y-dotw;
        }
        return cxy={
            cx: cx,
            cy: cy
        };
    };
    var deAdd=false, deEdit=false, deThis, ccx, ccy, cid=-1, dotw=17, deImg; //deAdd是否开启新增AP模式, deEdit是否开启编辑AP模式， deThis当前操作的AP， ccx,ccy手动获取的坐标, cid上一个deThis的id,  dotw AP图片的一半宽度, deImg 新增施工图所在this
    // 图片加载完成判断
    var t_img; // 定时器
    var isLoad = true; // 控制变量
    // 判断图片加载的函数
    var isImgLoad=function(callback){
        // 注意图片类名都是.ns_dedo img，因为我只需要处理相同类名的图片。其它图片可以不管。
        // 查找所有封面图，迭代处理
        $('.ns_dedo .deviceImg').each(function(i, n){
            // 找到为0就将isLoad设为false，并退出each
            if(this.height === 0){
                isLoad = false;
                return false;
            }else{
                var h=$(n).parent().height(),
                    w=$(n).parent().width();
                $(n).parent().css({'margin-top': -Math.floor(h/2)+'px', 'margin-left': -Math.floor(w/2)+'px'});
            }
        });
        // 为true，没有发现为0的。加载完毕
        if(isLoad){
            clearTimeout(t_img); // 清除定时器
            // 回调函数
            callback();
        // 为false，因为找到了没有加载完成的图，将调用定时器递归
        }else{
            isLoad = true;
            t_img = setTimeout(function(){
                isImgLoad(callback); // 递归扫描
            },500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
        }
    };
    // 判断图片加载状况，加载完成后回调
    isImgLoad(function(){
        // 加载完成
        console.log("加载完成！");
    });
    //$('.ns_deCtx .ns_dedo:eq(0)').show();
    // 放大图片
    //$(document).on('click', '.ns_dedo img.deviceImg', function(){
    //    if(!deAdd && !deEdit){
    //        $('#modalImg img').attr('src', $(this).attr('src')).load(function(){
    //            var w = this.width;
    //            $('.modal_img').css({'width': w+'px', 'margin-left':-Math.ceil(w/2)+'px'});
    //        });
    //        $('#modalImg').modal('open');
    //    }
    //});
    // 导航
    var devicedata=[];
    $(document).on('click', '.deviceSel', function(e){
        e.stopPropagation();
        $('.deviceSel').removeClass('on');
        $(this).addClass('on');
        $(this).parent().siblings().find('.deviceOp').hide();
        $(this).next().toggle();
    });
    $(document).on('click', '.wrapper', function(){$('.deviceOp').hide();});
    $(document).on('click', '.deviceOp span', function(){    // 切换施工图
        $('.deviceOp span').removeClass('on');
        $(this).addClass('on');
        $(this).parent().hide();
        //状态初始化
        $('.axy').animate({top: '-84px', opacity: 0}, 500, 'linear', function(){
            $(this).css('z-index', -1);
        });
        $('.ns_xy').animate({height: '60px'}, 500);
        $('.ns_xy em').text('');
        $('.ns_xy input').each(function(i, n){
            $(n).val('');
            inputError('', n);
        });
        $('.ns_debtns').hide();
        if(deAdd){
            $('.donew').remove();
            deAdd=false;
        }
        if(deEdit){
            deThis.parent().css({left: deThis.parent().data('left')+'px', top: deThis.parent().data('top')+'px'});
            deEdit=false;
        }

        // 加载AP
        var src=$(this).data('id');
        $('.deviceImg').attr('src', src);
        isImgLoad(function(){
            // 加载完成
            console.log("加载"+src+"完成！");
        });
        planAPAjax({imgurl: src}, function(data){
            $('.ns_dedo .dodot').remove();
            if(data.code==200){
                var h='';
                $.each(data.aps, function(k, v){
                    if(v.online==0){
                        h+='<i title="'+v.address+'" data-online="'+v.online+'" class="dodot doRed" data-x="'+v.pos_x+'" data-y="'+v.pos_y+'" style="left:'+v.left+'px; top:'+v.top+'px;">';
                    }else if(v.is_sens==1){
                        h+='<i title="'+v.address+'" data-online="'+v.online+'" class="dodot doBlue" data-x="'+v.pos_x+'" data-y="'+v.pos_y+'" style="left:'+v.left+'px; top:'+v.top+'px;">';
                    }else{
                        h+='<i title="'+v.address+'" data-online="'+v.online+'" class="dodot doGreen" data-x="'+v.pos_x+'" data-y="'+v.pos_y+'" style="left:'+v.left+'px; top:'+v.top+'px;">';
                    }
                    h+='<em class="doem" data-mac="'+v.mac+'" data-id="'+v._id+'"></em></i>';
                });
                $('.ns_dedo').append(h);
            }

        });

    });
    $(document).on('click', '#addnav', function(){$('#modalDeviceName').modal('open');});
    $(document).on('click', '#modalDeviceName, #modalDeviceName .closed', function(){$('#modalDeviceName').modal('closed');});
    // 新增组
    $(document).on('click', '#modalDeviceName .add', function(){
        if(checkInput($('#modalDeviceName .veright'))==0) {
            var name = $('#modalDeviceName input[name=name]').val();
            planQvAjax("post", {name: name, location: $('#location').val()}, function(data){
                if(data.code==200){
                    var h = '<div class="deviceNav">' +
                        '<div class="selIco deviceSel">' + name + '<i></i></div><div class="deviceOp"> ' +
                        '<div><button type="button" class="btnGreenAutoMin add" data-groupId="'+data.group_id+'">上传图片</button></div> ' +
                        '</div></div>';
                    $('#addnav').before(h);
                    if ($('.deviceNav').length == 5) {
                        $('#addnav').hide();
                    }
                    $('#modalDeviceName').modal('closed');
                }
            });
        }
    });
    // 删除施工图
    $(document).on('click', '.axc .delete', function(){
        if(confirm("确定要删除该施工平面图吗？")){
            var $img = $('.deviceOp span.on');
            var param = {
                location: $('#location').val(),
                imgurl: $img.data('id'),
                name: $img.text(),
                group_id: $img.parent().find('.add').data('groupid')
            };
            planImgAjax('delete', param, function(data){
                if(data.code==200){
                    alert('删除平面图成功！');
                    window.location.reload();
                }else{
                    alert('删除失败！');
                }
            });
        }

    });
    // 新增施工图
    $(document).on('click', '.deviceOp .add', function(){
        deImg=$(this);
        $('#modalDeviceImg h3').text('新增施工平面图');
        $('#modalDeviceImg .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalDeviceImg .file em').text('');
        $('#modalDeviceImg').modal('open');
    });
    $(document).on('click', '.axc .edit', function(){
        var $img = $('.deviceOp span.on');
        var name = $img.text(),
            src = $img.data('id');
        $('#modalDeviceImg input[name=name]').val(name);
        $('#modalDeviceImg .file input[type=hidden]').val(src);
        $('#modalDeviceImg .file em').text(src);
        $('#modalDeviceImg h3').text('编辑施工平面图');
        $('#modalDeviceImg .btngroups').html('<button type="button" class="btnBlue save">保存</button>');
        $('#modalDeviceImg').modal('open');
    });
    $(document).on('click', '#modalDeviceImg, #modalDeviceImg .closed', function(){$('#modalDeviceImg').modal('closed');});
    $(document).on('click', '#modalDeviceImg .add', function(){
        if(checkInput($('#modalDeviceImg .veright'))==0) {
            var name=$('#modalDeviceImg input[name=name]').val(),
                img=$('#modalDeviceImg .file input[type=hidden]').val();
            var param={
                name:name,
                group_id: deImg.attr('data-groupId'),
                imgurl:img
            };
            console.log(param);
            planImgAjax('post', param, function(data){
                if(data.code==200){
                    var h='<span data-id="'+img+'">'+name+'</span>';
                    deImg.parent().parent().append(h);
                    $('#modalDeviceImg').modal('closed');
                }
            })
        }
    });
    $(document).on('click', '#modalDeviceImg .save', function(){
        if(checkInput($('#modalDeviceImg .veright'))==0) {
            var $img = $('.deviceOp span.on');
            var name=$('#modalDeviceImg input[name=name]').val(),
                img=$('#modalDeviceImg .file input[type=hidden]').val();
            var param={
                name:name,
                group_id: $img.siblings('div').find('button').attr('data-groupId'),
                imgurl:img
            };
            console.log(param);
            planImgAjax('put', param, function(data){
                if(data.code==200){
                    $img.attr('data-id', img);
                    $('.deviceImg').attr('src', img);
                    isImgLoad(function(){
                        // 加载完成
                        console.log("加载"+img+"完成！");
                    });
                    $('#modalDeviceImg').modal('closed');
                }
            })
        }
    });
    $(document).on('click', '.addap', function(){                  //  进入新增模式
        $('.ns_xy .add').show().siblings('.save').hide();
        $('.axy').css('z-index', 10).animate({top: '0', opacity: 1}, 500);
        $('.ns_xy').animate({height: '80px'}, 500);
        deAdd=true;
    });
    $(document).on('click', '.ns_xy .quit', function(){            // 退出新增/编辑模式
        $('.axy').animate({top: '-84px', opacity: 0}, 500, 'linear', function(){
            $(this).css('z-index', -1);
        });
        $('.ns_xy').animate({height: '60px'}, 500);
        $('.ns_xy em').text('');
        $('.ns_xy input').each(function(i, n){
            $(n).val('');
            inputError('', n);
        });
        if(deAdd){
            $('.donew').remove();
            deAdd=false;
        }
        if(deEdit){
            deThis.parent().css({left: deThis.parent().data('left')+'px', top: deThis.parent().data('top')+'px'});
            deEdit=false;
        }
    });
    $(document).on('click', '.ns_deCtx .deviceImg', function(e){            //  获取坐标
        $('.ns_debtns').remove();
        var x=e.offsetX,
            y=e.offsetY,
            dh=$(this).parent().height(),    // 施工图高度
            dw=$(this).parent().width();     // 施工图宽度
        $('#ix').text(x);
        $('#iy').text(y);

        var cxy = checkXY(x, y, dw, dh);
        ccx=cxy.cx; ccy=cxy.cy;

        if(deAdd){
            $('.donew').remove();
            var h = '<i class="dodot donew" data-online="1" data-left="'+ccx+'" data-top="'+ccy+'" style="left: '+ccx+'px;top: '+ccy+'px;"></i>';
            $(this).parent().append(h);
        }
        if(deEdit){
            deThis.parent().css({left: ccx+'px', top: ccy+'px'});
        }
    });
    $(document).on('click', '.ns_xy .add', function(){             //  新增AP
        var idx=$('.deviceNav li.on').index();

        var mac=$('.ns_xy input[name=mac]').val(),
            x=$('#ix').text(),
            y=$('#iy').text();

        if(x=='' || y==''){alert('请点击施工图获取AP坐标');return false;}
        if(checkInput($('.ns_xy span'))==0){
            var param={
                location: $('#location').val(),
                imgurl: $('.ns_dedo .deviceImg').attr('src'),
                mac: mac,
                pos_x: x,
                pos_y: y,
                left: $('.donew').data('left'),
                top: $('.donew').data('top')
            };
            planAjax("post", '', param, function(data){
                if(data.code==200){
                    var h = '<em class="doem" data-mac="'+mac+'" data-x="'+x+'" data-y="'+y+'" data-id="'+data.ap_id+'"></em>';
                    $('.donew').html(h).addClass('doGreen').removeClass('donew');
                    $('.ns_xy em').text('');
                    $('.ns_xy input').each(function(i, n){
                        $(n).val('');
                        inputError('', n);
                    });
                    alert('新增成功！');
                }else if(data.code==500){
                    alert('Error:'+data.reason);
                }else{
                    console.log(data);
                }
            });
        }
    });
    $(document).on('click', '.ns_debtns .edit', function(){       // 进入编辑模式
        $('.ns_debtns').remove();
        $('.donew').remove();
        $('.ns_xy .save').show().siblings('.add').hide();
        $('.axy').css('z-index', 10).animate({top: '0', opacity: 1}, 500);
        $('.ns_xy').animate({height: '80px'}, 500);
        $('.ns_xy input[name=mac]').val(deThis.data('mac'));
        $('#ix').text(deThis.data('x'));
        $('#iy').text(deThis.data('y'));
        deAdd=false;
        deEdit=true;
    });
    $(document).on('click', '.ns_xy .save', function(){        // 编辑AP
        var mac=$('.ns_xy input[name=mac]').val(),
            x=$('#ix').text(),
            y=$('#iy').text();

        if(checkInput($('.ns_xy span'))==0) {
            var param={
                mac: mac,
                pos_x: x,
                pos_y: y,
                left: ccx,
                top: ccy
            };
            planAjax('put', deThis.data('id'), param, function(data){
                if(data.code==200){
                    alert('编辑成功！');
                    deThis.data('mac', mac);
                    deThis.data('x', x);
                    deThis.data('y', y);
                    deThis.parent().data('left', ccx);
                    deThis.parent().data('top', ccy);
                    $('.axy').animate({top: '-84px', opacity: 0}, 500, 'linear', function(){
                        $(this).css('z-index', -1);
                    });
                    $('.ns_xy').animate({height: '60px'}, 500);
                    $('.ns_xy em').text('');
                    $('.ns_xy input').each(function (i, n) {
                        $(n).val('');
                        inputError('', n);
                    });
                    deEdit=false;
                }else{
                    console.log(data);
                }
            });
        }
    });
    $(document).on('click', '.ns_debtns .delete', function(){        //  删除AP
        if(confirm("确定要删除此AP？")){
            planAjax("delete", deThis.data('id'), '', function(data){
                if(data.code==200){
                    deThis.parent().remove();
                    $('.ns_debtns').remove();
                }else{
                    console.log(data);
                }
            });
        }
    });
    var deoffset2=[   // 人员定位
        {top: 22, left: 122},
        {top: 0, left: 71},
        {top: 22, left: 22},
        {top: 71, left: 0},
        {top: 122, left: 22},
        {top: 142, left: 71},
        {top: 122, left: 122},
        {top: 71, left: 142},
        {top: 76, left: 152}
    ];
    // 所有感知人员
    var sens2Func = function(page, deThis){
        var location = $('#location').val();
        var param={
            location: location,
            ap_mac: deThis.data('mac'),
            page: page,
            page_size: 5
        };

        planMemberAjax('get', param, function(data){
            if(data.code==200){
                // render数据
                $('.ns_deinfo h5 span').html('('+data.address+')');
                var mem=data.members;
                for(var i=0, h=''; i<mem.length; i++){
                    h+='<li><a href="/projectsensmember.html?location='+location+'&sta_mac='+mem[i].sta_mac+'&ap_mac='+mem[i].ap_mac+'" title="'+mem[i].name+'"><span class="name"><em class="off"></em><p>'+mem[i].name+'</p></span></a></li>';
                }
                $('.ns_deinfo ul.bbody').html(h);
                $('.ns_page').data('page', page);
                // 翻页控制
                $('.devicelinkPrev, .devicelinkNext').hide();
                if(page<data.page_count){
                    $('.devicelinkNext').show();
                }
                if(page>1){
                    $('.devicelinkPrev').show();
                }
            }
        });
    };
    var sensFunc = function(mac, page){
        var location = $('#location').val();
        var param={
            location: location,
            ap_mac: mac,
            page: page
        };
        planMemberAjax('get', param, function(data){
            if(data.code==200){
                var mem=data.members;
                for(var i=0, h=''; i<mem.length; i++){
                    h+='<span class="new"><a href="/projectsensmember.html?location='+location+'&sta_mac='+mem[i]._id.sta_mac+'&ap_mac='+mem[i]._id.ap_mac+'" title="'+mem[i].name+'"><img src="'+mem[i].photo+'" /></a></span>';
                }
                if(!$('.sensbtn').length>0){
                    h+='<span class="sensbtn new"><button type="button" data-mac="'+mac+'" data-page="'+page+'"><em class="arrowNext"></em></button></span>';
                }
                $('.ns_circle').append(h);
                if(page==data.page_count){
                    $('.sensbtn button').attr("disabled",true);
                }
                $('.ns_circle .new').each(function(i, n){
                    if($(n).hasClass('sensbtn')){
                        $(n).animate({opacity: 1, top: deoffset2[8].top+'px', left: deoffset2[8].left+'px', width: '32px', height: '32px'}).removeClass('new');
                    }else{
                        $(n).animate({opacity: 1, top: deoffset2[i].top+'px', left: deoffset2[i].left+'px', width: '42px', height: '42px'}).addClass('old').removeClass('new');
                    }
                });
            }
        });
    };
    //$(document).on('mouseenter', '.ns_dedo .doGreen .doem', function(e){   // 加载感知人员
    //    e.stopPropagation();
    //    $(this).parent().css({'z-index': 13});
    //    var x=$(this).parent().position().left,   // AP横坐标
    //        y=$(this).parent().position().top;   // AP纵坐标
    //    $('.ns_circle').css({top: (y-75)+'px', left: (x-75)+'px'}).show();
    //
    //    $('.ns_circle').html('');
    //
    //    if((!$('.ns_circle img').length>0)){
    //        var mac=$(this).data('mac');
    //        sensFunc(mac, 1);
    //    }
    //});
    //$(document).on('click', '.ns_circle button', function(e){
    //    e.stopPropagation();
    //    $('.ns_circle .old').animate({opacity: 0}, function(){
    //        this.remove();
    //    });
    //
    //    var mac=$(this).data('mac'),
    //        page=$(this).data('page');
    //    page++;
    //    sensFunc(mac, page);
    //});
    $(document).on('mouseenter', '.ns_dedo .doBlue .doem', function(e){           // 加载提示框
        e.stopPropagation();
        deThis = $(this);

        sens2Func(1, deThis);

        // 信息框高度控制
        var w = $('.ns_deinfo').outerWidth(),     // 信息框宽度
            h = $('.ns_deinfo').outerHeight();    // 信息框高度

        var x=deThis.parent().position().left+dotw,   // AP横坐标
            y=deThis.parent().position().top+dotw,   // AP纵坐标
            dh=deThis.parent().parent().height(),    // 施工图高度
            dw=deThis.parent().parent().width();     // 施工图宽度

        // 特殊点位置
        if(x<w){
            $('.ns_deinfo').css({left: '1px'});
            $('.ns_deinfo .arrow').css({left: (x)+'px'});
        }else if(x>dw-w){
            $('.ns_deinfo').css({left: (dw-w-1)+'px'});
            $('.ns_deinfo .arrow').css({left: (w-(dw-x))+'px'});
        }else{
            $('.ns_deinfo').css({left: (x-w/2)+'px'});
            $('.ns_deinfo .arrow').css({left: '50%'});
        }
        if(y<h){
            $('.ns_deinfo').css({top: (y+dotw)+'px', 'box-shadow':'0 4px 8px rgba(205, 205, 205, 0.8)'});
            $('.ns_deinfo .arrow').css({'top':-10+'px'}).removeClass('down');
        }else{
            $('.ns_deinfo').css({top: (y-h-dotw)+'px', 'box-shadow':'0 -4px 8px rgba(205, 205, 205, 0.8)'});
            $('.ns_deinfo .arrow').css({top: (h-2)+'px'}).addClass('down');
        }

        $('.ns_deinfo').show();
    });
    $(document).on('click', '.devicelinkPrev', function(){
        var page = $('.ns_page').data('page');
        page--;
        sens2Func(page, deThis);
    });
    $(document).on('click', '.devicelinkNext', function(){
        var page = $('.ns_page').data('page');
        page++;
        sens2Func(page, deThis);
    });
    $(document).on('mouseover', '.ns_dedo .ns_deinfo, .ns_dedo .ns_circle', function(e){
        e.stopPropagation();

        //$('.doGreen, .doRed').css({'z-index': 11});
        //
        //$('.ns_circle span').animate({opacity:0, left:'75px', top:'75px', width:'34px', height:'34px'}, function(){
        //    $(this).parent().hide();
        //    $(this).remove();
        //});
    });
    $(document).on('mouseover', '.ns_device', function(){
        $('.ns_deinfo .bbody').html('');
        $('.ns_deinfo').hide();
    });
    $(document).on('click', '.ns_dedo .doem', function(){         // 加载编辑删除框
        if(!deEdit){
            var sensEnalbe = ( $(this).parent().hasClass('doBlue') ? true : false );
            if(cid==$(this).data('id') && $('.ns_debtns').length>0){
                $('.ns_debtns').remove();
                return false;
            }

            $('.ns_debtns').remove();
            deThis=$(this);
            cid=deThis.data('id');

            var location = $('#location').val(),
                ap_mac = deThis.data('mac');

            var x=$(this).parent().position().left+dotw,   // AP横坐标
                y=$(this).parent().position().top+dotw,   // AP纵坐标
                dh=$(this).parent().parent().height(),    // 施工图高度
                dw=$(this).parent().parent().width();     // 施工图宽度

            var h='<div class="ns_debtns">' +
                '<i class="arrow"></i>' +
                '<div><button type="button" class="btnBlueSmall edit">编辑</button><button type="button" class="btnBlueSmall delete">删除</button><a href="/projectsensgroup.html?location='+location+'&ap_mac='+ap_mac+'" class="btnBlueSmall" target="_blank">查看</a>';
            if(sensEnalbe){
                h += '<button type="button" class="btnBlueSmall sensEnable" data-value="1">关闭感知</button>';
            }else{
                h += '<button type="button" class="btnBlueSmall sensEnable" data-value="0">开启感知</button>';
            }
            h += '</div></div>';
            $(this).parent().parent().append(h);

            var w = $('.ns_debtns').outerWidth(),     // 编辑删除框宽度
                h = $('.ns_debtns').outerHeight();    // 编辑删除框高度

            // 特殊点位置
            if(x<Math.floor(dw/2)){
                $('.ns_debtns').css({left: (x+dotw)+'px'});
            }else{
                $('.ns_debtns').css({left: (x-w-dotw)+'px'});
                $('.ns_debtns .arrow').css({left: (w-2)+'px'}).addClass('right');
            }
            if(y<(h/2)){
                $('.ns_debtns').css({top: 0});
                $('.ns_debtns .arrow').css({top: (y)+'px'});
            }else if(y>(dh-h)){
                $('.ns_debtns').css({top: (dh-h)+'px'});
                $('.ns_debtns .arrow').css({top: (h-(dh-y))+'px'});
            }else{
                $('.ns_debtns').css({top: (y-h/2)+'px'});
            }
        }
    });
    // 感知开关
    $(document).on('click', '.ns_debtns .sensEnable', function(){
        var $this = $(this);
        var sensEnable = ((!$(this).data('value')) ? 1 : 0);
        var param = {
            mac: deThis.data('mac'),
            sens: sensEnable
        };
        console.log(param);
        planEnableAjax('put', param, function(data){
            if(data.code==200){
                console.log(deThis);
                var sensdot = deThis.parent();
                if(sensEnable){
                    $this.text('关闭感知').data('value', 1);
                    sensdot.addClass('doBlue');
                    if(sensdot.data('online')==0){
                        sensdot.removeClass('doRed');
                    }else{
                        sensdot.removeClass('doGreen');
                    }
                }else{
                    $this.text('开启感知').data('value', 0);
                    if(sensdot.data('online')==0){
                        sensdot.addClass('doRed');
                    }else{
                        sensdot.addClass('doGreen');
                    }
                    sensdot.removeClass('doBlue');
                }
            }
        });
    });

    // portal
    // 切换
    $(document).on('click', '.ns_portal .adsnav li', function(){
        var idx = $(this).index();
        $(this).addClass('on').siblings().removeClass('on');
        $('.pt_area').eq(idx).show().siblings().hide();
    });
    $(document).on('click', '#portallist .addbtn', function(){
        $('#modalPortal h3').text('新增Portal');
        $('#modalPortal .btngroups').html('<button type="button" class="btnBlue add">确定</button>');
        $('#modalPortal').modal('open');
    });
    $(document).on('click', '#portallist .edit', function(){
        var $trThis=$(this), id=$(this).siblings('input').val();
        $('#modalPortal input[name=name]').val(id);
        $('#modalPortal input[name=id]').val(id);
        $('#modalPortal h3').text('修改Portal模板名称');
        $('#modalPortal .btngroups').html('<button type="button" class="btnBlue edit">保存</button>');
        $('#modalPortal').modal('open');
    });
    $(document).on('click', '#modalPortal, #modalPortal .closed', function(){$('#modalPortal').modal('closed');})
    // 新增portal
    $(document).on('click', '#modalPortal .add', function(){
        if(checkInput($('#modalPortal .veright'))==0){
            var param = {
                name: $('#modalPortal input[name=name]').val()
            };
            portalAjax("post", '', param, function(data){
                if(data.Code==200){
                    window.location.reload();
                }else{
                    console.log(data);
                    alert('新增portal失败！');
                }
            });
        }
    });
    // 修改portal模板名称
    $(document).on('click', '#modalPortal .edit', function(){
        if(checkInput($('#modalPortal .veright'))==0){
            //var param = {
            //    name: $('#modalPortal input[name=name]').val()
            //};
            portalAjax("put", '?name='+$('#modalPortal input[name=name]').val(), '', function(data){
                if(data.Code==200){
                    window.location.reload();
                }else{
                    console.log(data);
                    alert('修改portal模板名称失败！');
                }
            });
        }
    });
    $(document).on('click', '#modalQrcode, #modalQrcode .closed', function(){$('#modalQrcode').modal('closed');});
    // 停用
    $(document).on('click', '#portallist .forbin', function(){
        var $this=$(this);
        var param={
            id: $(this).siblings('input[type=hidden]').val(),
            name: $(this).parent().parent().find('td:eq(0)').text(),
            location: $('#location').val(),
            mask: 0
        };
        portalAjax("put", param, function(data){
            if(data.code==200){
                window.location.reload();
            }else{
                console.log(data);
            }
        });
    });
    // 启用
    $(document).on('click', '#portallist .unforbin', function(){
        if(confirm("确定要启用该模板吗？")){
            var param={
                id: $(this).siblings('input[type=hidden]').val(),
                name: $(this).parent().parent().find('td:eq(0)').text(),
                location: $('#location').val(),
                mask: 1
            };
            portalAjax("put", param, function(data){
                if(data.code==200){
                    window.location.reload();
                }else{
                    console.log(data);
                }
            });
        }
    });
    // 删除
    $(document).on('click', '#portallist .delete', function(){
        var $this=$(this);
        if(confirm("确定模板没有在使用？")){
            portalAjax("DELETE", $this.siblings('input').val(), '', function(data){
                if(data.Code==200){
                    $this.parent().parent().fadeOut(function(){
                        $(this).remove();
                    });
                }else{
                    console.log(data);
                    alert("删除失败");
                }
            }, function(error){
                console.log(error);
                alert("删除失败");
            });
        }
    });
    $(document).on('mouseenter', '.zz', function(){   // 图上enter显示删除层
        $(this).find('.pt_zz').show();
    });
    $(document).on('mouseleave', '.pt_zz', function(){    // 图上leave隐藏删除层
        $(this).hide();
    });
    $(document).on('click', '.pt_h5 .pt_del', function(){   // H5图上删除认证方式
        var idx = $(this).parent().parent().index();
        $(this).parent().parent().hide();
        resizeZW();
        $('.h5case span').eq(idx).addClass('undo');
    });
    $(document).on('click', '.pt_pc .pt_del', function(){  // PC图片删除认证方式
        var idx = $(this).parent().parent().index();
        $(this).parent().parent().hide();
        $('.pccase span').eq(idx).addClass('undo');
    });
    $(document).on('click', '.pt_h5 .undo', function(){   // H5找回认证方式
        var idx = $(this).index();
        if(idx<3){
            $('.pt_h5 .zz').eq(idx).show();
            resizeZW();
            $(this).removeClass('undo');
        }
    });
    $(document).on('click', '.pt_pc .undo', function(){   // PC找回认证方式
        var idx = $(this).index();
        $('.pt_pc .zz').eq(idx).show();
        $(this).removeClass('undo');
    });
    $(document).on('mouseenter', '.pt_h5 h1 span, .pt_pc h1 span', function(){   // 标题enter显示提示
        $(this).siblings('.pt_tip').show();
    });
    $(document).on('mouseleave', '.pt_h5 h1 span, .pt_pc h1 span', function(){  // 标题leave隐藏提示
        $(this).siblings('.pt_tip').hide();
    });
    // 标题修改
    $(document).on('click', '.pt_h5 h1 span, .pt_pc h1 span', function(){
        var title = $(this).text();
        $(this).hide().siblings('input').val(title).show().focus();
    });
    $(document).on('blur', '.pt_h5 h1 input', function(){
        var title = $(this).val();
        $(this).hide().siblings('span').text(title);
        if(title==''){
            $(this).hide().siblings('p').show();
        }else{
            $(this).siblings('span').show();
        }
    });
    $(document).on('blur', '.pt_pc h1 input', function(){
        var title = $(this).val();
        title = (title=='') ? '南沙无线城市' : title;
        $(this).hide().siblings('span').text(title).show();
    });
    $(document).on('click', '.pt_h5 h1 p', function(){
        $(this).hide().siblings('input').show().focus();
    });
    // 背景图片上传
    $(document).on('change', '#h5bg, #pcbg', function(){
        wnlajaxImgThd($(this).attr('id'));
    });
    // 导航位置
    $(document).on('change', '.pt_pc #direction', function(){
        if($(this).val()=='top'){
            $('.pt_pc .pBar').removeClass('pbtm');
        }else{
            $('.pt_pc .pBar').addClass('pbtm');
        }
    });
    // 二维码弹出预览
    $(document).on('click', '#H5preview', function(){
        var way=[];
        $('.h5case span').each(function(i, n){
            if(!$(n).hasClass('undo')){
                way.push($(n).data('way'));
            }
        });
        var param={
            location: $('#location').val(),
            type: 'h5',
            title: $('.pt_h5 h1 span').text(),
            pic: $('input[name=h5bg]').val(),
            way: JSON.stringify(way)
        };
        portalAjax("get", param, function(data){
            if(data.code==200){
                var http = window.location.protocol+'//'+window.location.hostname+'/portal/preview/?preview_id='+data.preview_id;
                var qrcode = qrgen.canvas({
                    data: http,
                    cellSize : '5'
                });
                $('#qrcode').html(qrcode);
            }
        });
        $('#modalQrcode').modal('open');
    });
    // h5编辑保存
    $(document).on('click', '#H5save', function(){
        var way=[];
        $('.h5case span').each(function(i, n){
            if(!$(n).hasClass('undo')){
                way.push($(n).data('way'));
            }
        });
        var name=getParam('name');
        var param = {
            //id: $('#id').val(),
            type: 'h5',
            title: $('.pt_h5 h1 span').text(),
            pic: $('input[name=h5bg]').val()
            //way: JSON.stringify(way)
        };
        portalAjax("put", name, param, function(data){
            if(data.Code==200){
                alert('保存成功！');
                window.location.reload();
            }else{
                console.log(data);
                alert('保存失败！');
            }
        });
    });
    // 新窗口预览
    $(document).on('click', '#PCpreview', function(){
        var way=[];
        $('.pccase span').each(function(i, n){
            if(!$(n).hasClass('undo')){
                way.push($(n).data('way'));
            }
        });
        var param={
            location: $('#location').val(),
            type: 'pc',
            title: $('.pt_pc h1 span').text(),
            pic: $('input[name=pcbg]').val(),
            way: JSON.stringify(way),
            nav: $('#direction').val()
        };
        portalAjax("get", param, function(data){
            if(data.code==200){
                var http = window.location.protocol+'//'+window.location.host+'/portal/preview/?preview_id='+data.preview_id;
                window.open(http);
            }
        });
    });
    // PC编辑保存
    $(document).on('click', '#PCsave', function(){
        var way=[];
        $('.pccase span').each(function(i, n){
            if(!$(n).hasClass('undo')){
                way.push($(n).data('way'));
            }
        });
        var name=getParam('name');
        var param = {
            //id: $('#id').val(),
            type: 'pc',
            title: $('.pt_pc h1 span').text(),
            pic: $('input[name=pcbg]').val(),
            //way: JSON.stringify(way),
            //nav: $('#direction').val()
        };
        portalAjax("put", name, param, function(data){
            if(data.Code==200){
                alert('保存成功！');
                window.location.reload();
            }else{
                console.log(data);
                alert('保存失败！');
            }
        });
    });
});

window.onload = function(){
    removeLoad();
};