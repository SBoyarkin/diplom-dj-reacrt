import S from './file.module.css'
import {apiClient} from "../../customRequest.js";
import {useDispatch, useSelector} from "react-redux";
import {setFile} from "../../features/fileSlice.js";
import {useState} from "react";
import {formatFileName, getFileIcon} from "../../scripts.js";

export const File = ({props}) => {
    const {name, id, download_url} = props
    const dispatch = useDispatch()
    const selectedFileId = useSelector(state => state.file.value)
    const [isDownloading, setIsDownloading] = useState(false)


    const save = () => {
        setIsDownloading(true)
        apiClient.get(download_url, {
            responseType: 'blob'
        })
        .then(response => {
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Download error:', error);
        })
        .finally(() => {
            setIsDownloading(false)
        });
    }

    const selectFile = (e) => {
        const fileId = e.currentTarget.id
        dispatch(setFile(fileId))
    }

    const isSelected = selectedFileId === id.toString()

    return(
        <div
            className={`${S.file} ${isSelected ? S.fileSelected : ''} ${isDownloading ? S.fileDownloading : ''}`}
            id={id}
            onClick={selectFile}
            onDoubleClick={save}
        >


            <div className={S.fileIcon}>
                {getFileIcon(name)}
            </div>

            <div className={S.fileName} title={name}>
                {formatFileName(name)}
            </div>

            <div className={S.fileActions}>
                {isSelected && (
                    <div className={S.selectedIndicator}>
                        Выбран
                    </div>
                )}
            </div>
        </div>
    )
}