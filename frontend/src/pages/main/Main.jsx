import S from './main.module.css'
import {Menu} from "../../components/menu/Menu.jsx";
import {Space} from "../../components/space/Space.jsx";


export const Main = () => {
    return(
        <>
            <div className={S.main}>
                <Menu/>
                <Space/>
            </div>
        </>
    )
}