import S from './space.module.css'
import {File} from "../file/File.jsx";
import {useEffect, useState} from "react";
import {apiClient} from "../../customRequest.js";
import {useDispatch, useSelector} from "react-redux";
import {removeToken} from "../../features/tokenSlice.js";
import {removeFile} from "../../features/fileSlice.js";
import { useNavigate} from "react-router";
import {Details} from "../details/Details.jsx";

export const Space = () => {
    const navigate = useNavigate()
    const [files, filesHandler] = useState([])
    const dispatch = useDispatch()

    const Logout = () => {
        apiClient.post('auth/token/logout/')
            .then(response => {
                if (response.status === 204) {
                 dispatch(removeToken())
                 navigate('/login', { replace: true });
                }

            })

    }
    useEffect(() => {
            apiClient.get('cloud/files/')
                .then(response => {
                    filesHandler(response.data)
                    console.log(response)
                })
        },
        [])

    const resetFileState = (e) => {
    if (e.currentTarget === e.target) {
            dispatch(removeFile())
        }
    }
  return(
      <>
          <div className={S.space} onClick={resetFileState}>

            <div className={S.logout} onClick={Logout}>Выйти из системы</div>
            <div className={S.fileSpace}>{files.map((i) => <File key={i.id} props={i}/>)}</div>
              <Details/>
          </div>

      </>
  )
}