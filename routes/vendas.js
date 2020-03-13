var express = require('express');
var router = express.Router();
const {isAuth} = require('../helpers/autenticacao');



router.get('/',  isAuth, function(req, res) {
  const {data, caixa} =  req.query;    
  res.render('vendas', {dados:{data, caixa}});
});

module.exports = router;
