import S from './space.module.css'
import {File} from "../file/File.jsx";
import {useEffect, useState} from "react";
import {apiClient} from "../../customRequest.js";
export const Space = () => {
    const [files, filesHandler] = useState([])
    useEffect(() => {
            apiClient.get('cloud/files/')
                .then(response => {
                    filesHandler(response.data)
                    console.log(response)
                })
        },
        [])
  return(
      <>
          <div className={S.logout}>logout</div>
          <div className={S.space}>


              {files.map((i) => <File props={i}/>)}
          </div>
      </>
  )
}