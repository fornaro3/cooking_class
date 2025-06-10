// src/components/UserMenu.jsx
import React, { useContext } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserMenu = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const items = [
    {
      key: 'edit',
      label: 'Editar meus dados',
    },
    {
      key: 'logout',
      label: 'Sair',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/');
    }
    if (key === 'edit') {
      navigate('/profile');
    }
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Avatar
        icon={<UserOutlined />}
        style={{
          cursor: 'pointer',
          color: '#141414',
          backgroundColor: '#EDEDED',
        }}
      />
    </Dropdown>
  );
};

export default UserMenu;
