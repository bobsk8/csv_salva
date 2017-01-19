const
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('objdb', 'root', 'vasco20', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports.criaDB = _criaDB;
module.exports.setDB  = _setDB;
module.exports.findObjetivoDado = _findObjetivoDado;
module.exports.update = _update;


let ObjetivoDado = sequelize.define('objetivodado', {
id: {
   type: Sequelize.BIGINT,
   autoIncrement: true,
   primaryKey: true
 },
 objetivo: {
  type: Sequelize.STRING
},
indicador: {
  type: Sequelize.STRING
},
 data: {
 type: Sequelize.DATE  
 },
valor: {
type: Sequelize.DOUBLE
},
objetivoId: {
type: Sequelize.BIGINT
}
}, {
  freezeTableName: true 
});

function _criaDB(){  
  ObjetivoDado.sync({force: false}).then(function () {
    console.log('tabela criada');    
  });
};

function _setDB(objetivoDado){ 
  ObjetivoDado.sync({force: false}).then(function () {
    console.log('tabela criada ' + objetivoDado.objetivo);
    return ObjetivoDado.create({
    objetivo: objetivoDado.objetivo,
    indicador: objetivoDado.indicador,
    data: objetivoDado.data,
    valor: objetivoDado.valor,
    objetivoId:1
  });  
  });
};

function _update(objDado,id){
   ObjetivoDado.update({
       data: objDado.data,
       valor : objDado.valor
     },{
       where: { id: id }
     })
     .catch((err)=>{
       console.log('Error ' + err);
     });
}

function _findObjetivoDado(funcao){
  ObjetivoDado.findAll()
    .then((objdado)=>{
      funcao(objdado);
    })
    .catch((err)=>{
      console.log('error ' + err);
    });
}

/*function _findObjetivoDado(objetive,res,funcao){
  ObjetivoDado.findAll({ where: {objetivo: objetive.objetivo} && {indicador: objetive.indicador}
&& {data: objetive.data}})
    .then((objdado)=>{
      console.log(objdado);
      funcao(objdado);
    })
    .catch((err)=>{
      console.log('error ' + err);
    });

}
*/