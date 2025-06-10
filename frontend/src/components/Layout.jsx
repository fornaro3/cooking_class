// src/components/Layout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { Button, Layout, Badge } from 'antd';
import {
  ShoppingCartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import SideMenu from './SideMenu';
import Logo from './Logo';
import UserMenu from './UserMenu';
import NotificationPopup from './NotificationPopup';
import { CartContext } from '../context/CartContext';

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems } = React.useContext(CartContext);
  const navigate = useNavigate();

  // estado de notificação
  const [notif, setNotif] = useState({
    visible: false,
    type: 'success',    // 'success' | 'warning' | 'error'
    message: ''
  });

  // exemplo de disparo:
  // setNotif({ visible: true, type: 'warning', message: 'Isso é um alerta!' });

  return (
    <Layout
      style={{ minHeight: '100vh', position: 'relative' }}  // relative para o popup
    >
      <Header className="custom-header">
        <Logo />
        <div className="header-right">
          <Badge count={cartItems.length} offset={[-5, 5]} className="cart-area">
            <ShoppingCartOutlined
              className="cart-icon"
              onClick={() => navigate('/cart')}
              style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: 16 }}
            />
          </Badge>
          <UserMenu />
        </div>
      </Header>

      {/* aqui entraria o seu popup */}
      <NotificationPopup
        type={notif.type}
        message={notif.message}
        visible={notif.visible}
        onClose={() => setNotif(v => ({ ...v, visible: false }))}
      />

      <Layout className="content-area">
        <Sider
          width={230}
          collapsed={collapsed}
          collapsible
          trigger={null}
          className="sidebar"
        >
          <SideMenu />
        </Sider>
        <div className="toggle-wrapper">
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </div>
        <Content
          className="content-wrapper"
          style={{ padding: '20px', overflow: 'auto', height: 'calc(100vh - 80px)' }}
        >
          <main className="content" style={{ flex: 1, overflowY: 'auto' }}>
            {children}
          </main>
        </Content>
      </Layout>
    </Layout>
  );
}
