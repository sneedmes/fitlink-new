import React, { useState, useEffect } from "react"
import styles from "./ScheduleModal.module.css"
import {DayData, TeamType, User} from "../../../types/types";



interface Props {
    isOpen: boolean
    onClose: () => void
    currentUser: User
    currentTeam: TeamType | undefined
    setTeams: React.Dispatch<React.SetStateAction<TeamType[]>>
}

export const ScheduleModal: React.FC<Props> = ({ isOpen, onClose, currentUser, currentTeam, setTeams }) => {
    const [schedule, setSchedule] = useState<DayData[]>([])
    const isCoach = currentTeam?.userId === currentUser.id
    const daysOfWeek = ["В", "П", "В", "С", "Ч", "П", "С"] // Воскресенье → Суббота

    useEffect(() => {
        if (!currentTeam) return

        const today = new Date()
        const baseSchedule: DayData[] = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            const label = daysOfWeek[date.getDay()]
            const formattedDate = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })

            const existingDay = currentTeam.schedule?.find(d => d.date === formattedDate)

            return {
                label,
                date: formattedDate,
                time: existingDay?.time || ""
            }
        })
        setSchedule(baseSchedule)
    }, [currentTeam])

    const handleTimeChange = (index: number, newTime: string) => {
        if (!isCoach) return

        const updated = [...schedule]
        updated[index].time = newTime
        setSchedule(updated)

        if (!currentTeam) return
        const updatedTeams = JSON.parse(localStorage.getItem("myProject_teams") || "[]") as TeamType[]

        const newTeams = updatedTeams.map(team =>
            team.id === currentTeam.id ? { ...team, schedule: updated } : team
        )

        localStorage.setItem("myProject_teams", JSON.stringify(newTeams))
        setTeams(newTeams)
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.backButton} onClick={onClose}>←</button>
                <h2 className={styles.title}>Расписание на неделю</h2>
                <div className={styles.grid}>
                    {schedule.map((day, index) => (
                        <div key={index} className={styles.column}>
                            <div className={styles.dayLabel}>{day.label}</div>
                            <div className={styles.date}>{day.date}</div>
                            <input
                                type="time"
                                value={day.time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                className={styles.timeInput}
                                disabled={!isCoach}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
