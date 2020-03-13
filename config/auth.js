const localStrategy = require("passport-local").Strategy;
const { Pool } = require('pg');
const { conn } = require('../db');


module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'nome', passwordField:'senha'},(nome,senha,done)=>{        
        const pool  = new Pool (conn()); 
        const qry = `select id, login,nome from usuario where login='${nome}' and senha='${senha}'`
        console.log('login: ',qry)
        pool.query(qry)
          .then(con=>{
            const user = con.rows[0]
            console.log('login: ', user)                 
            if (user){
                done(null,user);
            } else {
                done(null,null);
            }
          })
          .catch((err)=>{
            console.log(err.message)
            done(null,null); 
          });
    }));

  
    passport.serializeUser((user,done)=>{ 
        console.log('serializeUser', user.id);
        done(null,user.id);
    });
  
    passport.deserializeUser((id,done)=>{
        const pool  = new Pool (conn()); 
        const qry = `select login as nome from usuario where id=${id}`
        pool.query(qry)
          .then(con=>{
            const user = con.rows[0];
            pool.end()
              .then(()=>{
                console.log('deserializeUser', user.nome);
                done(null,user.nome);
              })
              .catch(()=>{
                 done(null,user.nome);
              })
          });         
    });
    

}