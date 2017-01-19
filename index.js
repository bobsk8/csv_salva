const	
	express = require('express'),
	bodyParser = require('body-parser'),
	csv=require('csvtojson'),
	multiparty = require('connect-multiparty'),
	ulpload = require('./routes/upload'),
	mainDb = require('./db/main')	
	app = express();

const
	port = process.env.PORT || 8080;  	
	app.use(bodyParser.urlencoded({ extended: true }));
  	app.use(bodyParser.json());
  	app.listen(port);

 	let	csvFilePath='./uploads/some-csv-file.csv';

  	//Lendo arquivo csv
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
   	console.log(jsonObj);
	})
	.on('done',(error)=>{
    console.log('end')
	});

	//Rotas
	app.post('/api/upload',multiparty(), ulpload.recebe);
	app.get('/db/criate',mainDb.criaDB);