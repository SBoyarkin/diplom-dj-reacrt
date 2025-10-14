import S from './Login.module.css'
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {decrement, increment} from "../../features/counterSlice.js";
import {setToken, removeToken} from "../../features/tokenSlice.js";
import {Link} from "react-router";
import {useNavigate} from "react-router";

export const Login = () => {
    const navigate = useNavigate()
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()
    const token = useSelector((state) => state.token.value)

    const submitLogin = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const entries = formData.entries()
        const obj = Object.fromEntries(entries)
        axios.post('http://127.0.0.1:8000/auth/token/login', obj)
            .then(response => {if ( response.status === 200) {
                console.log(response.data.auth_token)
                dispatch(setToken(response.data.auth_token))
                navigate('/main', { replace: true });
            }})
    }


    return(
        <>
            <div className={S.main}>
                <div className={S.left}>
                    <div>
                        <div>
                            <button
                                aria-label="Увеличить значение"
                                onClick={() => dispatch(increment())}
                            >
                                Увеличить
                            </button>
                            <span>{count} sdfsdf</span>
                            <button
                                aria-label="Уменьшить значение"
                                onClick={() => dispatch(decrement())}
                            >
                                Уменьшить
                            </button>
                        </div>
                    </div>

                    <div>
                        <div>
                            <button
                                aria-label="Увеличить значение"
                                onClick={() => dispatch(setToken())}
                            >
                                Увеличить
                            </button>
                            <span>{token} ТУТ ТОКЕН</span>
                            <button
                                aria-label="Уменьшить значение"
                                onClick={() => dispatch(removeToken())}
                            >
                                Уменьшить
                            </button>
                        </div>
                    </div>

                </div>
                <div className={S.right}>
                    <form name='login' className={S.form} onSubmit={submitLogin}>
                        <div className={S.title}>Добро пожаловать</div>
                        <input name='username' className={S.input} type='text'/>
                        <input name='password' className={S.input} type='text'/>
                        <button className={S.btn} type="submit">Войти</button>
                        <Link to={'/sign'}>Регистрация</Link>
                    </form>
                </div>
            </div>


        </>
    )

}