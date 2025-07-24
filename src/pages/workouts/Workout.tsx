import React, {useEffect, useState} from 'react';
import {Button} from "../../components/Button/Button";
import {useNavigate} from "react-router-dom";
import style from "./Workout.module.css";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import {TeamType, User, WorkoutTypes} from "../../types/types";

const Workout = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    const [workouts, setWorkouts] = useState<WorkoutTypes[]>([]);

    useEffect(() => {
        const storedWorkouts: WorkoutTypes[] = JSON.parse(localStorage.getItem("myProject_workouts") || "[]");
        const users: User[] = JSON.parse(localStorage.getItem("myProject_users") || "[]"); // Загружаем всех юзеров

        const filteredWorkouts = storedWorkouts.filter(workout => {
            if (!workout.isPrivate) return true; // Публичные доступны всем

            const workoutCreator = users.find(u => u.id === workout.userId); // Автор события
            if (!workoutCreator || !workoutCreator.team || !currentUser.team) return false;

            // Проверяем, есть ли пересечения в id команд
            const creatorTeamIds = workoutCreator.team.map(t => t.id);
            const userTeamIds = currentUser.team.map((t: TeamType) => t.id);

            return creatorTeamIds.some(id => userTeamIds.includes(id));
        });

        setWorkouts(filteredWorkouts);
    }, []);


    if (!currentUser || !currentUser.id) {
        return <p className={style.error}>Данные пользователя недоступны.</p>;
    }

    return (
        <>
            <Header/>
            <Title title={'Тренировки'}/>
            <div className='content'>

                <Button
                    type={'active'}
                    title={'Создать тренировку'}
                    onClick={() => navigate('/create-workout')}
                    isActive={true}
                />
                <div className={style.workouts_container}>
                    {workouts.map((w) => (
                        <div className={style.workout}>
                            <div>
                                <h1>{w.title}</h1>
                                <p>{w.isPrivate ? "Приватная тренировка (только для команды)" : "Общая тренировка (доступна всем)"}</p>
                            </div>

                            <div className={style.edit}>
                                <Button
                                    title="Перейти"
                                    onClick={() => navigate(`/workout/${w.id}`)}
                                    type="edit"
                                    isActive={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Workout;
