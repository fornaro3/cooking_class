// src/pages/Payment.jsx
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import NotificationPopup from '../components/NotificationPopup';
import {
  Row,
  Col,
  Card,
  Typography,
  Tabs,
  Button,
  Divider,
  Spin
} from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import '../assets/Payment.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, coupon, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  // Usar documentId em vez de id
  const userDocId = user?.documentId;
  const [notif, setNotif] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  const [loadingApprove, setLoadingApprove] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems]
  );
  const discount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const total = subtotal - discount;
  const paymentCode = `COOKINGCLASS|TOTAL:R$${total.toFixed(2)}`;

  const handleApprove = async () => {
    if (!userDocId) {
      setNotif({
        visible: true,
        type: 'error',
        message: 'Você precisa estar logado.'
      });
      return;
    }

    setLoadingApprove(true);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';

      for (const course of cartItems) {
        // 1) buscar lessons do curso
        const lessonsRes = await fetch(
          `${base}/api/lessons?filters[aula][id][$eq]=${course.id}`,
          { headers: { Accept: 'application/json' } }
        );
        if (!lessonsRes.ok) {
          const text = await lessonsRes.text();
          console.error('GET lessons erro:', lessonsRes.status, text);
          throw new Error('Não foi possível carregar as aulas.');
        }
        const lessonsJson = await lessonsRes.json();
        const lessons = Array.isArray(lessonsJson.data)
          ? lessonsJson.data
          : [];

        // 2) criar user-lessons usando documentId no lugar de id
        for (const lesson of lessons) {
          const postRes = await fetch(`${base}/api/user-lessons`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                userid: userDocId,
                lessonid: lesson.id,
                statusLesson: 'pending'
              }
            })
          });
          if (!postRes.ok) {
            const text = await postRes.text();
            console.error('POST user-lessons erro:', postRes.status, text);
            throw new Error('Falha ao salvar progresso.');
          }
        }
      }

      clearCart();
      setNotif({
        visible: true,
        type: 'success',
        message: 'Pagamento aprovado! Suas aulas foram registradas.'
      });
    } catch (err) {
      console.error(err);
      setNotif({
        visible: true,
        type: 'error',
        message: err.message || 'Erro no servidor. Tente novamente.'
      });
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleError = () => {
    setNotif({
      visible: true,
      type: 'error',
      message: 'Falha no pagamento. Tente novamente.'
    });
  };

  return (
    <div className="payment-page">
      <NotificationPopup
        type={notif.type}
        message={notif.message}
        visible={notif.visible}
        onClose={() => setNotif((v) => ({ ...v, visible: false }))}
      />

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card className="payment-card" bordered={false}>
            <Title level={4}>Pagamento</Title>
            <Tabs defaultActiveKey="pix" className="payment-tabs">
              <TabPane tab="PIX" key="pix">
                <div className="qr-section">
                  <QRCodeCanvas value={paymentCode} size={150} />
                  <Text copyable className="qr-code">
                    {paymentCode}
                  </Text>
                  <Button
                    type="primary"
                    block
                    className="primary-btn"
                    onClick={handleApprove}
                    disabled={loadingApprove}
                    style={{ marginBottom: 8 }}
                  >
                    {loadingApprove ? <Spin /> : 'Simular Aprovação'}
                  </Button>
                  <Button type="primary" danger block onClick={handleError}>
                    Simular Erro
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="Cartão de Crédito" key="card">
                {/* Seu formulário de cartão */}
              </TabPane>
            </Tabs>
            <Divider />
            <Button
              type="link"
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Voltar ao Carrinho
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="summary-card" bordered={false}>
            <Title level={4}>Resumo do Pedido</Title>
            <div className="summary-line">
              <Text>Itens</Text>
              <Text>{cartItems.length}</Text>
            </div>
            <div className="summary-line">
              <Text>Subtotal</Text>
              <Text>R$ {subtotal.toFixed(2)}</Text>
            </div>
            {coupon && (
              <div className="summary-line">
                <Text>Desconto ({coupon.discountPercent}%)</Text>
                <Text type="danger">- R$ {discount.toFixed(2)}</Text>
              </div>
            )}
            <Divider />
            <div className="summary-line total">
              <Text strong>Total</Text>
              <Text strong>R$ {total.toFixed(2)}</Text>
            </div>
            <Divider />
            <Button
              block
              onClick={() => navigate('/home')}
              className="back-button"
            >
              Continuar Comprando
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
