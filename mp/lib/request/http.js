function Request(){
    this.protocol= "http",                // 请求协议
    this.host= "test.bidongwifi.com:",       // 请求域名或IP
    this.port= "9902",                      // 请求端口
    this.version= "v0"                   // API版本号
}
Request.prototype._send = function(type, pathname, params, success, fail){
    var url = this.protocol+'://'+this.host+':'+this.port+pathname;
    //var url = pathname;

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
                alert(res.message);
            }
        }
    }).fail(function(err){
        alert("[请求失败]系统繁忙")
    });
};
Request.prototype._post = function(pathname, params, success, fail){
    this._send("post", pathname, params, success, fail);
};
Request.prototype._get = function(pathname, params, success, fail){
    this._send("get", pathname, params, success, fail);
};