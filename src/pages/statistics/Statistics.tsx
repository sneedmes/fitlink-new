import React from 'react';
import Title from "../../components/Title/Title";
import {User} from "../../types/types";
import styles from "./Statistics.module.css"
import AttendanceCalendar from "../../components/Attendance/AttendanceCalendar";
import StatCard from "../../components/StatCard/StatCard";
import AttendanceDonutChart from "../../components/AttendanceDonutChart/AttendanceDonutChart";

const Statistics = () => {
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const stat = currentUser.statistics || {};

    const attendance = currentUser.statistics?.attendance;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

// Определяем число дней в текущем месяце
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

// Фильтруем посещения по текущему месяцу
    const attendedDays = Object.entries(attendance ?? {}).filter(([dateStr, visited]) => {
        const date = new Date(dateStr);
        return visited && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const missedDays = daysInMonth - attendedDays;


    const sumValues = (arr?: { game: string; value: number }[]) =>
        arr ? arr.reduce((acc, cur) => acc + cur.value, 0) : 0;

    return (
        <>
            {/*<Header/>*/}
            <Title title="Статистика"/>
            <div className="content">
                {(currentUser.team?.length === 0) ? (
                        <>
                            <h3 className={styles.without_team}>У вас пока нет команды. Поэтому статистика недоступна.
                                Попросите тренера добавить вас!</h3>
                        </>
                    ) :
                    <>
                        <div className={styles.attendance_container}>
                            <h2>Посещаемость</h2>
                            <div className={styles.attendance_card}>
                                <AttendanceCalendar
                                    player={currentUser}
                                    onChange={() => null}
                                />
                                <AttendanceDonutChart attendedDays={attendedDays} missedDays={missedDays}/>
                            </div>
                        </div>

                        <div className={styles.stat_container}>
                            <h2>Статистика</h2>
                            <div className={styles.statCardsContainer}>
                                {/* Голы */}
                                <StatCard
                                    title="Голы"
                                    total={sumValues(stat.goals)}
                                    items={stat?.goals?.map(g => ({label: g.game, value: g.value})) ?? []}
                                />
                                {/* Голевые передачи */}
                                <StatCard
                                    title="Голевые передачи"
                                    total={sumValues(stat.assists)}
                                    items={stat?.assists?.map(a => ({label: a.game, value: a.value})) ?? []}
                                />
                                {/* Карточки */}
                                <StatCard
                                    title="Карточки"
                                    total={(stat.redCards ?? 0) + (stat.yellowCards ?? 0)}
                                    items={[
                                        {label: 'Красные', value: stat.redCards ?? 0},
                                        {label: 'Жёлтые', value: stat.yellowCards ?? 0}
                                    ]}
                                />

                                {/* Сыгранные матчи */}
                                <StatCard
                                    title="Сыгранные матчи"
                                    total={stat.games?.length ?? 0}
                                    items={stat.games?.map((game) => ({label: game})) ?? []}
                                    showValue={false}
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default Statistics;