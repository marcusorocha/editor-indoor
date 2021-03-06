// Definição das Constantes
const SRU = 40;
const COR_PLANO = 0x000000;
const OPACIDADE_PLANO = 0.6;

const RAIO_CIRCULO = 4;
const ANGULO_INICIAL_QUADRANTE = 0;

// Definição da Classe do Editor de Mapas Indoor
function EditorIndoor( container )
{
	var id;
	var renderer;
	var scene;
	var camera;
	var	editor;
	var	plane;
	var	quadrante;
	var	objeto_pressionado;
	var	objeto_selecionado;
	var width, height;
	var mouse_pressed = false;
	var objetos = [];
	
	this.obterObjetos = function() 
	{
		return objetos;
	},
	
	this.adicionarObjeto = function( objeto ) 
	{
		scene.add( objeto );
		objetos.push( objeto );
	},
	
	this.removerObjeto = function( objeto ) 
	{
		var idx = objetos.indexOf(objeto);
		objetos.splice(idx, 1);		
		scene.remove( objeto );	
	},
	
	this.atualizarSelecao = function( objeto ) 
	{
		editor.limparSelecao();
		
		if ( objeto )
		{
			objeto_selecionado = objeto;
			objeto_selecionado.setSelecionado( true );
		}	
	},
	
	this.limparSelecao = function() 
	{
		if (objeto_selecionado)
		{
			objeto_selecionado.setSelecionado( false );
			objeto_selecionado = null;
		}
	},
	
	this.obterObjetoSelecionado = function()
	{
		return objeto_selecionado;
	},
	
	this.retornaPontoMouse = function( e, objeto_grafico )
	{
		var coordenadas = editor.obterCoordenadasMouse( e );

		return Funcoes.retornaPontoIntersecao( camera.cameraO, coordenadas, objeto_grafico );
	},

	this.retornaPontoToque = function( touch, objeto_grafico )
	{
		var coordenadas = editor.obterCoordenadasToque( touch );

		return Funcoes.retornaPontoIntersecao( camera.cameraO, coordenadas, objeto_grafico );
	},
	
	this.retornaObjetoClicado = function ( clique )
	{		
		return editor.retornaObjetoEvento( clique, editor.retornaPontoMouse );
	},
	
	this.retornaObjetoTocado = function ( toque )
	{		
		return editor.retornaObjetoEvento( toque, editor.retornaPontoToque );
	},
	
	this.retornaObjetoEvento = function ( e, fnChecagem )
	{
		var retorno = null;
		
		objetos.forEach(function(og) 
		{
			if (og.selecionavel)
			{ 
				if (fnChecagem( e, og ))
				{
					retorno = og;
				}
			}
		}, this);
		
		return retorno;
	},
	
	this.obterCoordenadasToque = function( toque ) 
	{
		// pega a posição do toque
		var touchX = touch.pageX;
		var touchY = touch.pageY;

		touchX =  (touchX / width) * 2 - 1;
		touchY = -(touchY / height) * 2 + 1;
		
		// retorna um vetor com as coordenadas
		return new THREE.Vector3(touchX, touchY, 0.5);
	},
	
	this.obterCoordenadasMouse = function( e ) 
	{
		// pega a posição do evento
		var mouseX = e.offsetX || e.clientX;
		var mouseY = e.offsetY || e.clientY;

		mouseX = (mouseX / width) * 2 - 1;
		mouseY = -(mouseY / height) * 2 + 1;
		
		// retorna um vetor com as coordenadas
		return new THREE.Vector3(mouseX, mouseY, 0.5);
	},

	// criando um objeto com todos os callbacks
	this.callbacks =
	{
		/**
		* Executado quando a janela for redimensionada
		*/
		onResize: function()
		{

			//recalculando o aspect ratio com base no novo tamanho da janela
			//camera.aspect = window.innerWidth / window.innerHeight;

			//atualizando a matriz de projeção da câmera
			//camera.updateProjectionMatrix();

			//atualizando as dimensões do renderizador
			//renderer.setSize( window.innerWidth, window.innerHeight );
		},

		/**
		* Executado quando o usuário fizer um clique com o mouse
		*
		* @param {Evento} e Recebe como parâmetro, o objeto do evento disparado
		*/
		onMouseDown: function(e)
		{
			//atualizando a variável global que indica se o mouse ainda está pressionado ou não
			mouse_pressed = true;						
			
			objeto_pressionado = editor.retornaObjetoClicado( e );
			
			editor.atualizarSelecao( objeto_pressionado );
		},

		/**
		* Executado quando o mouse se mover
		*
		* @param {Evento} e Recebe como parâmetro, o objeto do evento disparado
		*/
		onMouseMove: function( e )
		{
			e.preventDefault();

			if ( mouse_pressed )
			{
				if ( objeto_pressionado )
				{
					var ponto = editor.retornaPontoMouse( e, plane );
					objeto_pressionado.alterarPosicao( ponto );
				}
			}
		},

		/**
		* Executado quando o usuário soltar o clique do mouse
		*/
		onMouseUp: function()
		{			
			//atualizando a variável global que indica se o mouse ainda está pressionado ou não
			mouse_pressed = false;
			objeto_pressionado = null;
		},

		/**
		* Evitando que o usuário selecione o conteúdo html
		* Como por padrão, ao clicar segurar e arrastar o navegador exibe o cursor de seleção
		* Retornamos false para não permitir que nenhum conteúdo seja selecionado, prejudicando assim a experiência do usuário
		*/
		onSelectStart: function()
		{
			return false;
		},

		onTouchStart: function( e )
		{
			if ( e.touches.length === 1 )
			{
				e.preventDefault();
				
				var touch = e.touches[0];
												
				objeto_pressionado = editor.retornaObjetoTocado( touch, selecao );
				
				editor.atualizarSelecao( objeto_pressionado );
			}
		},

		onTouchMove: function( e )
		{
			if ( e.touches.length === 1 )
			{
				e.preventDefault();

				var touch = e.touches[0];

				if (objeto_pressionado)
				{
					var ponto = editor.retornaPontoToque( touch, plane );
					objeto_pressionado.alterarPosicao( ponto );
				}
			}
		},

		onTouchEnd: function( e )
		{
			objeto_pressionado = null;
		}
	},

	this.inicializar = function( container )
	{
		editor = this;
		
		width = container.clientWidth;
		height = container.clientHeight;
		
		camera = new THREE.CombinedCamera( width / 2, height / 2, 70, 1, 1000, - 500, 1000 );
		
		// Configurações de Câmera
		camera.toOrthographic();
		//camera.toTopView();
		camera.setZoom(8);
		//camera.rotateZ(0.5 * Math.PI);
		//camera.translateX(800);
		//camera.translateY(-700);
		//camera.setFov( 70 );
		//camera.setLens( 12 );
		
		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer({ antialias: true });

		renderer.setSize( width, height );
		renderer.setClearColor( 0xf0f0f0 );
		renderer.setPixelRatio( window.devicePixelRatio );

		container.appendChild( renderer.domElement );		

		var plane_geometry = new THREE.PlaneGeometry( width, height, 4, 4 );
		var plane_material = new THREE.MeshBasicMaterial( {color: 0xDDDDDD, side: THREE.DoubleSide} );

		plane = new THREE.Mesh( plane_geometry, plane_material );

		scene.add( plane );
		
		Funcoes.desenhaPlanoCartesiano( scene, SRU, COR_PLANO, OPACIDADE_PLANO );

		var render = function ()
		{
			id = requestAnimationFrame( render );

			renderer.render(scene, camera);
		};

		render();

		// disparando os callbacks quando...
		container.addEventListener('resize', this.callbacks.onResize, false); //redimensionar a janela
		container.addEventListener('mousedown', this.callbacks.onMouseDown, false); //clicar
		container.addEventListener('mousemove', this.callbacks.onMouseMove, false); //mover o mouse
		container.addEventListener('mouseup', this.callbacks.onMouseUp, false); //soltar o clique

		container.addEventListener( 'touchstart', this.callbacks.onTouchStart, false );
		container.addEventListener( 'touchmove', this.callbacks.onTouchMove, false );
		container.addEventListener( 'touchend', this.callbacks.onTouchEnd, false );

		//quando o conteúdo html do renderer for selecionado
		container.addEventListener('selectstart', this.callbacks.onSelectStart, false);
	},
	
	this.dispose = function() 
	{
		cancelAnimationFrame( id );
		
		renderer.dispose();
		
		Funcoes.destruirObjeto( scene );		
		
		scene = null;
		plane = null;
		camera = null;
		objetos = null;
		renderer = null;
		
		// disparando os callbacks quando...
		container.removeEventListener( 'resize', this.callbacks.onResize ); //redimensionar a janela
		container.removeEventListener( 'mousedown', this.callbacks.onMouseDown ); //clicar
		container.removeEventListener( 'mousemove', this.callbacks.onMouseMove ); //mover o mouse
		container.removeEventListener( 'mouseup', this.callbacks.onMouseUp ); //soltar o clique

		container.removeEventListener( 'touchstart', this.callbacks.onTouchStart );
		container.removeEventListener( 'touchmove', this.callbacks.onTouchMove );
		container.removeEventListener( 'touchend', this.callbacks.onTouchEnd );

		//quando o conteúdo html do renderer for selecionado
		container.removeEventListener('selectstart', this.callbacks.onSelectStart );
	},

	this.limpar = function() 
    {
        for (var i = scene.children.length - 1; i >= 0 ; i--) 
        {
            var child = scene.children[ i ];

            if (child !== camera ) { // camera are stored earlier
                scene.remove(child);
            }
        }
    }
	
	this.inicializar( container );
};