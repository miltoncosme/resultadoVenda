var express = require('express');
var router = express.Router();

/* GET home page. */
var knex = require('knex')({
  client: 'postgres',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : '740516',
    database : 'DBresultado',
    port:8080
  }
});

router.get('/', function(req, res, next) {
  const {data, caixa} =  req.query;

  console.log('minha consulta:',{data})
  var url = require('url');
  res.set('Location', url.parse(req.url).pathname); 
    
  res.render('finalizadora', {dados:{data, caixa, }});
});

router.get('/consulta/:data', function(req, res) {
  const { data } = req.params
  knex
  .distinct('caixa', 'data')
  .from('recebimento')
  .where('empresa', 4869308)
  .where('data', `${data}%`)
  .then(con=>{
    console.log(con)
    res.status(200).send({ auth: true, result: true, dados: con })
  })     
});

router.get('/consulta/:data/caixa/:caixa', function(req, res) {
  const { data, caixa } = req.params
  knex
  .select()
  .from('recebimento')
  .where('empresa', 4869308)
  .where('data', `${data}%`)
  .where('caixa', `${caixa}`)
  .then(con=>{
    console.log(con)
    res.status(200).send({ auth: true, result: true, dados: con })
  })     
});

module.exports = router;
