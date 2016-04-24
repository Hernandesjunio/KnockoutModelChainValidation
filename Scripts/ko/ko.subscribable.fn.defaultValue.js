/**
 * Created by Hernandes on 22/04/2016.
 */
function defaultValue() {
    return ko.subscribable.fn.defaultValue = function (defaultValue) {
        var target = this;
        var defaultValueFunction = function (newValue) {
            if (ko.validation.utils.isEmptyVal(target()) || !target()) {
                target(defaultValue);
            }
        }
        target.subscribe(defaultValueFunction);
        defaultValueFunction(target());
        return target;
    }
}

define('ko-fn-default-value',function() {
    return new defaultValue();
});