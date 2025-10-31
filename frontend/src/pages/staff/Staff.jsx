import React, { useState, useEffect } from 'react';
import S from './staff.module.css';
import { apiClient } from "../../customRequest.js";
import { useSelector, useDispatch } from "react-redux";
import { setUserList } from "../../features/userListSlice.js";
import { setListFile } from "../../features/filesListSlice.js";
import { STAFF_FILES_URL } from "../../endpoint.js";
import {UserList} from "../../components/userList/UserList.jsx";
import {FileList} from "../../components/fileList/FileList.jsx";
import {NavLink} from "react-router";

export const Staff = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const users = useSelector(state => state.userList.value);
    const userFiles = useSelector(state => state.fileList.value);

    useEffect(() => {
        setLoading(true);
        apiClient.get('/auth/users/')
            .then(request => {
                dispatch(setUserList(request.data));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    }, [dispatch]);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        apiClient.get(`${STAFF_FILES_URL}${user.id}`)
            .then(request => {
                if (request.status === 200) {
                    dispatch(setListFile(request.data));
                }
                if (request.status === 204) {
                    dispatch(setListFile([]));
                }
            })
            .catch(error => console.error('Error fetching user files:', error));
    };

    const handleUserDelete = () => {
        apiClient.get('/auth/users/')
            .then(request => dispatch(setUserList(request.data)));

        setSelectedUser(null);
        dispatch(setListFile([]));
    };

    return (
        <div className={S.adminContainer}>
            <div className={S.header}>
                <NavLink to='/' className={S.backLink}>
                    ← Вернуться в пользовательский режим
                </NavLink>
                <h1 className={S.title}>Панель администратора</h1>
                <p className={S.subtitle}>Управление пользователями и файлами</p>
            </div>

            {loading ? (
                <div className={S.loading}>
                    <div className={S.spinner}></div>
                    <p>Загрузка данных...</p>
                </div>
            ) : (
                <div className={S.content}>
                    <div className={S.sidePanel}>
                        <div className={S.panelHeader}>
                            <h2 className={S.panelTitle}>Пользователи</h2>
                            <span className={S.usersCount}>{users.length}</span>
                        </div>
                        <UserList
                            users={users}
                            selectedUser={selectedUser}
                            onUserSelect={handleSelectUser}
                            onUserDelete={handleUserDelete}
                        />
                    </div>

                    <div className={S.mainPanel}>
                        <div className={S.panelHeader}>
                            <h2 className={S.panelTitle}>
                                {selectedUser ? `Файлы пользователя: ${selectedUser.username}` : 'Выберите пользователя'}
                            </h2>
                            {selectedUser && (
                                <span className={S.filesCount}>{userFiles.length} файлов</span>
                            )}
                        </div>
                        <FileList
                            selectedUser={selectedUser}
                            userFiles={userFiles}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};