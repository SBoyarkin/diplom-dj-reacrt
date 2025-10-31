import React, { useState } from 'react';
import S from './FileItem.module.css';
import { useDispatch } from "react-redux";
import {apiClient} from "../../customRequest.js";
import {FILES, STAFF_FILES_URL} from "../../endpoint.js";
import {setListFile} from "../../features/filesListSlice.js";
import {formatDate, formatFileSize, getFileIcon} from "../../scripts.js";

export const FileItem = ({ file, userId }) => {
    const [editingFile, setEditingFile] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [newFileComment, setNewFileComment] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    const deleteFile = () => {
        if (!window.confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) {
            return;
        }

        setIsDeleting(true);
        apiClient.delete(`${FILES}${file.id}/`)
            .then(response => {
                if (response.status === 204) {
                    refreshFileList();
                }
            })
            .catch(error => {
                console.error('Ошибка при удалении файла:', error);
                alert('Не удалось удалить файл');
            })
            .finally(() => {
                setIsDeleting(false);
            });
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

        if (Object.keys(updateData).length === 0) {
            cancelEdit();
            return;
        }

        setIsSaving(true);
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
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const downloadFile = () => {
        setIsDownloading(true);
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
            })
            .finally(() => {
                setIsDownloading(false);
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
            <div className={S.fileIcon}>{getFileIcon(file.name)}</div>

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
                                className={`${S.saveButton} ${isSaving ? S.loading : ''}`}
                                disabled={isSaving}
                            >
                                {isSaving ? <div className={S.spinner}></div> : '💾 Сохранить'}
                            </button>
                            <button
                                onClick={cancelEdit}
                                className={S.cancelButton}
                                disabled={isSaving}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={S.fileHeader}>
                            <h4 className={S.fileName}>{file.name}</h4>
                            <div className={S.fileMeta}>
                                <span className={S.fileSize}>{formatFileSize(file.size)}</span>
                                <span className={S.fileDate}>{formatDate(file.date_uploaded)}</span>
                            </div>
                        </div>

                        {file.comment && (
                            <p className={S.fileComment}>{file.comment}</p>
                        )}

                        <div className={S.fileActions}>
                            <button
                                onClick={downloadFile}
                                className={`${S.downloadButton} ${isDownloading ? S.loading : ''}`}
                                disabled={isDownloading}
                                title="Скачать файл"
                            >
                                {isDownloading ? <div className={S.spinner}></div> : '📥 Скачать'}
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
                                className={`${S.deleteButton} ${isDeleting ? S.loading : ''}`}
                                disabled={isDeleting}
                                title="Удалить файл"
                            >
                                {isDeleting ? <div className={S.spinner}></div> : '🗑️ Удалить'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};