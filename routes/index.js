var express = require('express');
var router = express.Router();
const {isAuth} = require('../helpers/autenticacao');

router.get('/', isAuth, function(req, res) {  
  res.render('index');
});

module.exports = router;
