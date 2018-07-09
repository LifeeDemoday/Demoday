import React, { Component } from 'react';
import './Botao.css';

class Botao extends Component {
    
    ativar(ativado) {
        if(ativado){
            return 'ativado'
        }
        return 'desativado'
    }

    render() {
        return (
            <button className={this.ativar(this.props.ativado)} onClick={this.props.clicar}>{this.props.texto}</button>
        );
    }
}

export default Botao;