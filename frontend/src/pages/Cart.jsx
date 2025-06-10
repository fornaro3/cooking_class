// src/pages/Cart.jsx
import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  List,
  Typography,
  Input,
  Button,
  Collapse,
  Divider,
  message,
  Card,
  Spin
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartContext } from '../context/CartContext';
import '../assets/Cart.css';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    coupon,
    applyCoupon,
    removeCoupon
  } = useContext(CartContext);

  const [couponCode, setCouponCode] = useState(coupon?.code || '');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price, 0),
    [cartItems]
  );
  const discount = useMemo(() => {
    if (!coupon) return 0;
    return (subtotal * coupon.discountPercent) / 100;
  }, [coupon, subtotal]);
  const total = subtotal - discount;

  const applyCouponHandler = async () => {
    const code = couponCode.trim();
    if (!code) {
      messageApi.warning('Por favor, insira um código de cupom');
      return;
    }

    setLoadingCoupon(true);
    try {
      const base = process.env.REACT_APP_API_URL || 'http://localhost:1337';
      const url = `${base}/api/coupons?filters[code][$containsi]=${encodeURIComponent(code)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      const json = await res.json();

      const hits = Array.isArray(json.data) ? json.data : [];
      if (hits.length === 0) {
        messageApi.error('Cupom inválido ou expirado');
      } else {
        const match = hits.find(entry => {
          const entryCode = entry.attributes?.code ?? entry.code;
          return entryCode.toLowerCase() === code.toLowerCase();
        }) || hits[0];

        const c = match.attributes?.code ?? match.code;
        const discountPercent =
          match.attributes?.discountPercent ?? match.discountPercent;

        applyCoupon({ code: c, discountPercent, id: match.id });
        messageApi.success(`Cupom "${c}" aplicado! ${discountPercent}% off`);
      }
    } catch (err) {
      console.error('Erro ao aplicar cupom:', err);
      messageApi.error('Erro ao validar cupom. Tente novamente.');
    } finally {
      setLoadingCoupon(false);
      setCouponCode('');
    }
  };

  const removeCouponHandler = () => {
    removeCoupon();
    messageApi.info('Cupom removido');
  };

  return (
    <>
      {contextHolder}
      <Row className="cart-page" gutter={24}>
        <Col xs={24} md={16}>
          <Title level={4}>Minha Sacola</Title>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={item => (
              <List.Item
                actions={[
                  <Text strong>R$ {item.price.toFixed(2)}</Text>,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remover
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<img src={item.image} alt={item.title} className="cart-thumb" />}
                  title={item.title}
                  description={item.teacher}
                />
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} md={8}>
          <Card className="summary-card" bordered={false}>
            <Title level={4}>Resumo</Title>

            <Collapse ghost>
              <Panel
                header={coupon ? `Cupom aplicado: ${coupon.code}` : 'Tem cupom de desconto?'}
                key="1"
                extra={
                  coupon && (
                    <Button type="link" size="small" onClick={removeCouponHandler}>
                      Remover
                    </Button>
                  )
                }
              >
                <Input
                  placeholder="Insira o cupom"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  disabled={!!coupon}
                  style={{ marginBottom: 8 }}
                />
                <Button
                  block
                  onClick={applyCouponHandler}
                  loading={loadingCoupon}
                  disabled={!!coupon}
                >
                  {loadingCoupon ? <Spin /> : 'Aplicar cupom'}
                </Button>
              </Panel>
            </Collapse>

            <Divider />

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

            <Button
              type="primary"
              block
              className="checkout-btn"
              onClick={() => navigate('/payment')}
              disabled={cartItems.length === 0}
              style={{ background: '#f8b54a', borderColor: '#f8b54a' }}
            >
              Realizar Pagamento
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
}
