function Request(){
    this.protocol= "http",                // 请求协议
    this.host= "10.20.1.40",       // 请求域名或IP test.bidongwifi.com
    this.port= "9092",                      // 请求端口 80
    this.version= "v0"                   // API版本号
}
Request.prototype._send = function(type, pathname, params, success, fail){
    //var url = this.protocol+'://'+this.host+':'+this.port+pathname;
    var url = pathname;

    $.ajax({
        method: type,
        url: url,
        dataType: "json",
        data: params,
    //    xhrFields:
    //      withCredentials: true
    //    crossDomain: true
    }).done(function(res){
        console.log(res);
        if(parseInt(res.code) == 200){
            if($.isFunction(success)){
                success(res)
            }
        }else{
            if($.isFunction(fail)){
                fail(res)
            }else{
                alert(res.reason);
            }
        }
    }).fail(function(err){
        console.log(err);
        alert("[请求失败]系统繁忙");
    });
};
Request.prototype._post = function(pathname, params, success, fail){
    this._send("post", pathname, params, success, fail);
};
Request.prototype._get = function(pathname, params, success, fail){
    this._send("get", pathname, params, success, fail);
};
Request.prototype._put = function(pathname, params, success, fail){
    this._send("put", pathname, params, success, fail);
};
Request.prototype._delete = function(pathname, params, success, fail){
    this._send("delete", pathname, params, success, fail);
};