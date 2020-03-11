var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const {data, caixa} =  req.query;

  console.log('minha consulta:',{data})
  var url = require('url');
  res.set('Location', url.parse(req.url).pathname); 
    
  res.render('index', {dados:{data, caixa}});
});

module.exports = router;
