import S from './details.module.css'
import {useSelector} from "react-redux";
import {apiClient} from "../../customRequest.js";
import {useEffect, useState} from "react";


export const Details = () => {
    const [fileInfo, fileInfoHandler] = useState({})
    const selector = useSelector((state) => state.file.value)
    const updateComment = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const entries = formData.entries()
        const obj = Object.fromEntries(entries)

        apiClient.patch(`/cloud/files/${selector}/`, obj)
            .then(response => {console.log(response)
            if (response.statusText === 'OK') {
                apiClient.get(`/cloud/files/${selector}`).then(
        response => {fileInfoHandler(response.data)})
        e.target.reset()
            }
            })
    }

    useEffect(() => {
        if (selector !== null) {
         apiClient.get(`/cloud/files/${selector}`).then(
        response => {fileInfoHandler(response.data)})
    }}, [selector])
    if (selector) {

        return(
        <>
        <div className={S.details}>
            <div >О файле</div>
            <div className={S.title}>Имя файла: {fileInfo.name}</div>
            <div> Размер файла: {fileInfo.size}</div>
            <div> {(fileInfo.comment)}</div>
            <form onSubmit={updateComment}>
                <input name='comment'></input>
                <button>Сохранить</button>
            </form>

        </div>


        </>
    )}
}