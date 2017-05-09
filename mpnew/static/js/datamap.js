/**
 * Created by JavieChan on 2016/7/23.
 */

var proUrl = '/';

function chartAjax(url, callback, errFunc){
    $.ajax({
        method: "get",
        url: proUrl+'datamap/'+ url,
        data: {location: 77201},
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc();
    });
}
var intPB, intPC, intMem;
var chartFlag=true, chartA, chartB, chartC, xarea, dataOnline,
    onlinePieA=[],
    onlinePieB=[],
    onlinePieC=[],
    onlineLineA=[],
    onlineLineB=[],
    onlineLineC=[],
    area24=[],
    clmn={},
    pieArrB=[];
var colorStep=[
    ['#71cd6f', '#eeb636'],
    ['#5befb2', '#3ec6ff', '#6b8eff'],
    ['#71cd6f', '#e2c966', '#3b97ff', '#b26dff'],
    ['#eb5e2a', '#ec8622', '#b26dff', '#e2d653', '#56e3a9', '#3ec6ff', '#a7e043', '#747eff', '#fff']
];
var pieNames=['热点状态', '各镇街在线人数', '连接终端', '人流预警', '人口密度'];

$(function(){
    // 数据初始化
    var dataOvi = function(){
        chartAjax('overview', function(data){
            if(data.code==200){
                $('.dataOvi table tr:eq(1) td').each(function(i, n){$(n).text(data.ap_count[i]);});
                $('.dataOvi table tr:eq(2) td').each(function(i, n){$(n).text(data.ap_offline_count[i]);});
                $('.dataOvi table tr:eq(3) td').each(function(i, n){$(n).text(data.online[i]);});
                $('.dataOvi table tr:eq(4) td').each(function(i, n){$(n).text(data.traffic[i]);});
                $('.dataOvi table tr:eq(5) td').each(function(i, n){$(n).text(data.app[i]);});
                $('.dataOvi table tr:eq(6) td').each(function(i, n){$(n).text(data.message[i]);});
            }
        });
    };
    dataOvi();

    chartAjax('general', function(data){
        if(data.code==200){
            assignData(data, 0);

            var chartData = data;
            // 村镇排行
            $('#onlineSlimScroll .scrollbar').html(townVillageRank(chartData.town_user_rank));
            // slimScroll
            $('#onlineSlimScroll').slimScroll({height: '536px', width:'270px'});

            // 热点数
            $('.online .blockInfo em:eq(0)').text(chartData.ap_count);
            $('.online .blockInfo em:eq(1)').text(chartData.ap_offline_count);
            $('.online .blockInfo em:eq(2)').text(chartData.total_user);
            $('.online .blockInfo em:eq(3)').text(chartData.online_user);
            $('.online .blockInfo em:eq(4)').text(parseInt(chartData.traffic));

            intMem = setInterval(function(){
                $('.online .blockInfo em:eq(3)').text(randomNum(chartData.online_user-6, chartData.online_user+7));
            }, 5000);
        }
    });

    // 控制演示的最佳尺寸
    perfectSize();

    setInterval(function(){
        dataOvi();
        chartAjax('general', function(data){
            if(data.code==200){
                assignData(data, 0);

                var chartData = data;
                // 村镇排行
                $('#onlineSlimScroll .scrollbar').html(townVillageRank(chartData.town_user_rank));
                // slimScroll
                $('#onlineSlimScroll').slimScroll({height: '536px', width:'270px'});

                // 热点数
                $('.online .blockInfo em:eq(0)').text(chartData.ap_count);
                $('.online .blockInfo em:eq(1)').text(chartData.ap_offline_count);
                $('.online .blockInfo em:eq(2)').text(chartData.total_user);
                $('.online .blockInfo em:eq(3)').text(chartData.online_user);
                $('.online .blockInfo em:eq(4)').text(parseInt(chartData.traffic));

                clearInterval(intMem);
                intMem = setInterval(function(){
                    $('.online .blockInfo em:eq(3)').text(randomNum(chartData.online_user-6, chartData.online_user+7));
                }, 5000);

                if(!$('.block').is(':hidden')){
                    if(chartFlag){
                        chartA.series[0].setData(onlinePieA);
                        chartB.series[0].setData(onlinePieB);
                        chartC.series[0].setData(onlinePieC);
                    }else{
                        chartA.series[0].setData(chartData.ap_online_chart_data.online);
                        chartA.series[1].setData(chartData.ap_online_chart_data.offline);
                        for(var i=0; i<chartB.series.length; i++){
                            chartB.series[i].setData(onlineLineB[i].data);
                        }
                        chartC.series[0].setData(chartData.device_chart_data.android);
                        chartC.series[1].setData(chartData.device_chart_data.ios);
                        chartC.series[2].setData(chartData.device_chart_data.wechat);
                        chartC.series[3].setData(chartData.device_chart_data.pc);
                    }

                    if($('.online .blockChartBottom .asidebtns button.on').index()==0){
                        xarea.series[0].setData(chartData.traffic_chart_data);
                    }else{
                        for(var i=0; i<3; i++){
                            xarea.series[i].setData(clmn.ds[i].data);
                        }
                        xarea.xAxis[0].setCategories(clmn.towns);
                    }
                }
            }
        });
    }, 120000);

    // highcharts
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    var optionChart = {
        optionPie: function(id, data, color, title, unit, loadFunc){
            var options = {
                chart: {
                    renderTo: id,
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 15
                    },
                    backgroundColor: 'transparent',
                    style: {
                        color: '#fff'
                    },
                    events: {
                        load: function(){
                            if(typeof(loadFunc)=="function") loadFunc(this);
                        }
                    }
                },
                title: {
                    text: title,
                    style: {
                        fontSize: '14px',
                        color: '#c3f1f7'
                    }
                },
                colors: color,
                credits:{
                    enabled: false
                },
                legend: {
                    itemStyle: {
                        fontSize: '16px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '16px',
                        fontWeight: 'normal'
                    },
                    symbolRadius: 6,
                    symbolWidth: 12,
                    symbolHeight: 12
                },
                tooltip: {
                    formatter: function(){
                        return this.key+': '+this.y+unit;
                    }
                },
                plotOptions: {
                    pie: {
                        //innerSize: 100,
                        allowPointSelect: true,   // 可选中
                        depth: 25,
                        showInLegend: true,    // 显示legend
                        borderWidth: 0,
                        point: {
                            events: {
                                click: function () {
                                    if(this.options.url)
                                        location.href = this.options.url;
                                }
                            }
                        }
                    },
                    series: {
                        dataLabels: {
                            align: 'center',
                            color: '#fff',
                            style: {
                                fontSize: '18px',
                                fontWeight: 'normal'
                            },
                            format: '{y}'+unit,
                            distance: 1
                        }
                    }
                },
                series: [{
                    data: data
                }]
            };
            return options;
        },
        optionPieMore: function(id, data, color, title, unit, loadFunc){
            var options = {
                chart: {
                    renderTo: id,
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 15
                    },
                    backgroundColor: 'transparent',
                    style: {
                        color: '#fff'
                    },
                    events: {
                        load: function(){
                            if(typeof(loadFunc)=="function") loadFunc(this);
                        }
                    }
                },
                title: {
                    text: title,
                    style: {
                        fontSize: '14px',
                        color: '#c3f1f7'
                    }
                },
                colors: color,
                credits:{
                    enabled: false
                },
                legend: {
                    itemWidth: 75,
                    itemStyle: {
                        fontSize: '12px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '12px',
                        fontWeight: 'normal'
                    },
                    symbolRadius: 4,
                    symbolWidth: 8,
                    symbolHeight: 8
                },
                tooltip: {
                    formatter: function(){
                        return this.key+': '+this.y+unit;
                    }
                },
                plotOptions: {
                    pie: {
                        //innerSize: 100,
                        allowPointSelect: true,   // 可选中
                        depth: 25,
                        showInLegend: true,    // 显示legend
                        borderWidth: 0,
                        point: {
                            events: {
                                click: function () {
                                    if(this.options.url)
                                        location.href = this.options.url;
                                }
                            }
                        }
                    },
                    series: {
                        dataLabels: {
                            align: 'center',
                            color: '#fff',
                            style: {
                                fontSize: '14px',
                                fontWeight: 'normal'
                            },
                            format: '{y}'+unit,
                            distance: 1
                        }
                    }
                },
                series: [{
                    data: data
                }]
            };
            return options;
        },
        optionArea: function(id, data){
            var options = {
                chart: {
                    type: 'area',
                    renderTo: id,
                    backgroundColor: 'transparent',
                    spacing: [20, 20, 20, 20]
                },
                title: {
                    text: '用户流量统计',
                    style: {
                        color: '#dffeff',
                        fontSize: '16px'
                    },
                    align: 'left'
                },
                credits:{
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function(){
                        return '<b>'+this.x+':00</b><br />'+this.series.name+': '+this.y+'M/H';
                    }
                },
                xAxis: {
                    minPadding:0,
                    maxPadding:0,
                    allowDecimals: false,
                    labels: {
                        //formatter: function () {
                        //    return this.value / 1000; // clean, unformatted number for year
                        //},
                        format: '{value}:00',
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    tickWidth: 0,
                    lineColor: '#fff'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        format: '{value}M/H',
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    gridLineWidth: 0,
                    tickWidth: 0,
                    lineWidth: 1,
                    lineColor: '#fff'
                },
                plotOptions: {
                    area: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: data
            };
            return options;
        },
        optionLine: function(id, data, title, unit, loadFunc){
            var option = {
                chart: {
                    renderTo: id,
                    type: 'spline',
                    backgroundColor: 'transparent',
                    spacing: [10, 20, 5, 20],
                    animation: Highcharts.svg, // don't animate in old IE
                    events: {
                        load: function(){
                            if(typeof(loadFunc)=="function") loadFunc(this);
                        }
                    }
                },
                title: {
                    text: title,
                    style: {
                        fontSize: '14px',
                        color: '#c3f1f7'
                    }
                },
                credits:{
                    enabled: false
                },
                legend: {
                    itemStyle: {
                        fontSize: '16px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '16px',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    formatter: function(){
                        return '<b>'+this.x+':00</b><br />'+this.series.name+': '+this.y+unit;
                        //return '<b>'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)+'</b><br />'+this.series.name+': '+this.y+'人';
                    }
                },
                xAxis: {
                    //type: 'datetime',   // 测试
                    allowDecimals: false,  // 不能为小数
                    labels: {
                        format: '{value}:00',
                        style: {
                            color: '#fff',
                            fontSize: '14px'
                        }
                    },
                    tickWidth: 0,
                    lineColor: '#fff'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineWidth: 0,
                    tickWidth: 0,
                    lineWidth: 1,
                    lineColor: '#fff'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: data
            };
            return option;
        },
        optionLineMore: function(id, data, title, unit, loadFunc){
            var option = {
                chart: {
                    renderTo: id,
                    type: 'spline',
                    backgroundColor: 'transparent',
                    spacing: [10, 20, 5, 20],
                    animation: Highcharts.svg, // don't animate in old IE
                    events: {
                        load: function(){
                            if(typeof(loadFunc)=="function") loadFunc(this);
                        }
                    }
                },
                title: {
                    text: title,
                    style: {
                        fontSize: '14px',
                        color: '#c3f1f7'
                    }
                },
                credits:{
                    enabled: false
                },
                legend: {
                    itemWidth: 80,
                    itemStyle: {
                        fontSize: '12px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '12px',
                        fontWeight: 'normal'
                    },
                    symbolWidth: 10
                },
                tooltip: {
                    formatter: function(){
                        return '<b>'+this.x+':00</b><br />'+this.series.name+': '+this.y+unit;
                        //return '<b>'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)+'</b><br />'+this.series.name+': '+this.y+'人';
                    }
                },
                xAxis: {
                    //type: 'datetime',   // 测试
                    allowDecimals: false,  // 不能为小数
                    labels: {
                        format: '{value}:00',
                        style: {
                            color: '#fff',
                            fontSize: '12px'
                        }
                    },
                    tickWidth: 0,
                    lineColor: '#fff'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineWidth: 0,
                    tickWidth: 0,
                    lineWidth: 1,
                    lineColor: '#fff'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: data
            };
            return option;
        },
        optionLineX: function(id, data){
            var option = {
                chart: {
                    renderTo: id,
                    type: 'spline',
                    backgroundColor: 'transparent',
                    spacing: [20, 20, 20, 20],
                    animation: Highcharts.svg // don't animate in old IE
                },
                title: {
                    text: '各镇连接人数实时统计',
                    style: {
                        color: '#dffeff',
                        fontSize: '14px'
                    },
                    align: 'left'
                },
                credits:{
                    enabled: false
                },
                legend: {
                    itemStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    formatter: function(){
                        return this.series.name+': '+this.y+'人';
                        //return '<b>'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)+'</b><br />'+this.series.name+': '+this.y+'人';
                    }
                },
                xAxis: {
                    allowDecimals: false,  // 不能为小数
                    labels: {
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    tickWidth: 0,
                    lineColor: '#fff'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    gridLineWidth: 0,
                    tickWidth: 0,
                    lineWidth: 1,
                    lineColor: '#fff'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: data
            };
            return option;
        },
        optionColumn: function(id, data){
            var option={
                chart: {
                    renderTo: id,
                    type: 'column',
                    backgroundColor: 'transparent',
                    spacing: [20, 20, 20, 20]
                },
                title: {
                    text: '各镇连接人数实时统计',
                    style: {
                        color: '#dffeff',
                        fontSize: '14px'
                    },
                    align: 'left'
                },
                credits:{
                    enabled: false
                },
                legend: {
                    itemStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal'
                    },
                    itemHoverStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:14px;line-height:2">{point.key}</span><table style="font-size:14px">',
                    pointFormat: '<tr><td style="color:{series.color}">{series.name}: </td>' +
                    '<td style="padding-left:10px"><b>{point.y} 人</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                xAxis: {
                    //categories: [
                    //    '黄阁镇',
                    //    '万顷沙镇',
                    //    '珠江街',
                    //    '龙穴街',
                    //    '榄核镇',
                    //    '横沥镇',
                    //    '东涌镇',
                    //    '南沙街',
                    //    '大岗镇'
                    //],
                    categories: data.towns,
                    labels: {
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    crosshair: true,   // 定义十字准线
                    tickWidth: 0,
                    lineColor: '#fff'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        style: {
                            color: '#dffeff',
                            fontSize: '16px'
                        }
                    },
                    gridLineWidth: 0,
                    tickWidth: 0,
                    lineWidth: 1,
                    lineColor: '#fff'
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                //series: [{
                //    name: '昨天',
                //    color: colorStep[3][5],
                //    data: [48, 38, 39, 41, 47, 48, 59, 59, 52]
                //}, {
                //    name: '当前',
                //    color: colorStep[3][6],
                //    data: [83, 78, 98, 93, 106, 84, 105, 104, 91]
                //}, {
                //    name: '历史最高',
                //    color: colorStep[3][4],
                //    data: [49, 71, 106, 129, 144, 176, 135, 148, 216]
                //}]
                series: data.ds
            };
            return option;
        }
    };

    // 下拉
    $(document).on('click', 'header span button', function(){
        if($('.block').is(':hidden')){
            //$(this).addClass('on');
            $('.blockCtx').hide();
            $('.blockCtx:eq(0)').show();
            $('.blockNavBtns button:eq(0)').addClass('on').siblings().removeClass('on');
            $('.blockChartBottom .asidebtns button:eq(1)').addClass('on').siblings().removeClass('on');
            $('.mapbtn').html('热点地图');
            $('.block').slideDown(500);

            chartA = new Highcharts.Chart(optionChart.optionPie("onlinePieA", onlinePieA, colorStep[0], pieNames[0], '个'));
            chartB = new Highcharts.Chart(optionChart.optionPieMore("onlinePieB", onlinePieB, colorStep[3], pieNames[1], '人', loadPieB));
            chartC = new Highcharts.Chart(optionChart.optionPie("onlinePieC", onlinePieC, colorStep[2], pieNames[2], '%'));
            xarea = new Highcharts.Chart(optionChart.optionColumn("Xline", clmn));
        }else{
            clearInterval(intMem);
            clearInterval(intPB);
            $('.mapbtn').html('<i class="dataIco"></i>数据统计');
            $('.block').slideUp(500);
        }
    });

    // 统计图触发下拉
    $(document).on('click', '.dataOvi h3', function(){
        $('.blockCtx').hide();
        $('.blockCtx:eq(0)').show();
        $('.blockNavBtns button:eq(0)').addClass('on').siblings().removeClass('on');
        $('.blockChartBottom .asidebtns button:eq(1)').addClass('on').siblings().removeClass('on');
        $('.mapbtn').html('热点地图');
        $('.block').slideDown(500);

        chartA = new Highcharts.Chart(optionChart.optionPie("onlinePieA", onlinePieA, colorStep[0], pieNames[0], '个'));
        chartB = new Highcharts.Chart(optionChart.optionPieMore("onlinePieB", onlinePieB, colorStep[3], pieNames[1], '人', loadPieB));
        chartC = new Highcharts.Chart(optionChart.optionPie("onlinePieC", onlinePieC, colorStep[2], pieNames[2], '%'));
        xarea = new Highcharts.Chart(optionChart.optionColumn("Xline", clmn));
    });

    // 切换tab
    $(document).on('click', '.blockNavBtns button', function(){
        if($(this).hasClass('on')){return false;}
        var idx=$(this).index(), $ht=$(this).html();
        if(idx>0){msgBox("此模块开发中...");}
        chartFlag=true;
        $(this).addClass('on').siblings().removeClass('on');
        $('.changeChart').text('切换坐标');
        $('.blockChartBottom .btn:eq(1)').addClass('on').siblings().removeClass('on');
        $('.blockTab h2').html($ht);
        $('.blockCtx').hide().eq(idx).show();
        if(idx==0){
            $('.msgbox').hide();
            chartA = new Highcharts.Chart(optionChart.optionPie("onlinePieA", onlinePieA, colorStep[0], pieNames[0], '个'));
            chartB = new Highcharts.Chart(optionChart.optionPieMore("onlinePieB", onlinePieB, colorStep[3], pieNames[1], '人', loadPieB));
            chartC = new Highcharts.Chart(optionChart.optionPie("onlinePieC", onlinePieC, colorStep[2], pieNames[2], '%'));
            xarea = new Highcharts.Chart(optionChart.optionColumn("Xline", clmn));
        }
    });

    // 切换图表
    $(document).on('click', '.online .blockChartTop .changeChart', function(){
        if(chartFlag){
            clearInterval(intMem);
            clearInterval(intPB);
            clearInterval(intPC);
            $(this).text("切换饼图");
            chartA = new Highcharts.Chart(optionChart.optionLine("onlinePieA", onlineLineA, pieNames[0], '个'));
            chartB = new Highcharts.Chart(optionChart.optionLineMore("onlinePieB", onlineLineB, pieNames[1], '人'));
            chartC = new Highcharts.Chart(optionChart.optionLine("onlinePieC", onlineLineC, pieNames[2], '台'));
            chartFlag=false;
        }else{
            $(this).text("切换坐标");
            chartA = new Highcharts.Chart(optionChart.optionPie("onlinePieA", onlinePieA, colorStep[0], pieNames[0], '个'));
            chartB = new Highcharts.Chart(optionChart.optionPieMore("onlinePieB", onlinePieB, colorStep[3], pieNames[1], '人', loadPieB));
            chartC = new Highcharts.Chart(optionChart.optionPie("onlinePieC", onlinePieC, colorStep[2], pieNames[2], '%'));
            chartFlag=true;
        }
    });

    // 切换人数统计/流量统计
    $(document).on('click', '.online .blockChartBottom .asidebtns button', function(){
        if($(this).hasClass('on')){return false;}
        $(this).addClass('on').siblings().removeClass('on');
        var idx=$(this).index();
        if(idx==0){
            xarea = new Highcharts.Chart(optionChart.optionArea("Xline", area24));
        }else{
            xarea = new Highcharts.Chart(optionChart.optionColumn("Xline", clmn));
        }
    });

    // 切换村镇
    $(document).on('click', '.townVillage button', function(){
        $(this).addClass('on').siblings().removeClass('on');
        var idx = $(this).index();
        $(this).parents('.blockRank').find('.slimScroll ul').hide();
        $(this).parents('.blockRank').find('.slimScroll ul').eq(idx).show();
    });
    $(document).on('mouseenter', '.slimScroll .fst', function(){
        $(this).prepend('<i class="clickIco"></i>').siblings().find('.clickIco').remove();
    });
    $(document).on('click', '.slimScroll .fst', function(){
        if($(this).next('.sec').is(':hidden')){
            $('.sec').slideUp();
            $(this).next('.sec').slideDown();
        }else{
            $(this).next('.sec').slideUp();
        }
    });

    // 窗口重置
    window.onresize = function(){
        perfectSize();
        if(!$('.block').is(":hidden")){
            chartA.reflow();
            chartB.reflow();
            chartC.reflow();
        }
    };

    // 分配数据
    function assignData(chartData, idx){
        onlinePieA=[];
        onlinePieB=[];
        onlinePieC=[];
        onlineLineA=[];
        onlineLineB=[];
        onlineLineC=[];
        area24=[];
        $('.slimScroll ul li').remove();
        if(idx==0){
            // chart-data
            var aa=chartData.ap_online_status.online_count,
                bb=chartData.ap_online_status.offline_count,
                mss=chartData.device_status.message_count,
                wx=chartData.device_status.wechat_count,
                app=chartData.device_status.app_count;
            $.each(chartData.town_conns_status, function(k, v){
                pieArrB.push(v);
                onlinePieB.push([k, v]);
            });
            onlinePieA.push(["在线", aa], ["离线", bb]);
            var ho=mss+wx+app;
            onlinePieC.push(['短信', parseInt(mss/ho*100)], ['微信', parseInt(wx/ho*100)], ['APP', 100-(parseInt(mss/ho*100)+parseInt(wx/ho*100))]);
            onlineLineA.push({
                name: '在线',
                color: colorStep[0][0],
                data: chartData.ap_online_chart_data.online
            },
            {
                name: '离线',
                color: colorStep[0][1],
                data: chartData.ap_online_chart_data.offline
            });
            var ee=[], ff=[];
            $.each(chartData.town_conns_chart_data, function(k, v){
                ee.push(k);
                ff.push(v);
            });
            for(var i=0; i<ee.length; i++){
                onlineLineB.push({
                    name: ee[i],
                    color: colorStep[3][i],
                    data: ff[i]
                })
            }
            onlineLineC.push({
                name: '短信',
                color: colorStep[2][0],
                data: chartData.device_chart_data.message
            },{
                name: '微信',
                color: colorStep[2][1],
                data: chartData.device_chart_data.wechat
            },{
                name: 'APP',
                color: colorStep[2][2],
                data: chartData.device_chart_data.app
            });
            area24.push({
                name: '用户流量',
                color: '#276089',
                lineColor: '#00f6ff',
                data: chartData.traffic_chart_data
            });
            var a=[], b=[], c=[], t=[];
            $.each(chartData.town_conns, function(i, n){
                $.each(n, function(k, v){
                    t.push(k);
                    a.push(v[0]);
                    b.push(v[1]);
                    c.push(v[2]);
                })
            });
            clmn.towns=t;
            clmn.ds=[{
                name: '当前',
                color: colorStep[3][5],
                data: b
            }, {
                name: '昨天最高',
                color: colorStep[3][6],
                data: a
            }, {
                name: '历史最高',
                color: colorStep[3][4],
                data: c
            }];
        }
    }
});

// 最佳尺寸
function perfectSize(){
    var $height = $(window).height()-60;
    var $perH = $height>826 ? $height : 826;
    var $chartH = Math.floor(($perH-70-44-10)/2);
    $('.block').css({'height': $perH+'px'});
    $('.blockChartTop, .blockChartBottom, .htq').css({'height': $chartH+'px'})
}

// 村镇排行
function townVillageRank(town){
    for(var i=0, rank='', rankVillage=''; i<town.length; i++){
        var r=town[i];
        rank+='<div class="fst"><span title="'+r.name+'">'+r.name+'</span><em>'+r.conns+'</em></div>';
        rankVillage='<div class="sec">';
        for(var j= 0; j<r.villages.length; j++){
            var k=r.villages[j];
            rankVillage+='<div><span>'+k[0]+'</span><em>'+k[1]+'</em></div>';
        }
        rankVillage+='</div>';
        rank+=rankVillage;
    }
    return rank;
}

// 随机数据
function randomNum(min, max){
    var range = max-min;
    var rand = Math.random();
    var num = min+Math.ceil(rand*range);
    return num;
}

// pie随机数据
function loadPieB(tis){
    var series = tis.series[0];
    intPB = setInterval(function(){
        var data=[],pie=[];
        $.each(pieArrB, function(i, n){
            pie.push(randomNum(n+1, n+3));
        });
        $.each(onlinePieB, function(i, n){
            data.push([n[0], pie[i]]);
        });
        series.setData(data);
    }, 3000);
}