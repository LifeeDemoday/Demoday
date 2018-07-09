import React, { Component } from 'react';
import Botao from './Botao';
import './Controle.css';

class Controle extends Component {

    render() {
        if (this.props.pressionado === 'login') {
            return (
                <div className="controle">
                    <Botao texto="Cadastro" clicar={this.props.cadastro} ativado={false}/>
                    <Botao texto="Login" clicar={this.props.login} ativado={true}/>
                </div>
            );
        } else {
            return (
                <div className="controle">
                    <Botao texto="Cadastro" clicar={this.props.cadastro} ativado={true}/>
                    <Botao texto="Login" clicar={this.props.login} ativado={false}/>
                </div>
            );
        }
    }
}

export default Controle;