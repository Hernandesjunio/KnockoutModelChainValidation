/**
 * Created by Hernandes on 21/04/2016.
 */
function PessoaCreateEditViewModel(data){
    var self = this;
    var ctrl = new PessoaController();

    self.Pessoa = ko.observable(new PessoaModel(data)).typeOf(PessoaModel)

    self.Pessoa().isValidCustom = function(){
        //custom validation
        return self.Pessoa().Nome && self.Pessoa().Nome().length > 3;
    };

    self.gravarAlteracoes = function(){
        if(self.Pessoa().isValid() == false)
            return;

        ctrl.Gravar(self.Pessoa(),function(result){
            //callback\
            //verifica se teve alguma mensagem de erro a ser exibida ao cliente
            if(result.length > 0){
                Util.Message('Houve erro ao salvar dados','danger');
            }
            else{
                Util.Message('Salvo com sucesso!','success');
                ko.postbox.publish('pessoa-create-edit-view-model-gravar-alteracoes');
            }
        });
    }

    self.removerEndereco = function(element){
        self.Pessoa().Enderecos.remove(element);
        self.Pessoa().registerValidations();
    }
    self.novoEndereco = function(){
        self.Pessoa().Enderecos.push(new EnderecoBaseModel());
        self.Pessoa().registerValidations();
    }

    self.editar = function(element){
        ctrl.Editar(element.PessoaID,function(html){
            //callback
            Util.loadAndShowModal("result","modal",html,function(evt){
                if(evt.event=='hide'){

                }
                else
                if(evt.event=='show'){

                }
            });
        })
    }

    self.novo = function(){
        ctrl.Novo(function(html){
            //callback
            Util.loadAndShowModal("result","modal",html,function(evt){
                if(evt.event=='hide'){

                }
                else
                if(evt.event=='show'){

                }
            });
        });
    }
}

define('pessoa-create-edit-view-model',function(){
   return PessoaCreateEditViewModel;
});
