app.controller("CampusListController", function($scope, CampusService)
{
    $scope.campus = [];
    
    $scope.carregaCampuses = function() 
    {
        CampusService.query(function (campuses)
        {
            $scope.campuses = campuses;
        });
    };

    $scope.$on('$viewContentLoaded', function()
    {
        $scope.carregaCampuses();
    });
});

app.controller("CampusFormController", function($scope, $location, $rootScope, $routeParams, CampusService)
{
    $scope.campus = new CampusService();
    
    $scope.carregaCampus = function(id) 
    {
        CampusService.get({id: id}, function (campus)
        {
            $scope.campus = campus;
        });
    };

    $scope.$on('$viewContentLoaded', function()
    {
        if ($routeParams.id)
            $scope.carregaCampus($routeParams.id);
    });

    $scope.salvar = function() 
    {
        $rootScope.setLoading(true);

        $scope.campus.$save(function() 
        {
            $rootScope.setLoading(false);
            $location.url('/campus'); 
        });        
    };
});