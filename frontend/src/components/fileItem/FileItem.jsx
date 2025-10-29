import React, { useState } from 'react';
import S from './FileItem.module.css';

import { useDispatch } from "react-redux";
import {apiClient} from "../../customRequest.js";
import {FILES, STAFF_FILES_URL} from "../../endpoint.js";
import {setListFile} from "../../features/filesListSlice.js";
import {formatDate, formatFileSize} from "../../scripts.js";


export const FileItem = ({ file, userId }) => {
    const [editingFile, setEditingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFileComment, setNewFileComment] = useState('');
    const dispatch = useDispatch();

    const deleteFile = () => {
        if (window.confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) {
            apiClient.delete(`${FILES}${file.id}/`)
                .then(response => {
                    if (response.status === 204) {
                        refreshFileList();
                    }
                })
                .catch(error => {
                    console.error('Ошибка при удалении файла:', error);
                    alert('Не удалось удалить файл');
                });
        }
    };

    const startEditFile = () => {
        setEditingFile(file.id);
        setNewFileName(file.name);
        setNewFileComment(file.comment || '');
    };

    const cancelEdit = () => {
        setEditingFile(null);
        setNewFileName('');
        setNewFileComment('');
    };

    const saveFileChanges = () => {
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
                        refreshFileList();
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
    };

    const downloadFile = () => {
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
    };

    const refreshFileList = () => {
        apiClient.get(`${STAFF_FILES_URL}${userId}`)
            .then(request => {
                if (request.status === 200) {
                    dispatch(setListFile(request.data));
                }
                if (request.status === 204) {
                    dispatch(setListFile([]));
                }
            });
    };

    return (
        <div className={S.fileItem}>
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
                                onClick={saveFileChanges}
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
                                onClick={downloadFile}
                                className={S.downloadButton}
                                title="Скачать файл"
                            >
                                📥 Скачать
                            </button>
                            <button
                                onClick={startEditFile}
                                className={S.editButton}
                                title="Редактировать файл"
                            >
                                ✏️ Редактировать
                            </button>
                            <button
                                onClick={deleteFile}
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
    );
};