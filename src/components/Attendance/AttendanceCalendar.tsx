import React from 'react';
import { getDaysInMonth, format } from 'date-fns';
import clsx from 'clsx';
import styles from './AttendanceCalendar.module.css';
import { ru } from 'date-fns/locale';
import { User, TeamType } from '../../types/types';

type Props = {
    position: 'Тренер' | 'Спортсмен';
    player: User[];
    teamId: number;
    setTeams: React.Dispatch<React.SetStateAction<TeamType[]>>;
};

export const AttendanceCalendar: React.FC<Props> = ({
                                                        position,
                                                        player,
                                                        teamId,
                                                        setTeams
                                                    }) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = getDaysInMonth(new Date(currentYear, currentMonth));
    const monthName = format(new Date(currentYear, currentMonth), 'LLLL', { locale: ru })
        .replace(/^\w/, c => c.toUpperCase());

    const handleAttendanceChange = (
        teamId: number,
        playerId: number,
        updatedAttendance: { [date: string]: boolean }
    ) => {
        setTeams((prev: TeamType[]) =>
            prev.map(team =>
                team.id !== teamId
                    ? team
                    : {
                        ...team,
                        members: team.members.map(p =>
                            p.id === playerId
                                ? {
                                    ...p,
                                    statistics: p.statistics?.length
                                        ? [{ ...p.statistics[0], attendance: updatedAttendance }]
                                        : [{
                                            goals: 0,
                                            assists: 0,
                                            redCards: 0,
                                            yellowCards: 0,
                                            missedBalls: 0,
                                            games: 0,
                                            attendance: updatedAttendance
                                        }]
                                }
                                : p
                        ),
                    }
            )
        );
    };

    const handleDateClick = (playerId: number, currentAttendance: { [date: string]: boolean }, day: number) => {
        if (position === 'Спортсмен') return;

        const dateStr = format(new Date(currentYear, currentMonth, day), 'yyyy-MM-dd');
        const updatedAttendance = {
            ...currentAttendance,
            [dateStr]: !currentAttendance[dateStr],
        };

        handleAttendanceChange(teamId, playerId, updatedAttendance);
    };

    return (
        <>
            <h5 className={styles.monthName}>{monthName} {currentYear}</h5>
            {player.map(p => {
                const attendance = p.statistics?.[0]?.attendance || {};
                return (
                    <div key={p.id}>
                        <h6 className={styles.playerName}>{p.name} {p.surname}</h6>
                        <div className={styles.calendar}>
                            {Array.from({ length: daysInMonth }, (_, i) => {
                                const day = i + 1;
                                const dateStr = format(new Date(currentYear, currentMonth, day), 'yyyy-MM-dd');
                                const attended = attendance[dateStr] ?? false;

                                return (
                                    <div
                                        key={day}
                                        className={clsx(
                                            styles.day,
                                            attended && styles.attended,
                                            position === 'Спортсмен' && styles.disabledDay
                                        )}
                                        onClick={() => handleDateClick(p.id, attendance, day)}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </>
    );
};
