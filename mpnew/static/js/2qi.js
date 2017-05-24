//ajax
var ajaxDomain = "http://172.16.36.15:8007/";	//"http://172.16.44.2:8007/";
var ajaxUrls = {
	totalnum:"sense/totalnum",	//感知设备总数、连接设备总数
	search:"sense/search",	//搜索
	aplist:"sense/aplist",	//AP列表，含经纬度、感知设备数等，用于热力地图显示
	disGroupList:"sense/disGroupList",	//六镇二街，名称代码列表
	getGroupAP:"sense/getGroupAP ",	//区域（AP组）AP列表
	disGroupSta:"sense/disGroupSta",	//AP 组（区域）统计数值
}

var ajaxQ = function(url,type,param,callback,errFunc){
	$.ajax({
		url:ajaxDomain+url,
		type:type,
		data:param,
		success: function(data){				
			callback(data);
		},
		error:function(){
			console.log("ajax error");
			if(typeof(errFunc)=="function")errFunc();
		}
	});
}

window.msgBox = function (texts,tos) {
	$('.msgbox').remove();
	$("body").append('<div class="msgbox msgUp">' + texts + '</div>')
	$('.msgbox').show();
	if(!tos){tos = 2200;}
	setTimeout(function () {
		$('.msgbox').removeClass("msgUp").addClass("msgDown");
	},tos);//停留时间
}