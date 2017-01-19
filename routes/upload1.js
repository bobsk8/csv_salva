const
	fs = require('fs'),
	csv=require('csvtojson'),
	mainDb = require('../db/main');  

module.exports.recebe = _recebe;
let listaObjecTela = [];


function _recebe(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  let arquivo = req.files.file;
  let temporario = req.files.file.path;
  let caminhoArquivo = './uploads/' + concatDateTime() + '.csv';  
 	fs.rename(temporario, caminhoArquivo, function(err){
 		
  readCSV(caminhoArquivo,res);

  if(err){
 		 res.status(500).json({error: err})
 	  }
 		 res.json({message: "enviado com sucesso.", file: caminhoArquivo});
 	  })
  }



function concatDateTime(){
	let date = new Date();  
  	let day = date.getDate();
  	let monthIndex = date.getMonth() + 1;
  	let year = date.getFullYear();
  	let minutos = date.getMinutes();
  	let horas = date.getHours();
  
  	let dateConcat = `${year}_${monthIndex}_${day}-${horas}_${minutos}`;

  	return dateConcat;
};

function readCSV(caminhoArquivo,res){	
  let i = 0;
  
  //Lendo arquivo csv
	csv()
	.fromFile(caminhoArquivo)
	.on('json',(jsonObj)=>{
    listaObjecTela = jsonObj;    
    //Busca no banco
    
    mainDb.findObjetivoDado(jsonObj,res,function(obj){
      if(obj!=undefined){
        console.log(obj[i].objetivo);
      }else{
        console.log('vazio');
      }
    
    i++;
  //    if(obj!=undefined && obj.length>0){
      //  console.log('É diferente');
      //  varreObjeto(jsonObj,obj);
  //    }else{
      //  console.log('É igual ')
  //    }
    });
    //Descomentar para salvar no banco    
   // mainDb.setDB(jsonObj);  
    //mainDb.setDB(listaObjecTela);
    
	//console.log(listaObjecTela);
  })
	.on('done',(error)=>{
    console.log('end');
	});
}


function varreObjeto(objTela,listaBanco){
  //console.log('chegou lista tela' + objTela.objetivo);
  for(var i = 0;i < listaBanco.length;i++){
    if(listaBanco[i].objetivo == objTela.objetivo){
      console.log('É igual ' + listaBanco[i].objetivo + ' = ' + objTela.objetivo);
    }else{
      console.log('É diferente ' + listaBanco[i].objetivo + ' != ' + objTela.objetivo);
    }   
  }
}