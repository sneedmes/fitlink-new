import React, { useEffect, useState } from 'react';
import styles from './player-stat.module.css';
import StatCard from '../../components/StatCard/StatCard';
import AttendanceCalendar from '../../components/Attendance/AttendanceCalendar';
import Modal from '../../components/StatModal/StatModal';
import { Button } from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Statistic } from '../../types/types';

const PlayerStat = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formLabel, setFormLabel] = useState('');
    const [formValue, setFormValue] = useState('');
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingField, setEditingField] = useState<keyof Statistic | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsers = localStorage.getItem("myProject_users");
        if (storedUsers) {
            const users: User[] = JSON.parse(storedUsers);
            const foundUser = users.find((u) => u.id === Number(id));
            setUser(foundUser || null);
        }
    }, [id]);

    const openAddModal = (field: keyof Statistic) => {
        setModalMode('add');
        setEditingField(field);
        setFormLabel('');
        setFormValue('');
        setModalOpen(true);
    };

    const saveModal = () => {
        if (!user || !editingField) return;

        const updatedUsers = JSON.parse(localStorage.getItem("myProject_users") || "[]") as User[];
        const userIndex = updatedUsers.findIndex(u => u.id === user.id);
        if (userIndex === -1) return;

        const userToUpdate = { ...updatedUsers[userIndex] };

        if (!userToUpdate.statistics) {
            userToUpdate.statistics = {
                goals: 0,
                assists: 0,
                redCards: 0,
                yellowCards: 0,
                missedBalls: 0,
                games: 0,
                attendance: {}
            };
        }

        const stat = userToUpdate.statistics;
        const newValue = Number(formValue);

        // НЕ трогаем attendance, только числовые поля
        if (editingField !== 'attendance' && !isNaN(newValue)) {
            stat[editingField] = newValue as number;
        }

        updatedUsers[userIndex] = userToUpdate;
        localStorage.setItem("myProject_users", JSON.stringify(updatedUsers));
        setUser(userToUpdate);
        setModalOpen(false);
    };

    if (!user) return <div>Пользователь не найден 😢</div>;

    const stat = user.statistics;

    return (
        <>
            <Button type="edit" title="Назад" onClick={() => navigate(`/player-info/${user.id}`)} isActive={false} />

            <div className={styles.card}>
                <h4><span className={styles.label}>ФИО:</span> {user.surname} {user.name} {user.fatherName}</h4>
                <h4><span className={styles.label}>Дата рождения:</span> {user.dateOfBirth}</h4>
                <h4><span className={styles.label}>Почта:</span> {user.email}</h4>
                <h4><span className={styles.label}>Роль:</span> {user.role}</h4>
            </div>

            <h2>Статистика</h2>
            <div className={styles.statCardsContainer}>
                <StatCard
                    title="Голы"
                    total={stat?.goals ?? 0}
                    items={[]}
                    onAdd={() => openAddModal('goals')}
                    addLabel="Добавить гол"
                />
                <StatCard
                    title="Голевые передачи"
                    total={stat?.assists ?? 0}
                    items={[]}
                    onAdd={() => openAddModal('assists')}
                    addLabel="Добавить передачу"
                />
                <StatCard
                    title="Карточки"
                    total={(stat?.redCards ?? 0) + (stat?.yellowCards ?? 0)}
                    items={[]}
                    showControls={false}
                    showValue={true}
                />
                <StatCard
                    title="Сыгранные матчи"
                    total={stat?.games ?? 0}
                    items={[]}
                    onAdd={() => openAddModal('games')}
                    addLabel="Добавить матч"
                    showValue={false}
                />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'add' ? 'Добавить запись' : 'Редактировать запись'}
            >
                <form onSubmit={e => {
                    e.preventDefault();
                    saveModal();
                }}>
                    <label>
                        Игра:<br />
                        <input
                            type="text"
                            value={formLabel}
                            onChange={e => setFormLabel(e.target.value)}
                            autoFocus
                        />
                    </label>
                    <br />
                    <label>
                        Количество:<br />
                        <input
                            type="text"
                            value={formValue}
                            onChange={e => setFormValue(e.target.value)}
                        />
                    </label>
                    <br />
                    <div className={styles.buttonGroup}>
                        <button className={`${styles.btn} ${styles.cancelBtn}`} type="button"
                                onClick={() => setModalOpen(false)}>Отмена</button>
                        <button className={`${styles.btn} ${styles.saveBtn}`} type="submit">Сохранить</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default PlayerStat;
