
function wechatRequest(){
    Request.call(this);
}
wechatRequest.prototype = new Request();
wechatRequest.prototype.getWxpromote = function(page, callback){
    var params = {
        page: page
    };
    this._get('/wxpromote', params, function(data){
        callback(data);
    });
};
wechatRequest.prototype.pustWxpromote = function(wechatId, nickname, account, password, imageUrl, callback){
    var params = {
        wechat_id: wechatId,
        nickname: nickname,
        account: account,
        password: password,
        image_uri: imageUrl
    };
    this._post('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.putWxpromote = function(id, wechatId, nickname, account, password, imageUrl, callback){
    var params = {
        id: id,
        wechat_id: wechatId,
        nickname: nickname,
        account: account,
        password: password,
        image_uri: imageUrl
    };
    this._put('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.deleteWxpromote = function(id, callback){
    var params = {
        id: id
    };
    this._delete('/wxpromote', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.deleteWxpromotes = function(idList, callback){
    var params = {
        id_list: idList
    };
    this._post('/wxpromote/bulk-delete', JSON.stringify(params), function(data){
        callback(data);
    });
};
wechatRequest.prototype.getUsingWxpromote = function(callback){
    this._get('/wxpromote/promoting', '', function(data){
        callback(data);
    });
};
wechatRequest.prototype.usingWxpromote = function(id, callback){
    var params = {
        id: id
    };
    this._post('/wxpromote/promoting', JSON.stringify(params), function(data){
        callback(data);
    });
};