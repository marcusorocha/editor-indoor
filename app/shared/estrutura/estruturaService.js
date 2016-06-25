'use strict';

var estruturaServiceImpl = function ($http)
{
    var url = api + "/estrutura";
    
    var DAO = { };

    DAO.obterEstrutura = function ()
    {
        return $http.get(url + '/obter');
    };

	DAO.listaCampuses = function ()
    {
        return $http.get(url + '/campus');
    };
    
    return DAO;
}

services.factory('EstruturaService', ['$http', estruturaServiceImpl]);