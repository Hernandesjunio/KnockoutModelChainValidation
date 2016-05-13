/**
 * @class
 * @summary classe base para criação de models em javascript, utilizada para facilitar alguns comportamentos padrões
 */
function BusinessBaseModel() {
    var self = this;
   
    //devera ser redefinida na classe derivada para realizar uma validacao customizada
    self.isValidCustom = function () { return true; };
    //Estado do objeto que está sendo validado
    self.isValid = ko.observable(true);

    //Responsável por realizar a cadeira de validação entre os objetos e suas propriedades complexas
    //Sempre deverá ser chamado quando tiver um novo objeto associado
    self.registerValidations = function () {
        var ctx = this;
        //
        var property = {}
        //função utilizada para percorrer todas as propridades e validar ko.validation.isValid
        var analisarTodasPropriedadesIsValid = function (model) {
            var condicao = true;
            if (model.isValidCustom == undefined || model.isValidCustom() == false)
                condicao = false;
            else {
                for (var pp in model) {
                    var sub = model[pp];
                    if (ko.isWriteableObservable(sub)) {
                        if (sub.isValid != undefined && sub.isValid() == false) {
                            condicao = false;
                            break;
                        }
                        else if (sub() instanceof Object && (sub() instanceof Array) == false) {
                            analisarTodasPropriedadesIsValid(sub());
                            if (sub().isValid != undefined)
                                condicao = sub().isValid();
                            if (condicao == false)
                                break;
                        }
                        else if (sub() instanceof Array) {
                            for (var i = 0; i < sub().length; i++) {
                                if (sub()[i].isValid != undefined) {
                                    analisarTodasPropriedadesIsValid(sub()[i])
                                    condicao = sub()[i].isValid();
                                    if (condicao == false)
                                        break;
                                }
                            }
                        }
                    }
                }
            }

            if (model.isValid != undefined)
                model.isValid(condicao);
        };

        var observarPropriedades = function (ctx, propertyName) {

            var subscribeIsValid = function (isValid) {
                isValid.subscribe(function (value) {
                    if (value == true)
                        analisarTodasPropriedadesIsValid(this.m);
                    else
                        this.m.isValid(value);
                }.bind({ m: ctx }));
            }

            if (ko.isWriteableObservable(ctx[propertyName])) {
                //ctx[propertyName]() instanceof Array
                if (ctx[propertyName]() && ctx[propertyName]().isValid != undefined) {
                    if (ko.isWriteableObservable(ctx[propertyName]().isValid))
                    subscribeIsValid(ctx[propertyName]().isValid);
                }
                else
                    if (ctx[propertyName]() instanceof Array) {
                        ko.utils.arrayForEach(ctx[propertyName](), function (item) {
                            if (ko.isWriteableObservable(item.isValid))
                                subscribeIsValid(item.isValid);
                        });
                    }

            }
        }

        for (var propertyName in ctx) {
            if (ko.isWriteableObservable(ctx[propertyName]) && propertyName != "isValid") {

                observarPropriedades(ctx, propertyName);

                analisarTodasPropriedadesIsValid(ctx);
                //toda propridade do objeto que for alterada, todas serão repassadas novamente
                ctx[propertyName].subscribe(function (v) {
                    analisarTodasPropriedadesIsValid(this.m);
                }.bind({ m: ctx, p: ctx[propertyName] }));

                //caso a propriedade seja array trata item a item
                if (ctx[propertyName]() instanceof Array) {
                    var arrayProp = ctx[propertyName]();
                    for (var i = 0; i < arrayProp.length; i++) {
                        var itemArrayProp = arrayProp[i];
                        for (var p in itemArrayProp) {
                            var property = itemArrayProp[p];

                            if (ko.isWriteableObservable(property) && p != "isValid") {
                                observarPropriedades(itemArrayProp, p);
                                //caso alguma propriedade de um item do array seja modificada
                                //percorre o array inteiro validando novamente
                                property.subscribe(function (v) {
                                    for (var i = 0; i < this.a.length; i++) {
                                        //analista todas as propriedades do meste
                                        analisarTodasPropriedadesIsValid(this.b);
                                        //analista todas as propriedades dos detalhes
                                        analisarTodasPropriedadesIsValid(this.a[i]);
                                        if (this.a[i].isValid() == false) {                                            
                                            this.a[i].isValid(false);
                                            this.b.isValid(false);
                                            break;
                                        }
                                    }
                                }.bind({ m: itemArrayProp, p: property, a: arrayProp, b: ctx }));
                            }
                        }
                    }
                }
                //chama registerValidations em cadeia
                if (ctx[propertyName]() && ctx[propertyName]().registerValidations)
                    ctx[propertyName]().registerValidations();
            }
        }
        analisarTodasPropriedadesIsValid(this);
    }
    //Atribui propriedades no objeto utilizando apenas um objeto tipado ou não
    self.assignProperties = function (model) {
        model = ko.utils.unwrapObservable(model);

        for (var propertyName in model) {                        
            if (ko.isWriteableObservable(this[propertyName]) && ko.utils.unwrapObservable(model[propertyName]) != undefined) {
                this[propertyName](ko.utils.unwrapObservable(model[propertyName]));
            }
        }

        this.registerValidations();
        return this;
    }
    //Limpa as propridades observáveis escrevíveis do objeto
    self.clearProperties = function () {
        for (var propertyName in this) {
            if (ko.isWriteableObservable(this[propertyName])) {
                this[propertyName](undefined);
            }
        }
        return this;
    }

    self.clone = function () {
        var c = new self.constructor();
        c.assignProperties(this);
        return c;
    }
}
