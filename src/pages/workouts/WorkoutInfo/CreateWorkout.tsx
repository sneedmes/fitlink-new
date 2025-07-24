import React, { useState } from 'react';
import Header from "../../../components/Header/Header";
import Title from "../../../components/Title/Title";
import style from "../Workout.module.css";
import { Button } from "../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import {ExerciseItem, WorkoutTypes} from "../../../types/types";

const CreateWorkout = () => {
    const [title, setTitle] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [items, setItems] = useState<ExerciseItem[]>([{ exercise: '', image: '' }]);
    const [titleError, setTitleError] = useState('');
    const [itemsError, setItemsError] = useState('');
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "null");
    const currentUserId = currentUser?.id;

    const handleItemChange = (index: number, field: keyof ExerciseItem, value: string) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleImageUpload = (index: number, file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedItems = [...items];
            updatedItems[index].image = reader.result as string;
            setItems(updatedItems);
        };
        reader.readAsDataURL(file);
    };

    const handleAddItem = () => {
        setItems(prev => [...prev, { exercise: '', image: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleAdd = () => {
        setTitleError('');
        setItemsError('');

        if (!title.trim()) {
            setTitleError('Введите название тренировки');
            return;
        }

        const hasEmptyExercise = items.some(item => !item.exercise.trim());
        if (hasEmptyExercise) {
            setItemsError('У каждого упражнения должно быть заполнено описание');
            return;
        }

        const newWorkout: WorkoutTypes = {
            userId: currentUserId,
            id: Date.now(),
            title,
            isPrivate,
            items,
        };

        const stored = JSON.parse(localStorage.getItem("myProject_workouts") || "[]");
        localStorage.setItem("myProject_workouts", JSON.stringify([...stored, newWorkout]));

        navigate('/workouts');
    };

    return (
        <>
            <Header />
            <Title title="Создать тренировку" />

            <div className="content">
                <div className={style.add_workout}>
                    <label>
                        <h2>Название / дата тренировки</h2>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {titleError && <div className={style.error}>{titleError}</div>}
                    </label>

                    {items.map((item, index) => (
                        <div key={index} className={style.exercise_input}>
                            <h2>Упражнение</h2>
                            <label>
                                <input
                                    type="text"
                                    placeholder="Описание"
                                    value={item.exercise}
                                    onChange={(e) => handleItemChange(index, 'exercise', e.target.value)}
                                />
                                Картинка (если есть)
                                <label className={style.image_upload}>
                                    Загрузить изображение
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(index, e.target.files?.[0] || null)}
                                    />
                                </label>
                            </label>

                            {item.image && (
                                <img
                                    src={item.image}
                                    alt="Превью"
                                    style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8 }}
                                />
                            )}

                            {items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className={style.remove_button}
                                >
                                    Удалить упражнение
                                </button>
                            )}
                        </div>
                    ))}

                    {itemsError && <div className={style.error}>{itemsError}</div>}

                    <Button
                        onClick={handleAddItem}
                        title="Добавить упражнение"
                        isActive={true}
                        type="edit"
                    />

                    <label className={style.checkbox_container}>
                        <span className={style.checkbox_text}>Приватная тренировка</span>
                        <label className={style.checkbox_label}>
                            <input
                                type="checkbox"
                                className={style.checkbox_input}
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            <span className={style.checkbox_slider}></span>
                        </label>
                    </label>

                    <Button
                        onClick={handleAdd}
                        title="Создать тренировку"
                        isActive={true}
                        type="active"
                    />
                </div>
            </div>
        </>
    );
};

export default CreateWorkout;
