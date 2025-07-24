import React, { useState, useEffect } from "react"
import styles from "./SchedulePanel.module.css"
import {TeamType, User} from "../../types/types"; // можно оставить стили, но удалить overlay и modal

interface DayData {
    label: string
    date: string
    time: string
}

interface Props {
    team: TeamType;
    updateSchedule: (teamId: number, schedule: DayData[]) => void;
}

const daysOfWeek = ["В", "П", "В", "С", "Ч", "П", "С"]; // начиная с воскресенья


export const SchedulePanel: React.FC<Props> = ({ team, updateSchedule }) => {
    const [schedule, setSchedule] = useState<DayData[]>([]);
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");

    useEffect(() => {
        if (team.schedule && team.schedule.length > 0) {
            setSchedule(team.schedule);
        } else {
            const today = new Date();
            const next7Days: DayData[] = Array.from({ length: 7 }, (_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const label = daysOfWeek[date.getDay()];
                const formattedDate = date.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                });
                return { label, date: formattedDate, time: "" };
            });
            setSchedule(next7Days);
        }
    }, [team]);

    const handleTimeChange = (index: number, newTime: string) => {
        const updated = [...schedule];
        updated[index].time = newTime;
        setSchedule(updated);
        updateSchedule(team.id, updated);
    };

    return (
        <div className={styles.panelWrapper}>
            <div className={styles.grid}>
                {schedule.map((day, index) => (
                    <div key={index} className={styles.column}>
                        <div className={styles.dayLabel}>{day.label}</div>
                        <div className={styles.date}>{day.date}</div>
                        {currentUser.role === 'Тренер' ?
                            <input
                                type="time"
                                value={day.time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                className={styles.timeInput}
                            />
                            : <div className={styles.timeDisplay}>{day.time || "—"}</div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

