//================== Logica do phaser
var game = new Phaser.Game(900, 391, Phaser.CANVAS, 'phaser-id',
 { preload: preload, create: create, update: update, render:render});


class Poisson{
	constructor(quantidadeChamadas ,periodo, y){
		this.y = y;
		this.T =periodo;
		this.quantidadeChamadas = quantidadeChamadas;
	}
	fator(num){
	 var k = this.howK(num);
	 var fat=1;
      	for(let x=1; x <= k; x++)
      	{
       	 fat = fat *x;
      	}
      return fat;
    }
    howK(isIt){
      var sum=0;
      isIt = isIt;
      for (let k=1; k<= 500 ; k++){
        sum+=k;
        if(sum>=isIt){
          return k;
        }
      }

    }
    getPoissonFreq(ichamada){
      var k =this.howK(ichamada);
      var f1 = 1- ( 1.96/Math.sqrt( k +14) );
      f1= f1*( k + 15 )/ this.T;
      return f1/5;
    }
    getPoisson(ichamada){
      var k =this.howK(ichamada);
      var f = Math.exp(-this.y)* Math.pow( this.y, k);
      var fat = this.fator(k);
      f= f /fat;
      return f*1000;
    }
}
class Grafo{

	constructor(quantidadePoints){
		this.infinito = 1000;//Number.MAX_SAFE_INTEGER;
		this.lengthVertices = quantidadePoints;
		this.enlaces = [];
		this.inicializarGrafo();
	}
	Infinito(){
		return this.infinito;
	}
	inicializarGrafo(){
		this.matrizADJ = [];
		for(var i=0;i<= this.lengthVertices;i++){
	        let linha=[];
	        this.matrizADJ.push(linha);
	        for(var j=0;j<=this.lengthVertices;j++){
	        this.matrizADJ[i].push(this.infinito);//se tem ou nao ligação
	        }
    	}
	}
	setConfigInit(dataLinhasPontos, limiteOndas){
		this.limiteOndas= limiteOndas;
		for( let k=0; k < dataLinhasPontos.length; k++ ){
			this.setMatrizAdj( dataLinhasPontos[k] );
			this.criarEnlaces( dataLinhasPontos[k] );
		}
	}
	setMatrizAdj(dataLinhaPontos){
		var u = dataLinhaPontos.u -1;
		var v = dataLinhaPontos.v -1;
		var peso  = dataLinhaPontos.peso;
		this.matrizADJ[ u ][ v ] =parseInt( peso );
	    this.matrizADJ[ v ][ u ] =parseInt( peso );
	}
	criarEnlaces( enlace ){
		var u = enlace.u;
		var v = enlace.v;
		if (u> v){
			var t =u;u=v;v=t;
		}
		this.enlaces[Grafo.toParCode(u,v)]= ( this.criarEnlance( u, v, enlace.peso ) );
	}
	criarEnlance(u,v,peso){
		var ondas = [];
		for( let i=0;i<= this.limiteOndas; i++){
			var onda = { onda:"y"+i,
						 tempoReserva:0,
						 isReservado:function(){
						 	return this.tempoReserva !=0;
						 },
						 updateReserva: function(tempoDecorrido){
						 	this.tempoReserva -= tempoDecorrido;
				 			if( this.tempoReserva < 0 ) {
				 				this.tempoReserva = 0;
				 			}
						 },
						 reservar: function(tempo){
						 	this.tempoReserva = tempo;
						 }
						};
			ondas.push(onda);
		}
		return { u:u,
				 v:v,
				 peso:peso,
				 ondasReservadas: ondas,
				 atualizaReserva: function(tempoDecorrido){//testar isso aqui usando foreach
				 	for(let i =0; i < this.ondasReservadas.length; i++){
				 		this.ondasReservadas[i].updateReserva( tempoDecorrido) ;
				 	}
				 },
				 atualizaReserva2: function(tempoDecorrido){//testar isso aqui usando foreach
				 	ondasReservadas.forEach(
				 		function(element, index, array){
				 			element.updateReserva( tempoDecorrido) ;
				 		} );

				 },
				 isOndaDisponivel: function(onda){
				 	return  ! this.ondasReservadas[onda].isReservado();
				 },
				 reservar: function(onda,tempo){
				 	this.ondasReservadas[onda].reservar(tempo);
				 }
				};
	}
	isEnlaceDisponivel(u,v, onda){
		var is= true;
		var cod = Grafo.toParCode(u,v);
		if( this.enlaces[ cod ] != null ){
			is = this.enlaces[ cod ].isOndaDisponivel(onda);
		}else{
			is = false;
		}
		return is;
	}
	reservarEnlace(u,v,onda,tempo){
		var cod = Grafo.toParCode(u,v);
		let enlace = this.enlaces[ cod ];
		if( enlace != null && this.isEnlaceDisponivel(u,v,onda) ){
			enlace.reservar(onda,tempo);
			return "ok";
		}else{
			return "so bad";
		}
	}
	reservarEnlaces( vet_caminho, onda, tempo ){
		for( let i=0; i< vet_caminho.length -1; i++){
			if (this.reservarEnlace( vet_caminho[i]+1, vet_caminho[i+1]+1, onda, tempo ) == "so bad"){
				return "so bad";
			}
		}
		return "ok";
	}
	isCaminhoDisponivel(vet_caminho){
		var disponivel = false;
		var j,i;
		for( j=1; j <= this.limiteOndas && !disponivel; j++){
			disponivel = true;
			for(  i=0; i< vet_caminho.length -1 && disponivel; i++){
				var u,v;
				u = vet_caminho[i] + 1; v= vet_caminho[i+1]+1;
				disponivel = this.isEnlaceDisponivel(u,v,j);
			}
			if (disponivel){
				return j;
			}
		}
		return -1;
	}
	updateTempoEnlaces(atualizaReserva){
		this.enlaces.forEach( function(element, index, array){
			element.atualizaReserva(atualizaReserva);
		}
		);
		/*metodo 2*

		let chaves = Object.keys(this.enlaces);
		chaves.forEach(function(element, index, array){
			this.enlaces[element].atualizaReserva(atualizaReserva);
		});*/
	}
	static toParCode(u,v){
		if (u>v){
			var t =u; u=v; v=t;
		}
		return ""+u+""+v;
	}
}
//criar funcao de menor caminho otico
class GraphAlgoritms{
	constructor(grafo){
		this.infinito = grafo.Infinito();
		this.graph = grafo;
	}
	menorCaminho(origem,destino){
		var saida =  this.menorCaminho_init(origem-1,destino-1);
		return saida;
	}
	menorCaminho_init(origem,destino){
		this.saida = [];
		this.caminho = [];
		this.onda_encontrada=-1;
	    var distancias = [];
	    var visitados = [];
	    var conj = [];
	    var adj=[];

		var vertices= this.graph.lengthVertices;
	    for(var i =0;i<= vertices; i++){
	        distancias.push(this.infinito );
	        visitados.push(false);
	    }

	    this.caminho.push(origem);
	    distancias[origem] = 0;
		var u =  origem;

		this.menorCaminho_loop(u,destino,distancias,conj,visitados);

		var obj_saida={
			vetorDistacia: distancias,
			custoPercusso:distancias[destino],
			percusso: this.saida,
			onda_disponivel: this.onda_encontrada
		};

		return obj_saida;
	}
	menorCaminho_loop(u,fim,distancias,conj,visitados){

		if(visitados[u]==false){
			visitados[u]=true;
			var adj = this.graph.matrizADJ[u];
			for(var i =0;i<adj.length;i++){
				var v= i;
				//nesta verificação, vc tbm verifica se há caminho disponível
				if(this.graph.matrizADJ[u][v] != this.infinito ){
					if(   distancias[v]  > distancias[u]+this.graph.matrizADJ[u][v]){

						distancias[v]= distancias[u]+this.graph.matrizADJ[u][v];//atualiza
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
		this.caminho.push(v);
		if ( this.caminho[this.caminho.length-1] == fim){
			var onda = this.graph.isCaminhoDisponivel( this.caminho );
			if( onda != -1){
				this.onda_encontrada = onda;
				this.saida=[];
				for ( var i=0; i< this.caminho.length; i++){
					this.saida.push( this.caminho[i] );
				}
				return true;
			}
		}
		return false;
	}
}
//Talves essa funcção deva estar dentro de uma classe Redes Oticas//ultima prioridade
var simulacoes =[];
var limChamadas=0;
function simularCenario_Otico(quantidadeChamadas,list_ondas, periodo){
	//TODO precisa informar dados de Poisson
	//periodo = 24h
	//console.log(rd);
	console.log("simulando cenario de RD");
	simulacoes =[];
	for(let i=0;i< list_ondas.length;i++){
		var rd = new RedesOticas(points, dataLinhasPontos, quantidadeChamadas,list_ondas[i],periodo);
		var dados = rd.simularCenario( list_ondas[i] );
		simulacoes.push(dados);
	}
	addOpcoes(list_ondas);

	console.log(simulacoes);
	limChamadas = quantidadeChamadas;

	plotGraficoErro(list_ondas,simulacoes);
}
function plotbyId(value){
	if(limChamadas > 8000 ){
		alert("Limite para plot é 8000 chamadas,devido aos limites do PC na fórmula de fatorial.");
	}else{
		plotGrafico(0,limChamadas,simulacoes[value]);
	}
}
function addOpcoes(list_ondas){
	var optionsAsString = "";
	for(var i = 0; i < list_ondas.length; i++) {
	    optionsAsString += "<option value='" + i + "'>" + list_ondas[i] + "</option>";
	}
	$("select[name='inptOndas']").find('option').remove().end().append($(optionsAsString));
}
function plotGraficoErro(list_ondas,simulacoes){
	google.charts.load('current', {'packages':['corechart','table']});
	google.charts.setOnLoadCallback(drawErro(list_ondas,simulacoes));
}
function drawErro(list_ondas,simulacoes){
	var dataBloqueio = [['onda','%Bloqueio']];


	for (let i=0;i< simulacoes.length;i++ ){
		var row=[list_ondas[i], simulacoes[i].prob_Erro()*100 ];
		dataBloqueio.push(row);
	}
	data = google.visualization.arrayToDataTable(dataBloqueio);
	options = {
			  title : 'Probabilidade de bloqueio',
			  backgroundColor: '#fff',
			  pointSize: 0,
			  vAxis: {title: '%'},
			  hAxis: {title: 'Quantidade de comprimento de onda'},
			  seriesType: 'bars',
			  series: {0: {type: 'bars'}}
			};
	var chart = new google.visualization.ComboChart(document.getElementById('chart_prob_erro'));
	chart.draw(data, options);
}
function plotGrafico(id,quantidadeChamadas,simulacao){
	google.charts.load('current', {'packages':['corechart','table']});
	if( id== 0 ){
		google.charts.setOnLoadCallback(drawSimulation(quantidadeChamadas,simulacao));
	}
}
function drawSimulation(quantidadeChamadas,calls){
			var dataPoisson = [['k', 'Tempo em Poisson',"frequência de confiança"]];
			var rows = [];
			var myPoisson = calls.myPoisson;
			for (let c=0; c< quantidadeChamadas; c++){

				var poissonFreq = myPoisson.getPoissonFreq(c);
				var v = [];
				v.push(c);
				v.push(myPoisson.getPoisson(c));//calculo de Poisson
				v.push(poissonFreq);//f poisson

				dataPoisson.push(v);
				var verificacao =calls.verificacoes[c];
				if(verificacao == null){
					console.log("algo errado");
					console.log("indice: ",c);
				}
				else{
					rows.push( [c+1,verificacao.sucessRoteamento,
						verificacao.ondaAlocada!=null?"y"+verificacao.ondaAlocada:null ,
						verificacao.par,verificacao.getStr(),
						verificacao.distancia,
						verificacao.tempoAlocado] );
				}
			}
			data = google.visualization.arrayToDataTable(dataPoisson);

			options = {
			  title : 'Distribuição Poisson , em 24h',
			  backgroundColor: '#fff',
			  pointSize: 0,
			  vAxis: {title: 'Tempo em s'},
			  hAxis: {title: 'Chamadas'},
			  seriesType: 'line',
			  series: {0: {type: 'line'}}
			};
			var chart = new google.visualization.ComboChart(document.getElementById('chart_poisson'));
			chart.draw(data, options);


			var dataTable = new google.visualization.DataTable();
			//... add data here ...
			dataTable.addColumn('number', 'i_call');
			dataTable.addColumn('boolean', 'Sucess?');
			dataTable.addColumn('string', 'y_onda');
			dataTable.addColumn('string', 'Enlace');
			dataTable.addColumn('string', 'Rota');
			dataTable.addColumn('number', 'D(km)');
			dataTable.addColumn('number', 'timeout');
			dataTable.addRows(rows);

	        //chart = new google.visualization.ComboChart(document.getElementById('chart_prob_erro'));
	        //chart.draw(data, options);
	        //teste table

			var cssClassNames = {
				'headerRow': 'italic-darkblue-font large-font bold-font',
				'tableRow': '',
				'oddTableRow': 'beige-background',
				'selectedTableRow': 'orange-background large-font',
				'hoverTableRow': '',
				'headerCell': 'gold-border',
				'tableCell': '',
				'rowNumberCell': 'underline-blue-font'};
			var options = {'showRowNumber': true,
			 'allowHtml': true,
			 'width':800 ,
			  'cssClassNames': cssClassNames};

			var table = new google.visualization.Table(document.getElementById('tb_chamadas'));
			table.draw(dataTable, options);
}
//== no futuro passar tudo para duas classes

class RedesOticas{
	constructor(points, dataLinhasPontos, quantidade,ondasLim, periodoTeste){
		this.points = points;
		this.limiteOndas= ondasLim;
		this.dataLinhasPontos = dataLinhasPontos;
		this.quantidadeChamadas = quantidade;
		this.calls = {};
		this.periodoTeste = periodoTeste;
	}
	simularCenario(limiteOndas){
		this.grafoOtico = new Grafo(this.points.length);
		this.grafoOtico.setConfigInit(this.dataLinhasPontos, limiteOndas );
		this.calls = Chamadas.gerarChamadas(this.quantidadeChamadas, this.points.length, this.periodoTeste, limiteOndas);
		this.calls.realizarVerificoes( this.grafoOtico );
		return this.calls;
	}
}

class Chamadas{
	constructor(quantidade, periodoTeste, y){
    	this.quantidade = quantidade;
    	this.periodoTeste = periodoTeste;
    	this.limOndas = y;
    	this.buscas = [];
    	this.verificacoes = [];
    	this.bloqueios =0;
    	this.myPoisson = new Poisson(quantidade, periodoTeste, y);
	}
	getIndexChamada(u,v){
    	var disponivel= -1;
    	var code = Grafo.toParCode(u,v);
    	for (var i=0; i< this.buscas.length && disponivel== -1 ;i++){
    		if( this.buscas[i].par == code ){
    			disponivel= i;
    		}
    	}
    	return disponivel;
    }
    realizarVerificoes( grafo ){
    	for( let i =0;i < this.quantidade;i++){
    		var graphAlgoritms = new GraphAlgoritms( grafo );
			var u = this.verificacoes[i].u;
			var v = this.verificacoes[i].v;
			if (i != 0){
				let tempoEspera = this.myPoisson.getPoissonFreq(i+1);
				grafo.updateTempoEnlaces(tempoEspera);//: atualiza todos enlances;

			}
			var r = graphAlgoritms.menorCaminho( u, v );
			let tempoReserva = this.myPoisson.getPoisson(i+1);//: calcular aqui o tempo de chamada
			if(isNaN(tempoReserva)){
				tempoReserva = 1;
			}
			if ( r !=null &&  r.onda_disponivel != -1){
				if (grafo.reservarEnlaces(r.percusso, r.onda_disponivel,tempoReserva) == "so bad"){//: reservar aqui cada enlace do caminho na onda y com tempo tal
					console.log("erro com caminho,onda,tempo");
					console.log(r,tempoReserva);
					console.log("u,v:",u,v);
				}
				//let indiceCall =  this.getIndexChamada(u,v);

				//this.buscas[indiceCall].addCaminho( r.percusso, r.custoPercusso);//TODO:adicionar na busca o tempo alocado
			}
			var success = this.verificacoes[i].setData( r.percusso, r.custoPercusso,r.onda_disponivel,tempoReserva  );//: Isso se o retorno não retornou bloqueio ne.
			this.bloqueios = this.bloqueios + ( success !=true?1:0 );

			if(r.onda_disponivel == -1){
				console.log("deu bloq "+this.limOndas);
			}
		}
		return this.verificacoes;
    }
    prob_Erro(){
    	return this.bloqueios/this.quantidade;
    }
    //TODO:CRIAR AQUI o tempo RANDOM
    static gerarRandomPar(limite){
		var u = getRandomInt(1, limite);
		var v = getRandomInt(1, limite);
		while (u==v){
			var v = getRandomInt(1, limite);
		}
		if (u>v){
			var t =u; u=v; v=t;
		}
		return {u:u,v:v};
    }
    static gerarChamadas(quantidade, totalPontos, periodoTeste, y ){

	    var chamadas = new Chamadas(quantidade, periodoTeste, y);
		for(var i=1;i<=quantidade;i++ ){
			var par = Chamadas.gerarRandomPar(totalPontos);
			var u = par.u;
			var v = par.v;
			/*let j = chamadas.getIndexChamada(u,v);
			if( j == -1){
				var chamada = new BuscaChamada(u,v);
				chamadas.buscas.push(chamada);
			}
			else {
				chamadas.buscas[j].solicitacao ++;
			}*/

			var verificacao = new VerificacaoChamada(u,v);
			chamadas.verificacoes.push(verificacao);
		}
		return chamadas;
	}
    // criar function static de gerarChamadas
}
class BuscaChamada{
	constructor(u,v){
		this.par= Grafo.toParCode(u,v);
		this.u = u;
		this.v = v;
		this.caminhos = [/*{class caminho}*/];
		this.solicitacao = 1;
	}
	prob_Erro(){
		return this.caminhos.length/this.solicitacao;
	}
	isBuscado(rota){
		var buscado = false;
		for (let i=0; i< this.caminhos.length && !buscado;i++){
			buscado = this.caminhos[i].equals(rota);
		}
		return buscado;
	}
	addCaminho(rota,distancia){
		var caminho = new Caminho(rota,distancia);
		this.caminhos.push(caminho);
	}
}
class VerificacaoChamada{
	constructor(u,v){
		this.par="" + u + "-" + v;
		this.u = u;
		this.v = v;
		this.caminho = "";
		this.distancia= -1 ;
	}
	setData(caminho,distancia,ondaAlocada,tempoAlocado){
		this.caminho = ondaAlocada !=-1?caminho:null;
		this.distancia = ondaAlocada !=-1?distancia:null;
		this.tempoAlocado = ondaAlocada !=-1?tempoAlocado:null;
		this.ondaAlocada = ondaAlocada !=-1?ondaAlocada:null;
		this.sucessRoteamento=  ondaAlocada !=-1? true: false;
		return this.sucessRoteamento;
	}
	getStr(){
		var src = "";
		if(this.caminho != null){
			 src = ""+(this.caminho[0]+1);
			for(let i=0; i< this.caminho.length; i++){
				src = src +"-"+ (this.caminho[i]+1);
			}
		}
		return src;
	}
}
class Caminho{
	constructor(rota,distancia){
		this.rota = rota;
		this.distancia = distancia;
	}
	equals(rota){
		return this.rota.localeCompare(rota)==0;
	}

}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//================== Logica do phaser

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
var connection = 0;
var makeLine = false;
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
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
	game.stage.backgroundColor = '#808080';
	config_buttons();
	currentPoint = game.add.image(10, 10, 'centroid');
	currentPoint.anchor.set(0.5);
	currentPoint.alpha = 0.9;
	game.input.onTap.add(onTapHandler, this);

}
function update() {

    switch ( etapa.fase ){
    	case 0:
    		setInputTap(false);
    		game.paused = true;
    		saved= dataSaved();
    		if( saved ){
    			setDataLinhasPontos();
    		}
    		if ( etapa.em_execucao==0 ){
    			verificacaoInicial();
    			etapa.em_execucao = 1;
    		}
    		break;
    	case 1:
    	if(!spaceKey.isDown){
    		currentPoint.position.copyFrom(game.input.activePointer.position);
		}
		else{
			spaceKey.isDown = false;
			setInputTap(false);
	        etapa.fase=2;
			etapa.em_execucao = 0;
		}
		break;
		case 2:
		  if ( etapa.em_execucao == 1  && spaceKey.isDown){
		  	etapa.em_execucao = 0;
			etapa.fase = 3;
			flag=true;
			salvarEstagio();
			show=1;
			spaceKey.isDown= false;
		  }
		  if (spaceKey.isDown){
		  	spaceKey.isDown= false;
        	etapa.em_execucao = 1;
		  }

		  if ( etapa.em_execucao ){
		  	connectLine();
		  }
		  break;
		case 3:
			var formCall = document.getElementById("formCall").style.visibility = "visible";
			break;
		default:
		//console.log("saindo da faixa de fase");
	}
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
				},
				equals:function(outro){
					return outro.u== this.u && outro.v == this.v;
				}
			};
	return  aux;
}
function configParPoint(idP1,idP2, peso){
	var aux = inicarParPoint();
	if (idP1 > idP2 ){
		var t = idP1; idP1 = idP2; idP2= t;
	}
	aux.u = idP1;
	aux.v = idP2;
    var p1Point  = getPoint(idP1);
    var p2Point  = getPoint(idP2);
	line = new Phaser.Line( p1Point.x, p1Point.y, p2Point.x, p2Point.y);
	aux.peso = peso;
	aux.linha = line;
	return aux;
}
function addParDataLinha(auxNovo){
	var achouSemelhante= false;
	for( let i=0; i< dataLinhasPontos.length;i++ ){
		if( dataLinhasPontos[i].equals(auxNovo)  ){
			achouSemelhante= true;
			if( dataLinhasPontos[i].peso > auxNovo.peso ){
				dataLinhasPontos[i].peso = auxNovo.peso;
			}
		}
	}
	if ( !achouSemelhante){
		dataLinhasPontos.push(auxNovo);
	}
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
    			selection = parseInt(prompt("Please enter a number from 1 to 10.000", "peso"), 10);
    			if ( isNaN(selection) ){
    				break;
    			}
			}while( selection > 10000 || selection < 1);
			peso = selection;
            if( isNaN(selection) ){
            	this.connection =0;
            	adjPesos = [];
            }
            else{
	            aux = configParPoint(adjPesos[0],adjPesos[1],peso);
	            addParDataLinha(aux);//guarda as arestas  com infor de origem,destino e peso
	            makeLine=true;
				resetFindParPoint();
            }
        }
    }
}
function resetFindParPoint(){
		this.connection=0;
		adjPesos = [];
		peso = '';
}
function getPoint(id){
	return points[id-1];
}
function getPoints (point) {
  var indice = points.indexOf(point)+1;
   if( adjPesos.length>0 && adjPesos[0] != indice ){
   	adjPesos.push( indice );
   	this.connection+=1;
   }else if( adjPesos.length == 0 ) {
   	adjPesos.push( indice );
   	this.connection+=1;
   }
}
function setDataLinhasPontos(){
	setInputTap(false);
	makeLine = true;
	etapa.fase = 3;
	game.paused = false;
}
function getStart(){
	/*if( document.getElementById("btnprox_etapa").disabled != null){
		document.getElementById("btnprox_etapa").disabled = false;
	}*/
	etapa.fase++;
	setInputTap(true);
	game.paused = false;
}
function setInputTap(pode){
	currentPoint.visible= pode;
	currentPoint.inputEnabled = pode;
	overTap= !pode;
}

//==================== Salvar layout
function salvarEstagio(){
	save = {"grafo":{
	points: points.map(function (point){
			var saveObject = {};
			saveObject.x = point.x;
			saveObject.y = point.y;
			saveObject.indice = point.indice;
			return saveObject;//JSON.stringify(saveObject);
		}),
		dataLinhasPontos:dataLinhasPontos.map(function(adj){
			return adj;//adj.getjson();
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

function dataSaved(){
		var data = sessionStorage.getItem('graph_simulatorSave');
		sessionStorage.removeItem('graph_simulatorSave');
		saveObject = JSON.parse(data);
		if( saveObject != null ){
			criarPontos(saveObject);
			criarDataPoints(saveObject);
			return true;
			//setDataLinhasPontos();
		}
		else return false;
}

function criarPontos(saveObject){
	this.points = [];
	for( let i=0;i<saveObject.points.length;i++ ){
		var img = createImg(saveObject.points[i].x, saveObject.points[i].y, saveObject.points[i].indice);
    	this.points.push(img);
	}
}
function criarDataPoints(saveObject){
	this.dataLinhasPontos = [];
	for( let i=0;i<saveObject.dataLinhasPontos.length; i++ ){
		data = saveObject.dataLinhasPontos[i];
		aux = configParPoint(data.u,data.v,data.peso);
		this.dataLinhasPontos.push(aux);
	}
}

//====================== verificações de API
function verificacaoInicial(){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  // Great success! All the File APIs are supported.
	} else {
	  alert('The File APIs are not fully supported in this browser.');
	}
}

// ===================== FUNÇÕES DE APOIO DO PROJETO ===== QUE PODEM SER MUDADO
function prox_etapa(){
	show = 1;
	etapa.fase ++;
	projeto();
}
function projeto(){
	if(show ==1){
		show++;
		if(etapa.fase ==1){
			alert("Coloque os pontos clicando."+"\n"+"Para encerrar a inserção de pontos aperte a tecla \"space\".");
		}
		if(etapa.fase ==2){

			alert("\n\nPara começar a inserir as arestas aperte a tecla \"space\" :"+
			"\nDiga o valor do peso e clique nos dois vertices que deseja criar a aresta."+
			"\n\nPara encerrar,aperte a tecla \"space\".");
		}
	}
}

// FUNÇÕES CHAVE DE EXECUÇÃO DO PROJETO
function callMeBaby(){
	var calls = document.getElementById("quantidadeCall").value;
	var ondas = document.getElementById("quantidadeOnda").value;
	quantidade = parseInt( calls );
	if( quantidade>=1 &&  quantidade<=100000){
		list_ondas = [20,40,80,100];
		simularCenario_Otico(quantidade, list_ondas, 24);//alocar dados também de tempo de Poisson
		etapa.fase = 4;
	}
}

// usando objetos ele altera valor do atributo
/*class A{
	constructor(an){
		this.an= an;
		this.an.a = '1';
	}
}
var as = {a:0};
af = new A(as);
console.log(as);*/

//========== teste acima
