var express = require('express');
var router = express.Router();
const Knex = require('knex')
const dbConfig = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  const {data, caixa} =  req.query;

  console.log('minha consulta:',{data})
  var url = require('url');
  res.set('Location', url.parse(req.url).pathname); 
    
  res.render('vendas', {dados:{data, caixa}});
});

module.exports = router;
