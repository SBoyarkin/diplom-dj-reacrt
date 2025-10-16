import S from './signin.module.css'
import {Link} from "react-router";
export const SignIn = () => {
    return(
        <>
            <div className={S.sign}>
            <form className={S.form}>
                <h2>Регистрация</h2>
                <div className={S.inp}>
                <input className={S.itext} type='text'></input>
                <input className={S.itext} type='text'></input>
                <input className={S.itext} type='text'></input>
                <input className={S.itext} type='text'></input>

                <button>Регистрация</button>
                </div>
                <Link to='login'>Есть учетная запись?</Link>
            </form>
                </div>
        </>
    )
}