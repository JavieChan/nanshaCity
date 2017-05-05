
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
        operatorOptions: [
            {text: '全部', value: ''}
        ],
        codeList: [],

        currentPage: 1,
        totalPage: 1,
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
        },
        total: function(){
            var self = this;
            var sum = 0;
            if(self.codeList.length>0){
                $.each(self.codeList, function(i, n){
                    sum += n.total;
                });
            }
            return sum;
        },
        used: function(){
            var self = this;
            var sum = 0;
            if(self.codeList.length>0){
                $.each(self.codeList, function(i, n){
                    sum += n.used;
                });
            }
            return sum;
        },
        usable: function(){
            var self = this;
            var sum = 0;
            if(self.codeList.length>0){
                $.each(self.codeList, function(i, n){
                    sum += n.usable;
                });
            }
            return sum;
        },
        expired: function(){
            var self = this;
            var sum = 0;
            if(self.codeList.length>0){
                $.each(self.codeList, function(i, n){
                    sum += n.expired;
                });
            }
            return sum;
        }
    },
    mounted: function(){
        var self = this;

        ree.getOperatorAndList(self.totalStart, self.totalEnd, self.operator, 1, function(data){
            self.currentPage = data.table_payload.current_page;
            self.totalPage = data.table_payload.total_pages;
            self.codeList = data.table_payload.datas;
            $.each(data.operators, function(i,n){
                var op = {text: n, value: n};
                self.operatorOptions.push(op);
            });
        });
    },
    methods: {
        changeFilter: function(){
            var self = this;
            self.pageChange(1);
            self.jumpPage = '';
        },
        pageChange: function(page){
            var self = this;
            ree.getOperatorAndList(self.totalStart, self.totalEnd, self.operator, page, function(data){
                self.currentPage = data.table_payload.current_page;
                self.totalPage = data.table_payload.total_pages;
                self.codeList = data.table_payload.datas;
            });
        }
    }
});