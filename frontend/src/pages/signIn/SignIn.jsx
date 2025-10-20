import S from './signin.module.css'
import { Link } from "react-router";
import { apiClient } from "../../customRequest.js";
import { useState } from "react";

export const SignIn = () => {
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})

    const handleRegistration = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formObject = Object.fromEntries(formData.entries())

        console.log('Form data:', formObject)

        // Очищаем предыдущие сообщения
        setSuccessMessage('')
        setErrorMessage('')
        setFieldErrors({})

        apiClient.post('/auth/register/', formObject)
            .then(response => {
                if (response.status === 201) {
                    setSuccessMessage('Учетная запись успешно создана, перейдите на страницу авторизации')
                    setFieldErrors({})
                    console.log('Успешно')
                    e.target.reset()
                }
            })
            .catch(error => {
                if (error.response?.data) {
                    const errors = error.response.data;
                    setFieldErrors(errors)
                    const allErrors = Object.entries(errors)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('; ')

                    setErrorMessage(allErrors)
                } else {
                    setErrorMessage('Произошла ошибка при регистрации')
                }
            })
    }

    const getFieldError = (fieldName) => {
        return fieldErrors[fieldName]?.[0] || ''
    }

    return (
        <div className={S.sign}>
            <form className={S.form} onSubmit={handleRegistration}>
                <h2>Регистрация</h2>
                <div className={S.inp}>
                    <input
                        placeholder='login'
                        name='login'
                        className={S.itext}
                        type='text'
                    />
                    {getFieldError('login') && (
                        <div className={S.fieldError}>{getFieldError('login')}</div>
                    )}

                    <input
                        placeholder='username'
                        name='username'
                        className={S.itext}
                        type='text'
                    />
                    {getFieldError('username') && (
                        <div className={S.fieldError}>{getFieldError('username')}</div>
                    )}

                    <input
                        placeholder='email'
                        name='email'
                        className={S.itext}
                        type='email'
                    />
                    {getFieldError('email') && (
                        <div className={S.fieldError}>{getFieldError('email')}</div>
                    )}

                    <input
                        placeholder='password'
                        name='password'
                        className={S.itext}
                        type='password'
                    />
                    {getFieldError('password') && (
                        <div className={S.fieldError}>{getFieldError('password')}</div>
                    )}

                    <input
                        placeholder='confirm password'
                        name='password2'
                        className={S.itext}
                        type='password'
                    />
                    {getFieldError('password2') && (
                        <div className={S.fieldError}>{getFieldError('password2')}</div>
                    )}

                    <button type="submit">Регистрация</button>
                </div>

                {successMessage && (
                    <div className={S.successMessage}>
                        {successMessage}
                    </div>
                )}

                <Link to='login'>Есть учетная запись?</Link>
            </form>
        </div>
    )
}