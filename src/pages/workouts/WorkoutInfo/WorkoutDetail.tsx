import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Title from '../../../components/Title/Title';
import {Button} from '../../../components/Button/Button';
import style from '../Workout.module.css';
import Modal from '../../../components/Modal/Modal';
import {WorkoutTypes} from '../../../types/types';

const WorkoutDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<WorkoutTypes | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");

    useEffect(() => {
        const storedWorkouts: WorkoutTypes[] = JSON.parse(localStorage.getItem("myProject_workouts") || "[]");
        const workoutId = parseInt(id!);
        const foundWorkout = storedWorkouts.find(w => w.id === workoutId);
        setWorkout(foundWorkout || null);
    }, [id]);

    if (!workout) return <p className={style.error}>Тренировка не найдена</p>;

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            {/*<Header/>*/}
            <Title title={workout.title}/>

            <div className="content">
                <Button title="Назад" onClick={() => navigate('/Workouts')} type="edit" isActive={false}/>

                <div className={style.details}>
                    <h3>Упражнения:</h3>
                    <div className={style.itemsList}>
                        {workout.items.map((item, index) => (
                            <div key={index} className={style.exerciseCard}>
                                <div className={style.cardContent}>
                                    <h5 className={style.exerciseTitle}><strong>{item.exercise}</strong></h5>
                                    {item.image && (
                                        <div
                                            className={style.imageContainer}
                                            onClick={() => handleImageClick(item.image)}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.exercise}
                                                className={style.exerciseImage}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h5><i>{workout.isPrivate ? 'Приватная тренировка' : 'Общая тренировка'}</i></h5>

                    <div className={style.buttons}>
                        {workout.userId === currentUser.id &&
                            <Button
                                title="Редактировать"
                                onClick={() => navigate(`/edit-workout/${workout.id}`)}
                                type="edit"
                                isActive={true}
                            />
                        }
                    </div>

                </div>
            </div>

            {selectedImage && (
                <Modal onClose={closeModal}>
                    <div className={style.modalImageContainer}>
                        <img src={selectedImage} alt="Просмотр" className={style.modalImage}/>
                        <button onClick={closeModal} className={style.closeButton}>×</button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default WorkoutDetails;
