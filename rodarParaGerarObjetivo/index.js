 Sequelize = require('sequelize');

var sequelize = new Sequelize('objdb', 'root', 'vasco20', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var Objetivo = sequelize.define('objetivo', {
id: {
  type: Sequelize.BIGINT,
  autoIncrement: true,
  primaryKey: true
},
objetivo: {
  type: Sequelize.STRING
},
meta: {
  type: Sequelize.DOUBLE
},
indicador: {
  type: Sequelize.STRING
},
responsavel: {
  type: Sequelize.STRING
},
mensuracao: {
  type: Sequelize.STRING
}
}, {
freezeTableName: true 
});

var ObjetivoDado = sequelize.define('objetivodado', {
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
}
}, {
  freezeTableName: true 
});

/*
function findAll(){
  ObjetivoDado.findAll({ where: {objetivoId: '3'} })
    .then((posts) => {
      console.log('aaaaaaaaa'+ posts);
      
    })
    .catch((err) => {
      console.log('Errorrrrr' + err);
    });
}

findAll();
*/

Objetivo.sync({force: true}).then(function () {
  return Objetivo.create({
    objetivo: 'objOne',
    meta: 1.2,
    indicador: 'metaA',
    responsavel: 'Rodrigo',
    mensuracao: 'mes'    
  });  
});

Objetivo.hasMany(ObjetivoDado);

ObjetivoDado.sync({force: true}).then(function () {});







///////////////////////////////////////////////////////////////////

 /*Sequelize = require('sequelize');

var sequelize = new Sequelize('teste', 'root', 'vasco20', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

var User = sequelize.define('user', {
firstName: {
  type: Sequelize.STRING,
  field: 'first_name' 
},
lastName: {
  type: Sequelize.STRING
}
}, {
freezeTableName: true 
});

var Product = sequelize.define('product', {
  name: {
    type: Sequelize.STRING,
    field: 'name' 
  },
  price: {
    type: Sequelize.DOUBLE
  }
}, {
  freezeTableName: true 
});

//Product.hasOne(User); //chave fica com o usuario
//User.hasOne(Product); //chave fica com o produto
//Product.belongsTo(User); //chave fica com o produto
//User.hasMany(Product); //chave fica com o produto

Product.sync({force: true}).then(function () {

  return Product.create({
    name: 'Apple',
    price: 12.5
  });  
});

User.sync({force: true}).then(function () {
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
*/