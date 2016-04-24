/**
 * Created by Hernandes on 22/04/2016.
 */
var initConfig = function(){
    $('[title], [data-toggle="tooltip"]').tooltip();
    //http://mimo84.github.io/bootstrap-maxlength
    $("input[type='text'], textarea").not('[class^="select2"]').not('[class*="no-maxlength"]').maxlength({
        alwaysShow: true,
        appendToParent: true,
        placement: 'top-right-inside'
    });

    $('input').on('focus', function (e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
    });
}

var Util = {
    Request:new RequestProxy(),
    Message: function (msg, type, delay, showCloseButton, timeout, title) {
        if (showCloseButton === undefined)
            showCloseButton = true;

        if (timeout === undefined)
            timeout = "2000";

        toastr.options = {
            "closeButton": showCloseButton,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-full-width",
            "onclick": null,
            "showDuration": "500",
            "hideDuration": "1000",
            "timeOut": timeout,
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        if (type == 'success')
            toastr.success(msg, title == undefined ? "Sucesso" : title);
        else if (type == 'error')
            toastr.error(msg, title == undefined ? "Erro" : title);
        else if (type == 'info')
            toastr.info(msg, title == undefined ? "Informação" : title);
        else if (type == 'warning')
            toastr.warning(msg, title == undefined ? "Atenção" : title);
    },

    /**
     * @summary carrega e exibe o modal
     * @param {String} elementHostID - ID do elemento que receberá o html do modal
     * @param {String} elementModalID - ID que será utilizado como referência do modal
     * @param {html} htmlModal - conteúdo html do modal
     * @param {String} callback - executa os eventos hide e show
     */
    LoadAndShowModal:function(elementHostID, elementModalID, htmlModal, callback){
        //load modal in host elemnt id
        $host = $("#"+elementHostID);
        $host.html(htmlModal);
        $modal = $("#"+elementModalID);
        callback = callback?callback:function(){};
        $modal.on('hide.bs.modal', function (e) {
            $(".modal-backdrop").remove();
            callback({event:'hide'});
        });
        $modal.on('show.bs.modal', function (e) {
            //Define configurações de plugins no carregamento do modal.
            callback({event:'show'});
            initConfig();
        });

        //$("#ModalVerDadosPessoa").modal({ show: true, backdrop: 'static', keyboard: true });
        $modal.modal({ show: true, backdrop: 'static', keyboard: true });

        $('input').on('focus', function (e) {
            $(this)
                .one('mouseup', function () {
                    $(this).select();
                    return false;
                })
                .select();
        });
    }
}

define('util',function() {

//    $(function(){
//        initConfig();
//    });

    return Util;
});