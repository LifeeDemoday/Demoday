import React, { Component } from 'react';
import Botao from './Botao';
import './Controle.css';

class Controle extends Component {
  render() {
    return (
        <div className="controle">
            <Botao texto="Cadastro" clicar={this.props.cadastro}/>
            <Botao texto="Login" clicar={this.props.login}/>
        </div>
    );
  }
}

export default Controle;