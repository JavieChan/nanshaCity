var lrgHCrtCntnIsOpnIdx=false;
var erroMarkersTffy=TAFFY();
function showHighChartTop10() {
	$("#infoWindow").hide();
	 //closeSearchWindow();
	 $(".add-pile-box").hide();
	var series=[];
	
	
	AllKindMkrTfy().order("onliPeopleNum desc").limit(10).each(function (r) {
			console.log(r.title+" "+r.onliPeopleNum )
			var data=[r.title,r.onliPeopleNum];
			series.push(data);
			});
	openlrgHCrtCntn();
}
function closelrgHCrtCntn(){
	$('.largeHChartContainer').hide();
	lrgHCrtCntnIsOpnIdx=false;
}
function openlrgHCrtCntn(){
	$('.largeHChartContainer').show();
	lrgHCrtCntnIsOpnIdx=true;
}
function checkRkng(){
	//var x=document.getElementById("rankingBtn");
	
	//console.log(x[x.selectedIndex].innerText);
	//console.log("document.getElementByIdinnerText");
	console.log(document.getElementById("topTitle").innerText);
	$("#infoWindow").hide();
	$("#infoWindowSearchAp").hide();
	$("#panelLarger").hide();
	 //closeSearchWindow();
	 $(".add-pile-box").hide();
	
	if(document.getElementById("topTitle").innerText=="故障排行"){
		//$("#rankingBtn").hide();
		showHighChartErrApTop10();}
	else{
		showHighChartTop10();
		$("#rankingBtn").show();
		//if (x[x.selectedIndex].innerText=="按类型"){showTypeRanking();$("#rankingBtn").show();}
		//else if(x[x.selectedIndex].innerText=="按名字"){showHighChartTop10();$("#rankingBtn").show();}
		}
	
}
function checRkngType(){
	var x=document.getElementById("rankingBtn");
	if (x[x.selectedIndex].innerText=="按类型"|| x[x.selectedIndex].textContent=="按类型"){showTypeRanking();}
	else if(x[x.selectedIndex].innerText=="按名字"||x[x.selectedIndex].textContent=="按名字"){showHighChartTop10();}
}

function CheckErrOrNorm(){
	//管理员身份验证
	//if(Cookies.get("cToken")){
		//isErrNum 初始化值为false
		if (isErrNum){
			loadCluster();
			//queryAPOnLine();
			isErrNum=false;
		} else{
			showErroeAp();
			isErrNum=true;
		}
		closeInfoindow();
	//}
}

function showMac(){
	var x=document.getElementById("ApPosition");
	var index=x.selectedIndex;
	console.log(marker);
	document.getElementById("macLabel").innerText=markerOrCluster.mac[index];
	console.log(markerOrCluster);
	console.log(markerOrCluster.mac[index]);
}

function showErroeAp(){
	//更改右上角显示
	//function changeRightTopPage(){
	//	document.getElementById("marketRedIcon").src="images/nsc_images/sprites/marker_Grey2.png";
	//	document.getElementById("hotSpotsText").innerText="故障热点";
	//
	//	document.getElementById("num-of-onlineAP").innerText=0;
	//}
	//changeRightTopPage();
    //
	var  offLineAp=TAFFY(),mpoi=TAFFY(),erroMarkers=[];
	function getMpoi(){
		ajaxQuest(urlLocate,"GET",null,function(data){
			//queryCallback(data.mpoi);
			mpoi=TAFFY(data.mpoi);
			queryAPOffLine();//getmpoi成功后调用queryAPOffLine
		});
	}
	//getMpoi();
	queryAPOffLine();

	//添加故障热点查询
	queryAPOffLineCallback = function(results) {
		var lists =TAFFY(results);
		offLineAp=lists({mpoi_id:{"!is":""}});
		//页面显示数量
		var countOfAPOffline=offLineAp.count();//moi_id非空
		//console.log(countOfAPOffline);
		//document.getElementById("num-of-onlineAP").innerText=countOfAPOffline;
		var mid=offLineAp.distinct("mpoi_id");
		
		for (var i=0;i<mid.length;i++) {
			var j=i;
			mpois({mpoi_id:mid[j]}).each(function(r){
				var count=0;
				//console.log(mid[j]);
				var address=[],mac=[];
				offLineAp.filter({mpoi_id:mid[j]}).each(function(r){
					if (r.address!=null & r.address!=""){address.push(r.address);}
					else{address.push("无详细AP方位");}
					//else if(r.name!=null & r.name!=""){console.log(r.name);address.push(r.name);}
					//else{console.log("name and addresss are null");}
					mac.push(r.mac);
					count++;})
				//console.log(count);
				var object=r;
				var marker = new AMap.Marker({
					
				    icon: "/static/images/nsc_images/dot_0.png",
					//content: div,
		            position: [object.lng,object.lat],
		            //map: map,
		            offset: new AMap.Pixel(-25, -28)
		        });
		       
				marker.id=object.mpoi_id;
				marker.title=object.mpoi_name;
				marker.POIAddress=object.mpoi_address;
				marker.position=[object.lng,object.lat];
				marker.type= object.type;
				marker.errApNum=count;
				marker.addr=address;
				marker.mac=mac;
				marker.content = '<div class ="info">' +
					'<h3>' + object.mpoi_name + '</h3>' +
					'<div><img src="/static/images/nsc_images/p22.png" width="25" height="30" alt="locaicon" />'+marker.POIAddress+'</div>' +
					'<p><b>故障热点：</b>'+count+'个</p>' +
					'<img id="close" src="/static/images/nsc_images/close.png"  onclick="closeInfoindow()"/>';

				if(count<2){
					var  patt1=new RegExp(marker.addr[0]);
					marker.content+='<p><b>方位：</b>';
					if(!patt1.test(marker.POIAddress)){
					    star=marker.addr[0].search("村");
						star2=marker.addr[0].search("镇");
						star3=marker.addr[0].search("街");
						if( star!=-1){marker.content+=address[0].slice(star+1);}//取村的后半部分
						else if (star2!=-1){marker.content+=address[0].slice(star2+1);}//取村的后半部分
						else if (star3!=-1){marker.content+=address[0].slice(star3+1);}//取村的后半部分
						else{marker.content+=address[0];}
					}	
					if(patt1.test(marker.POIAddress)){marker.content+='无详细AP方位';}
					marker.content+='</p>';
					//marker.content+='<p><b>mac : </b><span id ="macLabel">'+mac[0]+'</span></p>';
				}
				else{
					marker.content+='<p><b>方位：</b>';
					var errApPositnCount=0;
					
					for (var i=0;i<address.length;i++){
						var  patt0=new RegExp(marker.addr[i]);
						if(patt0.test(marker.POIAddress)){errApPositnCount++;}
						//var  patt1=new RegExp(marker.addr[i]);
						if( marker.addr[i].search("无详细AP方位")!=-1 &&errApPositnCount<2){errApPositnCount++;}
						}
					if (errApPositnCount>1){
						marker.content+='无详细AP方位</p>';
						//marker.content+='<p><b>mac : </b><select id ="macLabel">';
						//for (var i=0;i<mac.length;i++){
						//	marker.content+='<option>'+mac[i]+'</option>'
						//	}
						//marker.content+='</select></p>';
						}
						//marker.content+='</select></div>';
					if (errApPositnCount<2){
						//console.log(errApPositnCount);
						marker.content+='<select id="ApPosition">'
							for (var i=0;i<address.length;i++){
							var  patt1=new RegExp(marker.addr[i]);
							if(!patt1.test(marker.POIAddress)){
								star=marker.addr[i].search("村");
								star2=marker.addr[i].search("镇");
								star3=marker.addr[i].search("南沙街");
								star4=marker.addr[i].search("珠江街");
								star5=marker.addr[i].search("服务中心");
								star6=marker.addr[i].search("社区");
								//console.log( star);
								if( star!=-1){marker.content+='<option>'+address[i].slice(star+1)+'</option>';}//取村的后半部分
								else if (star2!=-1){marker.content+='<option>'+address[i].slice(star2+1)+'</option>';}//取镇的后半部分
								else if (star3!=-1){marker.content+='<option>'+address[i].slice(star3+3)+'</option>';}//取街的后半部分
								else if (star4!=-1){marker.content+='<option>'+address[i].slice(star4+3)+'</option>';}//取街的后半部分
								else if (star5!=-1){marker.content+='<option>'+address[i].slice(star5+4)+'</option>';}//取街的后半部分
								else if (star6!=-1){marker.content+='<option>'+address[i].slice(star6+2)+'</option>';}//取街的后半部分
								else{marker.content+='<option>'+address[i]+'</option>';}
								}	
							if(patt1.test(marker.POIAddress)){marker.content+='<option>无详细AP方位</option>';}
							}
							//marker.content+='<option>'+address[i]+'</option>';}
						marker.content+='</select></p>';
						//marker.content+='<p><b>mac : </b><span id ="macLabel">'+mac[0]+'</span></p>';
					}	
					
				}
				
				
				marker.on('click', markerClick);
		        marker.on('mouseover', function(e){
		        	e.target.setAnimation("AMAP_ANIMATION_NONE");//AP图标不弹跳	
			    });
				erroMarkers.push(marker);
				
				function markerClick(e) {
					//console.log(e.target.addr);
					//console.log(e.target.POIAddress);


					closeAddPileBox();
					$("#infoWindow").html(e.target.content).show();
					//if (document.getElementById("searchInput").value!="请输入关键字"){document.getElementById("searchInput").value="请输入关键字";}
					/*if (icon && markerOrCluster){
						markerOrCluster.setIcon(icon );
					}
					icon = e.target.getIcon( );
					e.target.setIcon("images/nsc_images/map/newicon/selected.png");*/
					markerOrCluster=e.target;
				}
				
			})
		};
		
		erroMarkersTffy=TAFFY(erroMarkers);
		//var top3 = erroMarkersTffy().order("errApNum desc").limit(3).get();
		//console.log(top3 );
		//document.getElementById("name-of-onlinePepleTop1").innerText=top3[0].title+"   "+":"+"   ";document.getElementById("num-of-peple-onlineTop1").innerText =top3[0].errApNum;
		//document.getElementById("name-of-onlinePepleTop2").innerText =top3[1].title+"   "+":"+"  ";document.getElementById("num-of-peple-onlineTop2").innerText =top3[1].errApNum;
		//document.getElementById("name-of-onlinePepleTop3").innerText =top3[2].title+" "+":"+"   ";document.getElementById("num-of-peple-onlineTop3").innerText =top3[2].errApNum;
		//
		//document.getElementById("topTitle").innerText="故障排行";
		//document.getElementById("top1Label").innerText="个";
		//document.getElementById("top2Label").innerText="个";
		//document.getElementById("top3Label").innerText="个";
		addCluster(erroMarkers);
	
	}	
	//添加在线热点查询
	function queryAPOffLine(){
		ajaxQuest(urllist,"GET",{online:"0"},function(data){
			queryAPOffLineCallback(data.list);	
		});
	}
	
}
function showTypeRanking(){
	
	var series=[],array;
	var numOfGonvern=AllKindMkrTfy({"type":"政府"}).sum("onliPeopleNum");
	var numOfHpt=AllKindMkrTfy({"type":"医院"}).sum("onliPeopleNum");
	var numOfSpm=AllKindMkrTfy({"type":"商超"}).sum("onliPeopleNum");
	var numOfCmp=AllKindMkrTfy({"type":"校区"}).sum("onliPeopleNum");
	var numOfPbl=AllKindMkrTfy({"type":"公共"}).sum("onliPeopleNum");
	var numOfCmpany=AllKindMkrTfy({"type":"企业"}).sum("onliPeopleNum");
	var numOfCnt=AllKindMkrTfy({"type":"餐饮"}).sum("onliPeopleNum");
	var numOfSsght=AllKindMkrTfy({"type":"景区"}).sum("onliPeopleNum");
	var numOfTrfft=AllKindMkrTfy({"type":"车站"}).sum("onliPeopleNum");
	var numOfArp=AllKindMkrTfy({"type":"机场"}).sum("onliPeopleNum");
	var numOfEntt=AllKindMkrTfy({"type":"文娱"}).sum("onliPeopleNum");
	var numOfHtel=AllKindMkrTfy({"type":"宾馆"}).sum("onliPeopleNum");
	
	
	
	if (numOfGonvern!=0){series.push(["政务",numOfGonvern])};
	if (numOfHpt!=0){series.push(["医院",numOfHpt])};
	if (numOfSpm!=0){series.push(["商超",numOfSpm])};
	if (numOfCmp!=0){series.push(["校园",numOfCmp])};
	if (numOfPbl!=0){series.push(["公共",numOfPbl])};
	if (numOfCmpany!=0){series.push(["企业",numOfCmpany])};
	if (numOfCnt!=0){series.push(["餐饮",numOfCnt])};
	if (numOfSsght!=0){series.push(["景区",numOfSsght])};
	if (numOfTrfft!=0){series.push(["车站",numOfTrfft])};
	if (numOfArp!=0){series.push(["机场",numOfArp])};
	if (numOfEntt!=0){series.push(["文娱",numOfEntt])};
	if (numOfHtel!=0){series.push(["宾馆",numOfHtel])};
	function sortNumber(a, b)
	{
	  return b[1] - a[1]
	}
	series.sort(sortNumber);
	console.log(series);

	
	
	console.log(series);
	console.log(AllKindMkrTfy().distinct("type"));
	console.log(AllKindMkrTfy().sum("onliPeopleNum"));
	$('#highChartcontainer').highcharts({
		credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
		series:{
			labels: {
                rotation: 0,
                style: {
                    fontSize: '22px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
		},
        title: {
            text: '各类型场所实时在线人数',
			style:{
				fontSize: '22px',
				color:'#1bbc9b',
				
			}
        },
        
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '22px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
			allowDecimals: false,
            min: 0,
			labels: {
                style: {
                    fontSize: '22px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
            title: {
                text: '人数(个)',
				style:{
				fontSize: '22px',
				
				
			}
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="width:40px;height:30px;fontSize: 20px;">在线人数: <b>{point.y:0.f} 人</b><span>'
        },
        series: [{
            name: 'Population',
            data: series,
            dataLabels: {
                enabled: true,
                rotation: 0,//the  rotation of  label
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.0f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '17px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    })
	
}
function showHighChartErrApTop10() {
	$(".add-pile-box").hide();
	$("#infoWindow").hide();
	 //closeSearchWindow();
	var series=[];

	erroMarkersTffy().order("errApNum desc").limit(10).each(function (r) {
			//console.log(r.title+" "+r.errApNum )
			var data=[r.title,r.errApNum];
			series.push(data);
			});
	console.log(series);	
	openlrgHCrtCntn();
	$("#rankingBtn").hide();
	//$("#rankingBtn").show();
    $('#highChartcontainer').highcharts({
		credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: '故障TOP10',
			style:{
					fontSize: '22px',
					color:'#1bbc9b',	
					}
        },
        
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
			allowDecimals: false,
            min: 0,
            title: {
                text: '故障AP(个)',
				
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="width:40px;height:30px;">故障AP: <b>{point.y:0.f} 个</b><span>'
        },
        series: [{
            name: 'Population',
            data: series,
            dataLabels: {
                enabled: true,
                rotation: 0,//the  rotation of  label
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.0f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    })
    
}
//showTypeRanking();