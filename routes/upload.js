const
	fs = require('fs'),
	csv=require('csvtojson'),
	mainDb = require('../db/main');  

module.exports.recebe = _recebe;
let listaObjecTela = [];

//recebe o csv
function _recebe(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  let arquivo = req.files.file;
  let temporario = req.files.file.path;
  let caminhoArquivo = './uploads/' + getDateTimeNow() + '.csv';  
  	
  fs.rename(temporario, caminhoArquivo, function(err){
  //chama a função que irá ler o csv e retornar um array dos dados			
  readCSV(caminhoArquivo, function(arrayArquivo){
  	//chama a função que irá buscar no banco todos os objetivodados;	
  	mainDb.findObjetivoDado(function(listaBanco){  		
  		//chama a função que irá varrer a procura de objetos iguais;
  		varreObjeto(arrayArquivo,listaBanco);
  	});
  });

  if(err){
 		 res.status(500).json({error: err})
 	  }
 		 res.json({message: "enviado com sucesso.", file: caminhoArquivo});
 	  })
  }

//Lê o arquivo csv
function readCSV(caminhoArquivo, funcao){
	csv()
	.fromFile(caminhoArquivo)
	.on('json',(jsonObj)=>{
    	    	
  	})
	.on('end_parsed',(jsonArrObj)=>{
    	funcao(jsonArrObj);
	});
}


function varreObjeto(arrayArquivo,listaBanco){
  if(listaBanco.length!=undefined && listaBanco.length>0){

  for(var i = 0;i < arrayArquivo.length;i++){        
  	for(var j = 0;j < listaBanco.length;j++){
  		
  		if(listaBanco[j].objetivo == arrayArquivo[i].objetivo && 
  		   listaBanco[j].indicador == arrayArquivo[i].indicador){
      			if(convertDate(listaBanco[j].data) != arrayArquivo[i].data ||
      				listaBanco[j].valor != arrayArquivo[i].valor){
      					console.log('Update: ' +arrayArquivo[i].objetivo + ' - ' + listaBanco[j].objetivo);
      					//mainDb.update(arrayArquivo[i],listaBanco[j].id);

      					//console.log(listaBanco[j].data); 
      					//console.log(convertDate(listaBanco[j].data) + ' - ' + arrayArquivo[i].data);
      					//console.log(listaBanco[j].valor + ' - ' + arrayArquivo[i].valor);
      					//console.log(arrayArquivo[i].objetivo + ' - ' + listaBanco[j].id)
      			}
      	//console.log('É igual ' + listaBanco[j].objetivo + ' = ' + arrayArquivo[i].objetivo);
    	}else{
      		
    	}   
  	}
  }

}else{	
		//Irá cair nesse else quando a tabela objetivoDado estiver vazia
		console.log('tabela objetivoDado vazia');
		mainDb.findObjetivo(function(listaBanco){  		
  		//chama a função que irá varrer o banco a procura da existencia de objetivo e indicador iguais ;
  		verificaObjetivoIndicador(listaBanco,arrayArquivo);
  	});

/*
	console.log(arrayArquivo.length);
	for(var i = 0;i < arrayArquivo.length;i++){
		arrayArquivo[i].data = formatDate(arrayArquivo[i].data);
		console.log('banco vazio');
		//mainDb.setDB(arrayArquivo[i]);		
	}
*/
}
}


//Formata a data do objeto csv q está sendo enviado para persistir no banco.
function formatDate(data){
	var dataConcat = '';
	let dia = data.substring(0,2);
	let mes = data.substring(3,5);
	let ano = data.substring(6,12);	
	
	dataConcat = ano + '-' + mes + '-' + dia;
	return dataConcat;
}

//converte a data do banco para a mesma do arquivo csv que está sendo enviado.
//Com isso é possível fazer a comparação
function convertDate(data){
	let dataCo = data.setDate(data.getDate() + 1);
	
	let dateConcat = '';
	let date = new Date(dataCo);	
    let year = date.getFullYear();
    let raw = parseInt(date.getMonth()) + 1;    
    let month = raw < 10 ? '0' + raw : raw;
    let rawDay = parseInt(date.getDate());
    let day = rawDay < 10 ? '0' + rawDay : rawDay;
	
	dateConcat = day + '/' + month + '/' + year;	
	return dateConcat;
}

//retorna o tempo atual do servidor para setar no nome do arquivo
function getDateTimeNow(){
	let date = new Date();  
  	let day = date.getDate();
  	let monthIndex = date.getMonth() + 1;
  	let year = date.getFullYear();
  	let minutos = date.getMinutes();
  	let horas = date.getHours();
  
  	let dateConcat = `${year}_${monthIndex}_${day}-${horas}_${minutos}`;

  	return dateConcat;
};

//Ao salvar um objetoDado verifica se existe na tabela objetivo a existencia do objetivo e indicador
function verificaObjetivoIndicador(listaBanco,arrayArquivo){	
	for(var i = 0;i < arrayArquivo.length;i++){
		for(var j = 0;j < listaBanco.length;j++){
			if(listaBanco[j].objetivo == arrayArquivo[i].objetivo && 
  		   listaBanco[j].indicador == arrayArquivo[i].indicador){
				console.log('Irá salvar : ' + arrayArquivo[i].objetivo);
				mainDb.setDB(arrayArquivo[i], listaBanco[j].id);
			}
		}
	}
}