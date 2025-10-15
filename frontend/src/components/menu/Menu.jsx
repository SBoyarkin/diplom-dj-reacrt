import S from './menu.module.css'
import {Item} from "../item/Item.jsx";
import {User} from "../user/User.jsx";
export const Menu = () => {
    return(
        <>
            <div className={S.menu}>
                <Item/>
                <User/>
            </div>
        </>
    )

}