// src/pages/Home.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Input, Tag, Spin, Button, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import '../assets/Home.css';

const { Search } = Input;

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isChefe = user?.role === 'chefe';
  const userDocId = user?.documentId;

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('Todas');

  useEffect(() => {
    async function fetchAulas() {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
        let url = `${base}/api/aulas?populate=image`;

        // Se for chefe, buscar somente as próprias aulas
        if (isChefe && userDocId) {
          const filterChefe = new URLSearchParams({
            'filters[chefid][documentId][$eq]': userDocId
          }).toString();
          url += `&${filterChefe}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const json = await res.json();

        const items = (json.data || []).map(entry => {
          const a = entry.attributes || entry;
          const src = a.image?.data?.attributes?.url || a.image?.url;
          return {
            id: entry.id,
            title: a.title,
            teacher: a.teacher,
            cuisine: a.cuisine,
            price: `R$ ${Number(a.price).toFixed(2)}`,
            image:
              src ||
              'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=250'
          };
        });
        setAulas(items);
      } catch (err) {
        console.error('Falha ao carregar aulas:', err);
        message.error('Não foi possível carregar as aulas.');
      } finally {
        setLoading(false);
      }
    }
    fetchAulas();
  }, [isChefe, userDocId]);

  const cuisines = useMemo(() => {
    const setC = new Set(aulas.map(a => a.cuisine));
    return ['Todas', ...Array.from(setC)];
  }, [aulas]);

  const filteredAulas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return aulas.filter(a => {
      const matchesCuisine =
        activeCuisine === 'Todas' || a.cuisine === activeCuisine;
      const matchesSearch =
        a.title.toLowerCase().includes(term) ||
        a.teacher.toLowerCase().includes(term);
      return matchesCuisine && matchesSearch;
    });
  }, [aulas, searchTerm, activeCuisine]);

  if (loading) {
    return (
      <div className="home-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-controls">
        {/* Área de busca + botão Adicionar Aula (se for chefe) */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Search
            placeholder="Buscar aulas ou professor..."
            onSearch={value => setSearchTerm(value)}
            onChange={e => setSearchTerm(e.target.value)}
            enterButton
            allowClear
            style={{ flex: 1, minWidth: 240 }}
          />
          {isChefe && (
            <Button
              type="primary"
              style={{ marginLeft: 16 }}
              onClick={() => navigate('/add-aula')}
            >
              Adicionar Aula
            </Button>
          )}
        </div>
        <div className="cuisine-tags">
          {cuisines.map(c => (
            <Tag
              key={c}
              className={c === activeCuisine ? 'tag-active' : 'tag'}
              onClick={() => setActiveCuisine(c)}
            >
              {c}
            </Tag>
          ))}
        </div>
      </div>

      <div className="cards-container">
        <Row gutter={[24, 24]} className="cards-row">
          {filteredAulas.map(a => (
            <Col key={a.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={a.title} src={a.image} />}
                className="aula-card"
                onClick={() => navigate(`/course/${a.id}`)}
              >
                <div className="card-header">
                  <Card.Meta
                    title={a.title}
                    description={<span className="teacher">{a.teacher}</span>}
                  />
                </div>
                <span className="price">{a.price}</span>
                <Tag className="cuisine-tag">{a.cuisine}</Tag>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
