app.controller("EstruturaController", function($scope, EstruturaService)
{
    $scope.estrutura;
    
    $scope.carregaEstrutura = function() 
    {
        EstruturaService.obterEstrutura().success(function (estrutura)
        {
            $scope.estrutura = estrutura;
        });
    }
});