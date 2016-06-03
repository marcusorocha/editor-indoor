var Funcoes = {

    // Desenho do Plano Cartesiano
	desenhaPlanoCartesiano : function( scene, sru, cor, opacidade )
	{
		var material_linha_plano = new THREE.LineBasicMaterial({ color: cor, transparent: true, opacity: opacidade });

		var geometry_linhaX = new THREE.Geometry();

		geometry_linhaX.vertices.push(
			new THREE.Vector3( -sru, 0, 0 ),
			new THREE.Vector3( +sru, 0, 0 )
		);

		var geometry_linhaY = new THREE.Geometry();

		geometry_linhaY.vertices.push(
			new THREE.Vector3( 0, -sru, 0 ),
			new THREE.Vector3( 0, +sru, 0 )
		);

		var linhaX = new THREE.Line( geometry_linhaX, material_linha_plano );
		var linhaY = new THREE.Line( geometry_linhaY, material_linha_plano );

		scene.add( linhaX );
		scene.add( linhaY );
	},
    
    // Desenha uma linha
	desenhaLinha : function( scene, cor, pontoAx, pontoAy, pontoBx, pontoBy )
	{
		var material_linha_plano = new THREE.LineBasicMaterial({ color: cor, transparent: true, opacity: OPACIDADE_PLANO });

		var geometry_linha = new THREE.Geometry();

		geometry_linha.vertices.push(
			new THREE.Vector3( pontoAx, pontoAy, 0 ),
			new THREE.Vector3( pontoBx, pontoBy, 0 )
		);

		var linha = new THREE.Line( geometry_linha, material_linha_plano );

		scene.add( linha );

		return linha;
	},
    
    // Desenha uma linha pontilhada
	desenhaLinhaPontilhada : function( scene, cor, pontoAx, pontoAy, pontoBx, pontoBy )
	{
		var material_linha_plano = new THREE.LineDashedMaterial({color: cor, dashSize: 0.1, gapSize: 0.1});

		var geometry_linha = new THREE.Geometry();

		geometry_linha.vertices.push(
			new THREE.Vector3( pontoAx, pontoAy, 0 ),
			new THREE.Vector3( pontoBx, pontoBy, 0 )
		);

		var linha_pontilhada = new THREE.Line( geometry_linha, material_linha_plano );

		scene.add( linha_pontilhada );

		return linha_pontilhada;
	},
    
    // Desenha um Cículo
	desenhaCirculo : function( scene )
	{
		var geometry = new THREE.CircleGeometry( 0.2, 32 );
		var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		var circulo = new THREE.Mesh( geometry, material );

		scene.add( circulo );
        
        return circulo;
	},
    
    // Desenha um Texto
    desenhaTexto : function ( scene, texto, tamanho, cor, x, y )
	{
		var geo_texto = new THREE.TextGeometry(texto, { size: tamanho, height: 0 });
		var mat_texto = new THREE.MeshBasicMaterial( { color: cor } );
		var obj_texto = new THREE.Mesh( geo_texto, mat_texto );

		obj_texto.position.x = x;
		obj_texto.position.y = y;

		scene.add( obj_texto );
	},
    
    // Retorna o Ponto de Intersecção entre a posição (x, y) e o objeto_grafico.
    retornaPontoIntersecao : function( camera, coordenadas, objeto_grafico )
	{
	    //coordenadas.unproject( camera );

		// criar um raio com base na posição atual da câmera
		// assim sabemos a face que está virada para a câmera no momento
		//var raycaster = new THREE.Raycaster(camera.position, coordenadas.sub(camera.position).normalize());
		
		var pos = new THREE.Vector2();
		var raycaster = new THREE.Raycaster();
		
		pos.x = coordenadas.x;
		pos.y = coordenadas.y;
		
		raycaster.setFromCamera( pos, camera );

		var intersects = raycaster.intersectObject(objeto_grafico);

		// se o raio tiver intersecção com a superfície
		// executa a função para distorcer
		if (intersects.length)
		{
			return intersects[0].point;
		}

		return null;
	},
	
	destruirObjeto: function( obj )
    {
        if (obj !== null)
        {
            for (var i = 0; i < obj.children.length; i++)
            {
                this.destruirObjeto(obj.children[i]);
            }
            if (obj.geometry)
            {
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if (obj.material)
            {
                if (obj.material.materials)
                {
                    for (i = 0; i < obj.material.materials.length; i++)
                    {
                        obj.material.materials[i].dispose();
                    }
                }
                else
                {
                    obj.material.dispose();
                }
                obj.material = undefined;
            }
            if (obj.texture)
            {
                obj.texture.dispose();
                obj.texture = undefined;
            }
        }
        obj = undefined;
    }
}