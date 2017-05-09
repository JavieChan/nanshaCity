
function redeemCode(){
    Request.call(this);
}
redeemCode.prototype = new Request();
redeemCode.prototype.createSerial = function(count, hours, expired, callback){
    var params = {
        count: count,
        hours: hours,
        expired: expired
    };
    this._post('/redeemcode/creation', JSON.stringify(params), function(data){
        callback(data);
    });
};
redeemCode.prototype.generateCodes = function(serial, page, callback){
    var params = {
        serial: serial,
        page: page
    };
    this._get('/redeemcode/creation', params, function(data){
        callback(data);
    });
};
redeemCode.prototype.getCodeList = function(status, page, callback){
    var params = {
        status: status,
        page: page
    };
    this._get('/redeemcode/list', params, function(data){
        callback(data);
    });
};
redeemCode.prototype.getOperatorAndList = function(start, end, operator, page, callback){
    var params = {
        start: start,
        end: end,
        operator: operator,
        page: page
    };
    this._get('/redeemcode/operator', params, function(data){
        callback(data);
    });
};