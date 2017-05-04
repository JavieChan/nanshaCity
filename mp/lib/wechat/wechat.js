$(function(){
    $('#changeWechatBtn').on('click', function(){
        console.log(2);
        $('#modalChangeWechat').modal('open');
    });
});

var renderList = {
    template: '<tr>\
        <td><input type="checkbox" class="wechat-checkbox" /></td>\
        <td>{{ promote.wechat_id }}</td>\
        <td>{{ promote.nickname }}</td>\
        <td>{{ promote.account }}</td>\
        <td>{{ promote.password }}</td>\
        <td><img :src="promote.image_uri" /></td>\
        <td><span class="edit">编辑</span><span class="use" v-show="!promote.status">应用</span><span class="using" v-show="promote.status">已用</span><span class="delete">删除</span></td>\
    </tr>',
    props: ['promote'],
    data: function(){
        return {
        }
    },
    methods: {

    }
};

var wcr = new wechatRequest();
var vm = new Vue({
    el: '#promote',
    data: {
        haspromote: false,
        using: {
            wechatId: 'fulijun',
            nickname: '福利君',
            account: '18897654321',
            password: 'woshimima',
            qrcode: '/static/images/QRcode.jpg'
        },

        promoteList: []
    },
    components: {
        'render-list': renderList
    },
    mounted: function(){
        var self = this;
        self.getUsingPromote();
        self.getPromotes();
    },
    methods: {
        getUsingPromote: function(){
            var self = this;
            wcr.getUsingWxpromote(function(data){
                if(data.wechat.length>0){
                    var wechat = data.wechat;

                    self.haspromote = true;
                    self.using = {
                        wechatId: wechat.wechat_id,
                        nickname: wechat.nickname,
                        account: wechat.account,
                        password: wechat.password,
                        qrcode: wechat.image_url
                    }
                }
            });
        },
        getPromotes: function(){
            var self = this;
            wcr.getWxpromote(function(data){
                self.promoteList = data.wechat_list;
            });
        }
    }
});