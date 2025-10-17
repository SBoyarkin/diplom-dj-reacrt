import axios from 'axios';
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
    const dispatch = useDispatch()
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setUploadProgress(0);
        try {
            const formData = new FormData();
            formData.append('file', file);
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
            getFiles(dispatch, setListFile)
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setSelectedFile(null);
        }
    };

    return (
        <>
            <form>
                <label className={S.btn}>
                    {uploading ? `Загрузка... ${uploadProgress}%` : 'Загрузите файл'}
                    <input
                        type='file'
                        className={S.label}
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            </form>
        </>
    );
};