import React from 'react';
import S from './UserCard.module.css';
import {apiClient} from "../../customRequest.js";



export const UserCard = ({ user, isSelected, onSelect, onDelete }) => {
    const handleDelete = (e) => {
        e.stopPropagation();

        if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
            apiClient.delete(`users-destroy/${user.id}/`)
                .then(response => {
                    if (response.status === 204) {
                        onDelete();
                    }
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    alert('Не удалось удалить пользователя');
                });
        }
    };

    return (
        <div
            className={`${S.userCard} ${isSelected ? S.selected : ''}`}
            onClick={() => onSelect(user)}
        >
            <div className={S.userInfo}>
                <h3 className={S.userName}>{user.username}</h3>
                <p className={S.userEmail}>{user.email}</p>
                <span className={`${S.userRole} ${user.is_staff ? S.admin : ''}`}>
                    {user.is_staff ? 'Администратор' : 'Пользователь'}
                </span>
            </div>
            <button
                className={S.deleteButton}
                onClick={handleDelete}
                title="Удалить пользователя"
            >
                ×
            </button>
        </div>
    );
};