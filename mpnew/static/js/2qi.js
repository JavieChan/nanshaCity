//获取url参数
(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return decodeURI(r[2]);
		return null;
	}
})(jQuery);
var urlPramamLocation = $.getUrlParam("location");
//ajax
var ajaxDomain = "http://172.16.36.15:8007/";
//var ajaxDomain = "http://172.16.44.2:8007/";
var ajaxUrls = {
	totalnum: "sense/totalnum", //感知设备总数、连接设备总数
	search: "sense/search", //搜索
	aplist: "sense/aplist", //AP列表，含经纬度、感知设备数等，用于热力地图显示
	disGroupList: "sense/disGroupList", //六镇二街，名称代码列表
	getGroupAP: "sense/getGroupAP ", //区域（AP组）AP列表
	disGroupSta: "sense/disGroupSta", //AP 组（区域）统计数值
	phoneType: "sense/PhoneType", //移动终端品牌统计
	disOnliTime: "sense/DisOnliTime", //区域终端联网时间
	userDistrict: "sense/UserDistrict", //用户区域分布
	onliNmOfEryHour: "sense/OnliNmOfEryHour", //用户上网时段

	top20HotEn: "sense/Top20HotEn", //关键词排行头top20，
	top20Websites: "sense/Top20Websites", //点击量 top20 网站排行	

	disGroupList: "sense/disGroupList", //区域或AP组list，返回六镇二街，名称代码列表
	getGroupAP: "sense/getGroupAP", //根据区域或者AP组代码返回,AP 列表
	disGroupSta: "sense/disGroupSta", //AP 组（区域）统计数值
	clientlist: "sense/Clientlist", //感知设备列表
	searchGroupClient: "sense/SearchGroupClient", //用户设备搜索
	excelGroupClient: "sense/excelGroupClient", //导出excel

	clientTrace: "sense/ClientTrace",//返回用户轨迹
	xlsCityTrace: "sense/xlsCityTrace",//轨迹AP excel 表格下载

	superviseGrp: "sense/SuperviseGrp", //添加/删除监视组
	outSuperviseAP: "sense/outSuperviseAP", //从监视组踢出AP
	supervise: "sense/Supervise", //监视组列表
	superviseGrpSearch: "sense/SuperviseGrpSearch", //监视组名搜索
	superviseAP: "sense/SuperviseAP", //监视组详情
	superviseGrpEdit: "sense/SuperviseGrpEdit", //编辑监视组
}

var ajaxQ = function(url, type, param, callback, errFunc) {
	$.ajax({
		url: ajaxDomain + url,
		type: type,
		data: param,
		//		contentType:"application/json",
		success: function(data) {
			callback(data);
		},
		error: function() {
			console.log("ajax error");
			if(typeof(errFunc) == "function") errFunc();
		}
	});
}

window.msgBox = function(texts, tos) {
	$('.msgbox').remove();
	$("body").append('<div class="msgbox msgUp">' + texts + '</div>')
	$('.msgbox').show();
	if(!tos) {
		tos = 2200;
	}
	setTimeout(function() {
		$('.msgbox').removeClass("msgUp").addClass("msgDown");
	}, tos); //停留时间
}

//json排序
var sortBy = function(filed, rev, primer) {
	rev = (rev) ? -1 : 1;
	return function(a, b) {
		a = a[filed];
		b = b[filed];
		if(typeof(primer) != 'undefined') {
			a = primer(a);
			b = primer(b);
		}
		if(a < b) {
			return rev * -1;
		}
		if(a > b) {
			return rev * 1;
		}
		return 1;
	}
};

var isNull = function(val){
	if(val==null || val=="null" || val=="undefined" || typeof(val)=="undefined")
	{
		return true;
	}else{
		return false;
	}
}