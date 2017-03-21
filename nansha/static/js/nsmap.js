/**
 * Created by fxh on 2016/4/26.
 */
//消息窗替代alert
window.msgBox = function (texts,tos) {
	$('.msgbox').remove();
	$("body").append('<div class="msgbox msgUp">' + texts + '</div>');
	$('.msgbox').show();
	if(!tos){tos = 2200;}
	setTimeout(function () {
		$('.msgbox').removeClass("msgUp").addClass("msgDown");
	},tos);//停留时间
};
//全局变量 map
var	map = new AMap.Map('map', {
	resizeEnable: true,
	zoom:12,
	center: [113.518364,22.712559],//南沙区域正中心点	//[113.53141,22.808029],//南沙区政府点
	mapStyle:"normal"
});

;$(function(){
	var pileLng=0, pileLat=0;
	//var cluster = null;
	var zoomN;
	var t=null;
	//修改数据
	function CreatUpdateData() {
		map.on('click', function(e) {
			if (AddPileBoxIsOpenIndex){
				console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
				$(".add-wifi-lat").val(e.lnglat.getLat());
				$(".add-wifi-lng").val(e.lnglat.getLng());
				pileLng = e.lnglat.getLng(); pileLat = e.lnglat.getLat();
				//插入一个标记
				if(pointMark){pointMark.show(); pointMark.setPosition([pileLng, pileLat]);}
				else{
					pointMark = new AMap.Marker({
						icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
						position: [pileLng, pileLat]});
						pointMark.setMap(map);
					}
					
				var lnglatXY = [pileLng, pileLat]; //待解析坐标
				function regeocoder() {  //逆地理编码
					var geocoder = new AMap.Geocoder({
						radius: 1000,
						extensions: "all"
					});        
					geocoder.getAddress(lnglatXY, function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							var addrStr = result.regeocode.addressComponent.district;
							addrStr += result.regeocode.addressComponent.township
							addrStr += result.regeocode.addressComponent.street
							addrStr += result.regeocode.addressComponent.streetNumber;
							if(result.regeocode.addressComponent.neighborhood!=""){
								addrStr += "("+result.regeocode.addressComponent.neighborhood+"附近)";
								}
							$(".add-wifi-address").val(addrStr);
							}
						});
					}
				regeocoder();
			}
			//if(lrgHCrtCntnIsOpnIdx){closelrgHCrtCntn();}
			});
		
		map.setFitView();//地图自适应
	}
	CreatUpdateData();

	function getBoundary(){
	   //注释工具条标尺等
	   // map.addControl(scale); map.addControl(toolBar);
	    infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, 0),closeWhenClickMap:false});

    	//构建南沙各镇分区经纬度坐标数组
    	/*var nsTsPgs = [];
	    var nsPolygon=function(arr,fillColor){
	    	var pg = new AMap.Polygon({
	            map: map,
		        path: arr,//设置多边形边界路径
		        strokeOpacity:0,
		        fillColor: fillColor, //填充色
		        fillOpacity: 0.35//填充透明度
		    });
	    	nsTsPgs.push(pg);
	    	return pg;
	    };
	    for(var i=0;i<10;i++){	//9个镇区域色块
	    	nsPolygon(towns[i],townColor[i]);
	    }  */

	    queryCallback = function(results){	//获取到热点数据后执行（地图画点、显示数据、事件）
	    	//先清除地图上已有的数据
			GonvernMarkers =[];
			CmpuMarkers=[];
			BusiMarkers=[];
			TraffiMarkers=[];
	    	if(markers){
	    		for(var i=0;i<markers.length;i++){
	    			markers[i].hide();
	    		}
	    	}
	    	if(pointMark){pointMark.hide();}
	    	infoWindow.close();

	    	markers=[];
	    	var lnglats = [];

		    // 循环处理查询到的数据
		    for (var i = 0; i < results.length; i++) {
				var object = results[i];
				mpoi_id = object.mpoi_id;

				//AP 数量显示
				var num = GetApInfo(lists,mpoi_id);
				var datacount= num[0];
				var norNum = num[1];
				var errNum = num[2];
				var onliPeopleNum= num[3];


		        var marker = new AMap.Marker({

				    //icon: (i%2==1)?"images/nsc_images/map/p3.png":"images/nsc_images/map/p2.png",
					//content: div,
		            position: [object.lng,object.lat],
		            //map: map,
		            offset: new AMap.Pixel(-25, -28)
		        });
		        marker.id=object.mpoi_id;
				marker.title=object.mpoi_name;
				marker.address=object.mpoi_address;
				marker.position=[object.lng,object.lat];
				marker.type= object.type;
				marker.onliPeopleNum=onliPeopleNum;
		        marker.content = '<div class="info">' +
					'<h3>' + object.mpoi_name + '</h3>' +
					'<div><img src="/static/images/nsc_images/p22.png" width="25" height="30" alt="locaicon" />'+object.mpoi_address+'</div>' +
					'<p><b>接入点数量：</b>'+datacount+'</p>' +
					'<p><b>在线人数：</b>'+onliPeopleNum+'</p>' +
					'<p><b>类型：</b>'+object.type+'</p></div>' +
					'<img id="close" src="/static/images/nsc_images/close.png" onclick="closeInfoindow()"/>';

				marker.on('click', markerClick);
		        marker.on('mouseover', function(e){
		        	e.target.setAnimation("AMAP_ANIMATION_NONE");//AP图标不弹跳
			    });

				if(errNum>0){
					marker.setIcon("/static/images/nsc_images/dot_0.png");
				}else if(onliPeopleNum<=5){
					marker.setIcon("/static/images/nsc_images/blue.png");
				}else{
					marker.setIcon("/static/images/nsc_images/red.png");
				}
				var  type =object.type;
				switch (type){
					case "政府":
					case "医院":
						GonvernMarkers.push(marker);
						break;
					case "校区":
						CmpuMarkers.push(marker);
						break;
					case "商超":
					case "餐饮":
					case "宾馆":
					case "文娱":
					case "景区":
					case "企业":
					case "公共":
						BusiMarkers.push(marker);
						break;
					case "机场":
					case "车站":
						TraffiMarkers.push(marker);
						break;
				}

		    }
			//四种类型markers 赋值，以作后面筛选查询
			AllKindMkrTfy=TAFFY(GonvernMarkers.concat(CmpuMarkers).concat(BusiMarkers).concat(TraffiMarkers));

		    function markerClick(e) {
			    closeAddPileBox();
				$("#infoWindow").html(e.target.content).show();
				//if (document.getElementById("searchInput").value!="请输入关键字"){document.getElementById("searchInput").value="请输入关键字";}
				//if (icon && markerOrCluster){
				//	markerOrCluster.setIcon(icon);
				//}
				//icon = e.target.getIcon();
				//e.target.setIcon("/static/images/nsc_images/故障.png");
				markerOrCluster=e.target;
		    }
	    };

		//queryDB();
		GetListMidNotnull();

		//地图缩放时关闭infoWindow
		map.on('zoomend',function(){
			if(infoWindow.getIsOpen()){
				infoWindow.close();
			}
		});
		//queryAPOnLine();
		//查询在线Ap
		//queryPeopleOnLine();
         //查询在线人数

		//添加定时触发函数
		function timedMsg(){
		   if(!isErrNum){/*queryAPOnLine();*/}
		   //queryPeopleOnLine();
		   t=setTimeout(timedMsg,300000);//300秒钟获取一次值(5min)
		}
		timedMsg();
		//添加地图缩放或平移时infoWIndow关闭

	   // addNanSha();

	    //查询实时天气信息
	    AMap.service('AMap.Weather', function() {
	        var weather = new AMap.Weather();
	        weather.getLive('南沙区', function(err, data) {
	            var wStr = '',minStr = '';
	            if (!err) {
	            	minStr = data.weather + ' ' + data.temperature + '℃';

	                wStr+=('<p style="color: #36f;">' + data.city + ' 实时天气' + '</p>');
	                wStr+=('<p>天气：' + data.weather + '</p>');
	                wStr+=('<p>温度：' + data.temperature + '℃</p>');
	                wStr+=('<p>湿度：' + data.humidity + '%</p>');
	                wStr+=('<p style="margin-bottom: 10px;">风力：' + data.windDirection +'风 '+ data.windPower + '级</p>');
	                // wStr+=('<p>发布时间：' + data.reportTime + '</p>');

			        //未来4天天气预报
			        weather.getForecast('南沙区', function(err, data) {
			            if (err) {return;}
			            wStr += '<p style="color: #36f;">未来4天天气预报：</p>';
			            for (var i = 0,dayWeather; i < data.forecasts.length; i++) {
			                dayWeather = data.forecasts[i];
			                var week="";
			                switch(dayWeather.week){
			                	case "1":week="一";break;
			                	case "2":week="二";break;
			                	case "3":week="三";break;
			                	case "4":week="四";break;
			                	case "5":week="五";break;
			                	case "6":week="六";break;
			                	default:week="日";break;
			                }
			                wStr+=('<p>周'+week+' '+dayWeather.dayWeather+' '+ dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃</p>');
			            }
			        });

	            	$(".weather").html(minStr).show();

	                $(".weather").on("mouseover",function(e){
	                	$(this).html(wStr);
	                });

	                $(".weather").on("mouseleave",function(e){
	                	setTimeout(function(){
	                		$(".weather").html(minStr);
	                	},300000);
	                })
	            }
	        });
	    });

		$(document).on("click",".pop-title a",function(e){
			if($(this).hasClass("on")){return;}
			if($(this).index()=='1'){msgBox("此功能暂未开放。");return;}
			$(this).addClass("on").siblings().removeClass("on");
			$(".tbl-wifi").toggle();
			$(".tbl-pile").toggle();
		});
	}
	getBoundary();
   
	//设置为修改状态
	var setToEdit = function(){
		$(".pop-title").html('<a class="on" href="javascript:;">修改</a>');
		$(".btn-add").hide();
		$(".btn-edit").show();
	};
	//设置为新增状态
	var setToAdd = function(){
		$(".pop-title").html('<a class="on" href="javascript:;">新增热点</a> | <a href="javascript:;">新增充电桩</a>');
		$(".btn-add").show();
		$(".btn-edit").hide();
	};

	$(document).on("click",".btn-open-edit",function(e){
		setToEdit();
		$(".add-pile-box").show(function(e){
		//$(".CUDBox").show(function(e){
			AddPileBoxIsOpenIndex=true;
			var x=document.getElementById("TypeSelect");
			var index = x.selectedIndex;
			closeInfoindow();
			$(".add-wifi-address").val(markerOrCluster.address);
			$(".add-wifi-name").val(markerOrCluster.title);
			$(".add-wifi-lng").val(markerOrCluster.position[0]);
			$(".add-wifi-lat").val(markerOrCluster.position[1]);
			originLat =markerOrCluster.position[1];originLng=markerOrCluster.position[0];
			originName =markerOrCluster.title;originAddress=markerOrCluster.address;
			originType = markerOrCluster.type;
			switch(markerOrCluster.type){
				case "政府": x.options[0].selected=true;break;
				case "医院": x.options[1].selected=true;break;
				case "校区": x.options[2].selected=true;break;
				case "文娱": x.options[3].selected=true;break;
				case "商超": x.options[4].selected=true;break;
				case "宾馆": x.options[5].selected=true;break;
				case "餐饮": x.options[6].selected=true;break;
				case "景区": x.options[7].selected=true;break;
				case "车站": x.options[8].selected=true;break;
				case "机场": x.options[9].selected=true;break;
				case "企业": x.options[10].selected=true;break;
				case "公共": x.options[11].selected=true;break;
			}
		});
		//editObjId = $(this).parent().data("id");
		editObjId = markerOrCluster.id;
		console.log(editObjId);
	});

	$(document).on("click",".btn-open-del",function(e){
		var delObjId = $(this).parent().data("id");
		console.log("delObjId:"+delObjId);
		if(confirm("确定要删除该点？")){
			delDB(delObjId);
		}
	});

	//添加成功后callback
	addCallback = function(){
		msgBox("添加成功！");
		$(".add-wifi-name,.add-wifi-address,.add-wifi-mac").val("");
	};

	var trim = function(inputObj){  //非空验证
		var fl=true;
		var inputValue = inputObj.val();
		inputObj.val(inputObj.val().replace(/(^\s*)|(\s*$)|(\s)/g, ""));
		if(inputObj.val()==""){msgBox("请输入名称(地址)");inputObj.focus();fl=false;}
		return fl;
　　};
	var valid = function(){	//表单验证
		var x=document.getElementById("TypeSelect");
		var index = x.selectedIndex;
		
		if(!trim($(".add-wifi-address")) || !trim($(".add-wifi-name")) || !trim($(".add-wifi-lng")) || !trim($(".add-wifi-lat"))){return false;};
		if ( parseFloat($(".add-wifi-lng").val())>140 || parseFloat($(".add-wifi-lng").val())<70 || parseFloat($(".add-wifi-lat").val())>60 || parseFloat($(".add-wifi-lat").val())<0 ){msgBox("经纬度超出范围，请重新输入或选点");return false;}
		var regLngLat=/^\d{1,3}\.\d*\d$/;
		if(!regLngLat.test($(".add-wifi-lng").val())|| !regLngLat.test($(".add-wifi-lat").val())){msgBox("经纬度格式有误");return false;}
		
		//修改内容检测
		if(originLng ==$(".add-wifi-lng").val() && originLat == $(".add-wifi-lat").val() && originType ==x.options[index].text &&originName ==$(".add-wifi-name").val() &&originAddress ==$(".add-wifi-address").val() )
		{
			msgBox("内容未修改，请重新修改或关闭取消");return false;}	
		
		else{
			var content="修改内容如下：\n";
			if (originLng !=$(".add-wifi-lng").val() || originLat!= $(".add-wifi-lat").val()){content+="经纬度："+$(".add-wifi-lng").val()+" "+$(".add-wifi-lat").val()+"\n";}
			if (originType !=x.options[index].text){content+="类型："+x.options[index].text+"\n";}
			if(originName !=$(".add-wifi-name").val()){content+="名称："+$(".add-wifi-name").val()+"\n";}
			if (originAddress !=$(".add-wifi-address").val()){content+="地址："+$(".add-wifi-address").val()+"\n";}
			if (!confirm(content)){return false};
		}
		//if ( parseFloat($(".add-wifi-lng").val())>140 || $(".add-wifi-lng").val()<70 || $(".add-wifi-lat").val()>60 || $(".add-wifi-lat").val()<0 ||){msgBox("经纬度错误，请重新输入或选点");return false;}
		
		//var regMAC = /^([0-9a-fA-F]{2})(([/\s-][0-9a-fA-F]{2}){5})$/;
		///[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
		//if(!regMAC.test($(".add-wifi-mac").val())){msgBox("请输入正确的MAC地址<br>例如:1A-2B-3C-4D-5E-6F",3000);$(".add-wifi-mac").focus();return false;}
		return true;
	};

	$(document).on("click",".btn-add.wifi",function(e){
		if(!valid())return;
		//添加热点
		var addHotData = {
			name:$(".add-wifi-name").val(),
			address:$(".add-wifi-address").val(),
			lng:""+pileLng,
			lat:""+pileLat,
			mac:$(".add-wifi-mac").val()
		};
		//addtoDB(addHotData);
	});
	
	//var editObjId=null;//待修改的点id
	$(document).on("click",".btn-edit.wifi",function(e){
		var x=document.getElementById("TypeSelect");
		var index = x.selectedIndex;	
		if(!valid())return;
		//修改热点
		console.log($(".add-wifi-lng").val());
		console.log($(".add-wifi-lat").val());
		var editHotData = {
			mpoi_id:editObjId,
			mpoi_name:$(".add-wifi-name").val(),
			mpoi_address:$(".add-wifi-address").val(),
			mpoi_address:$(".add-wifi-address").val(),
			lng:""+$(".add-wifi-lng").val(),
			lat:""+$(".add-wifi-lat").val(),
			type: x.options[index].text
			//mac:$(".add-wifi-mac").val()
		};
		if(confirm("确认要修改该点？")){
			
			updateDB(editHotData);
		}
	});

	$(document).on("click",".pop-close",function(e){
		closeAddPileBox();
		//pointMark.hide();
		//$(".CUDBox").hide();
		//AddPileBoxIsOpenIndex=false
		if (searchResutIndex){closeSearchWindow();}
	});

	// 地图移动镇区域
    $('#mapNav li').on('click', function(){
        $(this).addClass('on').siblings().removeClass('on');
        var ln = $(this).data('lnglat').split(',');
        if($(this).index()==0){
            map.setZoomAndCenter(12, ln);
        }else{
            map.setZoomAndCenter(13, ln);
        }
        closeInfoindow();
    });
    
});