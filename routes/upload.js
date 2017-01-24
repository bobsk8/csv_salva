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

	  	if(err){
	 		 res.status(500).json({error: err})
	 	  }
	 		res.json({message: "enviado com sucesso.", file: caminhoArquivo});

	 		 //chama a função que irá ler o csv e retornar um array de dados (arrayArquivo)			
	  		readCSV(caminhoArquivo, function(arrayArquivo){
	  			//Varre o array chamando a funcao que faz busca no banco trazendo o ultimo objeto (varreObjetoObjetivoDado)
	  			for(var i = 0;i < arrayArquivo.length;i++){
	  				varreObjetoObjetivoDado(arrayArquivo[i],function(objetivo,objetivoId,id,teste){
	  					if(teste=='altera'){ 
	  						mainDb.update(objetivo,id);
	  					}else if(teste=='incluir'){
	  						mainDb.setDB(objetivo, objetivoId);	  				
	  					}
	  				});
	  			}
	  		});
	 	})
	  
	  }

	function varreObjetoObjetivoDado(objetivo,funcao){
		mainDb.findUltimoObjetivoDado(objetivo.objetivo,objetivo.indicador,function(objetoBanco){
			var teste = '';
			var data ='';	
			if(objetoBanco!=null){
				data = convertDate(objetoBanco.dataValues.data);
				if(objetivo.data == data &&
	      			objetivo.valor != objetoBanco.dataValues.valor){
					teste = 'altera';									
				}else if(objetivo.data != data ||
	      			objetivo.valor != objetoBanco.dataValues.valor){
					teste = 'incluir'					
				}
				funcao(objetivo,objetoBanco.dataValues.objetivoId,objetoBanco.dataValues.id,teste);
			}else{					
					//Quando a tabela objetivoDado estiver vazia irá para esse else			
					mainDb.findObjetivo(function(listaBanco){  		
	  				//chama a função que irá varrer o banco a procura da existencia de objetivo e indicador iguais 
	  				//verificaObjetivoIndicador(listaBanco,arrayArquivo[i]);
	  				verificaObjetivoIndicador(listaBanco,objetivo)
	  			})
	  		}								
	  		
	  	});
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

	//Ao salvar um novo objetivoDado, verifica se existe na tabela objetivo o seu correspondente de objetivo e indicador
	function verificaObjetivoIndicador(listaBanco,objetivo){
		
		for(var i = 0;i < listaBanco.length;i++){					
			
			if(listaBanco[i].objetivo == objetivo.objetivo && 
	  	   		listaBanco[i].indicador == objetivo.indicador){
				console.log('Vai salvar ' + objetivo.data + ' - ' + objetivo.objetivo);			
				mainDb.setDB(objetivo, listaBanco[i].id);
			}
		}
	}

	/* 
	INSERT INTO `objetivo` 
		(`id`,`objetivo`,`meta`,`indicador`,`responsavel`,`mensuracao`,`createdAt`,`updatedAt`) 
	VALUES 
		(DEFAULT,'objtwo',1.2,'metab','Rodrigo','mes','2017-01-23 19:07:00','2017-01-23 19:07:00');


	INSERT INTO `objetivo` 
		(`id`,`objetivo`,`meta`,`indicador`,`responsavel`,`mensuracao`,`createdAt`,`updatedAt`) 
	VALUES 
		(DEFAULT,'objOne',2.5,'metaA','Alberto','mes','2017-01-23 17:15:00','2017-01-23 17:15:00');
	/*



	/*
	//varre a lista da tela e a lista do banco buscando objetivos e indicadores iguais
	//Após esse procedimento, verifica se existe alguma modificação no ano ou no valor do mesmo 
	function varreObjetoObjetivoDado(arrayArquivo,listaBanco){
	  if(listaBanco.length!=undefined && listaBanco.length>0){

	  for(var i = 0;i < arrayArquivo.length;i++){        
	  	for(var j = 0;j < listaBanco.length;j++){
	  		
	  		if(listaBanco[j].objetivo == arrayArquivo[i].objetivo && 
	  		   listaBanco[j].indicador == arrayArquivo[i].indicador){
	      			if(convertDate(listaBanco[j].data) == arrayArquivo[i].data &&
	      				listaBanco[j].valor != arrayArquivo[i].valor){
	      					//Irá chamar o update caso a data ou o valor estejam diferentes
	      					//mainDb.update(arrayArquivo[i],listaBanco[j].id);
	      					console.log('passou update ' + listaBanco[j].valor + ' - ' + arrayArquivo[i].valor);
	      			}else if(convertDate(listaBanco[j].data) != arrayArquivo[i].data){	      				
	      				//mainDb.setDB(arrayArquivo[i], listaBanco[j].id);
	      				console.log();
	      				console.log('passou, abaixo update ' + listaBanco[j].valor + ' - ' + arrayArquivo[i].valor);
	      				console.log();
	      			}
	    		}
	  		}
	  	}

	}else{	
			console.log('caiu aqui');
			//Quando a tabela objetivoDado estiver vazia irá para esse else			
			mainDb.findObjetivo(function(listaBanco){  		
	  		//chama a função que irá varrer o banco a procura da existencia de objetivo e indicador iguais 
	  		verificaObjetivoIndicador(listaBanco,arrayArquivo);
	  	});

		}
	}
*/