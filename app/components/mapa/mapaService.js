'use strict';

var mapaServiceImpl = function ($http)
{
    var url = api + "/mapa";
    
    var DAO = { };

    /*
    DAO.obterEstrutura = function ()
    {
        return $http.get(url + '/salvar');
    };
    */
    
    return DAO;
}

services.factory('MapaService', ['$http', estruturaServiceImpl]);