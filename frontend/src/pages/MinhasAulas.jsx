// src/pages/MinhasAulas.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Empty,
  Button,
  Spin,
  message
} from 'antd';
import { AuthContext } from '../context/AuthContext';
import '../assets/MinhasAulas.css';

const { Title, Text } = Typography;

export default function MinhasAulas() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // Agora usamos documentId em vez de id
  const userDocId = user?.documentId;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!userDocId) return;

    (async () => {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
        // Filtra por documentId no user-lessons
        const url =
          `${base}/api/user-lessons` +
          `?filters[userid][documentId][$eq]=${userDocId}` +
          `&populate[userid][fields][0]=documentId` +
          `&populate[lessonid][populate][aula][populate][0]=image` +
          `&populate[lessonid][populate][aula][populate][1]=lessons`;

        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const { data } = await res.json();
        const map = {};

        for (const entry of data) {
          const status = entry.statusLesson;
          const lesson = entry.lessonid;
          if (!lesson) continue;

          const aula = lesson.aula;
          if (!aula) continue;

          const aulaId = aula.id;
          const lessonsArr = Array.isArray(aula.lessons) ? aula.lessons : [];

          if (!map[aulaId]) {
            map[aulaId] = {
              info: {
                id: aulaId,
                title: aula.title || 'Sem título',
                teacher: aula.teacher || 'Professor não especificado',
                image:
                  aula.image?.url ||
                  aula.image?.data?.attributes?.url ||
                  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=250',
                description: aula.description || ''
              },
              total: lessonsArr.length,
              completed: 0
            };
          }
          if (status === 'completed') {
            map[aulaId].completed += 1;
          }
        }

        const result = Object.values(map).map(({ info, total, completed }) => ({
          ...info,
          progress: total > 0 ? Math.round((completed / total) * 100) : 0
        }));

        setCourses(result);
      } catch (err) {
        console.error('Erro ao carregar MinhasAulas:', err);
        msgApi.error('Não foi possível carregar suas aulas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    })();
  }, [userDocId, msgApi]);

  if (!userDocId) {
    return (
      <div className="minhas-aulas-empty">
        {contextHolder}
        <Empty description="Você precisa fazer login para ver suas aulas." />
        <Button type="primary" onClick={() => navigate('/')}>
          Entrar
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
        <Spin tip="Carregando..." size="large" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="minhas-aulas-empty">
        {contextHolder}
        <Empty description="Você ainda não está matriculado em nenhuma aula." />
        <Button type="primary" onClick={() => navigate('/home')}>
          Ver Aulas Disponíveis
        </Button>
      </div>
    );
  }

  return (
    <div className="minhas-aulas-page">
      {contextHolder}
      <Title level={3}>Minhas Aulas</Title>
      <Row gutter={[24, 24]}>
        {courses.map(course => (
          <Col key={course.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                course.image ? (
                  <img
                    alt={course.title}
                    src={course.image}
                    className="minhas-aulas-card-img"
                  />
                ) : (
                  <div className="minhas-aulas-card-placeholder">Sem imagem</div>
                )
              }
              onClick={() => navigate(`/course/${course.id}`)}
              className="minhas-aulas-card"
            >
              <Card.Meta
                title={course.title}
                description={
                  <>
                    <Text type="secondary">{course.teacher}</Text>
                    <br />
                    <Text type="secondary" ellipsis>
                      {course.description}
                    </Text>
                  </>
                }
              />
              <div className="minhas-aulas-progress" style={{ marginTop: 12 }}>
                <Text>Progresso:</Text>
                <Progress percent={course.progress} size="small" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
