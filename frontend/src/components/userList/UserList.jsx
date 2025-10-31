import React from 'react';
import S from './UserList.module.css';
import {UserCard} from "../userCard/UserCard.jsx";


export const UserList = ({ users, selectedUser, onUserSelect, onUserDelete }) => {
    return (
        <div className={S.usersSection}>
            <div className={S.usersList}>
                {users.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        isSelected={selectedUser?.id === user.id}
                        onSelect={onUserSelect}
                        onDelete={onUserDelete}
                    />
                ))}
            </div>
        </div>
    );
};