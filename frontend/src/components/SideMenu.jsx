// src/components/SideMenu.jsx
import React, { useContext } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, ReadOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function SideMenu() {
    const { user } = useContext(AuthContext);
    const isAluno = user?.role === 'aluno';
    const location = useLocation();
    const selectedKey = location.pathname;

    const items = [
        {
            key: '/home',
            icon: <HomeOutlined />,
            label: <Link to="/home">Página Inicial</Link>,
        },
        ...(isAluno
            ? [
                {
                    key: '/minhas-aulas',
                    icon: <ReadOutlined />,
                    label: <Link to="/minhas-aulas">Minhas Aulas</Link>,
                },
            ]
            : []),
    ];

    return (
        <Menu
            mode="inline"
            className="menu-bar"
            selectedKeys={[selectedKey]}
            items={items}
        />
    );
}
