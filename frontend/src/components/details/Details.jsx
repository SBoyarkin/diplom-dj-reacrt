import S from './details.module.css'
import {useDispatch, useSelector} from "react-redux";
import {apiClient, getFiles} from "../../customRequest.js";
import {useEffect, useState} from "react";
import {setListFile} from "../../features/filesListSlice.js";
import {setFile} from "../../features/fileSlice.js";
import {FILES} from "../../endpoint.js";
import {formatDate, formatFileSize} from "../../scripts.js";

export const Details = () => {
    const [fileInfo, fileInfoHandler] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [expiresDays, setExpiresDays] = useState(7) // Значение по умолчанию
    const selector = useSelector((state) => state.file.value)
    const dispatch = useDispatch()

    const save = () => {
        apiClient.get(fileInfo.download_url, {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileInfo.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Download error:', error);
        });
    }

    const deleteFile = (e) => {
        e.preventDefault()
        apiClient.delete(`/cloud/files/${selector}/`)
            .then(response => {
                console.log('Файл успешно удален:', response)
                getFiles(FILES, dispatch, setListFile);
                dispatch(setFile(null));
                fileInfoHandler({});
            })
            .catch(error => {
                console.error('Ошибка при удалении файла:', error);
            })
    }

    const shareFile = (e) => {
        e.preventDefault()
        const data = expiresDays ? { expires_days: expiresDays } : {}

        apiClient.post(`/cloud/files/${selector}/generate_public_link/`, data)
        .then(response => {
            console.log(response)
            setIsSharing(false)
            getUserFile()
        })
        .catch(error => {
            console.error('Ошибка при создании публичной ссылки:', error)
        })
    }

    const removeShareFile = (e) => {
        e.preventDefault()
        apiClient.post(`/cloud/files/${selector}/revoke_public_link/`,)
        .then(response => {
            console.log(response), getUserFile()
        })
    }

    const startSharing = () => {
        setIsSharing(true)
    }

    const cancelSharing = () => {
        setIsSharing(false)
        setExpiresDays(7)
    }

    const updateComment = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const entries = formData.entries()
        const obj = Object.fromEntries(entries)

        apiClient.patch(`/cloud/files/${selector}/`, obj)
            .then(response => {
                console.log(response)
                if (response.statusText === 'OK') {
                    apiClient.get(`/cloud/files/${selector}`).then(
                        response => {
                            fileInfoHandler(response.data)
                            setIsEditing(false)
                        }
                    )
                    e.target.reset()
                }
            })
    }

    const updateFileName = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newName = formData.get('name')

        if (!newName || newName.trim() === '') {
            console.log('Имя не может быть пустым')
            return
        }

        apiClient.patch(`/cloud/files/${selector}/`, { name: newName })
            .then(response => {
                console.log('Имя файла обновлено:', response)
                if (response.statusText === 'OK') {
                            getFiles(FILES, dispatch, setListFile)
                    apiClient.get(`/cloud/files/${selector}`).then(
                        response => {
                            fileInfoHandler(response.data)
                            setIsEditingName(false)
                        }
                    )
                }
            })
            .catch(error => {
                console.error('Ошибка при обновлении имени файла:', error)
                alert('Ошибка при обновлении имени файла')
            })
    }

    const startEditing = () => {
        setIsEditing(true)
    }

    const cancelEditing = () => {
        setIsEditing(false)
    }

    const startEditingName = () => {
        setIsEditingName(true)
    }

    const cancelEditingName = () => {
        setIsEditingName(false)
    }

    const getUserFile = () => {
            apiClient.get(`/cloud/files/${selector}`).then(
                response => {fileInfoHandler(response.data)}
            )
    }

    useEffect(() => {
        if (selector !== null) {
            getUserFile()
        } else {
            fileInfoHandler({});
            setIsEditing(false);
            setIsEditingName(false);
            setIsSharing(false);
        }
    }, [selector])

    if (selector) {
        return (
            <div className={S.details}>
                <div className={S.header}>
                    О файле
                    <button
                        className={S.closeButton}
                        onClick={() => dispatch(setFile(null))}
                        title="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <div className={S.infoSection}>
                    <div className={S.infoRow}>
                        <span className={S.label}>Имя файла:</span>
                        <div className={S.nameContainer}>
                            {isEditingName ? (
                                <form onSubmit={updateFileName} className={S.nameForm}>
                                    <input
                                        name='name'
                                        defaultValue={fileInfo.name}
                                        className={S.nameInput}
                                        autoFocus
                                    />
                                    <div className={S.nameActions}>
                                        <button type="submit" className={S.saveButton}>
                                            ✓
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelEditingName}
                                            className={S.cancelButton}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className={S.nameDisplay}>
                                    <span className={S.value}>{fileInfo.name}</span>
                                    <button
                                        className={S.editButton}
                                        onClick={startEditingName}
                                        title="Редактировать имя файла"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={S.infoRow}>
                        <span className={S.label}>Размер:</span>
                        <span className={S.value}>{formatFileSize(fileInfo.size)}</span>
                    </div>

                    <div className={S.infoRow}>
                        <span className={S.label}>Загружен:</span>
                        <span className={S.value}>{formatDate(fileInfo.date_uploaded)}</span>
                    </div>

                    {fileInfo.date_downloaded && (
                        <div className={S.infoRow}>
                            <span className={S.label}>Скачан:</span>
                            <span className={S.value}>{formatDate(fileInfo.date_downloaded)}</span>
                        </div>
                    )}

                    {fileInfo.is_public === true && (
                        <>
                            <div className={S.infoRow}>
                                <span className={S.label}>Публичная ссылка:</span>
                                <span className={S.value}>
                                    {fileInfo.public_access_url}
                                </span>
                            </div>
                            {fileInfo.public_url_expires && (
                                <div className={S.infoRow}>
                                    <span className={S.label}>Ссылка действительна до:</span>
                                    <span className={S.value}>
                                        {formatDate(fileInfo.public_url_expires)}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={S.commentSection}>
                    <div className={S.commentHeader}>
                        <span className={S.label}>Комментарий:</span>
                        {!isEditing && (
                            <button
                                className={S.editButton}
                                onClick={startEditing}
                            >
                                ✏️
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={updateComment} className={S.commentForm}>
                            <textarea
                                name='comment'
                                defaultValue={fileInfo.comment || ''}
                                className={S.commentInput}
                                placeholder="Добавьте комментарий..."
                                rows="3"
                            />
                            <div className={S.formActions}>
                                <button type="submit" className={S.saveButton}>
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className={S.cancelButton}
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={S.commentText}>
                            {fileInfo.comment || <span className={S.noComment}>Нет комментария</span>}
                        </div>
                    )}
                </div>

                <div className={S.actions}>
                    <div
                        onClick={save}
                        className={S.downloadButton}
                    >
                        📥 Скачать файл
                    </div>
                    <button
                        onClick={deleteFile}
                        className={S.deleteButton}
                    >
                        🗑️ Удалить файл
                    </button>

                    {!fileInfo.is_public ? (
                        isSharing ? (
                            <div className={S.shareForm}>
                                <label className={S.shareLabel}>
                                    Срок действия ссылки (дни):
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={expiresDays}
                                        onChange={(e) => setExpiresDays(parseInt(e.target.value) || 1)}
                                        className={S.expiresInput}
                                    />
                                </label>
                                <div className={S.shareActions}>
                                    <button
                                        onClick={shareFile}
                                        className={S.confirmShareButton}
                                    >
                                        Создать ссылку
                                    </button>
                                    <button
                                        onClick={cancelSharing}
                                        className={S.cancelShareButton}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={startSharing}
                                className={S.shareButton}
                            >
                                Поделиться
                            </button>
                        )
                    ) : (
                        <button
                            onClick={removeShareFile}
                            className={S.removeShareButton}
                        >
                            Удалить ссылку
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return null
}