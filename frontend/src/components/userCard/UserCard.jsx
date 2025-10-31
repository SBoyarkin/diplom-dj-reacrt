import React, { useState } from 'react';
import S from './UserCard.module.css';
import {apiClient} from "../../customRequest.js";
import {useSelector} from "react-redux";
import {getRandomColor, getUserInitials} from "../../scripts.js";

export const UserCard = ({ user, isSelected, onSelect, onDelete }) => {
    const me = useSelector(store => store.user)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isChangingRole, setIsChangingRole] = useState(false)

    const handleDelete = async (e) => {
        e.stopPropagation();

        if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await apiClient.delete(`users-destroy/${user.id}/`)
            if (response.status === 204) {
                onDelete();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Не удалось удалить пользователя');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleChangeRole = async (e) => {
        e.stopPropagation();
        const newRole = !user.is_staff;
        setIsChangingRole(true);
        try {
            const response = await apiClient.patch(`change-status/${user.id}/`, {is_staff: newRole})
            if (response.status === 200) {
                onDelete();
            }
        } catch (error) {
            console.error('Error changing user role:', error);
        } finally {
            setIsChangingRole(false);
        }
    };




    return (
        <div
            className={`${S.userCard} ${isSelected ? S.selected : ''} ${isDeleting ? S.deleting : ''}`}
            onClick={() => onSelect(user)}
        >
            <div className={S.userAvatar} style={{ backgroundColor: getRandomColor(user.username) }}>
                {getUserInitials(user.username)}
            </div>

            <div className={S.userInfo}>
                <div className={S.userMain}>
                    <h3 className={S.userName}>{user.username}</h3>
                    <span className={`${S.userRole} ${user.is_staff ? S.admin : ''}`}>
                        {user.is_staff ? 'Администратор' : 'Пользователь'}
                    </span>
                </div>
                <p className={S.userEmail}>{user.email}</p>
            </div>

            {me.id !== user.id && (
                <div className={S.userActions}>
                    <button
                        className={`${S.roleButton} ${user.is_staff ? S.demote : S.promote} ${isChangingRole ? S.loading : ''}`}
                        onClick={handleChangeRole}
                        disabled={isChangingRole}
                        title={user.is_staff ? 'Снять права администратора' : 'Назначить администратором'}
                    >
                        {isChangingRole ? (
                            <div className={S.spinner}></div>
                        ) : (
                            <>
                                <span className={S.roleIcon}>
                                    {user.is_staff ? '⬇️' : '⬆️'}
                                </span>
                                <span className={S.roleText}>
                                    {user.is_staff ? 'Понизить' : 'Повысить'}
                                </span>
                            </>
                        )}
                    </button>

                    <button
                        className={`${S.deleteButton} ${isDeleting ? S.loading : ''}`}
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Удалить пользователя"
                    >
                        {isDeleting ? (
                            <div className={S.spinner}></div>
                        ) : (
                            <span className={S.deleteIcon}>×</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};