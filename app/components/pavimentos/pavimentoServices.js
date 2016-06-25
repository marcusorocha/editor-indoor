var pavimentoServiceImpl = function ($resource)
{	
	var url = api + "/pavimento/:id";
	
	var params = {
            'get' : { method:'GET' },
           'save' : { method:'POST' },
          'query' : { method:'GET', isArray: true},
         'remove' : { method:'DELETE' },
    };
	
	return $resource(url, params);
};

services.factory('PavimentoService', ['$resource', pavimentoServiceImpl]);