// src/components/FormCadAluno.jsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../assets/FormCadAluno.css';

export default function FormCadAluno({ onFinish }) {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleFinish = async values => {
    setLoading(true);
    try {
      const payload = {
        data: {
          role: 'aluno',
          name: values.name,
          email: values.email,
          password: values.password,
          birthDate: values.birthDate,
          phone: values.phone
        }
      };
      const res = await fetch('http://localhost:1337/api/cooking-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { data } = await res.json();
      messageApi.success('Cadastro efetuado com sucesso! Faça login agora.');
      form.resetFields();
      if (onFinish) onFinish(data);
    } catch (err) {
      console.error(err);
      messageApi.error('Falha ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form} // 3. Passa a instância para o Form
        name="form_cad_aluno"
        layout="vertical"
        onFinish={handleFinish}
        className="form-cad-aluno"
      >
        <Form.Item
          label="Nome Completo"
          name="name"
          rules={[{ required: true, message: 'Por favor insira seu nome!' }]}
        >
          <Input placeholder="Maria Silva" />
        </Form.Item>

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
          rules={[{ required: true, message: 'Por favor insira uma senha!' }]}
          hasFeedback
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          label="Confirme a Senha"
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirme sua senha!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('As senhas não coincidem!'));
              }
            })
          ]}
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
            Cadastrar como Aluno
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
