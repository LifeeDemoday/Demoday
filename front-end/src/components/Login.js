import React, { Component } from 'react';
import './Login.css';
import Botao from './Botao';

class Login extends Component {

    login(){
        let cadastro = false;
        let email =document.querySelector('.login input.login').value;
        let senha =document.querySelector('.login input.senha').value;
        let object = {
            "email": email,
            "cadastro": cadastro,
            "senha": senha 
        };
        fetch('/entrada', {
            headers:{
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(object)
        }).then(promessa => promessa.json()).then(dados => {
            console.log('logado');
        });
    }

    render() {
        return (
            <div className="login">
                <input className="login" type="email" placeholder="Login"/>
                <input className="senha"type="password" placeholder="Senha"/>
                <Botao texto="Login" clicar={this.login}/>
            </div>
        );
    }
}

export default Login;