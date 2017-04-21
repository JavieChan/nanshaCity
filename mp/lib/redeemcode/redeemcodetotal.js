
$(function(){
    // 日期
    $("#start").datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function(selectedDate) {
            $("#end").datepicker("option", "minDate", selectedDate);
            vm.start = selectedDate;
        }
    });
    $("#end").datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function(selectedDate) {
            $("#start").datepicker("option", "maxDate", selectedDate);
            vm.end = selectedDate;
        }
    });
});

var renderList = {
    template: '<tr><td>{{ code.operator }}</td><td>{{ code.total }}</td><td>{{ code.used }}</td><td>{{ code.usable }}</td><td>{{ code.expired }}</td></tr>',
    props: ['code']
};

var ree = new redeemCode();
var vm = new Vue({
    el: '#redeemcodetotal',
    data: {
        start: GetDateStr(-1),
        end: GetDateStr(1),
        operator: '',
        operatorOptions: {

        },
        total: '',
        used: '',
        usable: '',
        expired: '',
        codeList: [],

        currentPage: 0,
        totalPage: 0,
        jumpPage: ''
    },
    components: {
        'render-list': renderList
    },
    computed: {
        totalStart: function(){
            return this.start+" 00:00:00";
        },
        totalEnd: function(){
            return this.end+" 23:59:59";
        }
    },
    mounted: function(){
        var self = this;
        ree.getOperatorAndList(self.totalStart, self.totalEnd, self.operator, 1, function(data){
            self.currentPage = data.current_page;
            self.totalPage = data.total_pages;
            self.codeList = data.table_payload.datas;
        });
    },
    methods: {
        pageChange: function(page){
            var self = this;
            ree.getOperatorAndList(self.totalStart, self.totalEnd, self.operator, page, function(data){
                self.currentPage = data.current_page;
                self.totalPage = data.total_pages;
                self.codeList = data.table_payload.datas;
            });
        }
    }
});