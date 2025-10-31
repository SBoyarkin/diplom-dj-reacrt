import { useState } from 'react';
import S from './AddBtn.module.css'
import {apiClient, getFiles} from "../../customRequest.js";
import {FILES} from "../../endpoint.js";
import {useDispatch} from "react-redux";
import {setListFile} from "../../features/filesListSlice.js";

export const AddBtn = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setShowCommentInput(true);
        }
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCancelUpload = () => {
        setSelectedFile(null);
        setShowCommentInput(false);
        setComment('');
        setUploadProgress(0);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            if (comment.trim()) {
                formData.append('comment', comment.trim());
            }

            const response = await apiClient.post(FILES, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(progress);
                    }
                },
            });

            console.log('Файл успешно загружен:', response.data);
            getFiles(FILES, dispatch, setListFile);

            handleCancelUpload();

        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={S.uploadContainer}>
            <div className={S.uploadCard}>
                <div className={S.cardHeader}>
                    <h3 className={S.cardTitle}>Загрузка файлов</h3>
                    <p className={S.cardSubtitle}>Выберите файл для загрузки в систему</p>
                </div>

                <form className={S.uploadForm}>
                    <label className={`${S.uploadButton} ${uploading ? S.uploadButtonDisabled : ''}`}>
                        <input
                            type='file'
                            className={S.fileInput}
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                        <div className={S.buttonContent}>
                            <span className={S.buttonIcon}>📁</span>
                            <span className={S.buttonText}>
                                {uploading ? `Загрузка... ${uploadProgress}%` : 'Выберите файл'}
                            </span>
                        </div>
                        {uploading && (
                            <div className={S.buttonProgress}>
                                <div
                                    className={S.progressBar}
                                    style={{width: `${uploadProgress}%`}}
                                ></div>
                            </div>
                        )}
                    </label>
                </form>

                {(selectedFile || uploading) && (
                    <div className={S.fileInfoPanel}>
                        <div className={S.panelHeader}>
                            <div className={S.panelTitle}>
                                <span className={S.panelIcon}>📄</span>
                                Информация о файле
                            </div>
                            {!uploading && (
                                <button
                                    className={S.closeButton}
                                    onClick={handleCancelUpload}
                                    type="button"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className={S.fileInfo}>
                            <div className={S.infoGrid}>
                                <div className={S.infoItem}>
                                    <span className={S.infoLabel}>Имя файла:</span>
                                    <span className={S.infoValue}>{selectedFile?.name}</span>
                                </div>
                                <div className={S.infoItem}>
                                    <span className={S.infoLabel}>Размер:</span>
                                    <span className={S.infoValue}>{formatFileSize(selectedFile?.size)}</span>
                                </div>
                                <div className={S.infoItem}>
                                    <span className={S.infoLabel}>Тип:</span>
                                    <span className={S.infoValue}>{selectedFile?.type || 'Неизвестно'}</span>
                                </div>
                            </div>
                        </div>

                        {uploading && (
                            <div className={S.progressSection}>
                                <div className={S.progressContainer}>
                                    <div className={S.progressBar}>
                                        <div
                                            className={S.progressFill}
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <div className={S.progressText}>
                                        {uploadProgress < 100 ? 'Загрузка...' : 'Обработка...'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {showCommentInput && !uploading && (
                            <div className={S.commentSection}>
                                <label className={S.commentLabel}>
                                    Комментарий к файлу (необязательно)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={handleCommentChange}
                                    className={S.commentInput}
                                    placeholder="Опишите назначение файла или добавьте заметку..."
                                    rows="3"
                                    maxLength="500"
                                />
                                <div className={S.commentActions}>
                                    <button
                                        onClick={handleCancelUpload}
                                        className={S.cancelButton}
                                        type="button"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleFileUpload}
                                        className={S.confirmButton}
                                        type="button"
                                    >
                                        <span className={S.confirmIcon}>📤</span>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};