/**
 * Created by Hernandes on 22/04/2016.
 */
function RequestProxy() {
    /**
     * @summary comunica com o servidor
     */
    var getRepository = function(){
        var repository = [];

        if(localStorage["pessoas"]){
            repository = $.parseJSON(JSON.parse(localStorage["pessoas"]));
        }

        return repository;
    }

    this.Request = function (url, method, params, dataType, contentType, callback) {
        console.log('request ' + JSON.stringify({url:url,method:method,params:params}));
        var repository = getRepository();

        if(method == "GET") {
            if (url == "Novo") {
                $.get(
                    absolutePath + "/Views/_create-edit.html",
                    undefined,
                    function (data) {
                        callback(data);
                    }
                )
            }
            else if(url == "Buscar"){

                callback(getRepository());
            }
            else if(url =="Editar")
            {
                $.get(
                    absolutePath +"/Views/_create-edit.html",
                    undefined,
                    function (data) {


                        var value = ko.utils.arrayFilter(getRepository(),function(item){
                            if(ko.utils.unwrapObservable(item.PessoaID) == params.id){
                                return true;
                            }
                        })[0];

                        String.prototype.splice = function(idx, rem, str) {
                            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                        };

                        data = data.splice(data.indexOf('PessoaCreateEditViewModel()')+26,0,ko.toJSON(value));

                        callback(data);
                        //ko.postbox.publish('init-pessoa-create-edit', value);
                    }
                )


            }

        }else{
            if(params.id){
                params["PessoaID"] = params.id;

                var valueSearched = ko.utils.arrayFilter(repository, function (item) {
                    if (ko.utils.unwrapObservable(params.PessoaID) == ko.utils.unwrapObservable(item.PessoaID))
                        return true;
                    else
                        return false;
                })[0];

                params = new PessoaModel(valueSearched);
            }


            if(params instanceof  PessoaModel) {


                var max = 0;

                var valueToUpdate = ko.utils.arrayFilter(repository, function (item) {
                    if (ko.utils.unwrapObservable(params.PessoaID) == ko.utils.unwrapObservable(item.PessoaID))
                        return true;
                    else
                        return false;
                });

                if (valueToUpdate.length == 0) {
                    ko.utils.arrayForEach(repository, function (item) {
                        var valor = parseInt(ko.utils.unwrapObservable(item.PessoaID));
                        if (valor > max)
                            max = valor;
                    });
                    params.PessoaID(max + 1);
                } else {
                    repository = ko.observableArray(repository);
                    repository.remove(valueToUpdate[0]);
                }

                if (url != "Excluir") {
                    repository.push(params);
                }

                function SortByID(a, b) {
                    return ((a.PessoaID < b.PessoaID) ? -1 : ((a.PessoaID > b.PessoaID) ? 1 : 0));
                }


                repository.sort(function (a, b) {
                    return ko.utils.unwrapObservable(a.PessoaID) - ko.utils.unwrapObservable(b.PessoaID);
                });

                localStorage["pessoas"] = JSON.stringify(ko.toJSON(ko.utils.unwrapObservable(repository)));
            }

            callback([]);
        }


    }
    /**
     * @summary envia as informações ao servidor
     */
    this.Post = function (url, params, dataType, contentType, callback) {
        this.Request(url,'POST',params,dataType,contentType,callback);
    }
    /**
     * @summary recebe as informações ao servidor
     */
    this.Get = function (url, params, dataType, contentType, callback) {
        this.Request(url,'GET',params,dataType,contentType,callback);
    }
}

define('request-proxy',function(){
    return RequestProxy;
})