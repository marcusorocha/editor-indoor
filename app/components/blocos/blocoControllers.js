app.controller("BlocoListController", function($scope, $rootScope, $confirm, BlocoService, CampusService)
{
    $scope.blocos = [];
    
    $scope.carregaBlocos = function() 
    {
        $rootScope.setLoading(true);

        function onErro(response)
        {
            $rootScope.setLoading(false);
            $rootScope.tratarErro(response);    
        }

        CampusService.query(function(campus)
        {
            BlocoService.query(function(blocos)
            {
                for (var i in blocos)
                {
                    var bloco = blocos[i];                                        
                    bloco.campus = campus.find(function( c ) { return c.id == this.idCampus }, bloco);
                }
                $scope.blocos = blocos;
                $rootScope.setLoading(false);
            },
            onErro);
        },
        onErro);
    };

    $scope.excluir = function(bloco) 
    {
        $confirm({text: 'Você tem certeza que deseja remover ?', title: 'Exclusão', ok: 'Sim', cancel: 'Não'})
        .then(function() {
            bloco.$delete({id: bloco.id}, function()
            {                
                $scope.carregaBlocos();
            }, 
            function(response) 
            {
                $rootScope.tratarErro(response);
            });
        });
    }

    $scope.$on('$viewContentLoaded', function()
    {
        $scope.carregaBlocos();
    });
});

app.controller("BlocoFormController", function($scope, $location, $rootScope, $routeParams, BlocoService, CampusService)
{
    $scope.bloco = new BlocoService();
    $scope.campus = [];

    $scope.carregaBloco = function(id) 
    {
        $rootScope.setLoading(true);

        function onErro(response)
        {
            $rootScope.setLoading(false);
            $rootScope.tratarErro(response);    
        }

        CampusService.query(function(campus)
        {
            $scope.campus = campus;

            BlocoService.get({id: id}, function (bloco)
            {                
                $scope.bloco = bloco;                
                $rootScope.setLoading(false);
            },
            onErro);
        },
        onErro);
    };

    $scope.$on('$viewContentLoaded', function()
    {
        if ($routeParams.id)
            $scope.carregaBloco($routeParams.id);
    });

    $scope.salvar = function() 
    {
        $rootScope.setLoading(true);

        $scope.bloco.$save(function() 
        {
            $rootScope.setLoading(false);
            $location.url('/blocos');
        }, 
        function(response) 
        {
            $rootScope.setLoading(false);
            $rootScope.tratarErro(response);
        });
    };

    $scope.cancelar = function() 
    {
        $location.url('/blocos');
    }
});