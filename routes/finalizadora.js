var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const { conn } = require('../db');
const {isAuth} = require('../helpers/autenticacao');



router.get('/', isAuth, function(req, res) {
  const {data, caixa} =  req.query;
  console.log(data, caixa);
  res.render('finalizadora');
});


module.exports = router;
