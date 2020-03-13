var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const { conn } = require('../db');
const {isAuth} = require('../helpers/autenticacao');

router.get('/finalizadora/caixasativos/:data', isAuth, function(req, res) {
  const { data } = req.params;
  const {user} = req;
  const pool  = new Pool (conn());
  const qry = `select distinct a.caixa from venda a, usuario b
                where a.data='${data}'
                and a.empresa=b.empresa
                and b.login='${user}'
                order by a.caixa`
  pool.query(qry)
    .then((con)=>{
        res.status(200).send({ dados: con.rows })
    })
    .catch((err)=>{
        res.status(500).send({ dados:[], erro: err.message })
    })
     
});

router.get('/finalizadora/:data/:caixa', isAuth, function(req, res) {
    const { data } = req.params;
    const { caixa } = req.params;
    if (caixa==='Selecionar'){
        res.status(200).send({ dados:[] });
        return;  
    }
    const {user} = req;
    const pool  = new Pool (conn());
    const qry = `select a.cod_finalizadora, a.finalizadora, (sum(a.valor) - sum(a.troco)) as valor 
                    from recebimento a, usuario b
                    where a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}
                group by a.cod_finalizadora, a.finalizadora`;
    console.log(qry);
    pool.query(qry)
      .then((con)=>{
          res.status(200).send({ dados: con.rows })
      })
      .catch((err)=>{
          res.status(500).send({ dados:[], erro: err.message })
      })
       
});

  
router.get('/vendidos/:data', isAuth, function(req, res) {
    const { data } = req.params;     
    const {user} = req;
    const pool  = new Pool (conn());
    const qry = `select a.cod_produto,
                    a.descricao,
                    sum(a.qtd) as qtd, 
                    sum(a.venda) as venda 
                    from movimento a, usuario b
                where a.cancelado=false
                    and a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                group by a.cod_produto, a.descricao
                order by qtd desc
                    limit 100`;
    console.log(qry);
    pool.query(qry)
    .then((con)=>{
        const tmp = con.rows
        const dados = tmp.map(e=>{
            return Object.values(e);
        })
        res.status(200).send({ dados })
    })
    .catch((err)=>{
        res.status(500).send({ dados:[], erro: err.message })
    })
        
});

router.get('/vendas/:data/:caixa', isAuth, function(req, res) {
    const { data, caixa } = req.params;     
    const {user} = req;
    const pool  = new Pool (conn());
    const qry = `select cast((select coalesce(sum(a.valor),0) as liquido from venda a, usuario b
                    where a.cancelado=false
                    and a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float),
                    cast((select coalesce(sum(a.valor),0) as cancelado from venda a, usuario b
                    where a.cancelado=true
                    and a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float),
                    cast((select coalesce(sum(a.valor),0) as bruto from venda a, usuario b
                    where a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float),
                    cast((select count(a.valor) as qtdvendaliq from venda a, usuario b
                    where a.cancelado=false
                    and a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float),
                    cast((select count(a.valor) as qtdvendacan from venda a, usuario b
                    where a.cancelado=true
                    and a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float),
                    cast((select count(a.valor) as qtdvendabruto from venda a, usuario b
                    where a.empresa=b.empresa
                    and b.login='${user}'
                    and a.data='${data}'
                    ${caixa==='Todos' ? '' : `and a.caixa='${caixa}'`}) as float)
                from venda limit 1`;
    
    pool.query(qry)
    .then((con)=>{
        const dados = con.rows[0];
        res.status(200).send({ dados })
    })
    .catch((err)=>{
        res.status(500).send({ dados:[], erro: err.message })
    })
        
});
    
  

module.exports = router;

