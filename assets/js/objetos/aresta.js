var Aresta = function( vA, vB, acesso ) 
{
    THREE.Line.call( this );
    
    this.sid = 0;
    this.tipo = 0; // 0 = Caminho; 1 = Elevador; 2 = Escada; 3 = Rampa;
    this.acesso = (acesso) ? acesso : false;
    this.acessibilidade = true;    
    
    this.type = "Aresta";
    this.verticeA = vA;
	this.verticeB = vB;
    this.material = new THREE.LineBasicMaterial({ color: 0x0101F2 });        
    this.selecionavel = false;
    
    this.verticeA.addAresta(this);
    this.verticeB.addAresta(this);
    
    this.atualizar();
    
    console.log("aresta criada");
};

Aresta.prototype = Object.create( THREE.Line.prototype );
Aresta.prototype.constructor = Aresta;

Aresta.prototype.atualizar = function()
{
    var posA = this.verticeA.obterPosicao();
    var posB = this.verticeB.obterPosicao();
    
    posA.z -= 0.5;
    posB.z -= 0.5;
    
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(posA, posB);    
    this.geometry.verticesNeedUpdate = true;
    
    if (!this.acesso) this.custo = new THREE.Line3(posA, posB).distance();
};

Aresta.prototype.toJSON = function()
{   
    var json = {
        id: this.sid,
        idVerticeA: this.verticeA.sid,
        idVerticeB: this.verticeB.sid,
        custo: this.custo,
        acesso: this.acesso,
        acessibilidade: this.acessibilidade
    };
    
    return json;
}

Aresta.prototype.fromJSON = function( json ) 
{
    this.sid = json.id;
    this.acesso = json.acesso;
    this.acessibilidade = json.acessibilidade;
    this.custo = json.custo;
}

Aresta.prototype.dispose = function()
{
    this.verticeA.removeAresta(this);
    this.verticeB.removeAresta(this);
}