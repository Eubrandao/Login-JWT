const express = require ('express')
const connectDb = require('./middlewares/connectDb')
const md5 = require('md5')
const User = require('./models/UserModel')
const app = express() 
const jwt = require('jsonwebtoken')
app.use(express.urlencoded({extended:true}))
app.use(express.json())
require('dotenv').config()
const cors = require('cors')

app.use(cors())

app.listen(3001, ()=>{
    console.log('Server is on')

})

//---------------------------CRIAÇÃO DE USUÁRIO------------------------

app.post('/users', async (req, res)=>{

  
    const name = req.body.name
    const email = req.body.email
    const password = md5(req.body.password)

   
    if(!req.body.name || req.body.name.length < 2){
        res.status(400).json({msg: 'Nome inválido'})
    }

    if(!req.body.email || req.body.email.length < 5 ){
        res.status(400).json({msg: 'E-mail inválido'})
    }

    if(!req.body.password || req.body.password.length < 4 ){
        res.status(400).json({msg: 'Senha inválida'})
    } 

  
    const existingEmail = await User.find({email: req.body.email})
    if(existingEmail && existingEmail.length){
        
        return res.status(400).json({msg: 'Já existe um usuário com este Email'})
    }
   
    await User.create({name, email, password})

    return res.status(200).json({msg: 'Usuário criado'})
})

    

app.post('/login', async(req, res)=>{

    const {MY_SECRET_KEY} = process.env
    if(!MY_SECRET_KEY){
        return res.status(500).json({msg: 'Chave JWT não informada'})
    }

    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    if(!req.body.email || !req.body.password){
        return res.status(404).json({msg: 'Favor informar usuário e senha'})
    }

    const usersFound = await User.find({email: req.body.email, password: md5(req.body.password)})
    if(usersFound && usersFound.length > 0){
        const user = usersFound[0]
        const token = jwt.sign({_id: user._id}, MY_SECRET_KEY)

        const result = {
            'msg': 'Bem vindo',
            name: user.name,
            email: user.email,
            token
    
        }
        res.status(200).json(result)
    }
    res.status(400).json({msg: 'Usuário ou senha não encontrado '})

    
    
})



module.exports = connectDb()