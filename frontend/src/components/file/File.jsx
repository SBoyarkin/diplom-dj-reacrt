import S from './file.module.css'
export const File = ({props}) => {
    const {name, id, size, type} = props

    const save = (e) => {
        console.log(e)
    }

    return(
        <>
            <div className={S.file} key={id} onDoubleClick={save}>
                <div>Иконка</div>
                <div className={S.name}>{name}</div>
            </div>
        </>
    )

}