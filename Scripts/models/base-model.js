/**
 * @class
 * @summary classe base para criação de models em javascript, utilizada para facilitar alguns comportamentos padrões
 */
function BusinessBaseModel() {
    var self = this;
    var _complexSubscribe = [];
    var _arraySubscribe = [];

    var _subscriptionsPropertiesObservable = [];
    var _allPropertiesWritable = [];

    //devera ser redefinida na classe derivada para realizar uma validacao customizada
    self.isValidCustom = function () { return true; };
    //Estado do objeto que está sendo validado
    self.isValid = ko.observable(true);

    self.disposeSubscribers = function () {
        _disposeArraySubscribers(_complexSubscribe);
        _disposeArraySubscribers(_arraySubscribe);
        _disposeArraySubscribers(_subscriptionsPropertiesObservable);
        _disposeArraySubscribers(_allPropertiesWritable);
    }

    self.dispose = function () {
        self.disposeSubscribers();
    }

    //Atribui propriedades no objeto utilizando apenas um objeto tipado ou não
    self.assignProperties = function (model, callback) {
        model = ko.utils.unwrapObservable(model);

        for (var propertyName in model) {
            if (ko.isWriteableObservable(this[propertyName]) == true && ko.utils.unwrapObservable(model[propertyName]) != undefined) {
                this[propertyName](ko.utils.unwrapObservable(model[propertyName]));
            }
        }

        this.registerValidations();

        if (callback)
            callback(this);

        return this;
    }
    //Limpa as propridades observáveis escrevíveis do objeto
    self.clearProperties = function () {
        for (var propertyName in this) {
            if (ko.isWriteableObservable(this[propertyName]) && self.isValid != this[propertyName]) {
                if (this[propertyName].removeAll !== undefined)
                    this[propertyName].removeAll();
                else
                    this[propertyName](undefined);
            }
        }
        return this;
    }
    //Habilita o rastreamento de alteraçõs no modelo
    self.trackChangesModel = function (model) {
        model = ko.utils.unwrapObservable(model);
        if (model) {
            for (var i = 0; i < model.length; i++) {
                var breakEditing = false;

                if (!breakEditing) {
                    ko.editable(model[i]);
                    model[i].beginEdit();
                    breakEditing = true;
                }
            }
        }
    }

    self.clone = function () {
        var c = new self.constructor();
        c.assignProperties(this);
        return c;
    }



    //Responsável por realizar a cadeira de validação entre os objetos e suas propriedades complexas
    //Sempre deverá ser chamado quando tiver um novo objeto associado
    self.registerValidations = function () {

        _disposeArraySubscribers(_arraySubscribe);
        _disposeArraySubscribers(_complexSubscribe);
        _disposeArraySubscribers(_subscriptionsPropertiesObservable)

        //somente se inscreve caso ainda não tenha feito
        if (_subscriptionsPropertiesObservable.length == 0) {
            for (var propName in this) {
                var prop = this[propName];

                //ignore isValid property
                if (propName === 'isValid' || ko.isObservable(prop) === false) {
                    continue;
                }

                if (_isComplexProperty(prop)) {
                    //if change property to undefined register validations                     
                    var sub = prop.subscribe(function (value) {
                        if (this.propertyObservable() !== undefined) {
                            _subscribeIsValidNotify(this.propertyObservable(), this.parentInstance, this.arraySubscribe, this.allPropertiesWritable);
                        } else {
                            this.parentInstance.registerValidations();
                        }
                    }.bind({ parentInstance: this, propertyObservable: prop, propertyName: propName, arraySubscribe: _arraySubscribe, allPropertiesWritable: _allPropertiesWritable }));
                    _subscriptionsPropertiesObservable.push(sub);
                } else if (_isWriteaableObservableArray(prop)) {
                    //if change property to [] register validations
                    var sub = prop.subscribe(function (value) {
                        //remove previous subscriptions
                        this.parentInstance.registerValidations();
                        if (value instanceof Array) {
                            for (var i = 0; i < this.propertyObservable().length; i++) {
                                var obj = this.propertyObservable()[i];
                                _subscribeIsValidNotify(obj, this.parentInstance, this.arraySubscribe, this.allPropertiesWritable);
                            }
                        } else if (obj !== undefined) {
                            _subscribeIsValidNotify(obj, this.parentInstance, this.arraySubscribe, this.allPropertiesWritable);
                        }
                    }.bind({ parentInstance: this, propertyObservable: prop, propertyName: propName, arraySubscribe: _arraySubscribe, allPropertiesWritable: _allPropertiesWritable }));
                    _subscriptionsPropertiesObservable.push(sub);
                }

                if (_isPropertyWriteableValidatable(prop)) {
                    //subscribe all properties validatable
                    var propertyW = { propertyName: propName, propertyObservable: prop, instanceObject: this };
                    var subscribeP = prop.subscribe(function (value) {
                        _checkIsValid(this.instanceObject, this.allPropertiesWritable);
                    }.bind({ propertyName: propName, instanceObject: propertyW.instanceObject, allPropertiesWritable: _allPropertiesWritable }));

                    _subscriptionsPropertiesObservable.push(subscribeP);
                    _allPropertiesWritable.push(propertyW);
                }
            }

            for (var index = 0; index < _allPropertiesWritable.length; index++) {
                var p = _allPropertiesWritable[index];
                //subscribe properties of object
                _subscriptionsPropertiesObservable.push(p.propertyObservable.subscribe(function (v) {
                    _checkIsValid(this.instanceObject, this.allPropertiesWritable);
                }.bind({ instanceObject: p.instanceObject, allPropertiesWritable: _allPropertiesWritable })));
            }
        }

        //subscribe complex property
        _checkComplexProperty(this, _complexSubscribe, _allPropertiesWritable);

        //subscription validation complex property and array
        for (var propName in this) {
            var propArray = this[propName];
            if (_isWriteaableObservableArray(propArray)) {
                _checkArrayProperty(propArray, this, _arraySubscribe, _allPropertiesWritable)
            }
        }

        //primeira validação
        _checkIsValid(this, _allPropertiesWritable);
    }

    function _subscribeIsValidNotify(instanceIsValid, parentInstance, arraySubscribe, allPropertiesWritable) {
        if (instanceIsValid !== undefined) {
            if (ko.isWriteableObservable(instanceIsValid.isValid) && !instanceIsValid._destroy) {
                _subscribeIsValid(instanceIsValid.isValid, parentInstance, arraySubscribe, allPropertiesWritable)
                instanceIsValid.isValid.notifySubscribers(instanceIsValid.isValid());
            }
        } else {
            this.parentInstance.registerValidations();
        }
    }
    
    function _isPropertyWriteableValidatable(propertyObservable) {
        //all properties subscribable
        var result = ko.isObservable(propertyObservable) && propertyObservable.isValid !== undefined && propertyObservable() instanceof Array === false;
        return result;
    }
    
    function _disposeArraySubscribers(objArray) {
        for (var i = 0; i < objArray.length; i++) {
            objArray[i].dispose();
        }
        objArray.splice(0);
    }
    
    function _isWriteaableObservableArray(propArray) {
        var result = ko.isWriteableObservable(propArray) === true && ko.utils.unwrapObservable(propArray) instanceof Array;
        return result;
    }
    
    function _checkIsValid(objInstance, _allPropertiesWritable) {
        var _isValid = true;
        if (!objInstance._destroy) {
            for (var index = 0; index < _allPropertiesWritable.length; index++) {
                var p = _allPropertiesWritable[index];
                if (p.propertyObservable.isValid() === false) {
                    _isValid = false;
                    break;
                }
            }
        }
    
        objInstance.isValid(_isValid);
    }
    
    function _subscribeIsValid(propertyObservableIsValid, _instanceReceiver, _arrayPush, _allPropertiesWritable) {
        if (ko.isWriteableObservable(propertyObservableIsValid) === true) {
            var sub = propertyObservableIsValid.subscribe(function (value) {
                if (value === false) {
                    this.instanceReceiver.isValid(false);
                } else if (value !== undefined) {
                    _checkIsValid(this.instanceReceiver, this.allPropertiesWritable);
                }
            }.bind({ instanceReceiver: _instanceReceiver, allPropertiesWritable: _allPropertiesWritable }));
            _arrayPush.push(sub);
        }
    }
    
    function _isComplexProperty(_property) {
        var result = ko.isWriteableObservable(_property) === true && _property.type !== undefined && _property() instanceof Array == false;
        return result;
    }
    
    function _checkComplexProperty(_instanceReceiver, _arrayPush, _allPropertiesWritable) {
        for (var propName in _instanceReceiver) {
            var prop = _instanceReceiver[propName];
            if (_isComplexProperty(prop) && prop() !== undefined && ko.isWriteableObservable(prop().isValid) === true) {
                _subscribeIsValid(prop().isValid, _instanceReceiver, _arrayPush, _allPropertiesWritable);
                prop().isValid.notifySubscribers(prop().isValid());
            }
        }
    }
    
    function _checkArrayProperty(_array, _instanceReceiver, _arraySubscribe, _allPropertiesWritable) {
        _array = ko.utils.unwrapObservable(_array);
        for (var i = 0; i < _array.length; i++) {
            var itemPropertyComplex = _array[i];
            if (ko.isWriteableObservable(itemPropertyComplex.isValid) === true) {
                //subscriptions all item list
                _subscribeIsValid(itemPropertyComplex.isValid, _instanceReceiver, _arraySubscribe, _allPropertiesWritable);
                _checkComplexProperty(itemPropertyComplex, _arraySubscribe, _allPropertiesWritable, _checkIsValid);
            }
        }
    }    
}
define('base-model', function () {
    return BusinessBaseModel;
});
