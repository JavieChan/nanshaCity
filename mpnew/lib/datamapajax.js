/**
 * Created by JaiveChan on 2016/7/25.
 */

var proUrl = '/';

function chartAjax(url, callback, errFunc){
    $.ajax({
        method: "get",
        url: proUrl+'datamap/'+ url,
        data: {location: 77201},
        dataType: "json"
    }).done(function(data){
        callback(data);
    }).fail(function(error){
        console.log(error);
        if(typeof(errFunc)=="function") errFunc();
    });
}