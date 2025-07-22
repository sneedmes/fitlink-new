import React, {useEffect, useState} from 'react';
import {Button} from "../../components/Button/Button";
import {useNavigate} from "react-router-dom";
import style from "./Workout.module.css";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import {WorkoutTypes} from "../../types/types";

const Workout = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    const [workouts, setWorkouts] = useState<WorkoutTypes[]>([]);

    useEffect(() => {
        const storedWorkouts = JSON.parse(localStorage.getItem("myProject_workouts") || "[]");
        setWorkouts(storedWorkouts);
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
                                <p>{w.isPrivate ? "Приватная тренировка" : "Общая тренировка"}</p>
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
