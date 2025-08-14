import React, {useState} from 'react';
import style from '../Events.module.css';
import {useNavigate} from 'react-router-dom';
import {EventsTypes} from '../../../types/types';
import {Button} from "../../../components/Button/Button";
import Title from "../../../components/Title/Title";

const CreateEvent = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "null");
    const currentUserId = currentUser?.id;

    const handleAdd = () => {
        if (!title || !desc || !date) {
            alert('Заполни все поля!');
            return;
        }

        const newEvent: EventsTypes & { joinedUsers: number[] } = {
            userId: currentUserId,
            id: Date.now(),
            title,
            desc,
            date,
            time,
            members: 0,
            joinedUsers: [],
            isPrivate,
        };

        // обновляем общий список событий
        const storedEvents = localStorage.getItem('myProject_events');
        const events = storedEvents ? JSON.parse(storedEvents) : [];
        const updatedEvents = [...events, newEvent];
        localStorage.setItem('myProject_events', JSON.stringify(updatedEvents));

        // обновляем конкретного пользователя
        const storedUsers = localStorage.getItem('myProject_users');
        if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const userIndex = users.findIndex((u: any) => u.id === currentUserId);
            if (userIndex !== -1) {
                users[userIndex].events = [...users[userIndex].events, newEvent];
                localStorage.setItem('myProject_users', JSON.stringify(users));

                // заодно обновим currentUser в localStorage
                localStorage.setItem('myProject_currentUser', JSON.stringify(users[userIndex]));
            }
        }

        navigate('/events');
    };



    return (
        <>
            {/*<Header/>*/}
            <Title title={'Создать событие'}/>

            <div className='content'>
                <div className={style.add_event}>
                    <h2>Заполните все поля</h2>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название"
                    />
                    <input
                        type="text"
                        name="description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Описание"
                    />
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                        type="time"
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="Время (необязательно)"
                    />
                    <div className={style.privacy_toggle}>
                        <div>
                            <p className={style.label_text}>
                                {isPrivate ? 'Приватное (только команда)' : 'Публичное (для всех)'}
                            </p>
                        </div>
                        <div className={style.switch_container}>
                            <label className={style.switch}>
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(!isPrivate)}
                                />
                                <span className={style.slider}></span>
                            </label>
                        </div>
                    </div>

                    <Button
                        onClick={handleAdd}
                        title={'Добавить'}
                        isActive={true}
                        type={'active'}
                    />
                </div>
            </div>
        </>
    );
};

export default CreateEvent;
