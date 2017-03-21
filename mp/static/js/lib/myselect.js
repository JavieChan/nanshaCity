/**
 * Created by JavieChan on 2016/3/11.
 * Updated by JavieChan on 2016/10/25.
 */

;(function($){
    var deThis;
    var fn = function(ele, option){
        this.element = ele;
        this.list = '';
        this.autoSelect = '.autoSelect';
        this.default = {
            height: 40,
            autoid: false
        };
        this.settings = $.extend({}, this.default, option);
    };

    fn.prototype.init = function(){
        var self = this;
        self.reHtml();
        self.ajaxData();
        self.handleClick();
        self.handleSelect();
    };

    fn.prototype.reHtml = function(){
        var self = this;
        self.element.each(function(i, n){
            var text = $(n).text();
            $(n).html('<em>'+text+'</em>');
        });
    };

    fn.prototype.handleClick = function(){
        var self = this;
        self.element.on('click', function(e){
            e.stopPropagation();
            deThis = $(this);

            var op = $(this).offset();
            $(self.autoSelect).css({'top': op.top+32+'px', 'left': op.left+'px'}).show();
            if(self.settings.autoid){
                $(self.autoSelect).attr('id', self.element.attr('id')+'_myselect');
            }else{
                $(self.autoSelect).attr('id', '');
            }
        });

        $('body, html').on('click', function(){
            $(self.autoSelect).hide();
        });
    };

    fn.prototype.handleSelect = function(){
        var self = this;
        $(document).on('click', '.autoSelect .select_item', function(){
            var locate=$(this).attr('data-locate'),
                name=$(this).attr('data-bind-name');

            deThis.find('em').text(name);
            deThis.attr('title', name);
            deThis.attr('data-locate', locate);

            $(self.autoSelect).hide();
        });
    };

    fn.prototype.ajaxData = function(){
        var self = this;
        if(self.list==''){
            //self.list={
            //    "code": 200,
            //    "resources": [
            //        {
            //            "_location": "23,15914",
            //            "name": "女校专网",
            //            "type_id": 2,
            //            "address": "番禺女校",
            //            "logo": "",
            //            "id": "15914"
            //        },
            //        {
            //            "_location": "33,13971",
            //            "name": "迎宾楼",
            //            "type_id": 2,
            //            "address": "资讯科技园",
            //            "logo": "",
            //            "id": "13971"
            //        },
            //        {
            //            "_location": "48,10000",
            //            "name": "演示1",
            //            "type_id": 2,
            //            "address": "广州市南沙区",
            //            "logo": "",
            //            "id": "10000"
            //        },
            //        {
            //            "_location": "48,10001",
            //            "name": "演示2",
            //            "type_id": 2,
            //            "address": "广州市南沙区",
            //            "logo": "",
            //            "id": "10001"
            //        },
            //        {
            //            "_location": "48,50001",
            //            "name": "信锐测试",
            //            "type_id": 2,
            //            "address": "信锐测试",
            //            "logo": "",
            //            "id": "50001"
            //        },
            //        {
            //            "_location": "48,50382",
            //            "name": "测试001",
            //            "type_id": 2,
            //            "address": "测试地址",
            //            "logo": "",
            //            "id": "50382"
            //        },
            //        {
            //            "_location": "48,50385",
            //            "name": "测试002",
            //            "type_id": 2,
            //            "address": "测试地址",
            //            "logo": "",
            //            "id": "50385"
            //        },
            //        {
            //            "_location": "48,50394",
            //            "name": "测试003",
            //            "type_id": 2,
            //            "address": "测试地址",
            //            "logo": "",
            //            "id": "50394"
            //        },
            //        {
            //            "_location": "48,50400",
            //            "name": "测试004",
            //            "type_id": 2,
            //            "address": "测试地址",
            //            "logo": "",
            //            "id": "50400"
            //        },
            //        {
            //            "_location": "51,10002",
            //            "name": "无线城市",
            //            "type_id": 2,
            //            "address": "None",
            //            "logo": "",
            //            "id": "10002"
            //        },
            //        {
            //            "_location": "51,10003",
            //            "name": "政务网",
            //            "type_id": 2,
            //            "address": "None",
            //            "logo": "",
            //            "id": "10003"
            //        },
            //        {
            //            "_location": "51,16557",
            //            "name": "",
            //            "type_id": 2,
            //            "address": "",
            //            "logo": "",
            //            "id": "16557"
            //        },
            //        {
            //            "_location": "51,16794",
            //            "name": "",
            //            "type_id": 2,
            //            "address": "",
            //            "logo": "",
            //            "id": "16794"
            //        },
            //        {
            //            "_location": "54,10016",
            //            "name": "白云区",
            //            "type_id": 2,
            //            "address": "广州白云区",
            //            "logo": "",
            //            "id": "10016"
            //        },
            //        {
            //            "_location": "54,10041",
            //            "name": "水桥街53号",
            //            "type_id": 2,
            //            "address": "广州市南沙区南横村水桥街53号",
            //            "logo": "",
            //            "id": "10041"
            //        },
            //        {
            //            "_location": "54,10162",
            //            "name": "十二道酒店",
            //            "type_id": 2,
            //            "address": "南沙区",
            //            "logo": "",
            //            "id": "10162"
            //        },
            //        {
            //            "_location": "54,10179",
            //            "name": "番禺大石镇",
            //            "type_id": 2,
            //            "address": "广州市番禺区大石镇",
            //            "logo": "",
            //            "id": "10179"
            //        },
            //        {
            //            "_location": "54,10310",
            //            "name": "小杜婶婶",
            //            "type_id": 2,
            //            "address": "广州市番禺区大石镇（小杜婶婶）",
            //            "logo": "",
            //            "id": "10310"
            //        },
            //        {
            //            "_location": "54,14159",
            //            "name": "水桥街59号",
            //            "type_id": 2,
            //            "address": "南横村水桥二街59号",
            //            "logo": "",
            //            "id": "14159"
            //        },
            //        {
            //            "_location": "6,12698",
            //            "name": "中科院",
            //            "type_id": 2,
            //            "address": "广州市南沙区环市大道南2号香港科大霍英东研究院3F",
            //            "logo": "",
            //            "id": "12698"
            //        },
            //        {
            //            "_location": "66,29475",
            //            "name": "广州市白云无线城市",
            //            "type_id": 2,
            //            "address": "广州市白云区",
            //            "logo": "None",
            //            "id": "29475"
            //        },
            //        {
            //            "_location": "75,29616",
            //            "name": "默认资源",
            //            "type_id": 2,
            //            "address": "测试地址",
            //            "logo": "",
            //            "id": "29616"
            //        },
            //        {
            //            "_location": "78,29619",
            //            "name": "289孵化器",
            //            "type_id": 2,
            //            "address": "收的的",
            //            "logo": "",
            //            "id": "29619"
            //        },
            //        {
            //            "_location": "81,29613",
            //            "name": "默认资源",
            //            "type_id": 2,
            //            "address": "测试",
            //            "logo": "",
            //            "id": "29613"
            //        },
            //        {
            //            "_location": "84,29946",
            //            "name": "产业园",
            //            "type_id": 2,
            //            "address": "广州市天河区黄埔大道",
            //            "logo": "",
            //            "id": "29946"
            //        }
            //    ]
            //};self.generateHtml(self.renderResult(self.list));
            $.getJSON("/resources/list",function(data){
                if(data.code==200){
                    self.list = data;
                    self.generateHtml(self.renderResult(self.list));
                }
            });
        }else{
            self.generateHtml(self.renderResult(self.list));
        }
    };

    fn.prototype.generateHtml = function(html){
        var self = this;
        var d = '<div class="autoSelect"><div class="autoOption">'+html+'</div></div>';
        if(!($('.autoSelect').length>0)){
            $('body').append(d);
        }else{
            return false;
        }
    };

    fn.prototype.renderResult = function(data){
        var self = this;
        var result = '';
        data.resources.map(function(item){
            result += self.resultItems(item);
        });
        return result;
    };

    fn.prototype.resultItems = function(item){
        return '<div class="select_item" data-locate="'+ item._location +'" data-bind-id="'+ item.id +'" data-bind-name="'+ item.name +'">'+ item.id + ' / ' + item.name +'</div>';
    };

    $.fn.mySelect = function(option){
        var selectpart = new fn(this, option);
        return selectpart.init();
    };
})(jQuery);