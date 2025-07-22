import React, { useState, useEffect } from "react";
import styles from "./AttendanceCalendar.module.css";
import { User, Statistic } from "../../types/types";

interface AttendanceCalendarProps {
    user: User;
    onAttendanceChange: (newAttendance: Statistic["attendance"]) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ user, onAttendanceChange }) => {
    const [attendance, setAttendance] = useState<Statistic["attendance"]>(user.statistics?.attendance || {});

    // Для примера — возьмём последние 14 дней от сегодня
    const today = new Date();
    const daysToShow = 30;

    useEffect(() => {
        setAttendance(user.statistics?.attendance || {});
    }, [user]);

    const getDateString = (date: Date) => date.toISOString().slice(0, 10);

    const datesArray = Array.from({ length: daysToShow }).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (daysToShow - 1 - i));
        return getDateString(d);
    });

    const toggleAttendance = (date: string) => {
        setAttendance((prev) => {
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date];
            } else {
                updated[date] = true;
            }
            onAttendanceChange(updated);
            return updated;
        });
    };

    return (
        <div className={styles.calendar}>
            {datesArray.map((date) => {
                const wasPresent = attendance[date];
                return (
                    <div
                        key={date}
                        className={`${styles.day} ${wasPresent ? styles.present : styles.absent}`}
                        onClick={() => toggleAttendance(date)}
                        title={wasPresent ? "Был (клик чтобы снять)" : "Отсутствовал (клик чтобы отметить)"}
                    >
                        <span>{date}</span>
                        <span>●</span>
                    </div>
                );
            })}
        </div>
    );
};

export default AttendanceCalendar;
