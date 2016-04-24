/**
 * Created by Hernandes on 22/04/2016.
 */
function PessoaListViewModel(){
    var self = this;

    var ctrl = new PessoaController();

    self.LstPessoas = ko.observableArray([]).typeOf(PessoaModel);
    self.novaPessoa = function(){

        ctrl.Novo(function(html){
            //console.log(html);
            Util.LoadAndShowModal("result","ModalVerDadosPessoa",html,function(e){
                console.log('Modal carregado ' + e);
                //$("#ModalVerDadosPessoa").modal({ show: true, backdrop: 'static', keyboard: true });
            });
        })
    }

    self.selecionado = ko.observable('');

    self.editarPessoa = function(element){

        ctrl.Editar(ko.utils.unwrapObservable(element.PessoaID), function(html){
            //console.log(html);
            Util.LoadAndShowModal("result","ModalVerDadosPessoa",html,function(e){
                //$("#ModalVerDadosPessoa").modal({ show: true, backdrop: 'static', keyboard: true });
            });
        })
    }

    self.excluirPessoa = function(element){

        ctrl.Excluir(ko.utils.unwrapObservable(element.PessoaID), function(result){
            Util.Message('Pessoa excluída com sucesso','success');
            self.buscar();
        })
    }

    self.buscar = function(){
        ctrl.Buscar(function(dados){
            self.LstPessoas(dados);
        });
    }

    ko.postbox.subscribe('pessoa-create-edit-view-model-gravar-alteracoes',function(){
        $("#ModalVerDadosPessoa").modal('hide');
        self.buscar();
    });
    self.buscar();
}

define('pessoa-list-view-model',function() {
    return PessoaListViewModel;
});