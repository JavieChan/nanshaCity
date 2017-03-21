//ajax
var urlLocate = "https://map.cniotroot.cn/mpoi/";
var urlmEditLocate ="https://map.cniotroot.cn/mpoi/";
var urllist ="https://map.cniotroot.cn/list/";

var ajaxQuest = function(url,type,param,callback,errFunc){
	$.ajax({
		url:url,
		type:type,
		data:param,
		success: function(data){				
			callback(data);
		},
		error:function(){
			console.log("error");
			if(typeof(errFunc)=="function")errFunc();
		}
	});
};

//全局变量 多次使用
var isErrNum=false;//是否选择查看故障热点
var GonvernMarkers =[],CmpuMarkers=[];
var BusiMarkers=[],TraffiMarkers=[];//分别存放不同类型markers 以作组合选择
var AllKindMkrTfy=TAFFY();
//CmpuMkrTfy=TAFFY(),BusiMkrTfy=TAFFY(),TraffiMkrTfy=TAFFY();
//Taffy数据库四种类型
var markers,cluster = null;//当前地图显示内容变量
var refreshIndex;//点击wifi图标全选按钮刷新时，用于标识前后两次点击时间间隔是否大于2s,避免恶意刷新

var AddPileBoxIsOpenIndex;
var pointMark = null;
var markersC;//记录当前cluster 对应的markers
var markerOrCluster,icon;//记录当前被点击marker or cluster,icon
var lists=TAFFY();//全局TAFFY数据库变量lists
var listArr =[],searchResutIndex=false;
var infoWindow;	//infowindow  cluster onClick 事件打开InfoWindow
var mpois=TAFFY();

var queryCallback = function(){};
var addCallback = function(){};
var queryAPOnLineCallback = function(){};
var queryPeopleOnLineCallback= function(){};



function addtoDB(addData){
	ajaxQuest(urlLocate,"POST",addData,function(data){
		addCallback();
		queryDB();
	},function() {
		console.log("ADD Error");
		msgBox("添加失败。")
	});
}

function updateDB(editData){
	mpoi_id=editObjId.toString();
	//console.log(mpoi_id);
	//console.log(editData);
	var urlmEditLocateAddMid=urlmEditLocate+mpoi_id
    console.log();
	ajaxQuest(urlmEditLocateAddMid,"PUT",editData,function(data){
		msgBox("修改成功！");
		queryDB();
		//$(".add-pile-box").hide();
		closeAddPileBox();
		pileLng=0; 
		pileLat=0;
	},function() {
		console.log("edit Error");
		msgBox("修改失败。")
	});
}

function queryDB(){
	ajaxQuest(urlLocate,"GET",null,function(data){
		mpois=TAFFY(data.mpoi);
		queryCallback(data.mpoi);	
		loadCluster();	
		refreshIndex=0;
	});
}

function loadCluster(){
	//document.getElementById("govern").checked=true;
	//document.getElementById("compus").checked=true;
	//document.getElementById("busi").checked=true;
	//document.getElementById("traffic").checked=true;
	markers=[];//清空数组
	markers=GonvernMarkers.concat(CmpuMarkers).concat(BusiMarkers).concat(TraffiMarkers);
	
	//获得在线人数top3
	//var NumPepleTop1=0,NumPepleTop2=0,NumPepleTop3=0;
	//
	//for (var i = 0; i < markers.length; i++ ){
	//	if (NumPepleTop1<markers[i].onliPeopleNum){ NumPepleTop1 = markers[i].onliPeopleNum;maxId= markers[i].id;maxName=markers[i].title;}
	//}
	//for (var i = 0; i < markers.length; i++ ){
	//	if (NumPepleTop2<markers[i].onliPeopleNum && markers[i].id!=maxId){ NumPepleTop2 = markers[i].onliPeopleNum;top2Id= markers[i].id;top2Name=markers[i].title;}
	//}
	//for (var i = 0; i < markers.length; i++ ){
	//	if (NumPepleTop3<markers[i].onliPeopleNum && markers[i].id!=maxId && markers[i].id!= top2Id){ NumPepleTop3 = markers[i].onliPeopleNum;top3Id= markers[i].id;top3Name=markers[i].title;}
	//}
	//document.getElementById("name-of-onlinePepleTop1").innerText=maxName+"   "+":"+"   ";document.getElementById("num-of-peple-onlineTop1").innerText =NumPepleTop1;
	//document.getElementById("name-of-onlinePepleTop2").innerText =top2Name+"   "+":"+"  ";document.getElementById("num-of-peple-onlineTop2").innerText =NumPepleTop2;
	//document.getElementById("name-of-onlinePepleTop3").innerText =top3Name+" "+":"+"   ";document.getElementById("num-of-peple-onlineTop3").innerText =NumPepleTop3;
	
	addCluster(markers);
	//refreshIndex=1;
}

//关闭infoWindow
function closeInfoindow(){
	document.getElementById("infoWindow").style.display = "none";
}

//关闭searchWindow 并触发回到初始加载页面
function closeSearchWindow(){
	document.getElementById("infoWindow").style.display = "none";
	loadCluster();
	//map.setCenter([113.518364,22.712559]);
	map.setZoomAndCenter(11,[113.518364,22.712559]);
	searchResutIndex=false;
}

//select-all -click 函数
function OnclickSelectAll(){
	//markers=GonvernMarkers.concat(CmpuMarkers).concat(BusiMarkers).concat(TraffiMarkers);
	//addCluster(markers);

	console.log("OnclickSelectAll()");
	closeInfoindow();
	if(document.getElementById("govern").checked &&document.getElementById("compus").checked&&document.getElementById("busi").checked&&document.getElementById("traffic").checked) {
		console.log("取消全选");
		console.log(cluster);
		if(document.getElementById("govern").checked){
			document.getElementById("govern").checked=false;
		}
		if(document.getElementById("compus").checked){
			document.getElementById("compus").checked=false;
		}
		if(document.getElementById("busi").checked){
			document.getElementById("busi").checked=false;
		}
		if(document.getElementById("traffic").checked){
			document.getElementById("traffic").checked=false;
		}

		if (cluster) {cluster.setMap(null);console.log("cluster.setMap(null)");}//清空页面clusters

	} else if(refreshIndex==0){

		ajaxQuest(urlLocate,"GET",null,function(data){
			queryCallback(data.mpoi);
			loadCluster();
			refreshIndex=1;
			refreshIndextimedMsg();
		});
		queryPeopleOnLine();
         //查询在线人数
		 //queryAPOnLine();
		//查询在线Ap

	}
}
function refreshIndextimedMsg(){
	var t=setTimeout(function(){
		refreshIndex=0;
	},2000);
}
function OnclickSelectSome(){
	closeInfoindow();
	var i=0;
	if(document.getElementById("govern").checked &&
		document.getElementById("compus").checked
		&&document.getElementById("busi").checked
		&&document.getElementById("traffic").checked){
			//document.getElementById("select-all").checked=true; 
			markers=[];//清空数组
			markers=GonvernMarkers.concat(CmpuMarkers).concat(BusiMarkers).concat(TraffiMarkers);
			addCluster(markers);	
	} else{
		//document.getElementById("select-all").checked=false;
		if(cluster ){cluster.setMap(null);}	
		
		markers=[];//清空数组

		if (document.getElementById("govern").checked){
			markers=markers.concat(GonvernMarkers);
			
		}
		if (document.getElementById("compus").checked){
			markers=markers.concat(CmpuMarkers);
			
		}
		if (document.getElementById("busi").checked){
			markers=markers.concat(BusiMarkers);
			
		}
		if (document.getElementById("traffic").checked){
			markers=markers.concat(TraffiMarkers);
			
		}
		addCluster(markers);	
	}
}
	

// 添加点聚合
function addCluster(Testmarkers) {
    //cluster= addClusterInner(cluster);

	if (cluster) {
		cluster.setMap(null);
		cluster.clearMarkers();
	}
	if (Testmarkers.length==0 ){
		msgBox("未选中类型或该类型暂无热点");
		OnclickSelectAll();
	} else{
		var sts = [{
		url: "/static/images/nsc_images/dot_11.png",
		size: new AMap.Size(48, 48),
		offset: new AMap.Pixel(-16, -30),
		textColor:"#FFFFFF",
		textSize:20
		},
		{url: "/static/images/nsc_images/dot_2.png",
		size: new AMap.Size(60, 60),
		offset: new AMap.Pixel(-16, -30),
		textColor:"#FFFFFF",
		textSize:20
		},
		{url: "/static/images/nsc_images/dot_3.png",
		size: new AMap.Size(100, 100),
		offset: new AMap.Pixel(-16, -30),
		textColor:"#FFFFFF",
		textSize:20
		}];
		map.plugin(["AMap.MarkerClusterer"], function() {
			cluster = new AMap.MarkerClusterer(map, Testmarkers,{styles:sts, maxZoom:15, averageCenter:true});
			//console.log(cluster);
			cluster.setMaxZoom(18);
			cluster.on("click",clusterClick)
		});
		
	}
	//return cluster0;

	//addClusterInner();
	//console.log(cluster);
}
function ShowSelectedInfo(markersC) {
	closeAddPileBox();
	var x=document.getElementById("ClusterSelectInfo")
	//var marker =markersC[x.selectedIndex]
	markerOrCluster=markersC[x.selectedIndex];
	
	$("#infoWindow").html(markerOrCluster.content).show();
}

//搜索输入框失焦时回复默认设置
function resetInput(){
	document.getElementById("searchInput").value="请输入关键字";
}

//搜索输入框聚集时清除内容
function clearInput(x){
	document.getElementById(x).value="";
}

//关键字搜索显示
function ShowSelectedMpoi(){
	searchResutIndex=true;
    closeAddPileBox();
	var value =document.getElementById("searchInput").value;
	var i=0;
	var apNum=0,onlineNum=0;
    //var count =GonvernMkrTfy({title:{likenocase:value}}).count(); 
	if (markers){markers=[];};
	var content=[];
	AllKindMkrTfy([{title:{like:value}},{address:{like:value}}]).each(function(r){	
		if (i==0){
			 map.setZoomAndCenter(16, r.getPosition());
			i++;
		}
		
		content=content.concat(r.content);
		markers.push(r);	
	})
	//结果为空时弹出框
	if (markers.length==0){
		msgBox("关键字无相应热点,请重新输入");
		document.getElementById("govern").checked=false;
		OnclickSelectAll();
		
	}
	//结果非空时页面显示查询结果
	else{
		addCluster(markers);
		var apNum=0,onlineNum=0;
		for (var i = 0; i < content.length; i++){
			apNum +=parseInt(content[i].match("<b>接入点数量：</b>.*?</p>")[0].split("</b>")[1].split("</p>")[0]);
			onlineNum+=parseInt(content[i].match("<b>在线人数：</b>.*?</p>")[0].split("</b>")[1].split("</p>")[0]);
		}
		var showcontent='<p><b  style="color: #36f;">' + value + ' </b>搜索结果</p><p><b>接入点数量：</b>'+apNum+'</p><p><b>在线人数：</b>'+onlineNum+'<img id="close"  src="/static/images/nsc_images/close.png"  onclick="closeSearchWindow()"/></p>'
		
		
		$("#infoWindow").html(showcontent).show();
	}
}

function clusterClick(e) {
	closeAddPileBox();
	if (map.getZoom()>16){
		markersC=e.markers;
		var content='<select id="ClusterSelectInfo" onchange ="ShowSelectedInfo(markersC)">'
		if (e.markers.length){
			for (var i=0;i<e.markers.length;i++){
				//content+='<select>名称：' + e.markers[i].title 
				content+='<option value ="'+e.markers[i].title+'">'+e.markers[i].title +'</option>'
			}
			conetnt=content+'</select>'
		}

		infoWindow.setContent(content);
		infoWindow.open(map, e.lnglat);
		$("#infoWindow").html(markersC[0].content).show();	
	}
}
	
//添加修改页面关闭函数
function closeAddPileBox(){
	if (AddPileBoxIsOpenIndex){
		$(".add-pile-box").hide();
		AddPileBoxIsOpenIndex=false;
	}
}

//添加在线热点查询
//queryAPOnLineCallback = function(results)
//{	var lists =TAFFY(results);
//    var countOfAPonline=lists({mpoi_id:{"!is":""}}).count();//moi_id非空
//    console.log(countOfAPonline);
// document.getElementById("num-of-onlineAP").innerText=countOfAPonline;
//};

//添加在线热点查询
function queryAPOnLine(){
	ajaxQuest(urllist,"GET",{online:"1"},function(data){
		queryAPOnLineCallback(data.list);	
	});
}

//queryPeopleOnLineCallback = function(results){
//	var NumOfPeoOnli =0;
//	for (var i = 0; i < results.length; i++) {
//		var object = results[i];
//		if(object.mpoi_id !=""){NumOfPeoOnli=object.conns+NumOfPeoOnli;}
//
//	}
//	//document.getElementById("num-of-onlinePeple").value = NumOfPeoOnli;
//	document.getElementById("num-of-onlinePeple").innerText = NumOfPeoOnli;
//}

//添加在线人数查询
function queryPeopleOnLine(){
	ajaxQuest(urllist,"GET",{online:"1"},function(data){
		queryPeopleOnLineCallback(data.list);	
	});
}

//查找list Mpoi_id非空记录 并运行queryDB()
function GetListMidNotnull(){
	ajaxQuest(urllist,"GET",{mpoi_id:{"!is":""}},function(data){
		//listArr=data.list;
		lists =TAFFY(data.list);
		queryDB();
	});
}

//返回对应id AP数量 
function GetApInfo(lists,mpoi_id){
    var count=lists({mpoi_id:mpoi_id}).count();
	var norNum=0,errNum=0,onliPeopleNum=0;
	lists({mpoi_id:mpoi_id}).each(function(r){
		r.online=="1" ? norNum++ : errNum++;
		onliPeopleNum+=r.conns;
	});
	
	return [count,norNum,errNum,onliPeopleNum];
}


function delDB(objectId){
	ajaxQuest(urlLocate,"DELETE",{id:objectId},function(data){
		msgBox("删除成功！");
		queryDB();
	},function() {
		console.log("del Error");
		msgBox("删除失败。")
	});
}


//南沙9镇地图区域数据

var towns=[
	[[113.392002,22.810347],[113.390865,22.810752],[113.387947,22.812129],[113.387199,22.812597],[113.386322,22.813879],[113.385254,22.815257],[113.383976,22.816476],[113.381187,22.818633],[113.379493,22.819851],[113.377146,22.821384],[113.375574,22.822226],[113.374418,22.8226],[113.373383,22.822694],[113.372158,22.822504],[113.370341,22.822],[113.369123,22.821529],[113.368524,22.821466],[113.368028,22.821591],[113.366837,22.822151],[113.36555,22.82287],[113.364264,22.823493],[113.362542,22.823339],[113.357377,22.822247],[113.354159,22.821751],[113.352785,22.821149],[113.352872,22.81885],[113.350411,22.818075],[113.348949,22.818175],[113.348897,22.816759],[113.346523,22.81614],[113.345357,22.819214],[113.344975,22.820208],[113.343922,22.820061],[113.343061,22.819775],[113.340939,22.819076],[113.338086,22.81838],[113.337199,22.81824],[113.335963,22.817942],[113.332249,22.821691],[113.32937,22.823274],[113.323525,22.824768],[113.318176,22.82626],[113.31441,22.828196],[113.312097,22.830394],[113.311423,22.832489],[113.310793,22.834449],[113.310523,22.838916],[113.309655,22.851194],[113.305619,22.851037],[113.303802,22.852074],[113.303559,22.853253],[113.302915,22.854109],[113.30102,22.855592],[113.299846,22.859046],[113.296812,22.85783],[113.296142,22.859905],[113.29742,22.860213],[113.296325,22.862504],[113.301334,22.866113],[113.299264,22.869965],[113.298108,22.873105],[113.300482,22.874077],[113.301308,22.874951],[113.30083,22.876772],[113.300425,22.877062],[113.30543,22.877247],[113.307187,22.87771],[113.310679,22.87863],[113.314744,22.880032],[113.319521,22.881424],[113.323106,22.882624],[113.331296,22.884938],[113.339192,22.886185],[113.34319,22.887884],[113.348929,22.890323],[113.349538,22.890582],[113.351342,22.891185],[113.358024,22.893268],[113.360216,22.893579],[113.361386,22.893785],[113.367952,22.887539],[113.376492,22.881608],[113.384689,22.878682],[113.390225,22.874135],[113.393916,22.872079],[113.398722,22.86773],[113.410052,22.85729],[113.413399,22.852386],[113.416661,22.844951],[113.416146,22.840528],[113.413828,22.828504],[113.417176,22.820752],[113.409537,22.81822],[113.406232,22.815253],[113.401039,22.819565],[113.398679,22.814541],[113.400868,22.813236],[113.400181,22.812484],[113.393916,22.815807],[113.392156,22.810981]],
	[[113.361386,22.893785],[113.361924,22.894206],[113.36705,22.897034],[113.370515,22.898558],[113.376363,22.900076],[113.380747,22.901056],[113.384542,22.901315],[113.393688,22.901106],[113.401079,22.901173],[113.403999,22.901791],[113.407796,22.90313],[113.411207,22.905191],[113.415691,22.907607],[113.41822,22.908407],[113.420358,22.908398],[113.423559,22.907662],[113.431226,22.906543],[113.447434,22.906458],[113.4517,22.906163],[113.462171,22.905108],[113.465079,22.905],[113.473497,22.901791],[113.485583,22.89585],[113.496031,22.892442],[113.502605,22.889782],[113.509526,22.885553],[113.50956,22.885327],[113.508788,22.882362],[113.509088,22.875205],[113.508696,22.872144],[113.495813,22.865326],[113.488002,22.860679],[113.485921,22.857516],[113.484326,22.854188],[113.486,22.848572],[113.486257,22.84347],[113.48514,22.834437],[113.486266,22.816311],[113.485602,22.816176],[113.483886,22.814514],[113.483946,22.810987],[113.485662,22.803787],[113.48519,22.80078],[113.486377,22.795189],[113.480041,22.797576],[113.47429,22.801769],[113.469597,22.808257],[113.4508,22.820283],[113.449083,22.820672],[113.426338,22.838076],[113.418613,22.846836],[113.416685,22.845004],[113.413399,22.852386],[113.410052,22.85729],[113.398722,22.86773],[113.393916,22.872079],[113.390225,22.874135],[113.384689,22.878682],[113.376492,22.881608],[113.367952,22.887539]],
	[[113.447782,22.735852],[113.44112,22.737222],[113.439291,22.73735],[113.43553,22.737614],[113.426141,22.738005],[113.417884,22.740407],[113.412192,22.742827],[113.404277,22.747249],[113.403143,22.747975],[113.400373,22.749749],[113.399931,22.750032],[113.396352,22.752324],[113.39143,22.755475],[113.39107,22.755706],[113.381453,22.761565],[113.374846,22.766171],[113.372971,22.767479],[113.365156,22.772602],[113.363512,22.774124],[113.361495,22.777018],[113.359852,22.781664],[113.357714,22.787033],[113.357009,22.791426],[113.356914,22.791738],[113.35654,22.792971],[113.357879,22.793919],[113.36027,22.792962],[113.363366,22.793544],[113.366461,22.794775],[113.368122,22.795286],[113.369765,22.79605],[113.371852,22.79688],[113.373121,22.795273],[113.374685,22.794557],[113.37546,22.795361],[113.376067,22.795991],[113.379161,22.797286],[113.379935,22.797428],[113.382744,22.799127],[113.383028,22.799299],[113.388159,22.804324],[113.388745,22.804898],[113.390275,22.80618],[113.391907,22.807297],[113.392046,22.807491],[113.393254,22.809174],[113.39339,22.8097],[113.393428,22.809847],[113.391895,22.8104],[113.393916,22.815807],[113.400181,22.812484],[113.400868,22.813236],[113.398679,22.814541],[113.401039,22.819565],[113.406232,22.815253],[113.409537,22.81822],[113.417176,22.820752],[113.413828,22.828504],[113.416146,22.840528],[113.416661,22.844951],[113.418613,22.846836],[113.426338,22.838076],[113.449083,22.820672],[113.4508,22.820283],[113.469597,22.808257],[113.47429,22.801769],[113.480041,22.797576],[113.486377,22.795189],[113.486377,22.795189],[113.487428,22.79003],[113.485883,22.787023],[113.472665,22.774045],[113.470777,22.77452],[113.469747,22.771987],[113.47558,22.769546],[113.478691,22.768181],[113.480476,22.766605],[113.480583,22.768723],[113.48599,22.7671],[113.492685,22.762985],[113.492685,22.761085],[113.478351,22.757682],[113.471828,22.750875],[113.461872,22.744701],[113.449341,22.736627]],
	[[113.509526,22.885553],[113.510302,22.886653],[113.520725,22.882775],[113.530769,22.876283],[113.548518,22.868535],[113.561064,22.861921],[113.571008,22.856961],[113.571224,22.853125],[113.574274,22.847298],[113.577593,22.841194],[113.584032,22.831311],[113.597629,22.817425],[113.607784,22.805637],[113.599716,22.801998],[113.571907,22.822252],[113.545128,22.827394],[113.543642,22.827701],[113.541002,22.822333],[113.540014,22.817903],[113.539156,22.813492],[113.53774,22.809912],[113.53362,22.802238],[113.52847,22.794404],[113.524908,22.787045],[113.526239,22.777905],[113.526754,22.772286],[113.487535,22.789971],[113.486377,22.795189],[113.48519,22.80078],[113.485662,22.803787],[113.483946,22.810987],[113.483886,22.814514],[113.485602,22.816176],[113.486266,22.816311],[113.48514,22.834437],[113.486257,22.84347],[113.486,22.848572],[113.484326,22.854188],[113.485921,22.857516],[113.488002,22.860679],[113.495813,22.865326],[113.508696,22.872144],[113.509088,22.875205],[113.508788,22.882362]],
	[[113.507511,22.68958],[113.491906,22.699792],[113.482156,22.707147],[113.471314,22.714995],[113.464814,22.720959],[113.465336,22.722208],[113.465348,22.722218],[113.465349,22.722239],[113.467974,22.728518],[113.44954,22.735093],[113.447782,22.735852],[113.449341,22.736627],[113.461872,22.744701],[113.471828,22.750875],[113.478351,22.757682],[113.492685,22.761085],[113.492685,22.762985],[113.48599,22.7671],[113.480583,22.768723],[113.480476,22.766605],[113.478691,22.768181],[113.47558,22.769546],[113.469747,22.771987],[113.470777,22.77452],[113.472665,22.774045],[113.485883,22.787023],[113.487428,22.79003],[113.526754,22.772286],[113.558689,22.746442],[113.562122,22.740268],[113.553882,22.744859],[113.537832,22.745492],[113.520237,22.743434],[113.499208,22.736785],[113.500022,22.735794],[113.524433,22.719445],[113.529836,22.714603],[113.533677,22.710545],[113.533655,22.709971],[113.528371,22.704738],[113.527492,22.704382],[113.525389,22.702086],[113.525561,22.701512],[113.513195,22.686079]],
	[[113.612086,22.802289],[113.626013,22.786756],[113.648132,22.761733],[113.653034,22.755866],[113.639161,22.745749],[113.623196,22.737042],[113.573672,22.733717],[113.562122,22.740268],[113.558689,22.746442],[113.526754,22.772286],[113.526239,22.777905],[113.524908,22.787045],[113.52847,22.794404],[113.53362,22.802238],[113.53774,22.809912],[113.539156,22.813492],[113.540014,22.817903],[113.541002,22.822333],[113.543642,22.827701],[113.545128,22.827394],[113.571907,22.822252],[113.599716,22.801998],[113.607784,22.805637]],
	[[113.562122,22.740268],[113.582743,22.721319],[113.587893,22.706117],[113.593386,22.696615],[113.581092,22.68664],[113.565213,22.671197],[113.559033,22.676741],[113.563583,22.681889],[113.557489,22.687274],[113.554484,22.684185],[113.544571,22.691867],[113.527048,22.703858],[113.527492,22.704382],[113.528371,22.704738],[113.533655,22.709971],[113.533677,22.710545],[113.529836,22.714603],[113.524433,22.719445],[113.500022,22.735794],[113.499208,22.736785],[113.520237,22.743434],[113.537832,22.745492],[113.553882,22.744859]],
	[[113.692043,22.515153],[113.682341,22.514361],[113.662006,22.514793],[113.651609,22.515719],[113.649419,22.52151],[113.639323,22.548276],[113.620779,22.579534],[113.615014,22.58529],[113.609797,22.588233],[113.60216,22.592788],[113.599618,22.594394],[113.594665,22.594396],[113.589981,22.595201],[113.587423,22.596828],[113.580974,22.602097],[113.578555,22.604615],[113.577862,22.603913],[113.574716,22.605716],[113.571917,22.602804],[113.567395,22.605932],[113.565143,22.603477],[113.564969,22.603688],[113.561635,22.607511],[113.558024,22.613732],[113.555643,22.617123],[113.551791,22.623766],[113.544745,22.635191],[113.541309,22.640335],[113.536879,22.647528],[113.532971,22.654983],[113.532779,22.655794],[113.533087,22.656371],[113.534414,22.656539],[113.536741,22.657212],[113.539511,22.657941],[113.540723,22.666208],[113.523375,22.679303],[113.513195,22.686079],[113.525561,22.701512],[113.525389,22.702086],[113.527048,22.703858],[113.544571,22.691867],[113.554484,22.684185],[113.557489,22.687274],[113.563583,22.681889],[113.559033,22.676741],[113.565213,22.671197],[113.581092,22.68664],[113.593386,22.696615],[113.605316,22.690346],[113.620766,22.680526],[113.637589,22.660885],[113.656128,22.636804],[113.670204,22.599725]],
	[[113.678217,22.726097],[113.685285,22.717725],[113.716856,22.645199],[113.727711,22.594219],[113.740462,22.534269],[113.737623,22.527658],[113.728183,22.521984],[113.705976,22.516291],[113.692043,22.515153],[113.670204,22.599725],[113.656128,22.636804],[113.637589,22.660885],[113.620766,22.680526],[113.605316,22.690346],[113.593386,22.696615],[113.587893,22.706117],[113.582743,22.721319],[113.562122,22.740268],[113.573672,22.733717],[113.623196,22.737042],[113.639161,22.745749],[113.653034,22.755866]]
	];

var townColor = ["#9117fc",
					"#17fc91",
						"#91fc17",
				"#9117fc",
					"#17fc91",
						"#91fc17",
				"#9117fc",
						"#91fc17",
					"#17fc91"];

var townNames = ["榄核镇","东涌镇","大岗镇","黄阁镇","横沥镇","南沙街道","珠江街道","万顷沙镇","龙穴岛街道"];
var townsCenter = [[113.358376,22.853401],[113.450729,22.872224],[113.4291,22.785997],[113.514759,22.84296],[113.498623,22.751807],[113.578102,22.781249],[113.554928,22.715393],[113.599045,22.642534],[113.645393,22.683244]];
