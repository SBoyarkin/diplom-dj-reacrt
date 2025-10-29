// Staff.jsx
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
    const dispatch = useDispatch();
    const users = useSelector(state => state.userList.value);
    const userFiles = useSelector(state => state.fileList.value);

    useEffect(() => {
        apiClient.get('/auth/users/')
            .then(request => dispatch(setUserList(request.data)))
            .catch(error => console.error('Error fetching users:', error));
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
            <NavLink to='/'
                  > Вернуться в пользовательский режим </NavLink>
            <h1 className={S.title}>Панель администратора</h1>

            <div className={S.content}>
                <UserList
                    users={users}
                    selectedUser={selectedUser}
                    onUserSelect={handleSelectUser}
                    onUserDelete={handleUserDelete}
                />

                <FileList
                    selectedUser={selectedUser}
                    userFiles={userFiles}
                />
            </div>
        </div>
    );
};