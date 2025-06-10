import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import '../assets/NotificationPopup.css';

const TYPE_STYLES = {
    success: 'notification-popup--success',
    warning: 'notification-popup--warning',
    error: 'notification-popup--error'
};

export default function NotificationPopup({
    type = 'success',
    message,
    visible,
    onClose,
    duration = 4000
}) {
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [visible, duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`notification-popup ${TYPE_STYLES[type]}`}>
            <span className="notification-popup__message">{message}</span>
            <CloseOutlined
                className="notification-popup__close"
                onClick={onClose}
            />
        </div>
    );
}

NotificationPopup.propTypes = {
    type: PropTypes.oneOf(['success', 'warning', 'error']),
    message: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    duration: PropTypes.number
};
