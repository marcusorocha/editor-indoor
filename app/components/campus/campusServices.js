var campusServiceImpl = function ($resource)
{	
	var url = api + "/campus/:id";
	
	var params = {
            'get' : {method:'GET'},
           'save' : {method:'POST'},
          'query' : {method:'GET', isArray: true},
         'remove' : {method:'DELETE'},
    };
	
	return $resource(url, params);
};

services.factory('CampusService', ['$resource', campusServiceImpl]);