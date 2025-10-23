import React, { useState, useEffect } from 'react';
import S from './staff.module.css';
import {apiClient, getFiles} from "../../customRequest.js";
import {useSelector, useDispatch} from "react-redux";
import {setUserList} from "../../features/userListSlice.js";
import {setListFile} from "../../features/filesListSlice.js";
import {STAFF_FILES_URL} from "../../endpoint.js";

export const Staff = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch()
    const users = useSelector(state => state.userList.value)
    const userFiles = useSelector(state => state.fileList.value)

    const deleteUser = (e) => {
        console.log(e)
    }
    useEffect(() => {
        apiClient.get('/auth/users/')
            .then(request => dispatch(setUserList(request.data)))
    }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    console.log(user)
      apiClient.get(`${STAFF_FILES_URL}${user.id}`)
          .then(request => {
              if (request.status === 200) {
                  dispatch(setListFile(request.data))
              }
              if (request.status === 204) {
                  dispatch(setListFile([]))
              }
          }).catch(error => console.log(error))
  };
  return (
    <div className={S.adminContainer}>
      <h1 className={S.title}>Панель администратора</h1>

      <div className={S.content}>
        <div className={S.usersSection}>
          <h2 className={S.sectionTitle}>Список пользователей</h2>
          <div className={S.usersList}>
            {users.map(user => (
              <div
                key={user.id}
                className={`${S.userCard} ${selectedUser?.id === user.id ? S.selected : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <div className={S.userInfo}>
                  <h3 className={S.userName}>{user.username}</h3>
                  <p className={S.userEmail}>{user.email}</p>
                  <span className={`${S.userRole} ${user.is_staff === true ? S.admin : ''}`}>
                    {user.is_staff}
                  </span>
                </div>
                <button
                  className={S.deleteButton}
                  onClick={deleteUser}
                  title="Удалить пользователя"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={S.filesSection}>
          <h2 className={S.sectionTitle}>
            {selectedUser ? `Файлы пользователя: ${selectedUser.username}` : 'Выберите пользователя'}
          </h2>

          {selectedUser ? (
            <div className={S.filesList}>
              {userFiles.length > 0 ? (
                userFiles.map(file => (
                  <div key={file.id} className={S.fileItem}>
                    <div className={S.fileIcon}>📄</div>
                    <div className={S.fileInfo}>
                      <h4 className={S.fileName}>{file.name}</h4>
                      <p className={S.fileDetails}>
                        Размер: {file.size} • Загружен: {file.uploadDate}
                      </p>
                    </div>
                    <div className={S.fileActions}>
                      <button className={S.downloadButton}>Скачать</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={S.noFiles}>Нет загруженных файлов</div>
              )}
            </div>
          ) : (
            <div className={S.noSelection}>
              Выберите пользователя из списка для просмотра его файлов
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
