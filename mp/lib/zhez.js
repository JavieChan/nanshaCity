/**
 * Created by JavieChan on 2016/2/23.
 * Updated by JavieChan on 2016/2/23.
 */

;(function($){
    // 模态对话框
    $.fn.extend({
        modal:function(type){
            var $obj = this;
            GenerateHtml($obj, type);
        }
    });

    var GenerateHtml=function(obj, type){
        if(type=='open'){
            $('body').css('padding-right', '17px').addClass('modal_open').append('<div class="zhez fade"></div>');
            $(obj).fadeIn(150, function(){
                $(this).addClass('in');
            });
            $('.zhez').addClass('in');
        }
        else if(type=='closed'){
            $(obj).removeClass('in').fadeOut(150);

            if(!$(obj).hasClass('notCloseInput')){
                $(obj).find('input').each(function(i, n){
                    $(n).val('');
                    inputError('', n);
                });
            }

            $('.amount input').val(2);

            $(obj).find('.msg').text('');

            $('.zhez').removeClass('in');
            setTimeout(function(){
                $('.zhez').remove();
                $('body').css('padding-right', '0').removeClass('modal_open');
            }, 150);
        }
    };

    // 特定元素处理
    $(document).on('click', '.modal .modal_body, .modal .modal_ele img', function(e){e.stopPropagation();});
})(jQuery);