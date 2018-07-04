const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/client'));
app.use(bodyParser.json());

function fichaCadastro (dados){
    let usuario = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha
    }

    return usuario;
}

function fichaLogin (dados){
    let usuario = {
        email: dados.email,
        senha: dados .senha
    }

    return usuario;
}

app.post('/entrada', (req, res) => {
    let cadastro = req.body.cadastro;
    
    let novoUsuario =  ficha(req.body);

    if(req.body.email.indexOf('@') == -1){
        res.status(400).send({mensagem: 'Email inválido'});
        return;
    }
    
    req.db.collection('usuarios').insert(novoUsuario, (error) =>{
        if(error){
            res.status(500).send('Error ao acessar o servidor.');
            return;
        }

        res.send(req.body);
    });

});
  
/*
app.post('/entrada', (req, res) => {

     if(cadastro){

         let novoUsuario = ficha(req.body);

        if(req.body.email.indexOf('@') == -1){
            res.status(400).send({mensagem: 'Email inválido'});
            return;
        }
    
         req.db.collection('usuarios').insert(novoUsuario, (error) =>{
             if(error){
                 res.status(500).send('Error ao acessar o servidor.');
                 return;
             }
    
             res.send(req.body);
         });
    }else{
        let usuario = fichaLogin(req.body);

        req.db.collection('usuarios') //levar a pagina do perfil ou inicio
    }
});

*/
app.get('/Usuarios', (req, res) => {
    req.db.collection('usuarios').find().toArray((error, data) =>{
        if(error){
            res.status(500).send('Erro ao acessar o banco de body');
            return;
        }
        res.send(data);
    });
});

app.get("/buscar/:id", (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('usuarios').findOne(query, (error, data) => {

        if(error){
            res.status(500).send('ususario não existe');
            return;
        }

        if(!data){
            res.status(404).send('não encontrado');
            return;
        }

        res.send(data);
    });
});

app.get("/Buscar/nome/:nome", (req, res) => {
    let query = {
        nome: req.params.nome
    };

    req.db.collection('usuarios').find(query).toArray((error, data) => {

        if(error){
            res.status(500).send('ususario não existe');
            return;
        }

        if(!data){
            res.status(404).send('não encontrado');
            return;
        }

        res.send(data);
    });
});

app.put("/Auto/:id", (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('usuarios').updateOne(query, autoUsuario, (error, data) => {
        
        if(error){
            res.status(500).send('Error ao atualizar ususario');
            return;
        }

        res.send(data);
    });
});


app.delete("/Excluir/:id", (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('usuarios').deleteOne(query, (error, data) => {
        
        if(error){
            res.status(500).send('Error ao deletar ususario');
            return;
        }

        res.send(data);
    });
});

app.listen(3000);