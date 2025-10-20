import S from './Login.module.css'
import {useDispatch} from "react-redux";
import {setToken} from "../../features/tokenSlice.js";
import {Link} from "react-router";
import {useNavigate} from "react-router";
import {apiClient} from "../../customRequest.js";
import {AUTH} from "../../endpoint.js";
import {MAIN} from "../../navigateEndpoint.js";
import {useState} from "react";

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const entries = formData.entries();
        const obj = Object.fromEntries(entries);

        apiClient.post(AUTH, obj)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.auth_token);
                    dispatch(setToken(response.data.auth_token));
                    navigate(MAIN, { replace: true });
                }
            })
            .catch(error => {
                console.error('Login error:', error);

                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;
                    if (status === 400) {
                        setError(data.detail || 'Неверные данные для входа');
                    } else if (status === 401) {
                        setError('Неверный логин или пароль');
                    } else if (status === 403) {
                        setError('Доступ запрещен');
                    } else if (status === 404) {
                        setError('Сервер авторизации не найден');
                    } else if (status >= 500) {
                        setError('Ошибка сервера. Попробуйте позже');
                    } else {
                        setError(data.detail || `Ошибка: ${status}`);
                    }
                } else if (error.request) {
                    setError('Нет соединения с сервером. Проверьте интернет-соединение');
                } else {
                    setError('Ошибка при отправке запроса');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className={S.main}>
                <h1 className={S.h1}>Добро пожаловать в файлообменник,  вы можете передавать файлы по ссыле загружая в эту систему, перед тем как начать пользоваться, зарегистрируйтесь!!</h1>
                <div className={S.left}>
                </div>
                <div className={S.right}>
                    <form name='login' className={S.form} onSubmit={submitLogin}>
                        <div className={S.title}>Добро пожаловать</div>


                        {error && (
                            <div className={S.error}>
                                {error}
                            </div>
                        )}

                        <input
                            name='username'
                            className={S.input}
                            type='text'
                            placeholder='Логин'
                            required
                            disabled={loading}
                        />
                        <input
                            name='password'
                            className={S.input}
                            type='password'
                            placeholder='Пароль'
                            required
                            disabled={loading}
                        />
                        <button
                            className={`${S.btn} ${loading ? S.loading : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Вход...' : 'Войти'}
                        </button>
                        <Link to={'/sign'}>Регистрация</Link>
                    </form>
                </div>
            </div>
        </>
    );
};