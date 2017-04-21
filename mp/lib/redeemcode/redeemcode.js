
$(function(){
    // 日期
    $("#expired").datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function(selectedDate) {
            vm.expired = selectedDate;
        }
    });
    // 复制兑换码
    var clipboard = new Clipboard('#clipboard');
    clipboard.on('success', function(){
        alert("本页兑换码已复制到剪贴板");
    });
    clipboard.on('error', function(){
        alert("[复制失败]");
    });
});

var renderList = {
    template: '<tr><td>{{ code.code }}</td><td>{{ code.hours }}小时</td><td>至{{ code.expired }}</td></tr>',
    props: ['code']
};

var ree = new redeemCode();
var vm = new Vue({
    el: '#redeemcode',
    data: {
        hours: 1,
        count: 1,
        expired: GetDateStr(1),
        codeList: [],

        currentPage: 0,
        totalPage: 0,
        jumpPage: '',

        serial: '',
        onePageCodes: ''
    },
    components: {
        'render-list': renderList
    },
    computed: {
        totalExpired: function(){
            return this.expired+" 23:59:59";
        },
        exportCodes: function(){
            var url = (this.serial == '') ? 'javascript:;' : 'http://10.20.1.34:8087/redeemcode/codes.xls?serial='+this.serial;
            return url;
        }
    },
    methods: {
        generateCodes: function(){
            var self = this;
            if(self.count>200){
                alert("兑换码数量超出上限(最多200个)");
                return false;
            }
            ree.createSerial(self.count, self.hours, self.totalExpired, function(data){
                self.serial= data.serial;
                self.pageChange(1);
                self.jumpPage = '';
            });
        },
        pageChange: function(page){
            var self = this;
            ree.generateCodes(self.serial, page, function(data){
                self.renderClipboard(data.codes);
                self.currentPage = data.current_page;
                self.totalPage = data.total_pages;
                self.codeList = data.codes;
            });
        },
        renderClipboard: function(codes){
            for(var i=0, h='', len=codes.length; i<len; i++){
                var code = codes[i];
                h+=code.code + '\t' + code.hours + '小时\t有效期至' + code.expired + '\r\n';
            }
            this.onePageCodes = h;
        }
    }
});