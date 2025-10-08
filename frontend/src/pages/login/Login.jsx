import S from './Login.module.css'
import {useEffect, useState} from "react";
export const Login = () => {

    const [login, updateLoginHandler] = useState('')

    const submitLogin = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const entries = formData.entries()
        const obj = Object.fromEntries(entries)
        updateLoginHandler(obj)
    }

    useEffect(() => {
        if (login.username && login.password) {
        fetch('http://127.0.0.1:8000/auth/token/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json", },
            body: JSON.stringify(login)
        }).then((response) => {
              return response.json()})
    }}, [login])

    return(
        <>
        <div className={S.main}>
            <div className={S.left}>
                left
            </div>
            <div className={S.right}>
                <form name='login' className={S.form} onSubmit={submitLogin}>
                    <div className={S.title}>Добро пожаловать</div>
                    <input name='username' className={S.input} type='text'/>
                    <input name='password' className={S.input} type='text'/>
                    <button className={S.btn} type="submit">Войти</button>
                    <a>Регистрация</a>
                </form>
            </div>
        </div>
        </>
    )

}