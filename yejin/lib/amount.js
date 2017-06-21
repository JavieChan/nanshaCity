/**
 * amount
 * Created by JavieChan on 2016/4/21.
 * Updated by JavieChan on 2016/5/17.
 */

;(function($){
    $.fn.amount = function(options){
        var wrapper = $(this),
            amount = {
                init: function(options){
                    var defaults = {
                        min: 1,
                        max: 5
                    };
                    this.wrapper = wrapper;
                    this.settings = $.extend(defaults, options || {});
                    this.ipu = this.wrapper.find('input');
                    this.addEvent();
                    this.reduceEvent();
                    this.modifyEvent();
                },
                addEvent: function(){
                    var that = this;
                    this.wrapper.find('.addOne').on('click', function(){
                        that.val = that.wrapper.find('input').val();
                        var v = that.amountFunc(that.val, true);
                        if(v>that.settings.max){
                            that.ipu.val(that.settings.max);
                        }else{
                            that.ipu.val(v);
                        }
                    });
                },
                reduceEvent: function(){
                    var that = this;
                    this.wrapper.find('.reduceOne').on('click', function(){
                        that.val = that.wrapper.find('input').val();
                        var v = that.amountFunc(that.val, false);
                        if(v<that.settings.min){
                            that.ipu.val(that.settings.min);
                        }else{
                            that.ipu.val(v);
                        }
                    });
                },
                modifyEvent: function(){
                    var that = this;
                    this.ipu.on('change', function(){
                        that.val = that.wrapper.find('input').val();
                        if(!that.reg(that.val) || that.val>that.settings.max || that.val<that.settings.min){
                            alert('仅可支持1-5个终端数');
                            that.ipu.val(2);
                        }
                    });
                },
                amountFunc: function(x, mode){
                    if(this.reg(x)){
                        if(mode){
                            x++;
                        }else{
                            x--;
                        }
                    }
                    return x;
                },
                reg: function(x){
                    return new RegExp("^[0-9]*$").test(x);
                }
            };
        amount.init(options);
    };
})(jQuery);