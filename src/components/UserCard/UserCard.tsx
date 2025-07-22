import React from 'react';
import style from "./UserCard.module.css"

type UserCardProps = {
    photo: string,
    name: string,
    surname: string,
    fatherName?: string,
    email: string,
    dateOfBirth: string
}

const UserCard = ({...data}:UserCardProps) => {
    return (
        <>
            <div className={style.card}>
                <img src={data.photo} alt="Фото пользователя" className={style.avatar}/>
                <h2>{data.surname} {data.name} {data.fatherName || ''}</h2>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Дата рождения:</strong> {data.dateOfBirth}</p>
            </div>
        </>
    );
};

export default UserCard;