/**
 * Created by Hernandes on 21/04/2016.
 */
function PessoaController() {
    var self = this;
    self.UrlBase = "";

    self.Gravar = function (pessoaModel, callback) {
        Util.Request.Post(self.UrlBase + 'Gravar', pessoaModel, 'json', 'application/json', callback);
    }

    self.Novo = function (callback) {
        Util.Request.Get(self.UrlBase + 'Novo', undefined, 'json', 'application/json', callback);
    }

    self.Editar = function (id, callback) {
        Util.Request.Get(self.UrlBase + 'Editar', {id: id}, 'json', 'application/json', callback);
    }

    self.Excluir = function (id, callback) {
        Util.Request.Post(self.UrlBase + 'Excluir', {id: id}, 'json', 'application/json', callback);
    }

    self.Buscar = function (callback) {
        Util.Request.Get(self.UrlBase + 'Buscar', undefined, 'json', 'application/json', callback);
    }
}

define('pessoa-controller',function() {
    return PessoaController;
});