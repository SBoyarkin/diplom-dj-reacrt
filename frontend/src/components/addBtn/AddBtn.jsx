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
            getFiles(dispatch, setListFile);


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
            <form className={S.uploadForm}>
                <label className={`${S.btn} ${uploading ? S.btnDisabled : ''}`}>
                    📁 {uploading ? `Загрузка... ${uploadProgress}%` : 'Выберите файл'}
                    <input
                        type='file'
                        className={S.fileInput}
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            </form>

            {(selectedFile || uploading) && (
                <div className={S.fileInfoPanel}>
                    <div className={S.panelHeader}>
                        <span>Загрузка файла</span>
                        {!uploading && (
                            <button
                                className={S.closeButton}
                                onClick={handleCancelUpload}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className={S.fileInfo}>
                        <div className={S.infoRow}>
                            <span className={S.label}>Имя файла:</span>
                            <span className={S.value}>{selectedFile?.name}</span>
                        </div>
                        <div className={S.infoRow}>
                            <span className={S.label}>Размер:</span>
                            <span className={S.value}>{formatFileSize(selectedFile?.size)}</span>
                        </div>
                        <div className={S.infoRow}>
                            <span className={S.label}>Тип:</span>
                            <span className={S.value}>{selectedFile?.type || 'Неизвестно'}</span>
                        </div>
                    </div>

                    {uploading && (
                        <div className={S.progressSection}>
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
                    )}

                    {showCommentInput && !uploading && (
                        <div className={S.commentSection}>
                            <label className={S.commentLabel}>
                                Комментарий (необязательно):
                            </label>
                            <textarea
                                value={comment}
                                onChange={handleCommentChange}
                                className={S.commentInput}
                                placeholder="Добавьте комментарий к файлу..."
                                rows="3"
                                maxLength="500"
                            />
                            <div className={S.commentActions}>
                                <button
                                    onClick={handleFileUpload}
                                    className={S.uploadButton}
                                    disabled={uploading}
                                >
                                    📤 Загрузить
                                </button>
                                <button
                                    onClick={handleCancelUpload}
                                    className={S.cancelButton}
                                    disabled={uploading}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};