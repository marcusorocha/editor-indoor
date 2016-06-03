app.controller('PlantaController', function ($scope, $uibModalInstance, $sce, params) 
{
    $scope.formURL = $sce.trustAsResourceUrl(api + "/plantas/enviar");
    $scope.params = params;
    
    $scope.ok = function ()
    {
        $uibModalInstance.close();
    };

    $scope.cancel = function () 
    {
        $uibModalInstance.dismiss('cancel');
    };
});