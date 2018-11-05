
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
var over = false;
var currentPoint;
var centroid;
var inputType;
var lineOn=false;
var enterKey;
var um;
var dois;
var tres;
var quatro;
var cinco;
var seis;
var sete;
var oito;
var nove;
var zero;
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
var b1;
var b2;
var b3;
var b4;
var b5;
var b6;
var b7;
var b8;
var b9;
var b0;
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
		// config buttons na view
		b0 = game.add.button(150, 180, 'button', actionOnClick, this,2,1,0,b0);
		b1 = game.add.button(30, 30, 'button', actionOnClick, this,2,1,0,b1);
		b2 = game.add.button(150, 30, 'button', actionOnClick, this,2,1,0,b2);
		b3 = game.add.button(270, 30, 'button', actionOnClick, this,2,1,0,b3);
		b4 = game.add.button(30, 80, 'button', actionOnClick, this,2,1,0,b4);
		b5 = game.add.button(150, 80, 'button', actionOnClick, this,2,1,0,b5);
		b6 = game.add.button(270, 80, 'button', actionOnClick, this,2,1,0,b6);
		b7 = game.add.button(30, 130, 'button', actionOnClick, this,2,1,0,b7);
		b8 = game.add.button(150, 130, 'button', actionOnClick, this,2,1,0,b8);
		b9 = game.add.button(270, 130, 'button', actionOnClick, this,2,1,0,b9);
		//config texto dos botoes
		var t1 = game.add.text(60,28, 1, style );
		var t2 = game.add.text(180,28, 2, style );
		var t3 = game.add.text(300,28, 3, style );
		var t4 = game.add.text(60,78, 4, style );
		var t5 = game.add.text(180,78, 5, style );
		var t6 = game.add.text(300,78, 6, style );
		var t7 = game.add.text(60,128, 7, style );
		var t8 = game.add.text(180,128, 8, style );
		var t9 = game.add.text(300,128, 9, style );
		var t0 = game.add.text(180,178, 0, style );
	
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
	currentPoint.transparent = true;
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
                    if( (auxAdj[k][0]-1) == i){
                        grafo[i][(auxAdj[k][1]-1)] =parseInt(auxAdj[k][2]);
                        grafo[(auxAdj[k][1]-1)][i] =parseInt(auxAdj[k][2]);
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
			enterOri.isDown=false;
			if(peso==""&& ori==""){
				alert("desculpe! você não informou a origem ainda? tente novamente por favor.");
			}
			
			if ( validaVetice() ){
				ori = peso; 
				etapa.fase = 4;
				etapa.em_execucao =0;
				show =1;
				peso = '';	
			}
        }
        if(enterDest.isDown){
            if(peso==""&& dest==""){
				alert("desculpe! você não informou o destino ainda? tente novamente por favor.");
			}
		
			if ( validaVetice() ){
				dest = peso; 
				etapa.fase = 5;
				etapa.em_execucao =0;
				show =1;
				peso = '';	
			}
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
    
    for(var i=0;i<setLP.length;i++){
         game.debug.text(auxAdj[i][2], (setLP[i][1][0].x+setLP[i][1][1].x)/2,(setLP[i][1][0].y+setLP[i][1][1].y)/2, "white", "20px Courier");
    }
    for(var i =0;i<setLP.length;i++){
         game.debug.geom(setLP[i][0]);
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
		if (etapa.fase < 3){
			alert("Coloque os pontos clicando.\n"+
		"Para encerrar a inserção de pontos aperte a tecla \"space\"."+
"\n\nPara começar a inserir as arestas aperte a tecla \"enter\" :"+
"\nDiga o valor do peso e clique nos dois vertices que deseja criar a aresta."+
"\n\nPara encerrar,aperte a tecla \"s\".");
		}else if (etapa.fase == 3){
			alert("Agora informe a origem pelo teclado virtual ao lado, em seguinda aperte O. ");
		}else if(etapa.fase == 4){
			alert("Agora informe o destino pelo teclado virtual ao lado, em seguinda aperte D. ");
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
    
    if(valor==b0){
        peso=peso.concat('0');
       
    }else if(valor==b1){
        peso=peso.concat('1');
        
    }else if(valor==b2){
       peso= peso.concat('2');
    }
    else if(valor==b3){
       peso= peso.concat('3');
    }
    else if(valor==b4){
       peso= peso.concat('4');
    }
    else if(valor==b5){
       peso= peso.concat('5');
    }
    else if(valor==b6){
       peso= peso.concat('6');
    }
    else if(valor==b7){
      peso=  peso.concat('7');
    }
    else if(valor==b8){
       peso= peso.concat('8');
    }else if(valor==b9){
       peso= peso.concat('9');
    }
   atualizarLog("Peso acumulado: "+peso);
}

function onTapHandler(pointer, doubleTap) {

    if (!over)
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
            setLP[i][0].fromSprite(setLP[i][1][0],setLP[i][1][1]);
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
			
            aux.push(adjPesos[0]);
            aux.push(adjPesos[1]);
            
            aux.push(peso);
			enlace = create_enlace();
			enlace.criar(adjPesos[0],adjPesos[1],peso);
            enlaces.push(enlace);
            auxAdj.push(aux);
            /*console.log(aux);
			console.log(auxAdj);
			console.log(parPoints);*/
            aux =[];
            makeLine=true;
            line = new Phaser.Line(parPoints[0].x,parPoints[0].y,parPoints[1].x,parPoints[1].y);
            aux.push(line);
            aux.push(parPoints);
            //aux.push(parseInt(peso));
            setLP.push(aux);
            
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
	console.log(enlaces);
	str_saida= "distancia: "+JSON.stringify(dist)
	+"saida: "+ JSON.stringify(dist)+
	"Enlaces: "+ JSON.stringify(enlaces);
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