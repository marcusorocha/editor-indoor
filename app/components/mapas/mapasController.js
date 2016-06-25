app.controller('MapasController', function($scope, $filter, TreeViewService, EstruturaService, $rootScope, $document, $routeParams, $uibModal, $log, PavimentoService, GrafoService, VerticeService, ArestaService) {

    var service = new TreeViewService;

    $scope.estService = service;
    $scope.estrutura;
    $scope.pavimento;
    $scope.planta;    
    $scope.grafo = { vertices: [], arestas: [] };

    $scope.$on('$viewContentLoaded', function()
    {
        $scope.editor = new EditorIndoor($document[0].getElementById("desenho"));
        $scope.carregaEstrutura();
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
        
        // Preparar os dados da planta para serem enviados ao servidor
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
    
    $scope.carregaEstrutura = function() 
    {
        EstruturaService.obterEstrutura().success(function (estrutura)
        {            
            $scope.estrutura = $filter('orderBy')(estrutura, "nome");

            for (var c in $scope.estrutura)
            {
                var campus = $scope.estrutura[c];                            
                var nodeCampus = { id: campus.id, name: campus.nome, children: [] };

                campus.edificios = $filter('orderBy')(campus.edificios, "nome");

                for (var b in campus.edificios)
                {
                    var bloco = campus.edificios[b];
                    var nodeBloco = { id: bloco.id, name: bloco.nome, children: [] };

                    bloco.pavimentos = $filter('orderBy')(bloco.pavimentos, "nivel");

                    for (var p in bloco.pavimentos)
                    {
                        var pavimento = bloco.pavimentos[p];
                        var nodePavimento = { 
                            id: pavimento.id, 
                            name: 'Pavimento ' + pavimento.nivel,
                            data: pavimento 
                        };

                        nodeBloco.children.push(nodePavimento);
                    }

                    nodeCampus.children.push(nodeBloco);
                }

                $scope.estService.nodes.push(nodeCampus);                
            }
        });
    };

    $scope.selecionaPavimento = function(pavimento) 
    {
        $rootScope.setLoading(true);            
        
        $scope.pavimento = angular.copy(pavimento);
        $scope.editor.limpar();
        $scope.carregaPlanta();
        $scope.carregaGrafo();
    };

    $scope.carregaPlanta = function() 
    {
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };
        
        var onError = function ( xhr ) 
        { 
            alert(xhr.target.responseText);
            $rootScope.setLoading(false);  
        };

        var baseURL = api + '/plantas/obter';
        var params = '/' + $scope.pavimento.idEdificio + '/' + $scope.pavimento.id + '/';
        
        var planta = new Planta();
        planta.carregaPlanta(baseURL, params, function (planta) 
        {            
            $scope.planta = planta;
            $scope.planta.copiarDoServidor( $scope.pavimento.planta );
            $scope.editor.adicionarObjeto( $scope.planta );
            
            $rootScope.setLoading(false);

        }, onProgress, onError);
    };

    $scope.carregaGrafo = function() 
    {
        $rootScope.setLoading(true);
               
        GrafoService.getPavimento($scope.pavimento.id).then
        (
            function(response)
            { 
                $scope.atualizarGrafo(angular.copy(response.data));            
                $rootScope.setLoading(false);
            }, 
            function(erro) 
            {            
                $rootScope.setLoading(false);
                alert(erro); 
            }
        );
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
            
            var fnAdicionaAresta = function( vA, vB )
            {
                if (vA && vB)
                {
                    var aresta = new Aresta( vA, vB );
                    aresta.fromJSON( a );
                                    
                    $scope.grafo.arestas.push( aresta );
                    
                    // Somente será apresentado se "não" for uma aresta de "Acesso"
                    if (!a.acesso) $scope.editor.adicionarObjeto( aresta );
                }
            }
            
            var fnCriarVertice = function(sid, fnOnComplete)
            {
                VerticeService.get({ id: sid }, function(v)
                {
                    var vertice = new Vertice();
                    vertice.fromJSON( v );
                    fnOnComplete(vertice);
                });
            }
            
            var vA = $scope.grafo.vertices.find(fnVerificaVertice, a.idVerticeA);
            var vB = $scope.grafo.vertices.find(fnVerificaVertice, a.idVerticeB);
            
            if (a.acesso)
            {
                if (vA == undefined) 
                {
                    fnCriarVertice(a.idVerticeA, function( vA ) 
                    {
                        fnAdicionaAresta(vA, vB);
                    });
                } 
                else 
                {
                    fnCriarVertice(a.idVerticeB, function( vB ) 
                    {
                        fnAdicionaAresta(vA, vB);
                    });
                }
            } 
            else 
            {
                fnAdicionaAresta(vA, vB);
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

    $scope.$watch('estService.selectedNode', function() 
    {
        if (service.selectedNode)
        {
            if (service.selectedNode.data)
            {                                
                $scope.selecionaPavimento(service.selectedNode.data);
            }
        }
    });

    $scope.enviaPlanta = function (size) 
    {
        var modalInstance = $uibModal.open({
            templateUrl: 'app/components/mapas/planta/plantaView.html',
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
            templateUrl: 'app/components/mapas/propriedades/propriedadesView.html',
            controller: 'PropriedadesController',
            resolve: {
                objeto: function () 
                {    
                    var selecao = $scope.editor.obterObjetoSelecionado();
                    
                    if (selecao)                     
                        return selecao;
                    else
                        return $scope.planta;
                },
                grafo : function()
                {
                    return $scope.grafo;   
                },
                edificioId : function()
                {
                    return $scope.pavimento.idEdificio;  
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