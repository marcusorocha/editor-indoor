app.controller("MapaController", function($scope, $rootScope, $document, $routeParams, $uibModal, $log, PavimentoService, GrafoService, VerticeService, ArestaService)
{   
    $scope.params = $routeParams;
    $scope.planta = { };
    $scope.pavimento = { };
    $scope.grafo = { vertices: [], arestas: [] };
    
    $scope.$on('$viewContentLoaded', function() 
    {        
        $scope.editor = new EditorIndoor($document[0].getElementById("desenho"));
        $scope.carregaPavimento();
        $scope.carregaGrafo();
    });

    $scope.$on('$destroy', function() 
    {
        $scope.editor.dispose();
        delete $scope.editor;
    });
    
    $scope.salva = function()
    {
        $rootScope.setLoading(true);
        
        var fnError = function (error) 
        {
            $rootScope.setLoading(false);
            alert("Erro ao gravar as informações: " + error);
        };
        
        // Preparar o planta para ser enviada ao servidor
        $scope.planta.copiarParaServidor( $scope.pavimento.planta );
        
        PavimentoService.save($scope.pavimento, function(pavimento)
		{
            $scope.pavimento.id = pavimento.id;
            
            var vLista = $scope.listaVerticesJSON();
            
            VerticeService.saveAll( vLista, function( vListaSalva ) 
            {
                vListaSalva.forEach(function( vSalvo, index ) 
                {
                    var vertice = $scope.grafo.vertices[index];              
                    vertice.fromJSON( vSalvo );
                });
                
                var aLista = $scope.listaArestasJSON()
                
                ArestaService.saveAll( aLista, function( aListaSalva ) 
                {
                    aListaSalva.forEach(function( aSalvo, index ) 
                    {
                        var aresta = $scope.grafo.arestas[index];              
                        aresta.fromJSON( aSalvo );
                    });
                    
                    $rootScope.setLoading(false);
                    alert(" Informações gravadas com sucesso ");
                }, 
                fnError);
            }, 
            fnError);
            
            /*
            GrafoService.save(grafo, function(grafo) 
            {
                $scope.atualizarGrafo(angular.copy(grafo));
                $rootScope.setLoading(false);
                alert(" Informações gravadas com sucesso ");
            }, fnError);
            */
            
		}, fnError);
    };
    
    $scope.listaVerticesJSON = function() 
    {
        var lista = [];
        
        $scope.grafo.vertices.forEach(function( vertice ) 
        {
            var vJSON = vertice.toJSON();
            vJSON.idPavimento = $scope.pavimento.id;
            
            lista.push ( vJSON );
        });
        
        return lista;
    };
    
    $scope.listaArestasJSON = function() 
    {
        var lista = [];
        
        $scope.grafo.arestas.forEach(function( aresta ) 
        {    
            var aJSON = aresta.toJSON();
            aJSON.idPavimento = $scope.pavimento.id;
            
            lista.push( aJSON );
        });
        
        return lista;
    };
    
    $scope.novoVertice = function()
    {				
        var vertice = new Vertice();
        
        $scope.editor.adicionarObjeto( vertice );
        $scope.grafo.vertices.push( vertice );
        
        var selecao = $scope.editor.obterObjetoSelecionado();
        
        if ( selecao )
        {
            var aresta = new Aresta( vertice, selecao );
            
            $scope.editor.adicionarObjeto( aresta );
            $scope.grafo.arestas.push( aresta );
        }
    };
    
    $scope.removeSelecionado = function()
    {
        var selecao = $scope.editor.obterObjetoSelecionado();
        
        if (!selecao)
        {
            alert("Nenhum objeto selecionado");
            return;
        }
        
        if (selecao instanceof Vertice)
        {
            $scope.removerVertice( vertice, true );
            $scope.editor.limparSelecao();
        }
    };
    
    $scope.carregaGrafo = function() 
    {
        $rootScope.setLoading(true);
        
        var chave = { pid : $scope.params.pavimentoId };
               
        GrafoService.get(chave, function(grafo)
		{ 
            $scope.atualizarGrafo(angular.copy(grafo));            
            $rootScope.setLoading(false);
		});
    };
    
    $scope.atualizarGrafo = function( grafo ) 
    {
        $scope.limparGrafo();
        
        grafo.vertices.forEach(function( v ) 
        {
            var vertice = new Vertice();
            vertice.fromJSON( v );
    
            $scope.editor.adicionarObjeto( vertice );
            $scope.grafo.vertices.push( vertice );                
        });
        
        grafo.arestas.forEach(function( a )
        {
            var fnVerificaVertice = function( v ) 
            {
                return v.sid == this;
            };
            
            var vA = $scope.grafo.vertices.find(fnVerificaVertice, a.idVerticeA);
            var vB = $scope.grafo.vertices.find(fnVerificaVertice, a.idVerticeB);
            
            if (vA && vB)
            {
                var aresta = new Aresta( vA, vB );
                
                $scope.editor.adicionarObjeto( aresta );
                $scope.grafo.arestas.push( aresta );
            }
        });
    };
    
    $scope.limparGrafo = function() 
    {
        $scope.grafo.vertices.forEach(function(v)
        {
            $scope.removerVertice( v ); 
        });
        $scope.grafo.vertices = [];
        $scope.grafo.arestas = [];
    };
    
    $scope.removerVertice = function( vertice, removerDoGrafo ) 
    {
        vertice.arestas.forEach(function(a) {
            var idx = $scope.grafo.arestas.indexOf(a);
		    $scope.grafo.arestas.splice(idx, 1);
            $scope.editor.removerObjeto(a);
            a.dispose();
        }, this);
        
        if (removerDoGrafo)
        {
            var idx = $scope.grafo.vertices.indexOf(vertice);
		    $scope.grafo.vertices.splice(idx, 1);
        }
        
        $scope.editor.removerObjeto(vertice);
    };
    
    $scope.carregaPavimento = function() 
    {
        $rootScope.setLoading(true);
        
        var chave = { oid : $scope.params.pavimentoId };
               
        PavimentoService.get(chave, function(pavimento)
		{
			$scope.pavimento = angular.copy(pavimento);
            $scope.carregaPlanta();
            
            $rootScope.setLoading(false);
		});
    };
    
    $scope.carregaPlanta = function() 
    {
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };
        
        var onError = function ( xhr ) { alert(xhr.target.responseText); };
        var baseURL = api + '/plantas/obter';
        var params = '/' + $scope.params.edificioId + '/' + $scope.params.pavimentoId + '/';
        
        var planta = new Planta();
        planta.carregaPlanta(baseURL, params, function (planta) 
        {            
            $scope.planta = planta;
            $scope.planta.copiarDoServidor( $scope.pavimento.planta );
            $scope.editor.adicionarObjeto( $scope.planta );
            
        }, onProgress, onError);
    };
    
    $scope.enviaPlanta = function (size) 
    {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/components/indoor/plantaView.html',
            controller: 'PlantaController',
            resolve: {
                params: function () {
                    return $scope.params;
                }
            }
        });

        modalInstance.result.then(function () 
        {
            //$scope.selected = selectedItem;
        }, 
        function () 
        {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    $scope.propriedades = function () 
    {
        var modalPropriedades = $uibModal.open({
            templateUrl: 'app/components/mapa/propriedadesView.html',
            controller: 'PropriedadesController',
            resolve: {
                objeto: function () {
                    
                    var selecao = $scope.editor.obterObjetoSelecionado();
                    
                    if (selecao)                     
                        return selecao;
                    else
                        return $scope.planta;
                }
            }
        });

        modalPropriedades.result.then(function () 
        {
            //$scope.selected = selectedItem;
        }, 
        function () 
        {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});