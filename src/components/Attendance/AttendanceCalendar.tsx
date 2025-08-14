import React, {useState, useEffect} from "react";
import {User} from "../../types/types"; // или путь к твоим типам
import styles from "./AttendanceCalendar.module.css"

interface AttendanceCalendarProps {
    player: User;
    onChange: (updatedAttendance: { [date: string]: boolean }) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({player, onChange}) => {
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const isCoach = currentUser.role === "Тренер";

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 - январь
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const [attendance, setAttendance] = useState<{ [date: string]: boolean }>(
        player.statistics?.attendance || {}
    );

    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]; // начиная с воскресенья

    useEffect(() => {
        onChange(attendance);
    }, [attendance, onChange]);

    const toggleDay = (day: number) => {
        if (!isCoach) return;

        const date = new Date(year, month, day).toISOString().slice(0, 10); // YYYY-MM-DD
        setAttendance(prev => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    return (

        <div className={styles.grid}>
            {daysOfWeek.map((d)=>
                <h4 style={{textAlign: "center", marginBottom: 10}}>{d}</h4>
            )}
            {/* Пустые ячейки перед 1 числом */}
            {[...Array((new Date(year, month, 1).getDay() || 7) - 1)].map((_, i) => (
                <div key={`empty-${i}`} className={styles.empty}></div>
            ))}

            {/* Дни месяца */}
            {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day).toISOString().slice(0, 10);
                const isPresent = attendance[date];

                return (
                    <div
                        key={date}
                        onClick={() => isCoach && toggleDay(day)}
                        className={`
          ${styles.day} 
          ${isPresent ? styles.present : styles.absent} 
          ${isCoach ? styles.clickable : ""}
        `}
                        title={date}
                    >
                        {day}
                    </div>
                );
            })}
        </div>

    );
};

export default AttendanceCalendar;
