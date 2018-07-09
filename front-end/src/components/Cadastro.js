import React, { Component } from 'react';
import './Cadastro.css';
import Botao from './Botao';

class Cadastro extends Component {
  render() {
    return (
        <div className="cadastro">
            <input type="text" placeholder="Nome"/>
            <input type="email" placeholder="E-mail"/>
            <input type="password" placeholder="Senha"/>
            <Botao texto="Cadastro" />
        </div>
    );
  }
}

export default Cadastro;