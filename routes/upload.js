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


//varre a lista da tela e a lista do banco primeiramente procurando objetivos e indicadores iguais
//depois verifica se existe alguma modificação no ano ou no valor do mesmo 
function varreObjeto(arrayArquivo,listaBanco){
  if(listaBanco.length!=undefined && listaBanco.length>0){

  for(var i = 0;i < arrayArquivo.length;i++){        
  	for(var j = 0;j < listaBanco.length;j++){
  		
  		if(listaBanco[j].objetivo == arrayArquivo[i].objetivo && 
  		   listaBanco[j].indicador == arrayArquivo[i].indicador){
      			if(convertDate(listaBanco[j].data) != arrayArquivo[i].data ||
      				listaBanco[j].valor != arrayArquivo[i].valor){
      					//Irá cair aqui caso a data ou o valor esteja diferentes
      					//mainDb.update(arrayArquivo[i],listaBanco[j].id);
      					console.log(''); 
      					console.log('Update!');
      			}
    	}
  	}
  }

}else{	
		//Irá cair nesse else quando a tabela objetivoDado estiver vazia
		console.log('tabela objetivoDado vazia');
		mainDb.findObjetivo(function(listaBanco){  		
  		//chama a função que irá varrer o banco a procura da existencia de objetivo e indicador iguais 
  		verificaObjetivoIndicador(listaBanco,arrayArquivo);
  	});

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

//Ao salvar um objetoDado verifica se existe na tabela objetivo o seu correspondente de objetivo e indicador
function verificaObjetivoIndicador(listaBanco,arrayArquivo){	
	for(var i = 0;i < arrayArquivo.length;i++){
		for(var j = 0;j < listaBanco.length;j++){
			if(listaBanco[j].objetivo == arrayArquivo[i].objetivo && 
  		   		listaBanco[j].indicador == arrayArquivo[i].indicador){
				arrayArquivo[i].data = formatDate(arrayArquivo[i].data);				
				mainDb.setDB(arrayArquivo[i], listaBanco[j].id);
			}
		}
	}
}