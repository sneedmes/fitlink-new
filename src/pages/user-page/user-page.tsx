import React from 'react';
import Title from "../../components/Title/Title";
import UserCard from "../../components/UserCard/UserCard";
import {useNavigate} from "react-router-dom";
import {Statistic, User} from "../../types/types";
import styles from "./user-page.module.css";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import {Button} from "../../components/Button/Button";
import {useUserFromStorage} from "../../hooks/useUserFromStorage";

const UserPage = () => {
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const navigate = useNavigate()

    const [user, setUser] = useUserFromStorage();
    const monthNames = [
        "январь", "февраль", "март", "апрель", "май", "июнь",
        "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ];

    const currentMonthName = monthNames[new Date().getMonth()];

    const updateAttendance = (newAttendance: Statistic["attendance"]) => {
        if (!user) return;

        // Проверяем, изменилось ли attendance
        if (JSON.stringify(user.statistics?.attendance) === JSON.stringify(newAttendance)) {
            return; // Нет изменений — не обновляем
        }

        const updatedUser: User = {
            ...user,
            statistics: {
                ...user.statistics,
                attendance: newAttendance,
            },
        };

        setUser(updatedUser);

        const storedUsers = localStorage.getItem("myProject_users");
        if (storedUsers) {
            const users: User[] = JSON.parse(storedUsers);
            const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
            localStorage.setItem("myProject_users", JSON.stringify(newUsers));
        }
    };

    if (!user) return <div>Пользователь не найден 😢</div>;


    return (
        <>
            {/*<Header/>*/}
            <Title title={user.name}/>
            <div className="content">
                <Button type={'edit'} title={'Назад'} onClick={() => navigate(`/team`)}
                        isActive={false}/>
                <UserCard
                    name={user.name}
                    surname={user.surname}
                    fatherName={user.fatherName}
                    photo={user.photo}
                    email={user.email}
                    dateOfBirth={user.dateOfBirth}
                />
                {user.role === "Спортсмен" &&
                    <div className={styles.stat_container}>

                        <div className={styles.stat}>
                            <h2>Посещаемость на <span>{currentMonthName}</span></h2>
                            <AttendanceCalendar
                                player={user}
                                onChange={updateAttendance}
                            />
                        </div>

                        <div className={styles.stat}>
                            <h2>Статистика</h2>
                            <div className={styles.card}>
                                <div className={styles.card_stat}>
                                    <h4>Голы: <span className={styles.label}>{user.statistics?.goals?.reduce((sum, item) => sum + item.value, 0) ?? 0}</span></h4>
                                    <h4>Голевые передачи: <span className={styles.label}>{user.statistics?.assists?.reduce((sum, item) => sum + item.value, 0) ?? 0}</span></h4>
                                    <h4>Красные карточки: <span className={styles.label}>{user.statistics?.redCards}</span></h4>
                                    <h4>Желтые карточки: <span className={styles.label}>{user.statistics?.yellowCards}</span></h4>
                                    <h4>Пропущенные мячи: <span className={styles.label}>{user.statistics?.missedBalls?.reduce((sum, item) => sum + item.value, 0) ?? 0}</span></h4>
                                    <h4>Сейвы: <span className={styles.label}>{user.statistics?.savedBalls?.reduce((sum, item) => sum + item.value, 0) ?? 0}</span></h4>
                                    <h4>Игры: <span className={styles.label}>{user.statistics?.games?.length}</span></h4>
                                </div>
                                {currentUser.role === "Тренер" &&
                                    <Button type={'edit'} title={'Изменить статистику'}
                                            onClick={() => navigate(`/player-info-stat/${user?.id}`)}
                                            isActive={false}/>
                                }
                            </div>
                        </div>

                    </div>
                }

                {user.events && user.events.length > 0 && (
                    <div className={styles.events}>
                        <h2>События пользователя</h2>
                        <div className={styles.events_container}>{user.events.map(event => (
                            <div key={event.id} className={styles.event}>
                                <div className={styles.event_info}>
                                    <h2>{event.title}</h2>
                                    <h3>{event.desc}</h3>
                                    <h4>{event.date}</h4>
                                    <h4>{event.time}</h4>
                                    <h6>
                                        Для связи:{" "}
                                        <span style={{color: "var(--color-main)"}}>{user.email}</span>
                                    </h6>
                                    <h6>
                                        <i>
                                            {event.isPrivate
                                                ? "Приватное (только команда)"
                                                : "Публичное (для всех)"}
                                        </i>
                                    </h6>
                                    <h6>Участников: {event.members}</h6>
                                </div>
                            </div>
                        ))}</div>
                    </div>
                )}

            </div>
        </>
    );
};

export default UserPage;
