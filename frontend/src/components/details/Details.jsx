import S from './details.module.css'
import {useSelector} from "react-redux";
import {apiClient} from "../../customRequest.js";
import {useEffect, useState} from "react";


export const Details = () => {
    const [fileInfo, fileInfoHandler] = useState({})
    const selector = useSelector((state) => state.file.value)
    useEffect(() => {

        apiClient.get(`/cloud/files/${selector}`).then(
        response => {fileInfoHandler(response.data)})

    }, [selector])
    if (selector) {
    return(
        <>
        <div className={S.details}>
            <div >О файле</div>
            <div className={S.title}>Имя файла: {fileInfo.name}</div>
            <div> Размер файла: {fileInfo.size}</div>
            <div> { (fileInfo.comment)}</div>

        </div>


        </>
    )}
}