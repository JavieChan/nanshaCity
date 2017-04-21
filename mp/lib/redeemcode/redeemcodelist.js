
$(function(){
});

var renderList = {
    template: '<tr><td>{{ code.code }}</td><td>{{ code.hours }}小时</td><td>至{{ code.expired }}</td><td>{{ code.created_time }}</td><td>{{ statusType }}</td></tr>',
    props: ['code'],
    computed: {
        statusType: function(){
            var _status = '';
            switch (this.code.status){
                case 0:
                    _status = '待兑换';break;
                case 1:
                    _status = '已兑换';break;
                case 2:
                    _status = '过期未兑换';break;
                default:
                    _status = '';
            }
            return _status;
        }
    }
};

var ree = new redeemCode();
var vm = new Vue({
    el: '#redeemcodelist',
    data: {
        codeStatus: '',
        codeList: [],

        currentPage: 1,
        totalPage: 1,
        jumpPage: ''
    },
    components: {
        'render-list': renderList
    },
    mounted: function(){
        var self = this;
        self.pageChange(1);
    },
    methods: {
        selectStatusCodes: function(){
            var self = this;
            self.pageChange(1);
            self.jumpPage = '';
        },
        pageChange: function(page){
            var self = this;
            ree.getCodeList(self.codeStatus, page, function(data){
                self.currentPage = data.current_page;
                self.totalPage = data.total_pages;
                self.codeList = data.codes;
            });
        }
    }
});