import S from './signin.module.css'
import { Link } from "react-router";
import { apiClient } from "../../customRequest.js";
import { useState } from "react";

export const SignIn = () => {
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [fieldErrors, setFieldErrors] = useState({})
    const [validationErrors, setValidationErrors] = useState({})

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    const loginRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/

    const validateForm = (formData) => {
        const errors = {}
        const { login, username, email, password, password2 } = formData

        if (!login) {
            errors.login = 'Логин обязателен для заполнения'
        } else if (!loginRegex.test(login)) {
            errors.login = 'Логин должен начинаться с буквы и содержать от 4 до 20 символов (только буквы и цифры)'
        }

        if (!username) {
            errors.username = 'Имя пользователя обязательно для заполнения'
        }

        if (!email) {
            errors.email = 'Email обязателен для заполнения'
        } else if (!emailRegex.test(email)) {
            errors.email = 'Введите корректный email адрес'
        }

        if (!password) {
            errors.password = 'Пароль обязателен для заполнения'
        } else if (password.length < 8) {
            errors.password = 'Пароль должен содержать минимум 8 символов'
        } else if (!passwordRegex.test(password)) {
            errors.password = 'Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один специальный символ'
        }

        if (!password2) {
            errors.password2 = 'Подтверждение пароля обязательно'
        } else if (password !== password2) {
            errors.password2 = 'Пароли не совпадают'
        }

        return errors
    }

    const handleRegistration = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formObject = Object.fromEntries(formData.entries())

        console.log('Form data:', formObject)
        setSuccessMessage('')
        setErrorMessage('')
        setFieldErrors({})
        setValidationErrors({})

        const validationErrors = validateForm(formObject)
        if (Object.keys(validationErrors).length > 0) {
            setValidationErrors(validationErrors)
            return
        }

        apiClient.post('/auth/register/', formObject)
            .then(response => {
                if (response.status === 201) {
                    setSuccessMessage('Учетная запись успешно создана, перейдите на страницу авторизации')
                    setFieldErrors({})
                    setValidationErrors({})
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
        return validationErrors[fieldName] || fieldErrors[fieldName]?.[0] || ''
    }

    return (
        <div className={S.sign}>
            <form className={S.form} onSubmit={handleRegistration}>
                <h2>Регистрация</h2>
                <div className={S.inp}>
                    <input
                        placeholder='Логин'
                        name='login'
                        className={S.itext}
                        type='text'
                    />
                    {getFieldError('login') && (
                        <div className={S.fieldError}>{getFieldError('login')}</div>
                    )}

                    <input
                        placeholder='Имя пользователя'
                        name='username'
                        className={S.itext}
                        type='text'
                    />
                    {getFieldError('username') && (
                        <div className={S.fieldError}>{getFieldError('username')}</div>
                    )}

                    <input
                        placeholder='Email'
                        name='email'
                        className={S.itext}
                        type='email'
                    />
                    {getFieldError('email') && (
                        <div className={S.fieldError}>{getFieldError('email')}</div>
                    )}

                    <input
                        placeholder='Пароль'
                        name='password'
                        className={S.itext}
                        type='password'
                    />
                    {getFieldError('password') && (
                        <div className={S.fieldError}>{getFieldError('password')}</div>
                    )}

                    <input
                        placeholder='Подтверждение пароля'
                        name='password2'
                        className={S.itext}
                        type='password'
                    />
                    {getFieldError('password2') && (
                        <div className={S.fieldError}>{getFieldError('password2')}</div>
                    )}

                    <button type="submit" className={S.submitButton}>Регистрация</button>
                </div>

                {successMessage && (
                    <div className={S.successMessage}>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className={S.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                <div className={S.linkContainer}>
                    <Link to='login' className={S.link}>Есть учетная запись?</Link>
                </div>
            </form>
        </div>
    )
}