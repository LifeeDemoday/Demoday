import React, { Component } from 'react';
import './Login.css';
import Botao from './Botao';

class Login extends Component {
  render() {
    return (
        <div className="login">
            <input type="email" placeholder="Login"/>
            <input type="password" placeholder="Senha"/>
            <Botao texto="Login" />
        </div>
    );
  }
}

export default Login;