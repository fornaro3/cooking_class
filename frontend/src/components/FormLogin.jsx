import React, { useState, useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/FormLogin.css';

export default function FormLogin() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [msgApi, contextHolder] = message.useMessage();

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;
            const ok = await login(email, password);

            if (ok) {
                msgApi.success('Login bem-sucedido!');
                navigate('/home');
            } else {
                msgApi.error('E-mail ou senha incorretos.');
            }
        } catch (err) {
            console.error('login error:', err);
            msgApi.error('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinishFailed = (errorInfo) => {
        msgApi.error('Por favor, corrija os erros no formulário.');
    };

    return (
        <>
            {contextHolder}
            <Form
                name="form_login"
                layout="vertical"
                autoComplete="off"
                onFinish={handleFinish}
                onFinishFailed={handleFinishFailed}
                className="form-login"
            >
                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                        { required: true, message: 'Por favor insira seu e-mail!' },
                        { type: 'email', message: 'Formato de e-mail inválido.' }
                    ]}
                >
                    <Input placeholder="seu@exemplo.com" />
                </Form.Item>

                <Form.Item
                    label="Senha"
                    name="password"
                    rules={[{ required: true, message: 'Por favor insira sua senha!' }]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{ background: '#f8b54a', borderColor: '#f8b54a' }}
                    >
                        Entrar
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}