import S from './user.module.css'
import {apiClient} from "../../customRequest.js";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../features/userSlice.js";
import {ME} from "../../endpoint.js";
import {getUserInitials} from "../../scripts.js";

export const User = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token !== null) {
            setLoading(true)
            apiClient.get(ME)
                .then(response => {
                    dispatch(setUser(response.data))
                    console.log(response)
                })
                .catch(error => {
                    console.error('Error fetching user data:', error)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [token, dispatch])




    return(
        <div className={S.userCard}>
            {loading ? (
                <div className={S.userLoading}>
                    <div className={S.loadingSpinner}></div>
                    <span>Загрузка...</span>
                </div>
            ) : (
                <>
                    <div
                        className={S.userAvatar}
                    >
                        {getUserInitials(user.username)}
                    </div>

                    <div className={S.userInfo}>
                        <div className={S.userName}>
                            {user.username || 'Гость'}
                        </div>
                        <div className={S.userDetails}>
                            {user.email && (
                                <div className={S.userEmail}>
                                    {user.email}
                                </div>
                            )}
                            {user.is_staff && (
                                <div className={S.userBadge}>
                                    Администратор
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}