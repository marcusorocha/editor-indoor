app.controller("CampusListController", function($scope, $rootScope, $confirm, CampusService)
{
    $scope.campus = [];
    
    $scope.carregaCampuses = function() 
    {
        $rootScope.setLoading(true);

        CampusService.query(function (campuses)
        {
            $scope.campuses = campuses;
            $rootScope.setLoading(false);
        }, 
        function(erro) 
        {
            $rootScope.setLoading(false);    
        });
    };

    $scope.excluir = function(campus) 
    {
        $confirm({text: 'Você tem certeza que deseja remover ?', title: 'Exclusão', ok: 'Sim', cancel: 'Não'})
        .then(function() {
            campus.$delete({id: campus.id}, function()
            {                
                $scope.carregaCampuses();
            }, 
            function(response) 
            {
                $rootScope.tratarErro(response);
            });
        });
    }

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
        }, 
        function(response) 
        {
            $rootScope.setLoading(false);
            $rootScope.tratarErro(response);
        });
    };

    $scope.cancelar = function() 
    {
        $location.url('/campus');
    }
});