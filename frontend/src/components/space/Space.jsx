import S from './space.module.css'
import {File} from "../file/File.jsx";
import {useEffect} from "react";
import {apiClient, getFiles} from "../../customRequest.js";
import {useDispatch, useSelector} from "react-redux";
import {removeToken} from "../../features/tokenSlice.js";
import {removeFile} from "../../features/fileSlice.js";
import {setListFile} from "../../features/filesListSlice.js";
import {NavLink, useNavigate} from "react-router";
import {Details} from "../details/Details.jsx";
import {FILES, LOGOUT} from "../../endpoint.js";
import {LOGIN} from "../../navigateEndpoint.js";
import {AddBtn} from "../addBtn/AddBtn.jsx";

export const Space = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const selector = useSelector(state => state.fileList.value)

        const Logout = () => {
        apiClient.post(LOGOUT)
            .then(response => {
                if (response.status === 204) {
                 dispatch(removeToken())
                 navigate(LOGIN, { replace: true });
                }
            })
    }

    useEffect(() => {
        getFiles(FILES, dispatch, setListFile)

        },[])

    const resetFileState = (e) => {
    if (e.currentTarget === e.target) {
            dispatch(removeFile())
        }
    }
  return(
      <>
          <div className={S.space} onClick={resetFileState}>
              <div className={S.flexMenu}>

                  <div className={S.logout} onClick={Logout}>Выйти из системы</div>

                </div>
              <div className={S.fileSpace}>{selector.map((i) => <File key={i.id} props={i}/>)}</div>
              <Details/>
              <AddBtn/>
          </div>

      </>
  )
}