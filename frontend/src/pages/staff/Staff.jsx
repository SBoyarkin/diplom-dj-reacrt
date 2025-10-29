import React, { useState, useEffect } from 'react';
import S from './staff.module.css';
import {apiClient, getFiles} from "../../customRequest.js";
import {useSelector, useDispatch} from "react-redux";
import {setUserList} from "../../features/userListSlice.js";
import {setListFile} from "../../features/filesListSlice.js";
import {STAFF_FILES_URL, FILES} from "../../endpoint.js";
import {formatDate, formatFileSize} from "../../scripts.js";

export const Staff = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingFile, setEditingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFileComment, setNewFileComment] = useState('');
    const dispatch = useDispatch()
    const users = useSelector(state => state.userList.value)
    const userFiles = useSelector(state => state.fileList.value)

    const countFiles = (files) => {
      return files ? files.length : 0;
    };

    const countTotalFileSize = (files) => {
      if (!files || files.length === 0) return 0;
      return files.reduce((total, file) => {
        return total + (file.size || 0);
      }, 0);
    };

    const countFile = countFiles(userFiles);
    const countSizeFile = countTotalFileSize(userFiles);

    const deleteUser = (e, user) => {
        e.stopPropagation()
        apiClient.delete(`users-destroy/${user.id}/`)
            .then(response => {
                if (response.status === 204) {
                    apiClient.get('/auth/users/')
                        .then(request => dispatch(setUserList(request.data)))
                    if (selectedUser && selectedUser.id === user.id) {
                        setSelectedUser(null);
                        dispatch(setListFile([]));
                    }
                }
            }).catch(error => console.log(error.message))
    }

    const deleteFile = (file) => {
        if (window.confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) {
            apiClient.delete(`${FILES}${file.id}/`)
                .then(response => {
                    if (response.status === 204) {
                        apiClient.get(`${STAFF_FILES_URL}${selectedUser.id}`)
                            .then(request => {
                                if (request.status === 200) {
                                    dispatch(setListFile(request.data))
                                }
                                if (request.status === 204) {
                                    dispatch(setListFile([]))
                                }
                            })
                    }
                })
                .catch(error => {
                    console.error('Ошибка при удалении файла:', error);
                    alert('Не удалось удалить файл');
                });
        }
    }


    const startEditFile = (file) => {
        setEditingFile(file.id);
        setNewFileName(file.name);
        setNewFileComment(file.comment || '');
    }


    const cancelEdit = () => {
        setEditingFile(null);
        setNewFileName('');
        setNewFileComment('');
    }

    const saveFileChanges = (file) => {
        const updateData = {};
        if (newFileName.trim() !== file.name) {
            updateData.name = newFileName.trim();
        }
        if (newFileComment !== file.comment) {
            updateData.comment = newFileComment.trim();
        }

        if (Object.keys(updateData).length > 0) {
            apiClient.patch(`${FILES}${file.id}/`, updateData)
                .then(response => {
                    if (response.status === 200) {
                        apiClient.get(`${STAFF_FILES_URL}${selectedUser.id}`)
                            .then(request => {
                                if (request.status === 200) {
                                    dispatch(setListFile(request.data))
                                }
                            })
                        setEditingFile(null);
                    }
                })
                .catch(error => {
                    console.error('Ошибка при обновлении файла:', error);
                    alert('Не удалось обновить файл');
                });
        } else {
            cancelEdit();
        }
    }

    const downloadFile = (file) => {
        apiClient.get(`${FILES}${file.id}/download/`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file.name);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Ошибка при скачивании файла:', error);
                alert('Не удалось скачать файл');
            });
    }

    useEffect(() => {
        apiClient.get('/auth/users/')
            .then(request => dispatch(setUserList(request.data)))
    }, []);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setEditingFile(null);
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
                                id={user.id}
                                className={`${S.userCard} ${selectedUser?.id === user.id ? S.selected : ''}`}
                                onClick={() => handleSelectUser(user)}
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
                                    onClick={(e) => deleteUser(e, user)}
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
                        {selectedUser ? `Файлы пользователя: ${selectedUser.username}, количество ${countFile}, объем ${formatFileSize(countSizeFile)}` : 'Выберите пользователя'}
                    </h2>

                    {selectedUser ? (
                        <div className={S.filesList}>
                            {userFiles.length > 0 ? (
                                userFiles.map(file => (
                                    <div key={file.id} className={S.fileItem}>
                                        <div className={S.fileIcon}>📄</div>
                                        <div className={S.fileInfo}>
                                            {editingFile === file.id ? (
                                                <div className={S.editForm}>
                                                    <input
                                                        type="text"
                                                        value={newFileName}
                                                        onChange={(e) => setNewFileName(e.target.value)}
                                                        className={S.editInput}
                                                        placeholder="Название файла"
                                                    />
                                                    <textarea
                                                        value={newFileComment}
                                                        onChange={(e) => setNewFileComment(e.target.value)}
                                                        className={S.editTextarea}
                                                        placeholder="Комментарий к файлу"
                                                        rows="2"
                                                    />
                                                    <div className={S.editActions}>
                                                        <button
                                                            onClick={() => saveFileChanges(file)}
                                                            className={S.saveButton}
                                                        >
                                                            Сохранить
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className={S.cancelButton}
                                                        >
                                                            Отмена
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h4 className={S.fileName}>{file.name}</h4>
                                                    <p className={S.fileDetails}>
                                                        Размер: {formatFileSize(file.size)} •
                                                        Загружен: {formatDate(file.date_uploaded)}
                                                    </p>
                                                    {file.comment && (
                                                        <p className={S.fileComment}>Комментарий: {file.comment}</p>
                                                    )}
                                                    <div className={S.fileActions}>
                                                        <button
                                                            onClick={() => downloadFile(file)}
                                                            className={S.downloadButton}
                                                            title="Скачать файл"
                                                        >
                                                            📥 Скачать
                                                        </button>
                                                        <button
                                                            onClick={() => startEditFile(file)}
                                                            className={S.editButton}
                                                            title="Редактировать файл"
                                                        >
                                                            ✏️ Редактировать
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFile(file)}
                                                            className={S.deleteFileButton}
                                                            title="Удалить файл"
                                                        >
                                                            🗑️ Удалить
                                                        </button>
                                                    </div>
                                                </>
                                            )}
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