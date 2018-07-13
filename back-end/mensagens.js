const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/client'));
app.use(bodyParser.json());
app.use(cors());


function formatoMensagem(dados, id) {
    let mensagem = {
        pessoas: [dados.pessoa, id].sort(),
        horaUltimaMensagem: dados.horario,
        mensagens: [{
            nome: dados.nome,
            horario: dados.horario,
            mensagem: dados.mensagem
        }]
    }
    return mensagem
}

function atualizarListaDeConversas(req, res, id, id2) {
    let query = {
        _id: ObjectID(id)
    };
    req.db.collection('usuarios').findOne(query, (error, data) => {

        if(error){
            res.status(500).send('usuário não existe');
            return;
        }

        if(!data){
            res.status(404).send('não encontrado');
            return;
        }
        pessoa = data;
        pessoa.conversas.push(id2);

        req.db.collection('usuarios').updateOne(query, pessoa, (error, data) => {
        
            if(error){
                res.status(500).send('Erro ao atualizar usuario');
                return;
            }
        });
    });
}

app.post('/mensagens/nova-mensagem/:id', (req, res) => {
    let mensagem = formatoMensagem(req.body, req.params.id);
    req.db.collection('conversas').insert(mensagem, (error) => {
        if(error){
            res.status(500).send('Erro ao acessar o banco de dados');
            return
        }
    });
    atualizarListaDeConversas(req, res, req.params.id, req.body.pessoa);
    atualizarListaDeConversas(req, res, req.body.pessoa, req.params.id);

});

app.get('/mensagens/:id', (req, res) => {

    // Cria uma lista com todos os IDs das pessoas com quem o usuario já conversou
    let pessoas = [];

    // Cria uma lista com as conversas
    let conversas = [];
    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('usuarios').find(query).toArray((error, data) =>{
        if(error){
            res.status(500).send('Erro ao acessar o banco de dados');
            return;
        }
        pessoas = data.conversas; // Atualiza a lista dos IDs
        console.log('data: ' + data); 
        console.log('pessoas: ' + pessoas);
    });
    for (let idOutraPessoa of pessoas) {
        
        query = {
            pessoas: [req.params.id, idOutraPessoa].sort()
        };

        req.db.collection('conversas').findOne(query, (error, data) => {

            if(error){
                res.status(500).send('usuário não existe');
                return;
            }

            if(!data){
                res.status(404).send('não encontrado');
                return;
            }

            conversas.push(data); // Atualiza a lista das conversas
            console.log('conversas: ' + conversas);
        });
    }
    res.send(conversas);
});

app.get('/mensagens/:id/:nome', (req, res) => {
    let queryID = {
        _id: ObjectID(req.params.id)
    };

    let queryNome = {
        nome: req.params.nome
    };

    let usuarios = [];
    let usuariosID = [];

    req.db.collection('usuarios').find(queryNome).toArray((error, data) => {

        if(error){
            res.status(500).send('Erro ao acessar o banco de dados');
            return;
        }

        if(!data){
            res.status(404).send('Usuário não existe');
            return;
        }

        usuarios = data;
    });

    for (const pessoa of usuarios) {
        usuariosID.push(pessoa._id);
    }
});
app.listen(3002);