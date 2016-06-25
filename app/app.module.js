
var app = angular.module("editorApp", ['ngRoute', 'editorServices', 'ui.bootstrap', 'ui.bootstrap.treeview', 'darthwade.loading', 'angular-confirm']);
var services = angular.module('editorServices', ['ngResource']);

var api = "http://indoor-furbmobile2016.rhcloud.com/api";


app.run(function($rootScope, $loading) 
{    
    $rootScope.setLoading = function(loading) 
    {        
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

    $rootScope.tratarErro = function( response ) 
    {
        if (response.data)
          alert('Erro: ' + response.data.mensagem);
        else
          alert('Erro: ' + response);
    }
})
.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});