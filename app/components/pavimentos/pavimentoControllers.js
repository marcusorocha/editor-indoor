app.controller("PavimentoListController", function($scope, $rootScope, $confirm, PavimentoService, BlocoService, CampusService)
{
    $scope.pavimentos = [];
    
    $scope.carregaPavimentos = function() 
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
                
                PavimentoService.query(function(pavimentos)
                {
                    for (var i in pavimentos)
                    {
                        var pavimento = pavimentos[i];                                        
                        pavimento.bloco = blocos.find(function( b ) { return b.id == this.idEdificio }, pavimento);
                    }

                    $scope.pavimentos = pavimentos;
                    $rootScope.setLoading(false);
                },
                onErro);
            },
            onErro);
        },
        onErro);
    };

    $scope.excluir = function(pavimento) 
    {
        $confirm({text: 'Você tem certeza que deseja remover ?', title: 'Exclusão', ok: 'Sim', cancel: 'Não'})
        .then(function() {
            pavimento.$delete({id: pavimento.id}, function()
            {                
                $scope.carregaPavimentos();
            }, 
            function(response) 
            {
                $rootScope.tratarErro(response);
            });
        });
    }

    $scope.$on('$viewContentLoaded', function()
    {
        $scope.carregaPavimentos();
    });
});

app.controller("PavimentoFormController", function($scope, $location, $rootScope, $routeParams, PavimentoService, BlocoService, CampusService)
{
    $scope.pavimento = new PavimentoService();
    $scope.blocos = [];

    $scope.carregaPavimento = function(id)
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
                
                if (id)
                {
                    PavimentoService.get({id: id}, function (pavimento)
                    {                    
                        $scope.pavimento = pavimento;               
                        $rootScope.setLoading(false);
                    },
                    onErro);
                }
                else
                {
                    $rootScope.setLoading(false);
                }
            },
            onErro);
        },
        onErro);
    };

    $scope.$on('$viewContentLoaded', function()
    {
        $scope.carregaPavimento($routeParams.id);
    });

    $scope.salvar = function() 
    {
        $rootScope.setLoading(true);

        $scope.pavimento.$save(function() 
        {
            $rootScope.setLoading(false);
            $location.url('/pavimentos');
        }, 
        function(response) 
        {
            $rootScope.setLoading(false);
            $rootScope.tratarErro(response);
        });
    };

    $scope.cancelar = function() 
    {
        $location.url('/pavimentos');
    }
});