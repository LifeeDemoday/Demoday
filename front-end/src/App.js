import React, { Component } from 'react';
import Controle from './components/Controle';
import Formulario from './components/Formulario';
import './App.css';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            atual: 'cadastro'
        };
    }

    irParaLogin = () => {
        this.setState({atual: 'login'});
    }

    irParaCadastro = () => {
        this.setState({atual: 'cadastro'});
    }

    render() {
        return (
            <div className="app">
                <Controle login={this.irParaLogin} cadastro={this.irParaCadastro} pressionado={this.state.atual}/>
                <Formulario tela={this.state.atual}/>
            </div>
        );
    }
}

export default App;
