app.controller('PropriedadesController', function ($scope, $rootScope, $uibModalInstance, VerticeService, objeto, grafo, edificioId) 
{
    $scope.objeto = objeto;
    $scope.acesso = { };
    
    $scope.init = function() 
    {
        if ($scope.isVertice())
        {   
            $scope.onChangeTipo();
        }
    }
    
    $scope.onChangeTipo = function()
    {
        if ($scope.isAcesso())
        {
            $rootScope.setLoading(true);
            
            // Carregar os vertices dos outros pavimentos - Acima e Abaixo
            VerticeService.queryEdificio({ id: edificioId }, 
            function(vertices)
            {
                $scope.vertices = vertices;
                $rootScope.setLoading(false);
            },
            function(error)
            {
                $rootScope.setLoading(false);
            });
        }
    }
    
    $scope.getPontaDestino = function(aresta)
    {
        return (aresta.verticeB.sid == objeto.sid) ? "A" : "B";
    }
    
    $scope.getDestino = function(aresta)
    {
        if (aresta.verticeB.sid == objeto.sid) {
            return aresta.verticeA;
        } else {
            return aresta.verticeB;
        }
    }
    
    $scope.salvaAcesso = function() 
    {        
        var vDestino = new Vertice();
        vDestino.fromJSON($scope.acesso.destino);
        
        var aresta;
        
        if ($scope.acesso.id) {
            aresta = grafo.arestas.find(function(a) { return a.sid == this }, $scope.acesso.id);
        } else {
            aresta = new Aresta(objeto, vDestino, true );
        }
        
        aresta.custo = $scope.acesso.custo;
        
        if (aresta.sid)
        {
            for(var i in grafo.arestas)
            {
                if (grafo.arestas[i].sid == aresta.sid)
                {
                    grafo.arestas[i] = aresta;
                }
            }
        }
        else
        {
            grafo.arestas.push(aresta);
        }

        $scope.acesso = { };
    }
    
    $scope.alterarAcesso = function( aresta ) 
    {
        var vDestino = $scope.getDestino(aresta);
        
        $scope.acesso.destino = $scope.vertices.find(function(v) { return v.id == this.sid }, vDestino);        
        $scope.acesso.id = aresta.sid;
        $scope.acesso.custo = aresta.custo;
        $scope.acesso.ponta = $scope.getPontaDestino(aresta);
    }
    
    $scope.isVertice = function () 
    {
        return objeto.type == "Vertice";
    }
    
    $scope.isTipo = function ( tipo ) 
    {
        return $scope.isVertice() && (objeto.tipo == tipo);
    }
    
    $scope.isConector = function () 
    {
        return $scope.isTipo(1);
    }
    
    $scope.isAcesso = function () 
    {
        return $scope.isTipo(3);
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