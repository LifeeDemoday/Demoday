import React, { Component } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';
import './Formulario.css';

class Formulario extends Component {
    render() {
        if (this.props.tela == 'cadastro') {
            return (
                <Cadastro />
            );
        }
        return (
            <Login />
        );
    }
}

export default Formulario;