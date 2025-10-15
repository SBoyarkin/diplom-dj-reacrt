import S from './user.module.css'
import {apiClient} from "../../customRequest.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../features/userSlice.js";

export const User = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    useEffect(() => {
        if (token !== null) {
        apiClient.get('/auth/users/me/')
            .then(response => {
                dispatch(setUser(response.data))
                console.log(response)
            })}}, [token])

    return(
        <>
            <div className={S.user_btn}>
                <div>{ user.id}</div>
                <div>{ user.email}</div>
                <div>{ user.username}</div>
            </div>
        </>
    )
}

