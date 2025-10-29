import S from './menu.module.css'
import {Item} from "../item/Item.jsx";
import {User} from "../user/User.jsx";
import {AddBtn} from "../addBtn/AddBtn.jsx";
import {NavLink} from "react-router";
import {useSelector} from "react-redux";
export const Menu = () => {
        const isStaffSelector = useSelector(state => state.user.is_staff)
    return(
        <>
            <div className={S.menu}>
                                  {isStaffSelector ? <NavLink to='/admin'
                  > Войти в режим администратратора </NavLink>: null }

                <User/>
            </div>
        </>
    )

}