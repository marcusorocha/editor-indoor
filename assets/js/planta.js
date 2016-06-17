var Planta = function()
{
    THREE.Object3D.call( this );
    
    this.type = "Planta";
    this.selecionavel = false;
    this.escala = this.escalaCalculada = 1;
    this.rotacao = this.rotacaoCalculada = 0;
    
    console.log("planta criada");
};

Planta.prototype = Object.create( THREE.Object3D.prototype );
Planta.prototype.constructor = Planta;

Planta.prototype.carregaPlanta = function(baseURL, params, fnSucesso, fnProgress, fnErro)
{
    var self = this;
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath( baseURL );
    objLoader.load( params + 'obj', function ( object ) 
    {
        var material = new THREE.LineBasicMaterial({ color: 0x000000 });
             
        object.traverse(function (child)
        { 
            if (child instanceof THREE.Line)
            {
                child.material = material;
            }
        });
        
        var box = new THREE.Box3().setFromObject( object );
        var center = box.center();
        
        object.position.x = center.x * -1;
        object.position.y = center.y * -1;
        object.position.z = 0;
                                
        self.add( object );
        
        if (fnSucesso) fnSucesso(self);
                                        
    }, fnProgress, fnErro );
};

Planta.prototype.updateMatrix = function () 
{
    if (this.escala != this.escalaCalculada)
    {
        this.scale.x = this.scale.y = this.scale.z = this.escala / 100;
        this.escalaCalculada = this.escala;   
    } 
    
    if (this.rotacao != this.rotacaoCalculada)
    {
        this.rotation.z = (Math.PI / 180) * this.rotacao;
        this.rotacaoCalculada = this.rotacao;
    }
    
    THREE.Object3D.prototype.updateMatrix.call(this);
};

Planta.prototype.copiarDoServidor = function( config ) 
{            
    this.escala = config.escala; // % de escala
    this.rotacao = config.rotacao; // Angulo de rotação
    this.position.x = config.posicao.x; // Posicao X
    this.position.y = config.posicao.y; // Posicao Y
    this.position.z = config.posicao.z; // Posicao Z
};

Planta.prototype.copiarParaServidor = function( config ) 
{            
    config.escala = this.escala; // % de escala
    config.rotacao = this.rotacao; // Angulo de rotação
    config.posicao.x = this.position.x; // Posicao X
    config.posicao.y = this.position.y; // Posicao Y
    config.posicao.z = this.position.z; // Posicao Z
};