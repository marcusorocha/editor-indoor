var grafoServiceImpl = function ($http)
{	
	var baseUrl = api + "/grafo";
	
	var service = { };
    
    service.getPavimento = function(id) 
    {
        return $http.get(baseUrl + "/pavimento/" + id);        
    }
                
	return service;
};

var verticeServiceImpl = function ($resource)
{	
	var url = api + "/vertice/:id";
	
	var params = {
            'get' : {method:'GET'},
           'save' : {method:'POST'},
          'query' : {method:'GET'},
         'remove' : {method:'DELETE'},
    };
    
    var acoes = {
        saveAll: { method:'POST', isArray: true, url: api + "/vertice/saveAll" },
        queryEdificio: { method:'GET', isArray: true, url: api + "/vertice/edificio/:id" }
    };
	
	return $resource(url, params, acoes);
};

var arestaServiceImpl = function ($resource)
{	
	var url = api + "/aresta/:id";
	
	var params = {
            'get' : {method:'GET'},
           'save' : {method:'POST'},
          'query' : {method:'GET'},
         'remove' : {method:'DELETE'},
    };
    
    var acoes = {
        saveAll: { method:'POST', isArray: true, url: api + "/aresta/saveAll" },
    };
	
	return $resource(url, params, acoes);
};

services.factory('GrafoService', ['$http', grafoServiceImpl]);
services.factory('VerticeService', ['$resource', verticeServiceImpl]);
services.factory('ArestaService', ['$resource', arestaServiceImpl]);