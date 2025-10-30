import React from 'react';
import S from './UserCard.module.css';
import {apiClient} from "../../customRequest.js";
import {useSelector} from "react-redux";


export const UserCard = ({ user, isSelected, onSelect, onDelete }) => {
    const me = useSelector(store => store.user)
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

    
    const handleChangeRole = (e) => {
        e.stopPropagation()
         apiClient.patch(`change-status/${user.id}/`, {is_staff: !user.is_staff})

                .then(response => {
                    if (response.status === 200) {
                        onDelete();
                    }
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                    alert(`Не удалось сменить роль у пользователя ${user.username}`);
                });

      
    }
    
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
            {me.id !== user.id ?
                <>
                    <button
                        className={S.statusButton}
                        onClick={handleChangeRole}
                        title={user.is_staff ? 'Снять права администратора' : 'Назначить администратором'}
                    >
                        {user.is_staff ? '⬇️ Понизить до пользователя' : '⬆️ Повысить до администратора'}
                    </button>
                    <button
                        className={S.deleteButton}
                        onClick={handleDelete}
                        title="Удалить пользователя"
                    >
                        ×
                    </button>


                </>
                : null}
        </div>
    );
};