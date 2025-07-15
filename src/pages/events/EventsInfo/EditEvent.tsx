import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import style from '../Events.module.css';
import {EventsTypes} from '../../../types/types';
import {Button} from '../../../components/Button/Button';
import Header from "../../../components/Header/Header";
import Title from "../../../components/Title/Title";

type EditEventProps = {
    events: EventsTypes[];
    setEvents: React.Dispatch<React.SetStateAction<EventsTypes[]>>;
};

const EditEvent = ({events, setEvents}: EditEventProps) => {
    const navigate = useNavigate();
    const {id} = useParams(); // Получаем ID события из URL
    const eventId = parseInt(id!);
    const event = events.find(e => e.id === eventId);

    const [formData, setFormData] = useState({
        title: event?.title || '',
        desc: event?.desc || '',
        date: event?.date || '',
        time: event?.time || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSave = () => {
        setEvents(prev => prev.map(e =>
            e.id === eventId ? {...e, ...formData} : e
        ));
        navigate('/');
    };

    const handleDelete = () => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        navigate('/');
    };

    if (!event) return <p>Событие не найдено</p>;

    return (
        <>
            <Header/>
            <Title title={'События'}/>
            <div className='content'>
                <div className={style.editEvent}>
                    <h2>Редактировать событие</h2>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Название"/>
                    <input name="desc" value={formData.desc} onChange={handleChange} placeholder="Описание"/>
                    <input name="date" value={formData.date} onChange={handleChange} placeholder="Дата" type="date"/>
                    <input name="time" value={formData.time} onChange={handleChange} placeholder="Время" type="time"/>

                    <div className={style.buttons}>
                        <Button title="Сохранить" onClick={handleSave} type="edit" isActive={true}/>
                        <Button title="Удалить" onClick={handleDelete} type="delete" isActive={false}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditEvent;
