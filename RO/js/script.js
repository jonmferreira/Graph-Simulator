class Retangulo {
  constructor(altura, largura) {
    this.altura = altura;
    this.largura = largura;
  }	
  calculaArea() {  
        return this.altura * this.largura;  
    }	
}
class Ponto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distancia(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.sqrt(dx*dx + dy*dy);
    }
}
var p = new Retangulo();
console.log(p);
console.log(gerarChamadas(100));

//================== teste acima		
var game = new Phaser.Game(800, 400, Phaser.CANVAS, 'phaser-id',
 { preload: preload, create: create, update: update, render:render});

function preload() {
    game.load.spritesheet('centroid', 'img/balls.png', 17, 17);
    game.load.spritesheet('button', 'img/button.png', 80, 20);
}
var points = [];
var parPoints = [];
var adjPesos = [];
var auxAdj=[];
var aux = [];
var setLP = [];
var overTap = false;
var currentPoint;
var centroid;
var inputType;
var lineOn=false;
var enterKey;
var connection = 0;
var grafo = [];
var linha = [];
var makeLine = false;
var peso='';
var enterStop;
var flag=false;
var enterOri;
var enterDest;
var ori='';
var dest='';
var style;
var show=1;
var avaliar = false;
var calculo_final= false;
var enlaces=[]
var etapa = {
	fase: 1, em_execucao:0
}

//Configuração de teclas de entrada de dados
function config_buttons(){
	console.log(etapa);
	//config teclas
	enterOri = game.input.keyboard.addKey(Phaser.Keyboard.O);
	enterDest = game.input.keyboard.addKey(Phaser.Keyboard.D);
	enterStop = game.input.keyboard.addKey(Phaser.Keyboard.S);
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

// funções de atualização
function create() {
	style ={font: "20px Arial",
		fill: "green",
        align: "center"
	} ;
	style_verticetxt ={font: "20px Courier",
		color: "YELLOWGREEN",
        align: "center"
	} ;
	game.stage.backgroundColor = '#191970';
	config_buttons();
	currentPoint = game.add.image(10, 10, 'centroid');
	currentPoint.anchor.set(0.5);
	currentPoint.alpha = 0.9;
	game.input.onTap.add(onTapHandler, this);
}

function update() {
    
    switch ( etapa.fase ){
    	case 1:
    	if(!spaceKey.isDown){
    		currentPoint.position.copyFrom(game.input.activePointer.position);
		}
		else{			
			currentPoint.visible=false;
	        currentPoint.inputEnabled=false;
	        etapa.fase=2;
			etapa.em_execucao = 0;	
			overTap= true;
		}
		break;
		case 2:
		  if ( etapa.em_execucao == 1  && enterStop.isDown){
		  	etapa.em_execucao = 0;
			etapa.fase = 3;
			flag=true;
            var inf= Number.MAX_SAFE_INTEGER;
            for(var i=0;i<points.length;i++){
                linha=[];
                grafo.push(linha);
                for(var j=0;j<points.length;j++){
                grafo[i].push(-1);//se tem ou nao ligação
                }
            }
            
            for(var k=0;k<auxAdj.length;k++){
                for(var i=0;i<points.length;i++){
                    if( (auxAdj[k].u-1) == i){
                        grafo[i][(auxAdj[k].v-1)] =parseInt(auxAdj[k].peso);
                        grafo[(auxAdj[k].v-1)][i] =parseInt(auxAdj[k].peso);
                    }
                }
            }
			calculo_final = true;
			show=1;
		  }
		  if (enterKey.isDown){
        	etapa.em_execucao = 1;
		  }

		  if ( etapa.em_execucao ){
		  	connectLine();
		  }

		  break;
		case 5:
		etapa.fase = 6;
		menorCaminho_init(parseInt(ori),parseInt(dest));
		calculo_final= false;
		break;
		default:
		console.log("saindo da faixa de fase");
	}
    
    if(calculo_final){
    	if(enterOri.isDown){
			var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to " + points.length, "peso"), 10);
			}while(isNaN(selection) || selection > points.length || selection < 1);
			peso = selection;
			ori = peso; 
			etapa.fase = 4;
			etapa.em_execucao =0;
			show =1;
        }
        if(enterDest.isDown){

        	var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to " + points.length, "peso"), 10);
			}while(isNaN(selection) || selection > points.length || selection < 1);
			peso = selection;
			dest = peso; 
			etapa.fase = 5;
			etapa.em_execucao =0;
			show =1;
			peso = '';	
        }
    }
    exibirLinhas();
}

function render(){
    var index=1;
    points.forEach(function(child) {
        game.debug.text(index, child.x - 10,child.y + 25, style_verticetxt.color,style_verticetxt.font);
        index+=1;
    });
    //setar um texto exatamento no meio da distancia entre os pontos
    for(var i=0;i<setLP.length;i++){
		 var mx = ( setLP[i].parPoints.p1.x + setLP[i].parPoints.p2.x )/2;
		 var my = ( setLP[i].parPoints.p1.y + setLP[i].parPoints.p2.y )/2;
         game.debug.text( auxAdj[i].peso, mx,my, "white", "20px Courier" );
    }
    for(var i =0;i<setLP.length;i++){
         game.debug.geom(setLP[i].linha);
    }      
	/*console.log("render"+etapa);
	if( connection==1	){
		console.log("entriu aqui render");	
		line = new Phaser.Line(parPoints[0].x,parPoints[0].y,currentPoint.x,currentPoint.y);
		console.log("entriu aqui render");
		console.log(line);
		game.debug.geom(line);		 
	}*/
}

// FUNÇÕES DE APOIO DO PROJETO
function ajuda(){
	show = 1;
	projeto();
}

function projeto(){
	if(show ==1){
		show++;
		if (etapa.fase < 3){
			alert("Coloque os pontos clicando.\n"+
		"Para encerrar a inserção de pontos aperte a tecla \"space\"."+
"\n\nPara começar a inserir as arestas aperte a tecla \"enter\" :"+
"\nDiga o valor do peso e clique nos dois vertices que deseja criar a aresta."+
"\n\nPara encerrar,aperte a tecla \"s\".");
		}else if (etapa.fase == 3){
			alert("Quando estiver pronto, aperte O e informe o ponto de origem.");
		}else if(etapa.fase == 4){
			alert("Quando estiver pronto, aperte D e informe o ponto de destino.");
		}
		else {
			alert("Analise o LOG de saída.");
		}
		
	}
	
}

// FUNÇÕES CHAVE DE EXECUÇÃO DO PROJETO
function atualizarLog(strvalue){
	document.getElementById("logview").textContent=strvalue;
}
function actionOnClick (valor) {
   atualizarLog("Peso acumulado: "+peso);
}
//Adiciona pontos na tela
function onTapHandler(pointer, doubleTap) {
    if (!overTap)
    {
        var img = game.add.sprite(game.input.activePointer.position.x, game.input.activePointer.position.y, 'centroid', 0);        
        img.anchor.set(0.5);
        img.alpha = 0.7;
        img.inputEnabled = true;
        img.input.enableDrag(true);
        img.defaultCursor = "move";
        points.push(img);
    }
}

function exibirLinhas(){
	if(makeLine){
        for(var i =0;i<setLP.length;i++){
            setLP[i].linha.fromSprite( setLP[i].parPoints.p1, setLP[i].parPoints.p2 );
        }
    }
}

function connectLine() {
   
    for(var i=0;i<points.length;i++){
       
        if(this.connection<2){
            console.log("ele esta tentando conectar linhas");
             points[i].events.onInputDown.add(getPoints, this,points[i]);
        }else{
			//TODO::DÁ PRA TRANSFORMAR ISSO AQUI NUMA ESTRUTURA MELHOR
			var aux = {
				u:0,
				v:0,
				peso:0,
				ocupado:0,
				linha:{},
				parPoints:[],
			}
			aux.u = adjPesos[0];
			aux.v = adjPesos[1];

            //aux.push(adjPesos[0]);//adjPesos é um vetor[2] que guarda o id do ponto escolhido
            //aux.push(adjPesos[1]);
            var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to 100", "peso"), 10);
			}while(isNaN(selection) || selection > 100 || selection < 1);
			peso = selection;
            aux.peso = peso;
            auxAdj.push(aux);//guarda as arestas  com infor de origem,destino e peso            
            aux =[];
            makeLine=true;
            line = new Phaser.Line(parPoints[0].x,parPoints[0].y,parPoints[1].x,parPoints[1].y);
            console.log("teste line");
            console.log(line);
			var aux = {
				u:0,
				v:0,
				peso:0,
				ocupado:0,
				linha:{},
				parPoints:{
						p1:{},p2:{}
				}
			}
			aux.linha = line;
            //aux.push(line);
			aux.parPoints.p1 = parPoints[0];
			aux.parPoints.p2 = parPoints[1];
            aux.peso = peso;
            setLP.push(aux);
			
			//setLP[i] eh um vetor de duas pocisoes = [ linha, parpoint[]  ]
			//parPoints é um vetor de duas pocisoes = [ ponto1,ponto2 ]
            
            this.connection=0;
            parPoints=[];
            aux=[];
            adjPesos = [];
            peso = '';
			atualizarLog("Peso acumulado: "+peso);
        }
    }
}
/*
CALCULO DE DISTANCIA
*/
var caminho=[];
var saida=[];
function menorCaminho_init(origem,destino){
	origem = origem;
	destino= destino;
    var dist = [];
    var visitados = [];
    var conj = [];
    var adj=[];
	caminho.push(origem);
	var vertices= points.length;
	var inf= Number.MAX_SAFE_INTEGER;
    for(var i =0;i<points.length;i++){
        dist.push(inf);
        visitados.push(false);
    }
    dist[origem-1]=0;
    conj.unshift(origem-1);
	var u=  conj[conj.length-1];
	menorCaminho_loop(u,destino,dist,conj,visitados,adj);
    console.log(dist);
	console.log(saida);
	//console.log(enlaces);
	str_saida= "distancia: "+JSON.stringify(dist)
	+"saida: "+ JSON.stringify(saida);
	atualizarLog(str_saida);
}

function menorCaminho_loop(u,fim,dist,conj,visitados,adj){
	var u=  conj[conj.length-1];
    conj.pop();

	if(visitados[u]==false){
		visitados[u]=true;
		adj = grafo[u];
		
		for(var i =0;i<adj.length;i++){
			if(adj[i]!=-1){//se tem ligação
				var v= i;
				if(dist[v] > dist[u]+grafo[u][v]){
					dist[v]= dist[u]+grafo[u][v];//atualiza
					caminho.push(v+1);
					conj.unshift( v );
					if ( caminho[caminho.length-1] == fim){
						saida=[];
						for ( var i=0; i< caminho.length; i++){
							saida.push(caminho[i]);
						}
					}else{
						menorCaminho_loop(v,fim,dist,conj,visitados,adj)
					}
					caminho.pop();
					visitados[v]=false;
				}
			}
		}
	}
}



function create_enlace(){
	var enlace = {
		noA: 0,
		noB : 0,
		peso : 0,
		y : [],
		firstfit: [],
		nome : function() {
			return this.noA + "-" + this.noB;
		},
		addComprimento_de_Onda: function(c_onda){
			this.y.push(c_onda);
			this.firstfit.push(true);
		}, 
		criar: function(a,b,peso){
			this.noA=a;
			this.noB=b;
			this.peso= peso;
		},
		checar_disponibilidade: function(c_onda){
			for( var i=0; i< y.length; i++){
				if( c_onda == this.y[i] && this.firstfit[i]){
					return i;
				}
			}
			return -1;
		}, 
		estabelecer_chamada: function(c_onda){
			var i = this.checar_disponibilidade(c_onda);
			if( i !=-1 ){
				this.firstfit[i]= false;
			}
		},
		getOnda_Livre: function(){
			for( var i=0; i< this.firstfit.length; i++){
				if ( this.firstfit[i]){
					return y[i];
				}
			}
			return "null";
		}
	};
	return enlace;
}

function getPoints (point) {
  
   adjPesos.push(points.indexOf(point)+1);
  
   this.connection+=1;
   parPoints.push(point);
}
function gerarChamadas(quantidade){
	var points= [0,0,0,0];
    chamadas ={
    	quantidade: quantidade,
    	buscas : [],
    	verificacoes : [/*{ rota:"1-2",caminho:'1-2', ditancia:120(int)}*/],
    	alocar_chamada : function(u,v){
    		var disponivel= true;
    		for (var i=0; i< this.buscas.length && disponivel;i++){
    			if( this.buscas[i].par == ""+u+"-"+v  || this.buscas[i].par == ""+v+"-"+u){
    				disponivel= false;
    			}
    		}
    		return disponivel;
    	}
    };
	for(var i=1;i<=quantidade;i++ ){
		var u = getRandomInt(1, points.length);
		var v = getRandomInt(1, points.length);
		while (u==v){
			var v = getRandomInt(1, points.length);
		}
		if (u>v){
			t =u; u=v; v=t;
		}
		chamada = {
			par:""+u+"-"+v,
			solicitacao:0,//quantidade de recorrencua
			caminhos:[
			/*{rota:'1-2',distancia:120(int)}*/] ,
			prob_erro: function(){
				return caminhos.length/solicitacao;
			}
		}
		chamadas.buscas.push(chamada);
	}
	return chamadas;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}