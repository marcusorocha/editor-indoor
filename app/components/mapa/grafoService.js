var grafoServiceImpl = function ($resource)
{	
	var url = api + "/grafo/:pid";
	
	var acoes = {
					'get':    {method:'GET'},
					'save':   {method:'POST'},
					'query':  {method:'GET'},
					'remove': {method:'DELETE'},
				};
	
	return $resource(url, acoes);
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
        saveAll: { method:'POST', isArray: true }
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
        saveAll: { method:'POST', isArray: true }
    };
	
	return $resource(url, params, acoes);
};

services.factory('GrafoService', ['$resource', grafoServiceImpl]);
services.factory('VerticeService', ['$resource', verticeServiceImpl]);
services.factory('ArestaService', ['$resource', arestaServiceImpl]);