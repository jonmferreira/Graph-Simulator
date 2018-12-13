// leitura de arquivo =======================
function fileSelect(files) {
    var f = files[0]; // FileList object
    var output = [];
  
    if (f != null){
    	var leitor = new FileReader();
		leitor.onload = leCSV;
		leitor.readAsText(f);
    }	
    function leCSV(evt) {
		var fileArr = evt.target.result;
		var saveObject = JSON.parse(fileArr).grafo; 
		enviarData(saveObject);
		
	}
}
function staticGraph(id){
	var graphA = {"grafo":{"points":[{"x":423.734375,"y":212.828125,"indice":1},{"x":426.734375,"y":151.828125,"indice":2},{"x":474.734375,"y":303.828125,"indice":3},{"x":581.734375,"y":66.828125,"indice":4},{"x":224.734375,"y":91.828125,"indice":5},{"x":321.734375,"y":278.828125,"indice":6},{"x":612.734375,"y":367.828125,"indice":7},{"x":412.734375,"y":369.828125,"indice":8},{"x":410.734375,"y":30.828125,"indice":9},{"x":629.734375,"y":199.828125,"indice":10},{"x":702.734375,"y":363.828125,"indice":11},{"x":726.734375,"y":269.828125,"indice":12},{"x":690.734375,"y":95.828125,"indice":13},{"x":122.734375,"y":63.828125,"indice":14},{"x":153.734375,"y":247.828125,"indice":15},{"x":417.734375,"y":86.828125,"indice":16},{"x":146.734375,"y":162.828125,"indice":17}],"dataLinhasPontos":[{"u":1,"v":4,"peso":90,"ocupado":0,"linha":{"start":{"x":423.734375,"y":212.828125,"type":25},"end":{"x":581.734375,"y":66.828125,"type":25},"type":23}},{"u":2,"v":4,"peso":80,"ocupado":0,"linha":{"start":{"x":426.734375,"y":151.828125,"type":25},"end":{"x":581.734375,"y":66.828125,"type":25},"type":23}},{"u":4,"v":16,"peso":100,"ocupado":0,"linha":{"start":{"x":581.734375,"y":66.828125,"type":25},"end":{"x":417.734375,"y":86.828125,"type":25},"type":23}},{"u":4,"v":9,"peso":140,"ocupado":0,"linha":{"start":{"x":581.734375,"y":66.828125,"type":25},"end":{"x":410.734375,"y":30.828125,"type":25},"type":23}},{"u":5,"v":16,"peso":100,"ocupado":0,"linha":{"start":{"x":224.734375,"y":91.828125,"type":25},"end":{"x":417.734375,"y":86.828125,"type":25},"type":23}},{"u":2,"v":5,"peso":90,"ocupado":0,"linha":{"start":{"x":426.734375,"y":151.828125,"type":25},"end":{"x":224.734375,"y":91.828125,"type":25},"type":23}},{"u":5,"v":9,"peso":120,"ocupado":0,"linha":{"start":{"x":224.734375,"y":91.828125,"type":25},"end":{"x":410.734375,"y":30.828125,"type":25},"type":23}},{"u":5,"v":14,"peso":90,"ocupado":0,"linha":{"start":{"x":224.734375,"y":91.828125,"type":25},"end":{"x":122.734375,"y":63.828125,"type":25},"type":23}},{"u":14,"v":17,"peso":90,"ocupado":0,"linha":{"start":{"x":122.734375,"y":63.828125,"type":25},"end":{"x":146.734375,"y":162.828125,"type":25},"type":23}},{"u":15,"v":17,"peso":90,"ocupado":0,"linha":{"start":{"x":153.734375,"y":247.828125,"type":25},"end":{"x":146.734375,"y":162.828125,"type":25},"type":23}},{"u":6,"v":15,"peso":150,"ocupado":0,"linha":{"start":{"x":321.734375,"y":278.828125,"type":25},"end":{"x":153.734375,"y":247.828125,"type":25},"type":23}},{"u":1,"v":6,"peso":120,"ocupado":0,"linha":{"start":{"x":423.734375,"y":212.828125,"type":25},"end":{"x":321.734375,"y":278.828125,"type":25},"type":23}},{"u":1,"v":3,"peso":100,"ocupado":0,"linha":{"start":{"x":423.734375,"y":212.828125,"type":25},"end":{"x":474.734375,"y":303.828125,"type":25},"type":23}},{"u":3,"v":8,"peso":60,"ocupado":0,"linha":{"start":{"x":474.734375,"y":303.828125,"type":25},"end":{"x":412.734375,"y":369.828125,"type":25},"type":23}},{"u":7,"v":8,"peso":110,"ocupado":0,"linha":{"start":{"x":612.734375,"y":367.828125,"type":25},"end":{"x":412.734375,"y":369.828125,"type":25},"type":23}},{"u":7,"v":11,"peso":100,"ocupado":0,"linha":{"start":{"x":612.734375,"y":367.828125,"type":25},"end":{"x":702.734375,"y":363.828125,"type":25},"type":23}},{"u":11,"v":12,"peso":100,"ocupado":0,"linha":{"start":{"x":702.734375,"y":363.828125,"type":25},"end":{"x":726.734375,"y":269.828125,"type":25},"type":23}},{"u":12,"v":13,"peso":90,"ocupado":0,"linha":{"start":{"x":726.734375,"y":269.828125,"type":25},"end":{"x":690.734375,"y":95.828125,"type":25},"type":23}},{"u":7,"v":10,"peso":100,"ocupado":0,"linha":{"start":{"x":612.734375,"y":367.828125,"type":25},"end":{"x":629.734375,"y":199.828125,"type":25},"type":23}},{"u":4,"v":10,"peso":100,"ocupado":0,"linha":{"start":{"x":581.734375,"y":66.828125,"type":25},"end":{"x":629.734375,"y":199.828125,"type":25},"type":23}},{"u":1,"v":7,"peso":150,"ocupado":0,"linha":{"start":{"x":423.734375,"y":212.828125,"type":25},"end":{"x":612.734375,"y":367.828125,"type":25},"type":23}},{"u":4,"v":13,"peso":100,"ocupado":0,"linha":{"start":{"x":581.734375,"y":66.828125,"type":25},"end":{"x":690.734375,"y":95.828125,"type":25},"type":23}},{"u":1,"v":5,"peso":100,"ocupado":0,"linha":{"start":{"x":423.734375,"y":212.828125,"type":25},"end":{"x":224.734375,"y":91.828125,"type":25},"type":23}}]}};
	var graphB ={"grafo":{"points":[{"x":229.734375,"y":37.828125,"indice":1},{"x":112.734375,"y":219.828125,"indice":2},{"x":348.734375,"y":81.828125,"indice":3},{"x":101.734375,"y":67.828125,"indice":4},{"x":342.734375,"y":136.828125,"indice":5},{"x":176.734375,"y":250.828125,"indice":6}],"dataLinhasPontos":[{"u":3,"v":6,"peso":1,"ocupado":0,"linha":{"start":{"x":348.734375,"y":81.828125,"type":25},"end":{"x":176.734375,"y":250.828125,"type":25},"type":23}},{"u":1,"v":2,"peso":3,"ocupado":0,"linha":{"start":{"x":229.734375,"y":37.828125,"type":25},"end":{"x":112.734375,"y":219.828125,"type":25},"type":23}},{"u":4,"v":6,"peso":3,"ocupado":0,"linha":{"start":{"x":101.734375,"y":67.828125,"type":25},"end":{"x":176.734375,"y":250.828125,"type":25},"type":23}},{"u":2,"v":3,"peso":3,"ocupado":0,"linha":{"start":{"x":112.734375,"y":219.828125,"type":25},"end":{"x":348.734375,"y":81.828125,"type":25},"type":23}},{"u":1,"v":5,"peso":4,"ocupado":0,"linha":{"start":{"x":229.734375,"y":37.828125,"type":25},"end":{"x":342.734375,"y":136.828125,"type":25},"type":23}},{"u":4,"v":5,"peso":1,"ocupado":0,"linha":{"start":{"x":101.734375,"y":67.828125,"type":25},"end":{"x":342.734375,"y":136.828125,"type":25},"type":23}}]}};
	if(id==1){
		graphA = graphA.grafo; 
		enviarData(graphA);
	}else{
		graphB = graphB.grafo; 
		enviarData(graphB);
	}
}
function enviarData(layout){
		sessionStorage.setItem('graph_simulatorSave', JSON.stringify(layout));
		window.window.location.href="simulador.html";
}
