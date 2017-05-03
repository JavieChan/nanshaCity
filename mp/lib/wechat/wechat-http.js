
function wechatRequest(){
    Request.call(this);
}
wechatRequest.prototype = new Request();
wechatRequest.prototype.createSerial = function(count, hours, expired, callback){
    var params = {
        count: count,
        hours: hours,
        expired: expired
    };
    this._post('/redeemcode/creation', JSON.stringify(params), function(data){
        callback(data);
    });
};