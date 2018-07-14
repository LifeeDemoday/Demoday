const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/client'));
app.use(bodyParser.json());
app.use(cors());

function mensagens(dados){
    return {
        nome: dados.nome,
        horario: dados.horario,
        mensagem: dados.mensagem
    }
}

function formatoMensagem(dados, id) {
    let mensagem = {
        pessoas: [dados.pessoa, id].sort(),
        horaUltimaMensagem: dados.horario,
        mensagens: [mensagens(dados)]
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
    req.db.collection('usuarios').findOne({_id: ObjectID(req.params.id)}, (error, data) => {
        if (error) {
            res.status(500).send('Erro ao acessar o banco de dados');
            return
        }
        if(!data.conversas.includes(req.body.pessoa)){
            req.db.collection('conversas').insert(mensagem, (error) => {
                if(error){
                    res.status(500).send('Erro ao acessar o banco de dados');
                    return
                }
            });
            atualizarListaDeConversas(req, res, req.params.id, req.body.pessoa);
            atualizarListaDeConversas(req, res, req.body.pessoa, req.params.id);
        }
        else{
            req.db.collection('conversas').findOne({pessoas: [req.body.pessoa, req.params.id].sort}, (error, data) => {
                if (error) {
                    res.status(500).send('Erro ao acessar o banco de dados');
                    return
                }
                data.horaUltimaMensagem = req.body.horario;
                data.mensagens.push(mensagens(req.body));
                req.db.collection('conversas').updateOne({pessoas: [req.body.pessoa, req.params.id].sort}, data, (error, data) => {
                    if(error){
                        res.status(500).send('Erro ao atualizar usuario');
                        return;
                    }
                });
            });
        }
    }); 
});

app.get('/mensagens/:usuario/:alvo', (req, res) => {
    let query = {
        _id: [req.params.id, req.params.alvo].sort
    };

    req.db.collection('conversas').findOne(query, (error, data) => {
        if(error){
            res.status(500).send('Erro ao acessar o banco de dados');
            return;
        }

        if(!data){
            res.status(404).send('Usuário não existe');
            return;
        }
        console.log(data);
        res.send(data);
    });
});
app.listen(3002);