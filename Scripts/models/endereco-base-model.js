/**
 * Created by Hernandes on 21/04/2016.
 */
 function EnderecoBaseModel(model) {
    var self = this;
    var base = new BaseModel();
    ko.utils.extend(self,base);

    self.Cep = ko.observable().extend({required:true});
    self.Endereco = ko.observable().extend({required:true});
    self.Numero = ko.observable().extend({required:true});
    self.Complemento = ko.observable();
    self.Bairro = ko.observable().extend({required:true});
    self.Cidade = ko.observable().extend({required:true});
    self.UF  = ko.observable().extend({required:true});

    self.assignProperties(model);
}

define('endereco-base-model',function() {
    return EnderecoBaseModel;
});