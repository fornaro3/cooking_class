// src/pages/Login.jsx
import React from 'react';
import { Tabs } from 'antd';
import FormLogin from '../components/FormLogin';
import FormCadAluno from '../components/FormCadAluno';
import FormCadChefe from '../components/FormCadChefe';
import Logo from '../components/Logo';
import '../assets/Login.css';

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-sidebar"><Logo /></div>
      <div className="login-form-area">
        <div className="login-form-wrapper">
          <h1>CookingClass</h1>
          <p>Bem-vindo! Escolha uma opção abaixo:</p>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Entrar" key="1"><FormLogin /></Tabs.TabPane>
            <Tabs.TabPane tab="Cadastro Aluno" key="2"><FormCadAluno /></Tabs.TabPane>
            <Tabs.TabPane tab="Cadastro Chefe" key="3"><FormCadChefe /></Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
