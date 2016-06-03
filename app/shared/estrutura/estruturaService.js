'use strict';

var estruturaServiceImpl = function ($http)
{
    var url = api + "/estrutura";
    
    var DAO = { };

    DAO.obterEstrutura = function ()
    {
        return $http.get(url + '/obter');
    };
    
    return DAO;
}

var pavimentoServiceImpl = function ($resource)
{	
	var url = api + "/pavimento/:oid";
	
	var acoes = {
					'get':    {method:'GET'},
					'save':   {method:'POST'},
					'query':  {method:'GET', isArray:true},
					'remove': {method:'DELETE'},
				};
	
	return $resource(url, acoes);
};

services.factory('EstruturaService', ['$http', estruturaServiceImpl]);
services.factory('PavimentoService', ['$resource', pavimentoServiceImpl]);