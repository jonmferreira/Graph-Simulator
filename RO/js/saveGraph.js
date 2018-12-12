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
		console.log(fileArr);
		var saveObject = JSON.parse(fileArr).grafo; 
		sessionStorage.setItem('graph_simulatorSave', JSON.stringify(saveObject));
		window.window.location.href="simulador.html";
	}
}
