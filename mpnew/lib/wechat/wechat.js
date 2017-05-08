$(function(){
    $(document).on('click', '#modalWechat, #modalWechat .closed', function(){
        vm.nowIndex = -1;
        $('#modalWechat').modal('closed');
    });
    $(document).on('click', '#modalChangeWechat, #modalChangeWechat .closed', function(){
        $('#modalChangeWechat').modal('closed');
    });
});

var wcr = new wechatRequest();
var vm = new Vue({
    el: '#promote',
    data: {
        haspromote: false,
        using: {
            wechatId: '',
            nickname: '',
            account: '',
            password: '',
            qrcode: ''
        },

        promoteList: [],
        nowIndex: -1,
        editStatus: false,

        checkGroup: []
    },
    mounted: function(){
        var self = this;
        self.getUsingPromote();
        self.getPromotes();
    },
    computed: {
        editArr: function(){
            if(this.nowIndex>=0){
                this.editStatus = true;
                var data = this.promoteList[this.nowIndex];
            }else{
                this.editStatus = false;
                var data = {id: '', wechat_id: '', nickname: '', account: '', password: '', image_uri: ''};
            }
            if(!!data.image_uri){
                $('.showImg').show();
            }else{
                $('.showImg').hide();
            }
            return {
                id: data.id,
                wechatId: data.wechat_id,
                nickname: data.nickname,
                account: data.account,
                password: data.password,
                imageUrl: data.image_uri
            }
        },
        checkAll: function(){
            if(this.checkGroup.length>0){
                return true;
            }else{
                return false;
            }
        }
    },
    methods: {
        checkAllPromote: function(){
            var self = this;
            if(self.checkAll){
                self.checkGroup = [];
            }else{
                self.checkGroup = [];
                self.promoteList.forEach(function(item){
                    self.checkGroup.push(item.wechat_id);
                });
            }
        },
        getUsingPromote: function(){
            var self = this;
            wcr.getUsingWxpromote(function(data){
                if(!$.isEmptyObject(data.wechat)){
                    var wechat = data.wechat;

                    self.haspromote = true;
                    self.using = {
                        wechatId: wechat.wechat_id,
                        nickname: wechat.nickname,
                        account: wechat.account,
                        password: wechat.password,
                        qrcode: wechat.image_uri
                    }
                }
            });
        },
        getPromotes: function(){
            var self = this;
            wcr.getWxpromote(function(data){
                self.promoteList = data.wechat_list;
            });
        },
        usingWxpromote: function(index){
            var self = this;
            if(confirm("确定要应用该微信号？")){
                wcr.usingWxpromote(self.promoteList[index].wechat_id, function(data){
                    window.location.reload();
                });
            }
        },
        openPromoteModal: function(){
            $('#modalChangeWechat').modal('open');
        },
        openModal: function(index){
            this.nowIndex = index;
            $('#modalWechat').modal('open');
        },
        addPromote: function(){
            var self = this;
            if(checkInput($('#modalWechat .veright'))==0){
                var imgurl = $('input[name=wechatQrcode]').val();
                self.editArr.imageUrl = imgurl;
                wcr.pustWxpromote(self.editArr.wechatId, self.editArr.nickname, self.editArr.account, self.editArr.password, self.editArr.imageUrl, function(data){
                    self.promoteList.unshift(data.wechat);
                    $('#modalWechat').modal('closed');
                    self.nowIndex = -2;
                });
            }
        },
        savePromote: function(){
            var self = this;
            if(checkInput($('#modalWechat .veright'))==0){
                var imgurl = $('input[name=wechatQrcode]').val();
                self.editArr.imageUrl = imgurl;
                wcr.putWxpromote(self.editArr.id, self.editArr.wechatId, self.editArr.nickname, self.editArr.account, self.editArr.password, self.editArr.imageUrl, function(data){
                    self.promoteList.splice(self.nowIndex, 1, data.wechat);
                    $('#modalWechat').modal('closed');
                    self.nowIndex = -1;
                });
            }
        },
        deleteUploadImg: function(){
            this.editArr.imageUrl = '';
        },
        deletePromote: function(index){
            var self = this;
            var item = self.promoteList[index];
            if(item.status==1){
                alert("该微信号正在推广中，无法删除该微信号，请先取消应用该微信号后再尝试删除！");   //该微信号正在推广中，无法删除该微信号！
                return false;
            }
            if(confirm("确定要删除该微信号吗？")){
                wcr.deleteWxpromote(item.wechat_id, function(data){
                    self.promoteList.splice(index, 1);
                    var idx = $.inArray(item.wechat_id, self.checkGroup);
                    if(idx>=0){
                        self.checkGroup.splice(idx, 1);
                    }
                });
            }
        },
        deletePromotes: function(){
            var self = this;
            if($.inArray(self.using.wechatId, self.checkGroup)>=0){
                alert("尝试删除的微信号正在被使用，无法删除！");
                return false;
            }
            if(confirm("确定要删除这些微信号吗？")){
                wcr.deleteWxpromotes(self.checkGroup.join(','), function(data){
                    window.location.reload();
                });
            }
        }
    }
});