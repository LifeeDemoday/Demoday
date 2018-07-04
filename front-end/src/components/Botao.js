import React, { Component } from 'react';
import './Botao.css';

class Botao extends Component {
  render() {
    return (
        <button onClick={this.props.clicar}>{this.props.texto}</button>
    );
  }
}

export default Botao;