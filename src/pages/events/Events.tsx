import React, {useState, useEffect} from 'react';
import Title from "../../components/Title/Title";
import {EventsTypes, TeamType, User} from '../../types/types';
import style from "./Events.module.css";
import {Button} from "../../components/Button/Button";
import {useNavigate} from "react-router-dom";

const Events = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    const [events, setEvents] = useState<EventsTypes[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedEvents: EventsTypes[] = JSON.parse(localStorage.getItem("myProject_events") || "[]");
        const users: User[] = JSON.parse(localStorage.getItem("myProject_users") || "[]"); // Загружаем всех юзеров
        setUsers(users);

        const filteredEvents = storedEvents.filter(event => {
            if (!event.isPrivate) return true; // Публичные доступны всем

            const eventCreator = users.find(u => u.id === event.userId); // Автор события
            if (!eventCreator || !eventCreator.team || !currentUser.team) return false;

            // Проверяем, есть ли пересечения в id команд
            const creatorTeamIds = eventCreator.team.map(t => t.id);
            const userTeamIds = currentUser.team.map((t: TeamType) => t.id);

            return creatorTeamIds.some(id => userTeamIds.includes(id));
        });

        setEvents(filteredEvents);
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
            {/*<Header/>*/}
            <Title title={'События'}/>
            <div className="content">
                <div className={style.events}>
                    <div className={style.events_container}>
                        {events.length > 0 ? (
                            events.map((event) => {
                                const hasJoined = event.joinedUsers?.includes(currentUser.id);
                                const creator = users.find(u => u.id === event.userId);
                                return (
                                    <div key={event.id} className={style.event}>
                                        <div className={style.event_info}>
                                            <h1>{event.title}</h1>
                                            <h3>{event.desc}</h3>
                                            <h4>{event.date}</h4>
                                            <h4>{event.time}</h4>
                                            <h6>Для связи напишите на почту: <span style={{color: "var(--color-main)"}}>{creator?.email}</span></h6>
                                            <h6>
                                                <i>{event.isPrivate ? 'Приватное (только команда)' : 'Публичное (для всех)'}</i>
                                            </h6>
                                        </div>
                                        <div className={style.members}>
                                            <div className={style.members_btns}>
                                                <Button
                                                    title={hasJoined ? 'Отменить участие' : 'Принять участие'}
                                                    type={'join'}
                                                    onClick={() => handleParticipationToggle(event.id)}
                                                    isActive={!hasJoined}
                                                />
                                                {event.userId === currentUser.id &&
                                                    <Button
                                                        title="Редактировать"
                                                        onClick={() => navigate(`/edit-event/${event.id}`)}
                                                        type="edit"
                                                        isActive={true}
                                                    />
                                                }
                                            </div>
                                            <p>Участников: {event.members}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Нет доступных событий.</p>
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
