import style from "./Button.module.css"

type ButtonProps = {
    type: string,
    title: string,
    onClick: ()=>void,
    isActive: boolean
}

export const Button=({type, title, onClick, isActive}:ButtonProps)=>{
    return(
        <>
            {type === 'header' &&
                        <button
                            onClick={onClick}
                            className={`${style.header}`}>
                            <h2>{title}</h2>
                        </button>
            }
            {type === 'active' &&
                <button
                    onClick={onClick}
                    className={`${style.active}`}>
                    <h4>{title}</h4>
                </button>
            }
            {type === 'passive' &&
                <button
                    onClick={onClick}
                    className={isActive ? `${style.passive_selected} ${style.passive}` : `${style.button_passive}`}>
                    <h4>{title}</h4>
                </button>
            }
            {type === 'join' &&
                <button
                    onClick={onClick}
                    className={isActive ? `${style.join}` : `${style.notJoined}`}>
                    <h5>{title}</h5>
                </button>
            }
            {type === 'edit' &&
                <button
                    onClick={onClick}
                    className={style.edit}>
                    <p>{title}</p>
                </button>
            }
            {type === 'members' &&
                <button
                    onClick={onClick}
                    className={style.members}>
                    <p>{title}</p>
                </button>
            }
            {type === 'submit' &&
                <button
                    onClick={onClick}
                    className={style.submit}
                    type='submit'>
                    <h4>{title}</h4>
                </button>
            }
        </>
    )
}