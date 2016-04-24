/**
 * Created by Hernandes on 22/04/2016.
 */
//console.log('config init');

//require(['../.dependencies','domReady'],function(d,ready) {

    //console.log(ready);
    //ready(function() {

        //console.log(paths.length);

//var ko = {};
//var $ ={};
var buildNumber = "1.0.0";

var domReady = function (callback) {
    require(['domReady'], function (dom) {
        dom(callback);
    });
}

function configMain() {

    for (var p in paths) {
        if (paths[p].toString().indexOf(absolutePath) < 0)
            paths[p] = getUrl(paths[p]);
    }

    //console.log(paths);

    for (var p in shim) {
        if (shim[p].toString().indexOf('requirejs') < 0) {
            //shim[p].push('vendors');
        }
    }

    require.config({
        baseUrl: absolutePath + '/Scripts/vendor/requirejs',
        paths: paths,
        waitSeconds:0,
        shim: shim
    });

    //console.log('config end');
    //});
//});

//    require(['vendors'], function () {
//        domReady(function(){
//           console.log('vendors loaded')
//        });
//    });

    //console.log(paths);

}


configMain();