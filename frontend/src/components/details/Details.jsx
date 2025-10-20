import S from './details.module.css'
import {useDispatch, useSelector} from "react-redux";
import {apiClient, getFiles} from "../../customRequest.js";
import {useEffect, useState} from "react";
import {setListFile} from "../../features/filesListSlice.js";
import {setFile} from "../../features/fileSlice.js";


export const Details = () => {
    const [fileInfo, fileInfoHandler] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const selector = useSelector((state) => state.file.value)
    const dispatch = useDispatch()

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

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
                getFiles(dispatch, setListFile);
                dispatch(setFile(null));
                fileInfoHandler({});
            })
            .catch(error => {
                console.error('Ошибка при удалении файла:', error);
            })
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
                            getFiles(dispatch, setListFile);
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

    useEffect(() => {
        if (selector !== null) {
            apiClient.get(`/cloud/files/${selector}`).then(
                response => {fileInfoHandler(response.data)}
            )
        } else {
            fileInfoHandler({});
            setIsEditing(false);
            setIsEditingName(false);
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

                    <div className={S.infoRow}>
                        <span className={S.label}>ID:</span>
                        <span className={S.value}>{fileInfo.id}</span>
                    </div>
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
                </div>
            </div>
        )
    }

    return null
}