app.controller('PropriedadesController', function ($scope, $uibModalInstance, objeto) 
{
    $scope.objeto = objeto;
    
    $scope.isVertice = function () 
    {
        return objeto.type == "Vertice";
    }
    
    $scope.ok = function ()
    {
        $uibModalInstance.close();
    };

    $scope.cancel = function () 
    {
        $uibModalInstance.dismiss('cancel');
    };
});