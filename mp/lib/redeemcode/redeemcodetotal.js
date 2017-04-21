
$(function(){
    // 日期
    $("#start").datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function(selectedDate) {
            vm.start = selectedDate;
        }
    });
    $("#end").datepicker({
        dateFormat: 'yy-mm-dd',
        onClose: function(selectedDate) {
            vm.end = selectedDate;
        }
    });
});

var renderList = {
    template: '<tr><td>{{ code.operator }}</td><td>{{ code.total }}</td><td>{{ code.used }}</td><td>{{ code.usable }}</td><td>{{ code.expired }}</td></tr>',
    props: ['code']
};

var vm = new Vue({
    el: '#redeemcodetotal',
    data: {
        start: GetDateStr(-1),
        end: GetDateStr(1),
        operator: '',
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
    methods: {
        pageChange: function(page){

        }
    }
});