// src/pages/Profile.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { AuthContext } from '../context/AuthContext';
import '../assets/Profile.css';

const { Title } = Typography;

export default function Profile() {
  const { user, updateUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    name: user?.name || '',
    password: '',
    confirm: '',
  });

  useEffect(() => {
    if (user) {
      const baseName = user.name;
      setInitialValues({ name: baseName, password: '', confirm: '' });
      form.setFieldsValue({
        email: user.email,
        name: baseName,
        password: '',
        confirm: '',
      });
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    const payload = {};
    if (values.name && values.name !== initialValues.name) {
      payload.name = values.name;
    }
    if (values.password) {
      payload.password = values.password;
    }
    if (!payload.name && !payload.password) {
      return;
    }

    setLoading(true);
    const ok = await updateUserData(payload);
    setLoading(false);

    if (ok) {
      messageApi.success('Dados atualizados com sucesso!');
      const newName = payload.name || initialValues.name;
      setInitialValues({ name: newName, password: '', confirm: '' });
      form.setFieldsValue({
        name: newName,
        password: '',
        confirm: '',
      });
    } else {
      messageApi.error('Falha ao atualizar. Tente novamente.');
    }
  };

  if (!user) {
    return <p>Você precisa estar logado para editar seus dados.</p>;
  }

  return (
    <div className="profile-page">
      {contextHolder}
      <Card className="profile-card" bordered={false}>
        <Title level={3}>Meus Dados</Title>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ email: user.email, ...initialValues }}
          onFinish={handleFinish}
          className="form-profile"
        >
          <Form.Item label="E-mail" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Nome" name="name">
            <Input placeholder="Seu nome completo" />
          </Form.Item>

          <Form.Item
            label="Nova Senha"
            name="password"
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && value.length < 6) {
                    return Promise.reject(
                      new Error('Deve ter ao menos 6 caracteres')
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            label="Confirme a Nova Senha"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const pwd = getFieldValue('password');
                  if (pwd) {
                    if (!value) {
                      return Promise.reject(
                        new Error('Confirme a nova senha')
                      );
                    }
                    if (value !== pwd) {
                      return Promise.reject(
                        new Error('As senhas não coincidem!')
                      );
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => {
              const { name, password, confirm } = form.getFieldsValue([
                'name',
                'password',
                'confirm',
              ]);
              const nameChanged = name !== initialValues.name;
              const pwdFilled = Boolean(password);
              const confirmMatch = password ? confirm === password : true;
              const hasChanges = nameChanged || pwdFilled;
              const isValid = hasChanges && (!password || confirmMatch);

              return (
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  disabled={!isValid}
                >
                  Salvar Alterações
                </Button>
              );
            }}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
