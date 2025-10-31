import React from 'react';
import S from './FileList.module.css';
import { FileItem } from '../fileItem/FileItem.jsx';
import {formatFileSize} from "../../scripts.js";

export const FileList = ({ selectedUser, userFiles }) => {
    const countFiles = userFiles ? userFiles.length : 0;

    const countTotalFileSize = (files) => {
        if (!files || files.length === 0) return 0;
        return files.reduce((total, file) => total + (file.size || 0), 0);
    };

    const countSizeFile = countTotalFileSize(userFiles);

    if (!selectedUser) {
        return (
            <div className={S.filesSection}>
                <div className={S.noSelection}>
                    Выберите пользователя из списка для просмотра его файлов
                </div>
            </div>
        );
    }

    return (
        <div className={S.filesSection}>
            <h2 className={S.sectionTitle}>
                Количество {countFiles},
                объем {formatFileSize(countSizeFile)}
            </h2>

            <div className={S.filesList}>
                {userFiles.length > 0 ? (
                    userFiles.map(file => (
                        <FileItem
                            key={file.id}
                            file={file}
                            userId={selectedUser.id}
                        />
                    ))
                ) : (
                    <div className={S.noFiles}>Нет загруженных файлов</div>
                )}
            </div>
        </div>
    );
};