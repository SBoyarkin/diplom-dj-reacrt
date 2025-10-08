import S from './Login.module.css'
export const Login = () => {
    return(
        <>
        <div className={S.main}>
            <div className={S.left}>
                left
            </div>
            <div className={S.right}>
                <form className={S.form}>
                    <div className={S.title}>Добро пожаловать</div>
                    <input className={S.input} type='text'/>
                    <input className={S.input} type='text'/>
                    <button className={S.btn} type="submit">Войти</button>
                    <a>Регистрация</a>
                </form>
            </div>
        </div>
        </>
    )

}