const mongoose = require('mongoose')
 require('dotenv').config()

const connectDb = async function(){
    const{DB_CONNECTION_STRING}  = process.env
    if(!DB_CONNECTION_STRING){
        console.log('Não foi informada nenhuma string de conexão ao banco') 
    }

    await mongoose.connect(DB_CONNECTION_STRING)
    mongoose.connection.on('connected', ()=>console.log('Conectado ao DB'))
    mongoose.connection.on('error', error => console.log('Ocorreu erro ao conectar no DB' + error));
    
}

module.exports = connectDb

