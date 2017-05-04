
function wechatRequest(){
    Request.call(this);
}
wechatRequest.prototype = new Request();
wechatRequest.prototype.getWxpromote = function(callback){
    this._get('/wxpromote', '', function(data){
        callback(data);
    });
};
wechatRequest.prototype.pustWxpromote = function(wechatId, nickname, account, password, uploadImg, callback){
    var params = {
        wechat_id: wechatId,
        nickname: nickname,
        account: account,
        password: password,
        image_url: uploadImg
    };
    this._post('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.putWxpromote = function(id, wechatId, nickname, account, password, uploadImg, callback){
    var params = {
        id: id,
        wechat_id: wechatId,
        nickname: nickname,
        account: account,
        password: password,
        image_url: uploadImg
    };
    this._put('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.deleteWxpromote = function(wechatId, callback){
    var params = {
        wechat_id: wechatId
    };
    this._delete('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.deleteWxpromotes = function(wechatIdList, callback){
    var params = {
        wechat_id_list: wechatIdList
    };
    this._delete('/wxpromote/bulk-delete', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.getUsingWxpromote = function(callback){
    this._get('/wxpromote/promoting', '', function(data){
        callback(data);
    });
};
wechatRequest.prototype.usingWxpromote = function(wechatId, callback){
    var params = {
        wechat_id: wechatId
    };
    this._post('/wxpromote/promoting', JSON.stringify(params), function(data){
        callback(data);
    });
};