// src/components/FormCadChefe.jsx
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, message } from 'antd';
import '../assets/FormCadChefe.css';

export default function FormCadChefe({ onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // Converte a birthdate (Moment) para string ISO (YYYY-MM-DD)
      const birthDateISO = values.birthdate.format('YYYY-MM-DD');

      // Monta payload apenas com campos válidos em cooking-user
      const payload = {
        data: {
          role: 'chefe',
          name: values.name,
          birthDate: birthDateISO,
          email: values.email,
          phone: values.phone || null,
          password: values.password
        }
      };

      // POST para criar o usuário-chefe
      const res = await fetch('http://localhost:1337/api/cooking-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }

      const { data } = await res.json();
      messageApi.success('Cadastro de Chefe realizado com sucesso!');
      form.resetFields();

      if (onFinish) onFinish(data);
    } catch (err) {
      console.error(err);
      messageApi.error('Falha ao cadastrar Chefe. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="form_cad_chefe"
        layout="vertical"
        onFinish={handleFinish}
        className="form-cad-chefe"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Nome Completo"
              name="name"
              rules={[{ required: true, message: 'Por favor insira seu nome!' }]}
            >
              <Input placeholder="Érick Jacquin" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Data de Nascimento"
              name="birthdate"
              rules={[
                { required: true, message: 'Selecione sua data de nascimento!' }
              ]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Selecionar" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { required: true, message: 'Por favor insira seu e-mail!' },
                { type: 'email', message: 'Formato de e-mail inválido.' }
              ]}
            >
              <Input placeholder="erick.jacquin@exemplo.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Número de Telefone (opcional)"
              name="phone"
              rules={[
                {
                  pattern: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                  message: 'Formato de telefone inválido.'
                }
              ]}
            >
              <Input placeholder="(41) 99786-5356" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor insira uma senha!' }]}
              hasFeedback
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Confirmar Senha"
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
          </Col>
        </Row>

        <Form.Item className="submit-item">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ background: '#f8b54a', borderColor: '#f8b54a' }}
          >
            Confirmar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
