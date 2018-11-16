class Grafo{
	
	constructor(quantidadePoints){
		this.infinito = Number.MAX_SAFE_INTEGER;
		this.lengthVertices = quantidadePoints;
		this.inicializarGrafo();
	}
	Infinito(){
		return this.infinito;
	}
	inicializarGrafo(){
		this.matrizADJ = [];
		for(var i=0;i< this.lengthVertices;i++){
	        let linha=[];
	        this.matrizADJ.push(linha);
	        for(var j=0;j<this.lengthVertices;j++){
	        this.matrizADJ[i].push(this.infinito);//se tem ou nao ligação
	        }
    	}
	}
	setMatrizAdj(dataLinhasPontos){
		for( let k=0; k < dataLinhasPontos.length; k++ ){
	        for( let i=0; i< this.lengthVertices; i++ ){
	            if( (dataLinhasPontos[k].u-1) == i){
	            	let v = dataLinhasPontos[k].v-1;
	                this.matrizADJ[i][ v ] =parseInt(dataLinhasPontos[k].peso);
	                this.matrizADJ[ v ][i] =parseInt(dataLinhasPontos[k].peso);
	            }
	        }
    	}
	}
}

class GraphAlgoritms{
	constructor(grafo){
		this.infinito = grafo.Infinito();
		this.graph = grafo;
	}

	menorCaminho(origem,destino){
		
		var saida =  this.menorCaminho_init(origem,destino);
		return saida;
	}
	
	menorCaminho_init(origem,destino){
		this.saida = [];
		this.caminho = [];
	    var distancias = [];
	    var visitados = [];
	    var conj = [];
	    var adj=[];
		
		var vertices= this.graph.lengthVertices;
	    for(var i =0;i< vertices; i++){
	        distancias.push(this.infinito );
	        visitados.push(false);
	    }

	    this.caminho.push(origem);
	    distancias[origem-1] = 0;
	    conj.unshift(origem-1);
		var u =  origem-1;

		this.menorCaminho_loop(u,destino,distancias,conj,visitados);

		var str_saida={
			vetorDistacia: distancias,
			custoPercusso:distancias[destino-1],
			percusso: JSON.stringify(this.saida)
		}; 
		
		return str_saida;
	}

	menorCaminho_loop(u,fim,distancias,conj,visitados){
		var u=  conj.pop();

		if(visitados[u]==false){
			visitados[u]=true;
			var adj = this.graph.matrizADJ[u];
			for(var i =0;i<adj.length;i++){
				var v= i;
				if(this.graph.matrizADJ[u][v] != this.infinito ){
					if(distancias[v] > distancias[u]+this.graph.matrizADJ[u][v]){

						distancias[v]= distancias[u]+this.graph.matrizADJ[u][v];//atualiza
						conj.unshift( v );
						if( !this.atualizarCaminho(v,fim) ){
							this.menorCaminho_loop(v,fim,distancias,conj,visitados);
						}
						this.caminho.pop();
						visitados[v]=false;
					}
				}
			}
		}
	}

	atualizarCaminho(v,fim){
		this.caminho.push(v+1);
		if ( this.caminho[this.caminho.length-1] == fim){
			this.saida=[];
			for ( var i=0; i< this.caminho.length; i++){
				this.saida.push(this.caminho[i]);
			}
			return true;
		}
		return false;
	}
}


//================== teste acima		
var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'phaser-id',
 { preload: preload, create: create, update: update, render:render});

function preload() {
    game.load.spritesheet('centroid', 'img/balls.png', 17, 17);
    game.load.spritesheet('button', 'img/button.png', 80, 20);
}
//grafo
var points = [];
var adjPesos = [];
var dataLinhasPontos=[];
var peso='';
//phaser
var overTap = false;
var currentPoint;
var centroid;
var enterKey;
var connection = 0;
var makeLine = false;
var enterStop;
var style;
var flag=false;
//projeto
var show=1;
var etapa = {
	fase: 0, em_execucao:0
}

//Configuração de teclas de entrada de dados
function config_buttons(){
	//config teclas
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

function getStart(){
	etapa.fase=1;
	setInputTap(true);
	game.paused = false;
}

function setInputTap(pode){
	currentPoint.visible= go;
	currentPoint.inputEnabled = go;
	overTap= !pode;
}

function update() {
    
    switch ( etapa.fase ){
    	case 0:
    		setInputTap(false);
    		game.paused = true;
    		break;
    	case 1:
    	if(!spaceKey.isDown){
    		currentPoint.position.copyFrom(game.input.activePointer.position);
		}
		else{			
			setInputTap(false);
	        etapa.fase=2;
			etapa.em_execucao = 0;	
			
		}
		break;
		case 2:
		  if ( etapa.em_execucao == 1  && enterStop.isDown){
		  	etapa.em_execucao = 0;
			etapa.fase = 3;
			flag=true;
			salvarEstagio();
			show=1;
		  }
		  if (enterKey.isDown){
        	etapa.em_execucao = 1;
		  }

		  if ( etapa.em_execucao ){
		  	connectLine();
		  }
		  break;
		case 3:
			var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to 1000", "Chamadas"), 10);
			}while(isNaN(selection) || selection > 1000 || selection < 1);
			criarGrafo(selection);
			etapa.fase = 4;
			break;
		default:
		//console.log("saindo da faixa de fase");
	}
}
function setDataLinhasPontos(){
	
	// jogo pausado?
	setInputTap(false);
	etapa.fase = 3;
	//configurar vector points
	//configurar dataLinhasPontos;
}


function render(){
	//adiciona indicie a bolinha
    var index=1;
    points.forEach(function(child) {
        game.debug.text(index, child.x - 10,child.y + 25, style_verticetxt.color,style_verticetxt.font);
        index+=1;
    });
    exibirLinhas();
}

function exibirLinhas(){
	if(makeLine){

        //setar um peso exatamento no meio da distancia entre os pontos
	    for(var i=0;i< dataLinhasPontos.length;i++){
	    	var p1Point  = getPoint(dataLinhasPontos[i].u);
	    	var p2Point  = getPoint(dataLinhasPontos[i].v);
			//atualiza linha
	    	dataLinhasPontos[i].linha.fromSprite( p1Point, p2Point );
	    	//adiciona linha no game
	    	game.debug.geom(dataLinhasPontos[i].linha);

			var mx = ( p1Point.x + p2Point.x )/2;
			var my = ( p1Point.y + p2Point.y )/2;
	        game.debug.text( dataLinhasPontos[i].peso, mx,my, "white", "20px Courier" );
	    }

    }
}

// FUNÇÕES DE APOIO DO PROJETO
function ajuda(){
	show = 1;
	projeto();
}

function projeto(){
	if(show ==1){
		show++;
		if(etapa.fase ==1){
			alert("Coloque os pontos clicando."+"\n"+"Para encerrar a inserção de pontos aperte a tecla \"space\".");
		}
		if(etapa.fase ==2){
			
			alert("\n\nPara começar a inserir as arestas aperte a tecla \"enter\" :"+
			"\nDiga o valor do peso e clique nos dois vertices que deseja criar a aresta."+
			"\n\nPara encerrar,aperte a tecla \"s\".");
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
        img = createImg(game.input.activePointer.position.x, game.input.activePointer.position.y,points.length+1);
        points.push(img);
    }
}
function createImg(x,y, id){
	var img = game.add.sprite(x, y, 'centroid', 0);        
        img.anchor.set(0.5);
        img.alpha = 0.7;
        img.inputEnabled = true;
        img.input.enableDrag(true);
        img.defaultCursor = "move";
        img.indice = id;
     return img;
}

function inicarParPoint(){
	var aux = {
				u:0,
				v:0,
				peso:0,
				ocupado:0,
				linha:{},
				getjson:function(){
					var saveObject = {};
					saveObject.u = this.u;
					saveObject.v = this.v;
					saveObject.peso = this.peso;
					return JSON.stringify(saveObject);
				}
			};
	return  aux;
}

function configParPoint(idP1,idP2, peso){
	var aux = inicarParPoint();
	aux.u = idP1;
	aux.v = idP2;
    var p1Point  = getPoint(idP1);
    var p2Point  = getPoint(idP2);
	line = new Phaser.Line( p1Point.x, p1Point.y, p2Point.x, p2Point.y);
	aux.peso = peso;
	aux.linha = line;
	return aux;
}

function connectLine() {
   
    for(var i=0;i<points.length;i++){
       
        if(this.connection<2){
            
            points[i].events.onInputDown.add(getPoints, this,points[i]);
        }else{
			//TODO::DÁ PRA TRANSFORMAR ISSO AQUI NUMA ESTRUTURA MELHOR
            //aux.push(adjPesos[0]);//adjPesos é um vetor[2] que guarda o id do ponto escolhido
            //aux.push(adjPesos[1]);
            var selection ;
            do{
    			selection = parseInt(prompt("Please enter a number from 1 to 100", "peso"), 10);
			}while(isNaN(selection) || selection > 100 || selection < 1);
			peso = selection;
            
            aux = configParPoint(adjPesos[0],adjPesos[1],peso);
            dataLinhasPontos.push(aux);//guarda as arestas  com infor de origem,destino e peso            
            makeLine=true;
			resetFindParPoint();
        }
    }
}

function resetFindParPoint(){
		this.connection=0;
		adjPesos = [];
		peso = '';
}
/*
CALCULO DE DISTANCIA
*/
function salvarEstagio(){
	save = {"grafo":{
	points: points.map(function (point){
			var saveObject = {};
			saveObject.x = point.x;
			saveObject.y = point.y;
			saveObject.indice = point.indice;
			return JSON.stringify(saveObject);
		}),
		dataLinhasPontos:dataLinhasPontos.map(function(adj){
			return adj.getjson();
		})
	}};
    salvar(JSON.stringify(save));
}
function salvar(obj) {
		let titulo = "graph";

		var data = new Date();

		var dia     = data.getDate();            
		var mes     = data.getMonth();          
		var ano4    = data.getFullYear(); 

		var str_data = ano4 + '-' + (mes+1) + '-' + dia;

		titulo+= str_data;

		var blob = new Blob([obj], { type: "text/plain;charset=utf-8" });
		saveAs(blob, titulo + ".txt");
}


function getPoint(id){
	return points[id-1];
}

function getPoints (point) {
  
   adjPesos.push(points.indexOf(point)+1);
  
   this.connection+=1;
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


class RedesOticas{
	constructor(points, rotas){
		this.points = points;
		this.rotas = rotas;
	}

}

class MapaProjeto{
	constructor(altura, largura){

	}
}

function gerarChamadas(quantidade, totalPontos){
	
    chamadas ={
    	quantidade: quantidade,
    	buscas : [],
    	verificacoes : [],
    	alocar_chamada : function(u,v){
    		var disponivel= -1;
    		for (var i=0; i< this.buscas.length && disponivel==-1;i++){
    			if( this.buscas[i].par == ""+u+"-"+v  || this.buscas[i].par == ""+v+"-"+u){
    				disponivel= i;
    			}
    		}
    		return disponivel;
    	}
    };

	for(var i=1;i<=quantidade;i++ ){
		var u = getRandomInt(1, totalPontos);
		var v = getRandomInt(1, totalPontos);
		console.log(""+u+" e "+v+" e total"+totalPontos);
		while (u==v){
			var v = getRandomInt(1, totalPontos);
		}
		if (u>v){
			var t =u; u=v; v=t;
		}
		let j = chamadas.alocar_chamada(u,v);
		if( j == -1){
			var chamada = {
				par:""+u+"-"+v,
				u:u,
				v:v,
				solicitacao:1,//quantidade de recorrencua
				caminhos:[
				/*{rota:'1-2',distancia:120(int)}*/] ,
				prob_erro: function(){
					return caminhos.length/solicitacao;
				}
			}
			chamadas.buscas.push(chamada);
		}
		else {
			chamadas.buscas[j].solicitacao ++;
		}

		var verificacao = {
			par:""+u+"-"+v,
			u:u,
			v:v,
			caminho:"",
			distancia:-1
		}
		chamadas.verificacoes.push(verificacao);
		console.log(chamadas);
	}
	return chamadas;
}
	
function criarGrafo(ahan){
	grafo = new Grafo(points.length);
	grafo.setMatrizAdj(dataLinhasPontos);
	graphAlgoritms= new GraphAlgoritms( grafo );

	calls = gerarChamadas(ahan, points.length);
	for( let i =0;i< calls.quantidade;i++){
		var u = calls.verificacoes[i].u;
		var v = calls.verificacoes[i].v;
		r = graphAlgoritms.menorCaminho( u, v );
		calls.verificacoes[i].caminho= r.percusso;
		calls.verificacoes[i].distancia = r.custoPercusso;
	}
	console.log(calls);
}