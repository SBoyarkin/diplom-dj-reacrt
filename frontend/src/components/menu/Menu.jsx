import S from './menu.module.css'
import {User} from "../user/User.jsx";
import {AddBtn} from "../addBtn/AddBtn.jsx";
import {NavLink} from "react-router";
import {useSelector} from "react-redux";

export const Menu = () => {
    const isStaffSelector = useSelector(state => state.user.is_staff)

    return(
        <div className={S.menu}>
            <div className={S.menuHeader}>
                <h2 className={S.menuTitle}>Панель управления</h2>
                <p className={S.menuSubtitle}>Быстрый доступ к функциям</p>
            </div>

            <div className={S.menuContent}>
                <div className={S.uploadSection}>
                    <AddBtn/>
                </div>

                {isStaffSelector && (
                    <div className={S.adminSection}>
                        <NavLink
                            to='/admin'
                            className={({ isActive }) =>
                                `${S.adminLink} ${isActive ? S.adminLinkActive : ''}`
                            }
                        >
                            <span className={S.adminIcon}>⚙️</span>
                            <span className={S.adminText}>
                                Режим администратора
                            </span>
                            <span className={S.adminBadge}>STAFF</span>
                        </NavLink>
                    </div>
                )}
            </div>

            <div className={S.menuFooter}>
                <User/>
            </div>
        </div>
    )
}