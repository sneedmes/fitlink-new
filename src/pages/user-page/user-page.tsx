import React, {useEffect, useState} from 'react';
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import UserCard from "../../components/UserCard/UserCard";
import {useNavigate, useParams} from "react-router-dom";
import {Statistic, User} from "../../types/types";
import styles from "./user-page.module.css";
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import {Button} from "../../components/Button/Button";

const UserPage = () => {
    const {id} = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const navigate = useNavigate()

    useEffect(() => {
        const storedUsers = localStorage.getItem("myProject_users");
        if (storedUsers) {
            const users: User[] = JSON.parse(storedUsers);
            const foundUser = users.find((u) => u.id === Number(id));
            setUser(foundUser || null);
        }
    }, [id]);

    const updateAttendance = (newAttendance: Statistic["attendance"]) => {
        if (!user) return;

        const updatedUser: User = {
            ...user,
            statistics: {
                goals: user.statistics?.goals ?? 0,
                assists: user.statistics?.assists ?? 0,
                redCards: user.statistics?.redCards ?? 0,
                yellowCards: user.statistics?.yellowCards ?? 0,
                missedBalls: user.statistics?.missedBalls ?? 0,
                games: user.statistics?.games ?? 0,
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
            <Header/>
            <Title title={user.name}/>
            <div className="content">
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
                            <h2>Посещаемость</h2>
                            <div className={styles.card}>
                                <AttendanceCalendar user={user} onAttendanceChange={updateAttendance}/>
                            </div>
                        </div>

                        <div className={styles.stat}>
                            <h2>Статистика</h2>
                            <div className={styles.card}>
                                <div className={styles.card_stat}>
                                    <h4>Голы: <span className={styles.label}>{user.statistics?.goals}</span></h4>
                                    <h4>Голевые передачи: <span className={styles.label}>{user.statistics?.assists}</span></h4>
                                    <h4>Красные карточки: <span className={styles.label}>{user.statistics?.redCards}</span></h4>
                                    <h4>Желтые карточки: <span className={styles.label}>{user.statistics?.yellowCards}</span></h4>
                                    <h4>Пропущенные мячи: <span className={styles.label}>{user.statistics?.missedBalls}</span></h4>
                                    <h4>Игры: <span className={styles.label}>{user.statistics?.games}</span></h4>
                                </div>
                                {currentUser.role === "Тренер" &&
                                    <Button type={'edit'} title={'Изменить достижения'}
                                            onClick={() => navigate(`/player-info-stat/${user?.id}`)}
                                            isActive={false}/>
                                }
                            </div>
                        </div>

                    </div>
                }
            </div>
        </>
    );
};

export default UserPage;
