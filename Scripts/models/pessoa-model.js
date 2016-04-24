/**
 * Created by Hernandes on 21/04/2016.
 */
function PessoaModel(m){
    var self = this;
    var base = new BaseModel();
    ko.utils.extend(self,base);
    self.PessoaID = ko.observable().defaultValue(0).extend({required:true});
    self.Nome = ko.observable('').extend({required:true,editable:true});
    self.Email = ko.observable('').extend({required:true,editable:true});
    self.Enderecos = ko.observableArray([]).typeOf(EnderecoBaseModel);

    self.assignProperties(m);
}

define('pessoa-model',function() {
    return PessoaModel;
});