require('dotenv/config');

const conn = function(){
    return {
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    database: 'DBResultadoVenda'}
}

module.exports.conn = conn