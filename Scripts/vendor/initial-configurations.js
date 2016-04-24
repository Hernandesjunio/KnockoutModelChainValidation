/**
 * Created by Hernandes on 22/04/2016.
 */
var paths=[];
var shim=[]
var absolutePath='/ClasseBase'
var getUrl = function(urlAbsolute){
    return absolutePath + urlAbsolute;
}


paths['util'] = '/Scripts/common/util';
paths['request-proxy'] = '/Scripts/common/request-proxy';
paths['pessoa-controller'] = '/Scripts/controllers/pessoa-controller';
paths['ko-fn-default-value'] = '/Scripts/ko/ko.subscribable.fn.defaultValue';
paths['ko-fn-type-of'] = '/Scripts/ko/ko.subscribable.fn.typeOf';
paths['base-model'] = '/Scripts/models/base-model';
paths['endereco-base-model'] = '/Scripts/models/endereco-base-model';
paths['pessoa-model'] = '/Scripts/models/pessoa-model';
paths['view-model-dependencies']='/Scripts/viewmodels/.dependencies';
paths['controller-dependencies']='/Scripts/controllers/.dependencies';
paths['model-dependencies']='/Scripts/models/.dependencies';
paths['common-dependencies']='/Scripts/common/.dependencies';
paths['ko-dependencies']='/Scripts/ko/.dependencies';
paths['pessoa-create-edit-view-model'] = '/Scripts/viewmodels/pessoa-create-edit-view-model';
paths['pessoa-list-view-model'] = '/Scripts/viewmodels/pessoa-list-view-model';

shim['util']=['request-proxy'];
shim['pessoa-controller'] = ['util'];
shim['endereco-base-model'] = ['base-model'];
shim['pessoa-model'] = ['base-model','endereco-base-model'];
shim['pessoa-create-edit-view-model'] = ['base-model','endereco-base-model','pessoa-model','pessoa-controller'];
shim['pessoa-list-view-model'] = ['base-model','endereco-base-model','pessoa-model','pessoa-controller','ko-fn-default-value','ko-fn-type-of'];
