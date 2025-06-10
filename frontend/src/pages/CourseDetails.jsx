import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Collapse, Avatar, message, Spin } from 'antd';
import '../assets/CourseDetails.css';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const { Panel } = Collapse;

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const userDocId = user?.documentId;
  const isChefe = user?.role === 'chefe';

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const getPriceValue = (price) => {
    if (typeof price === 'number') return price;
    const numericString = String(price).replace(/[^\d.,]/g, '');
    return parseFloat(numericString.replace(',', '.')) || 0;
  };

  useEffect(() => {
    async function loadCourseData() {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
        const resCourse = await fetch(`${base}/api/aulas?filters[id][$eq]=${id}`);
        if (!resCourse.ok) throw new Error(`Status ${resCourse.status}`);
        const jsonCourse = await resCourse.json();
        const entry = jsonCourse.data?.[0];
        if (!entry) {
          setCourse(null);
          setLoading(false);
          return;
        }

        const docId = entry.documentId;
        const raw = entry.attributes || entry;
        const priceValue = getPriceValue(raw.price);

        setCourse({
          id: entry.id,
          documentId: docId,
          title: raw.title,
          teacher: raw.teacher,
          cuisine: raw.cuisine,
          description: raw.description,
          price: priceValue,
          formattedPrice: `R$ ${priceValue.toFixed(2)}`,
          image:
            raw.image?.data?.attributes?.url ||
            raw.image?.url ||
            'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=250',
        });

        const resLessons = await fetch(`${base}/api/lessons?filters[aula][id][$eq]=${id}`);
        if (!resLessons.ok) throw new Error(`Status ${resLessons.status}`);
        const jsonLessons = await resLessons.json();
        setLessons(
          (jsonLessons.data || []).map((l) => ({
            id: l.id,
            title: l.attributes?.title || l.title,
            type: (l.attributes?.type || l.type)?.trim(),
          }))
        );

        if (!isChefe && userDocId) {
          const resUserLessons = await fetch(
            `${base}/api/user-lessons?filters[userid][documentId][$eq]=${userDocId}&populate=lessonid.aula`
          );
          if (resUserLessons.ok) {
            const jsonUL = await resUserLessons.json();
            const userLessons = jsonUL.data || [];
            const enrolled = userLessons.some((ul) => {
              const lesson = ul.lessonid?.data || ul.lessonid;
              const aula = lesson?.attributes?.aula?.data || lesson?.aula;
              return aula?.id.toString() === id.toString();
            });
            setIsEnrolled(enrolled);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
        message.error('Falha ao carregar detalhes do curso.');
      } finally {
        setLoading(false);
      }
    }
    loadCourseData();
  }, [id, userDocId, isChefe]);

  const isInCart = cartItems.some((item) => item.id === course?.id);

  const handleEnroll = () => {
    if (!userDocId) {
      message.warning('Faça login para se matricular.');
      return;
    }
    if (isEnrolled) {
      message.warning('Você já está matriculado neste curso.');
      return;
    }
    if (isInCart) {
      message.warning('Este curso já está no seu carrinho.');
      return;
    }
    addToCart({ id: course.id, title: course.title, teacher: course.teacher, image: course.image, price: course.price });
    setAnimating(true);
    message.success('Curso adicionado ao carrinho!');
    setTimeout(() => setAnimating(false), 600);
  };

  const handleDelete = () => {
    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    setConfirmVisible(false);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
      const res = await fetch(`${base}/api/aulas/${course.documentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      message.success('Curso excluído com sucesso.');
      navigate('/home');
    } catch (err) {
      console.error('Erro ao excluir curso:', err);
      message.error(`Falha ao excluir curso: ${err.message}`);
    }
  };

  const cancelDelete = () => {
    setConfirmVisible(false);
  };

  const handleEdit = () => {
    navigate(`/add-aula?id=${course.documentId}`);
  };

  if (loading) return <div className="detail-loading"><Spin size="large"/></div>;
  if (!course) return <p>Curso não encontrado.</p>;

  return (
    <div className="detail-container">
      <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Voltar
      </Button>
      <div className="detail-header">
        <img src={course.image} alt={course.title} className="detail-image" />
        <div className="detail-info">
          <h2>{course.title}</h2>
          <p className="description">{course.description}</p>
        </div>
        <div className="detail-teacher">
          <Avatar size={80} src={course.image} />
          <p className="teacher-name">{course.teacher}</p>
          <p className="teacher-label">Chefe</p>
        </div>
      </div>
      <Collapse accordion>
        {lessons.map((lesson) => (
          <Panel header={lesson.title} key={lesson.id}>
            {lesson.type === 'vídeo' ? (
              <div className="lesson-video">Conteúdo em vídeo</div>
            ) : (
              <div className="lesson-text">Conteúdo teórico</div>
            )}
          </Panel>
        ))}
      </Collapse>
      <div className="detail-footer">
        {isChefe ? (
          <>
            <Button type="primary" onClick={handleEdit} style={{ marginRight: 8 }}>
              Editar Curso
            </Button>
            <Button type="primary" danger onClick={handleDelete}>
              Excluir Curso
            </Button>
          </>
        ) : (
          <>
            {!isEnrolled && <span className="detail-price">{course.formattedPrice}</span>}
            <Button className={`enroll-btn ${animating ? 'bump' : ''}`} type="primary" onClick={handleEnroll} disabled={isInCart || isEnrolled}>
              {isEnrolled ? 'Já matriculado' : isInCart ? 'Já no Carrinho' : 'Matricular-se'}
            </Button>
          </>
        )}
      </div>
      {confirmVisible && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>Esta ação é irreversível. Tem certeza que deseja excluir este curso?</p>
            <Button onClick={confirmDelete} type="primary">Sim</Button>
            <Button onClick={cancelDelete} style={{ marginLeft: 8 }}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
