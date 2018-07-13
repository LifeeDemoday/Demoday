import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Cadastro.css';
import Botao from './Botao';

class Cadastro extends Component {

    cadastrar(){
        console.log('Entra na função');
        let cadastro = true;
        let nome =document.querySelector('.cadastro input.nome').value;
        let email =document.querySelector('.cadastro input.email').value;
        let senha =document.querySelector('.cadastro input.senha').value;
        let object = {
            "nome": nome,
            "email": email,
            "cadastro": cadastro,
            "senha": senha 
        };
        fetch('localhost:3001/entrada', {
            headers:{
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(object)
        }).then(promessa => promessa.json()).then(dados => {
            console.log(dados);
        });
    }
    render() {
        return (
            <div className="cadastro">
                <input className="nome" type="text" placeholder="Nome"/>
                <input className="email" type="email" placeholder="E-mail"/>
                <input className="senha" type="password" placeholder="Senha"/>
                <Botao clicar={this.cadastrar}texto="Cadastro" />
            </div>
        );
    }
}

export default Cadastro;