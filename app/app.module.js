
var app = angular.module("editorApp", ['ngRoute', 'editorServices', 'ui.bootstrap', 'darthwade.loading']);
var services = angular.module('editorServices', ['ngResource']);

var api = "http://indoor-furbmobile2016.rhcloud.com/api";


app.run(function($rootScope, $loading) 
{    
    $rootScope.setLoading = function(loading) 
    {
        //$rootScope.isLoading = loading;
        
        if (loading)
            $rootScope.startLoading('editor');
        else
            $rootScope.finishLoading('editor');
    }
    
    $rootScope.startLoading = function (name) 
    {
        $loading.start(name);
    };

    $rootScope.finishLoading = function (name) 
    {
        $loading.finish(name);
    };
});