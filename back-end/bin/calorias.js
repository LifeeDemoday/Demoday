const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(expressMongoDb('mongodb://localhost/client'));
app.use(bodyParser.json());
app.use(cors());

function exercicios (dados) {
    let exercicio = {
        nome: dados.nome ,
        fortalece:dados.fortalece,
        calPorMinutos: dados.calPorMinutos
    }
    return exercicio;
}

function calorias (dados) {
    let caloria = {
        cal: dados.cal
    }
    return caloria;
}

function calculoDeCalorias(objetivo, saldoDeCalorias, exercicios){
    if (objetivo === 'manter') {
        console.log(objetivo);
        console.log(saldoDeCalorias);
        if (saldoDeCalorias > 0) {
            let tempos = {};
            for (let exercicio of exercicios) {
                tempos[exercicio.nome] = saldoDeCalorias / exercicio.calPorMinutos;
            }
            return {acao: tempos}
        } 
        else if (saldoDeCalorias < 0){
            return {acao: `Você precisa comer ${-saldoDeCalorias} calorias`}
        }
        else{
            return {acao: 'Você não precisa se preocupar hoje'}
        }    
    } 
    else if (objetivo === 'perder'){
        console.log(objetivo);
        console.log(saldoDeCalorias);
        if (saldoDeCalorias > -1000) {
            tempos = {};
            for(let exercicio of exercicios){
                tempos[exercicio.nome] = (saldoDeCalorias + 1000) / exercicio.calPorMinutos;
            }
            return {acao: tempos}
        } 
        else if (saldoDeCalorias < -1000){
            return {acao: `Você precisa comer ${-saldoDeCalorias - 1000} calorias`}
        }
        else{
            return {acao: 'Você não precisa se preocupar hoje'}
        }    
    }
}

function exercicio(dados) {
    let exercicios = {
        exercicio: dados.nome,
        tempo: dados.tempo
    };
    return exercicios
}

app.post('/calorias/:id', (req, res) => {
    
    let caloria = calorias(req.body);
    let query = {
        _id: ObjectID(req.params.id)
    };
    req.db.collection('exercicios').find().toArray((err, data) => {
        if(err){
            res.status(500).send('Erro ao acessar o banco de dados');
            return;
        }
        let exercicios = data;
        req.db.collection('usuarios').findOne(query, (err, data) => {
            if (err) {
                res.status(500).send('Erro ao acessar o banco de dados');
                return
            }
            let objetivo = data.objetivo;
            res.send(calculoDeCalorias(objetivo, caloria.cal, exercicios));
        });
    });
});

app.post('/addExercicios', (req, res) =>{
    let exercicio = exercicios(req.body);
    
    req.db.collection('exercicios').insert(exercicio, (err) =>{
        if(err){
            res.status(500).send('erro ao acessar banco de dados');
            return;
        }
        res.send(req.body);
    });
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

app.get("/buscar/exercicio/:nome", (req, res) => {
    
    let query = {
        nome: req.params.nome
    }
    
    req.db.collection('exercicios').find(query).toArray((error, data) => {
        
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

app.put('/atualizacao-diaria/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    req.db.collection('usuarios').findOne(query, (err, data) => {
        if (err) {
            res.status(500).send('Erro ao acessar o banco de dados');
            return
        }
        let usuario = data;
        for (let i in req.body.exercicios){
            usuario.exercicios.push(exercicio(req.body.exercicios[i]));
        }
        usuario.calorias.push(req.body.calorias);
        
        req.db.collection('usuarios').updateOne(query, usuario, (err, data) => {
            if (err) {
                res.status(500).send('Erro ao acessar o banco de dados');
                return
            }
            res.send('Atualizado com sucesso');
        });
    });
});

app.listen(3001);