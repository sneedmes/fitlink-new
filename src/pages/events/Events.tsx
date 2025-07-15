import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Title from "../../components/Title/Title";
import { EventsTypes } from '../../types/types';
import style from "./Events.module.css";
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Events = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    const [events, setEvents] = useState<EventsTypes[]>([]);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("myProject_events") || "[]");
        setEvents(storedEvents);
    }, []);

    const handleParticipationToggle = (eventId: number) => {
        const updatedEvents = events.map(event => {
            if (event.id === eventId) {
                const hasJoined = event.joinedUsers?.includes(currentUser.id);
                const updatedUsers = hasJoined
                    ? event.joinedUsers.filter((id: number) => id !== currentUser.id)
                    : [...(event.joinedUsers || []), currentUser.id];

                return {
                    ...event,
                    joinedUsers: updatedUsers,
                    members: updatedUsers.length
                };
            }
            return event;
        });

        setEvents(updatedEvents);
        localStorage.setItem("myProject_events", JSON.stringify(updatedEvents));
    };

    if (!currentUser || !currentUser.id) {
        return <p className={style.error}>Данные пользователя недоступны.</p>;
    }

    return (
        <>
            <Header/>
            <Title title={'События'} />
            <div className="content">
                <div className={style.events}>
                    <div className={style.events_container}>
                        {events.length > 0 ? (
                            events.map((event) => {
                                const hasJoined = event.joinedUsers?.includes(currentUser.id);
                                return (
                                    <div key={event.id} className={style.event}>
                                        <div>
                                            <h1>{event.title}</h1>
                                            <h3>{event.desc}</h3>
                                            <h4>{event.date}</h4>
                                            <h4>{event.time}</h4>
                                        </div>
                                        <div className={style.members}>
                                            <Button
                                                title={hasJoined ? 'Отменить участие' : 'Принять участие'}
                                                type={'passive'}
                                                onClick={() => handleParticipationToggle(event.id)}
                                                isActive={!hasJoined}
                                            />
                                            <Button
                                                title="Редактировать"
                                                onClick={() => navigate(`/edit-event/${event.id}`)}
                                                type="edit"
                                                isActive={true}
                                            />
                                            <p>Участников: {event.members}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>У тебя пока нет событий. Давай создадим первое!</p>
                        )}
                    </div>

                    <Button
                        onClick={() => navigate('/CreateEvent')}
                        title={'Добавить событие'}
                        type={'active'}
                        isActive={true}
                    />
                </div>
            </div>
        </>
    );
};

export default Events;
