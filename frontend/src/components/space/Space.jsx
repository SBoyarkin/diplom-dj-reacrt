import S from './space.module.css'
import {File} from "../file/File.jsx";
import {useEffect, useState} from "react";
import {apiClient, getFiles} from "../../customRequest.js";
import {useDispatch, useSelector} from "react-redux";
import {removeToken} from "../../features/tokenSlice.js";
import {removeFile} from "../../features/fileSlice.js";
import {setListFile} from "../../features/filesListSlice.js";
import {NavLink, useNavigate} from "react-router";
import {Details} from "../details/Details.jsx";
import {FILES, LOGOUT} from "../../endpoint.js";
import {LOGIN} from "../../navigateEndpoint.js";
import {AddBtn} from "../addBtn/AddBtn.jsx";
import {User} from "../user/User.jsx";

export const Space = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const selector = useSelector(state => state.fileList.value)
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const Logout = () => {
        setIsLoggingOut(true);
        apiClient.post(LOGOUT)
            .then(response => {
                if (response.status === 204) {
                 dispatch(removeToken())
                 navigate(LOGIN, { replace: true });
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                setIsLoggingOut(false);
            })
    }

    useEffect(() => {
        getFiles(FILES, dispatch, setListFile)
    },[])

    const resetFileState = (e) => {
        if (e.currentTarget === e.target) {
            dispatch(removeFile())
        }
    }

    return(
        <div className={S.space} onClick={resetFileState}>
            <div className={S.header}>
                <div className={S.headerContent}>
                    <h2 className={S.title}>Мои файлы</h2>

                    <button
                        className={`${S.logoutBtn} ${isLoggingOut ? S.loading : ''}`}
                        onClick={Logout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? (
                            <>
                                <div className={S.spinner}></div>
                                Выход...
                            </>
                        ) : (
                            'Выйти из системы'
                        )}
                    </button>
                </div>
                {selector.length > 0 && (
                    <div className={S.fileCount}>
                        {selector.length} файл{selector.length === 1 ? '' : selector.length > 1 && selector.length < 5 ? 'а' : 'ов'}
                    </div>
                )}
            </div>

            <div className={S.content}>
                {selector.length === 0 ? (
                    <div className={S.emptyState}>
                        <div className={S.emptyIcon}>📁</div>
                        <h3 className={S.emptyTitle}>Файлов пока нет</h3>
                        <p className={S.emptyText}>Загрузите первый файл, нажав на кнопку ниже</p>
                    </div>
                ) : (
                    <div className={S.fileGrid}>
                        {selector.map((i) => <File key={i.id} props={i}/>)}
                    </div>
                )}

                <Details/>
            </div>
        </div>
    )
}