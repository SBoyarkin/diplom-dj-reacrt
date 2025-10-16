import S from './file.module.css'
import {apiClient} from "../../customRequest.js";
import axios from "axios";
export const File = ({props}) => {
    const {name, id, download_url} = props

    const save = (e) => {
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
    });
}

    return(
        <>
            <div className={S.file} key={id} onDoubleClick={save}>
                <div>Иконка</div>
                <div className={S.name}>{name}</div>
            </div>
        </>
    )

}