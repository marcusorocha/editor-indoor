var Vertice = function()
{
    THREE.Mesh.call( this );
    
    this.sid = 0;
    this.tipo = 1;
    this.icone = 1;
    this.descricao = "";
    this.identificacao = "";
    
    this.cores = {
        selecionado: 0xAAAAAA,
        deselecionado: 0xAE0000
    };
    
    this.type = "Vertice";
    this.arestas = [];
    this.geometry = new THREE.CircleGeometry( 1, 32 );
    this.material = new THREE.MeshBasicMaterial( { color: this.cores.deselecionado } );
    this.selecionavel = true;
    this.selecionado = false;        
    this.position.z = 1; // Fixando a posição do eixo Z
    
    console.log("vertice criado");
};

Vertice.prototype = Object.create( THREE.Mesh.prototype );
Vertice.prototype.constructor = Vertice;

Vertice.prototype.setSelecionado = function( valor )
{
    this.selecionado = valor;
    this.atualizarMaterial();
};

Vertice.prototype.atualizarMaterial = function()
{
    if (this.selecionado)
        this.material = new THREE.MeshBasicMaterial( { color: this.cores.selecionado } );
    else
        this.material = new THREE.MeshBasicMaterial( { color: this.cores.deselecionado } );
};

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
    return this.position.clone();
};

Vertice.prototype.alterarPosicao = function( posicao )
{        
    this.position.x = posicao.x;    
    this.position.y = posicao.y;
    
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
        identificacao: this.identificacao,
        descricao: this.descricao,  
        icone: this.icone,
        tipo: this.tipo,
        posicao: posicao
    };
    
    return json;
};

Vertice.prototype.fromJSON = function(json) 
{        
    this.position.x = json.posicao.x;
    this.position.y = json.posicao.y;
    this.position.z = json.posicao.z;
    
    this.sid = json.id;
    this.identificacao = json.identificacao;
    this.descricao = json.descricao;
    this.icone = json.icone;
    this.tipo = json.tipo;
};