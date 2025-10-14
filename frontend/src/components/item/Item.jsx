import S from './item.module.css'
import { NavLink} from "react-router";
export const Item = () => {
    return(
        <>
            <NavLink className={S.item}>
                item
            </NavLink>
        </>
    )

}