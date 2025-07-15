import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from '../Events.module.css';
import { EventsTypes } from '../../../types/types';
import { Button } from '../../../components/Button/Button';
import Header from '../../../components/Header/Header';
import Title from '../../../components/Title/Title';

const EditEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const eventId = parseInt(id!);

    const [events, setEvents] = useState<EventsTypes[]>([]);
    const [event, setEvent] = useState<EventsTypes | undefined>(undefined);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('myProject_events');
        const parsed: EventsTypes[] = stored ? JSON.parse(stored) : [];
        setEvents(parsed);

        const found = parsed.find(e => e.id === eventId);
        if (found) {
            setEvent(found);
            setTitle(found.title);
            setDesc(found.desc);
            setDate(found.date);
            setTime(found.time);
            setIsPrivate(found.isPrivate);
        }
    }, [eventId]);

    const handleSave = () => {
        if (!title || !desc || !date) {
            alert('Заполни все поля!');
            return;
        }

        const updatedEvent: EventsTypes = {
            ...event!,
            title,
            desc,
            date,
            time,
            isPrivate,
        };

        const updatedEvents = events.map(e => (e.id === eventId ? updatedEvent : e));
        setEvents(updatedEvents);
        localStorage.setItem('myProject_events', JSON.stringify(updatedEvents));
        navigate('/events');
    };

    const handleDelete = () => {
        const filtered = events.filter(e => e.id !== eventId);
        setEvents(filtered);
        localStorage.setItem('myProject_events', JSON.stringify(filtered));
        navigate('/events');
    };

    if (!event) return <p>Событие не найдено</p>;

    return (
        <>
            <Header />
            <Title title="Редактировать событие" />

            <div className="content">
                <div className={style.add_event}>
                    <h2>Измените нужные поля</h2>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название"
                    />
                    <input
                        type="text"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Описание"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <input
                        type="time"
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

                    <div className={style.buttons}>
                        <Button title="Сохранить" onClick={handleSave} type="edit" isActive={true} />
                        <Button title="Удалить" onClick={handleDelete} type="edit" isActive={false} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditEvent;
