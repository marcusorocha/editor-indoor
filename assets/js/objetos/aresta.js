var Aresta = function( vA, vB ) 
{
    THREE.Line.call( this );
    
    this.sid = 0;    
    this.type = "Aresta";
    this.verticeA = vA;
	this.verticeB = vB;    
    this.material = new THREE.LineBasicMaterial({ color: 0x000000 });    
    this.geometry.vertices = [this.verticeA.obterPosicao(), this.verticeB.obterPosicao()];
    this.selecionavel = false;
    
    this.verticeA.addAresta(this);
    this.verticeB.addAresta(this);
    
    console.log("aresta criada");
};

Aresta.prototype = Object.create( THREE.Line.prototype );
Aresta.prototype.constructor = Aresta;

Aresta.prototype.atualizar = function()
{
    this.geometry.vertices = [this.verticeA.obterPosicao(), this.verticeB.obterPosicao()];
    this.geometry.verticesNeedUpdate = true;
};

Aresta.prototype.toJSON = function() 
{
    var pvA = this.verticeA.obterPosicao();
    var pvB = this.verticeB.obterPosicao();
    
    var lineAB = new THREE.Line3( pvA, pvB );
    var custo = lineAB.distance();
    
    var json = {
        id: this.sid,
        idVerticeA: this.verticeA.sid,
        idVerticeB: this.verticeB.sid,
        custo: custo
    };
    
    return json;
}

Aresta.prototype.fromJSON = function( json ) 
{
    this.sid = json.id;
}

Aresta.prototype.dispose = function()
{
    this.verticeA.removeAresta(this);
    this.verticeB.removeAresta(this);
}