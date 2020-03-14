var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const { conn } = require('../db');
const {isAuth} = require('../helpers/autenticacao');



router.get('/', isAuth, function(req, res) {
  const {data, caixa} =  req.query;
  var dados = {};
  console.log(data, caixa);
  if(data!=='undefined' && caixa!=='undefined'){
    const {user} = req;
    const pool  = new Pool (conn());
    const qry = `select a.cod_finalizadora, a.finalizadora, (sum(a.valor) - sum(a.troco)) as valor 
                    from recebimento a, usuario b
                    where a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}
                group by a.cod_finalizadora, a.finalizadora`;    
    pool.query(qry)
      .then((con)=>{
          const dados= con.rows;
          res.render('finalizadora', {data:data.replace('.','/').replace('.','/'), caixa, dados});
      })
      .catch((err)=>{
        res.render('finalizadora', {data:data.replace('.','/').replace('.','/'), caixa, dados});
      });
  } else {
    res.render('finalizadora', {data:data.replace('.','/').replace('.','/'), caixa, dados});
  }

});


module.exports = router;
