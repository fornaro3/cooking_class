import React, { useState, useContext, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Spin
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/AddAula.css';

const { TextArea } = Input;
const { Option } = Select;

export default function AddAula() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aulaDocId = searchParams.get('id');
  const { user } = useContext(AuthContext);
  const userDocId = user?.documentId;
  const [aulaNumId, setAulaNumId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!aulaDocId);
  const [existingLessons, setExistingLessons] = useState([]);

  useEffect(() => {
    if (!aulaDocId) {
      setFetching(false);
      return;
    }
    (async () => {
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
        const url = `${base}/api/aulas/${aulaDocId}?populate=*`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GET aula failed: ${res.status}`);
        const { data: aula } = await res.json();
        setAulaNumId(aula.documentId);
        form.setFieldsValue({
          title: aula.title,
          teacher: aula.teacher,
          cuisine: aula.cuisine,
          description: aula.description,
          price: aula.price
        });
        const lessons = (aula.lessons || []).map(l => ({
          id: l.id,
          documentId: l.documentId,
          title: l.title,
          type: l.type.trim()
        }));
        setExistingLessons(lessons.map(l => l.id));
        form.setFieldsValue({ lessons });
      } catch (err) {
        message.error('Falha ao carregar dados para edição.');
      } finally {
        setFetching(false);
      }
    })();
  }, [aulaDocId, form]);

  const handleFinish = async values => {
    setLoading(true);
    try {
      if (!userDocId) {
        message.error('Usuário inválido.');
        return;
      }
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
      const aulaPayload = {
        data: {
          title: values.title,
          teacher: values.teacher,
          cuisine: values.cuisine,
          description: values.description,
          price: values.price,
          chefid: userDocId
        }
      };
      if (aulaDocId) {
        await fetch(`${base}/api/aulas/${aulaDocId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aulaPayload)
        });
      } else {
        const postRes = await fetch(`${base}/api/aulas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aulaPayload)
        });
        const postJson = await postRes.json();
        setAulaNumId(postJson.data.documentId);
      }
      const lessons = values.lessons || [];
      for (let id of existingLessons) {
        if (!lessons.some(l => l.id === id)) {
          await fetch(`${base}/api/lessons/${id}`, { method: 'DELETE' });
        }
      }
      for (let l of lessons) {
        const payload = {
          data: {
            title: l.title,
            type: l.type.trim(),
            aula: { connect: [aulaNumId] }
          }
        };
        if (l.documentId) {
          await fetch(`${base}/api/lessons/${l.documentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch(`${base}/api/lessons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }
      message.success(`Aula ${aulaDocId ? 'atualizada' : 'criada'} com sucesso!`);
      navigate('/home');
    } catch {
      message.error('Falha ao salvar aula.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin /></div>;
  }

  return (
    <div className="add-aula-page">
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <h2>{aulaDocId ? 'Editar Aula' : 'Adicionar Nova Aula'}</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="add-aula-form"
            initialValues={{ lessons: [] }}
          >
            <Form.Item label="Título" name="title" rules={[{ required: true }]}>  
              <Input placeholder="Título da aula" />
            </Form.Item>
            <Form.Item label="Chefe Responsável" name="teacher">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Culinária" name="cuisine" rules={[{ required: true }]}>  
              <Select placeholder="Selecione">
                <Option value="Japonesa">Japonesa</Option>
                <Option value="Italiana">Italiana</Option>
                <Option value="Francesa">Francesa</Option>
                <Option value="Russa">Russa</Option>
                <Option value="Alemã">Alemã</Option>
                <Option value="Mexicana">Mexicana</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Descrição" name="description" rules={[{ required: true }]}> 
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Preço (R$)" name="price" rules={[{ required: true }]}>  
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.List name="lessons">
              {(fields, { add, remove }) => (
                <div className="lessons-section">
                  <div className="lessons-header">
                    <h3>Lições</h3>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Adicionar Lição
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} className="lesson-row">
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        noStyle
                      >
                        <Input type="hidden" />
                      </Form.Item>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Título da Lição"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'type']}
                          label="Tipo"
                          rules={[{ required: true }]}
                        >
                          <Select>
                            <Option value="texto">Texto</Option>
                            <Option value="video">Vídeo</Option>
                            <Option value="imagem">Imagem</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4} className="lesson-remove-col">
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </Form.List>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {aulaDocId ? 'Salvar Alterações' : 'Criar Aula'}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
