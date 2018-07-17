const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/client'));
app.use(bodyParser.json());

function exercicios () {
    let exercicio = {
        nome: dados.nome ,
        calTempo: dados.calTempo,
        tempo: dados.tempo
    }
    return exercicio;
}

function calorias () {
    let caloria = {
       cal: dados.cal
    }
    return caloria;
}

// function contaCal (calUsuario, calExercicio, dados){

//     if(calUsuario >= 0 && calUsuario < 10000){
//         let conta = (calUsuario - calExercicio);
//         return conta;
//     }
//     else{
//         let responde = dados.send('Você não pode colocar este valor');
//         return responde;
//     }
// }

app.post('/calorias', (req, res) => {

    let caloria = calorias();

    req.db.collection('addCal').insert(caloria, (err)  =>{
        if(err){
            res.statys(500).send('erro ao acessar banco de dados');
            return;
        }
        res.send(req.body);
    });
});

app.post('/addExercicios', (req, res) =>{
    let exercicio = exercicios();
    
    req.db.collection('exercicios').insert(exercicio, (err) =>{
        if(err){
            res.statys(500).send('erro ao acessar banco de dados');
            return;
        }
        res.send(req.body);
    });
});

app.put('autoCal/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };

    if(exercicio){

        let cal = calorias();

        req.db.collection('calorias').updateOne(query, cal, (error, data) => {
            
            if(error){
                res.status(500).send('Erro ao atualizar calorias');
                return;
            }
    
            res.send(data);
        });
    }
    
});

app.get('/exercicios', (req, res) => {
    req.db.collection('exercicios').find().toArray((error, data) =>{
        if(error){
            res.status(500).send('Erro ao acessar o banco de dados');
            return;
        }
        res.send(data);
    });
});

app.get("/buscar/exercicio/:id", (req, res) => {

    let query = {
        _id: ObjectID(req.params.id)
    };

    req.db.collection('exercicios').findOne(query, (error, data) => {

        if(error){
            res.status(500).send('exercicio não existe');
            return;
        }

        if(!data){
            res.status(404).send('não encontrado');
            return;
        }

        res.send(data);
    });
});




app.listen(3001);