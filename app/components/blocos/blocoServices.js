var blocoServiceImpl = function ($resource)
{	
	var url = api + "/bloco/:id";
	
	var params = {
            'get' : { method:'GET' },
           'save' : { method:'POST' },
          'query' : { method:'GET', isArray: true},
         'remove' : { method:'DELETE' },
    };
	
	return $resource(url, params);
};

services.factory('BlocoService', ['$resource', blocoServiceImpl]);