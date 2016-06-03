var Vertice = function()
{
    THREE.Mesh.call( this );
    
    this.sid = 0;
    this.tipo = 1;
    this.descricao = "";
    
    this.type = "Vertice";
    this.arestas = [];
    this.geometry = new THREE.CircleGeometry( 1, 32 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    this.selecionavel = true;
    
    console.log("vertice criado");    
};

Vertice.prototype = Object.create( THREE.Mesh.prototype );
Vertice.prototype.constructor = Vertice;

Vertice.prototype.addAresta = function( aresta ) 
{
    this.arestas.push( aresta );
};

Vertice.prototype.removeAresta = function( aresta )
{
    var idx = this.arestas.indexOf( aresta );
    this.arestas.splice( idx, 1 );
};

Vertice.prototype.atualizarArestas = function() 
{
    this.arestas.forEach(function(a) { a.atualizar(); }, this);
};

Vertice.prototype.obterPosicao = function() 
{
    return this.position;
};

Vertice.prototype.alterarPosicao = function( posicao )
{
    this.position.copy( posicao );    
    
    this.atualizarArestas();
};

Vertice.prototype.toJSON = function() 
{    
    var posicao = {
        x: this.position.x,
        y: this.position.y,
        z: this.position.z
    }
    
    var json = {
        id: this.sid,
        descricao: this.descricao,
        tipo: this.tipo,
        posicao: posicao,
    };
    
    return json;
};

Vertice.prototype.fromJSON = function(json) 
{        
    this.position.x = json.posicao.x;
    this.position.y = json.posicao.y;
    this.position.z = json.posicao.z;
    
    this.sid = json.id;
    this.descricao = json.descricao;
    this.tipo = json.tipo;
};