/**
 * Created by Hernandes on 22/04/2016.
 */
function typeOf() {
   return ko.subscribable.fn.typeOf = function (type) {
        var target = this;

        target.subscribe(function (newValue) {
            if (target.destroyAll != undefined) {
                //se for array
                var newValues = ko.utils.arrayFilter(newValue, function (item) {
                    return (item instanceof type) == false;
                });

                if (newValues.length > 0)
                    target.removeAll(newValues);

                ko.utils.arrayForEach(newValues, function (item) {
                    target.push(new type(item));
                });
            }
            else
            //se nao for array
            if ((newValue instanceof type) == false)
                target(new type(newValue));

        });

        return target;
    }
}

define('ko-fn-type-of',function() {
    //return ko.subscribable.fn.defaultValue;
    return new typeOf();
});