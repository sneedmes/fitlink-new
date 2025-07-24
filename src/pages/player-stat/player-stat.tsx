import React, { useState } from 'react';
import styles from './player-stat.module.css';
import StatCard from '../../components/StatCard/StatCard';
import Modal from '../../components/StatModal/StatModal';
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { User, Statistic } from '../../types/types';
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import UserCard from "../../components/UserCard/UserCard";
import { useUserFromStorage } from "../../hooks/useUserFromStorage";

const PlayerStat = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [formLabel, setFormLabel] = useState('');
    const [formValue, setFormValue] = useState('');
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingField, setEditingField] = useState<keyof Statistic | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const navigate = useNavigate();
    const [user, setUser] = useUserFromStorage();

    type StatArrayField = 'goals' | 'assists' | 'missedBalls';
    type StatNumberField = 'redCards' | 'yellowCards';
    type StatStringArrayField = 'games';

    const isArrayField = (field: keyof Statistic): field is StatArrayField =>
        ['goals', 'assists', 'missedBalls'].includes(field);
    const isNumberField = (field: keyof Statistic): field is StatNumberField =>
        ['redCards', 'yellowCards'].includes(field);
    const isStringArrayField = (field: keyof Statistic): field is StatStringArrayField =>
        field === 'games';

    const openAddModal = (field: keyof Statistic) => {
        setModalMode('add');
        setEditingField(field);
        setEditingIndex(null);
        setFormLabel('');
        setFormValue('');
        setModalOpen(true);
    };

    const openEditModal = (field: keyof Statistic, index: number) => {
        if (!user || !user.statistics) return;
        const stat = user.statistics;

        setModalMode('edit');
        setEditingField(field);
        setEditingIndex(index);

        if (isArrayField(field)) {
            const item = stat[field]?.[index];
            setFormLabel(item?.game || '');
            setFormValue(item?.value?.toString() || '');
        } else if (isNumberField(field)) {
            setFormLabel('');
            setFormValue((stat[field] ?? 0).toString());
        } else if (isStringArrayField(field)) {
            setFormLabel('');
            setFormValue(stat[field]?.[0] || ''); // Пример — редактируем первый матч
        }

        setModalOpen(true);
    };

    const deleteItem = (field: keyof Statistic, index?: number) => {
        if (!user) return;

        const updatedUsers = JSON.parse(localStorage.getItem("myProject_users") || "[]") as User[];
        const userIndex = updatedUsers.findIndex(u => u.id === user.id);
        if (userIndex === -1) return;

        const userToUpdate = { ...updatedUsers[userIndex] };
        if (!userToUpdate.statistics) return;
        const stat = userToUpdate.statistics;

        if (isArrayField(field)) {
            if (index === undefined) return;
            stat[field] = stat[field]?.filter((_, i) => i !== index) || [];
        } else if (isNumberField(field)) {
            stat[field] = 0;
        } else if (isStringArrayField(field)) {
            stat[field] = [];
        }

        updatedUsers[userIndex] = userToUpdate;
        localStorage.setItem("myProject_users", JSON.stringify(updatedUsers));
        setUser(userToUpdate);
    };

    const saveModal = () => {
        if (!user || !editingField) return;

        const updatedUsers = JSON.parse(localStorage.getItem("myProject_users") || "[]") as User[];
        const userIndex = updatedUsers.findIndex(u => u.id === user.id);
        if (userIndex === -1) return;

        const userToUpdate = { ...updatedUsers[userIndex] };
        if (!userToUpdate.statistics) userToUpdate.statistics = {};
        const stat = userToUpdate.statistics;

        if (isArrayField(editingField)) {
            const newValue = Number(formValue);
            if (isNaN(newValue) || newValue <= 0) {
                alert('Количество должно быть положительным числом');
                return;
            }

            const entry = { game: formLabel.trim(), value: newValue };

            if (modalMode === 'add') {
                stat[editingField] = [...(stat[editingField] || []), entry];
            } else if (modalMode === 'edit' && editingIndex !== null) {
                stat[editingField] = [
                    ...(stat[editingField] || [])
                ];
                stat[editingField]![editingIndex] = entry;
            }

        } else if (isNumberField(editingField)) {
            const newValue = Number(formValue);
            if (isNaN(newValue) || newValue < 0) {
                alert('Введите корректное число');
                return;
            }

            stat[editingField] = modalMode === 'add'
                ? (stat[editingField] ?? 0) + newValue
                : newValue;
        } else if (isStringArrayField(editingField)) {
            const trimmed = formValue.trim();
            if (!trimmed) {
                alert('Введите название игры');
                return;
            }

            if (modalMode === 'add') {
                stat[editingField] = [...(stat[editingField] || []), trimmed];
            } else if (modalMode === 'edit' && editingIndex !== null) {
                const currentArray = stat[editingField] || [];
                currentArray[editingIndex] = trimmed;
                stat[editingField] = currentArray;
            }
        }

        updatedUsers[userIndex] = userToUpdate;
        localStorage.setItem("myProject_users", JSON.stringify(updatedUsers));
        setUser(userToUpdate);
        setModalOpen(false);
    };


    if (!user) return <div>Пользователь не найден 😢</div>;

    const stat = user.statistics || {};

    const sumValues = (arr?: { game: string; value: number }[]) =>
        arr ? arr.reduce((acc, cur) => acc + cur.value, 0) : 0;

    return (
        <>
            <Header />
            <Title title={user.name} />
            <div className='content'>
                <Button
                    type="edit"
                    title="Назад"
                    onClick={() => navigate(`/player-info/${user.id}`)}
                    isActive={false}
                />

                <UserCard
                    photo={user.photo}
                    name={user.name}
                    surname={user.surname}
                    email={user.email}
                    dateOfBirth={user.dateOfBirth}
                />

                <div className={styles.stat_container}>
                    <h2>Статистика</h2>
                    <div className={styles.statCardsContainer}>
                        {/* Голы */}
                        <StatCard
                            title="Голы"
                            total={sumValues(stat.goals)}
                            items={stat?.goals?.map(g => ({ label: g.game, value: g.value })) ?? []}
                            onAdd={() => openAddModal('goals')}
                            addLabel="Добавить гол"
                            onEdit={(index) => openEditModal('goals', index)}
                            onDelete={(index) => deleteItem('goals', index)}
                        />
                        {/* Голевые передачи */}
                        <StatCard
                            title="Голевые передачи"
                            total={sumValues(stat.assists)}
                            items={stat?.assists?.map(a => ({ label: a.game, value: a.value })) ?? []}
                            onAdd={() => openAddModal('assists')}
                            addLabel="Добавить передачу"
                            onEdit={(index) => openEditModal('assists', index)}
                            onDelete={(index) => deleteItem('assists', index)}
                        />
                        {/* Карточки */}
                        <StatCard
                            title="Карточки"
                            total={(stat.redCards ?? 0) + (stat.yellowCards ?? 0)}
                            items={[
                                { label: 'Красные', value: stat.redCards ?? 0 },
                                { label: 'Жёлтые', value: stat.yellowCards ?? 0 }
                            ]}
                            showControls={true}
                            showValue={true}
                            onEdit={(index) => {
                                if (index === 0) openEditModal('redCards', 0);
                                else if (index === 1) openEditModal('yellowCards', 0);
                            }}
                            onDelete={(index) => {
                                if (index === 0) deleteItem('redCards');
                                else if (index === 1) deleteItem('yellowCards');
                            }}
                        />

                        {/* Сыгранные матчи */}
                        <StatCard
                            title="Сыгранные матчи"
                            total={stat.games?.length ?? 0}
                            items={stat.games?.map((game) => ({ label: game })) ?? []}
                            onAdd={() => openAddModal('games')}
                            addLabel="Добавить матч"
                            showValue={false}
                            onEdit={(index) => openEditModal('games', index)}
                            onDelete={(index) => deleteItem('games', index)}
                        />
                    </div>
                </div>

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={modalMode === 'add' ? 'Добавить запись' : 'Редактировать запись'}
                >
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            saveModal();
                        }}
                    >
                        {editingField === 'games' && (
                            <label>
                                Название матча:<br />
                                <input
                                    type="text"
                                    value={formValue}
                                    onChange={e => setFormValue(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </label>
                        )}

                        {(editingField === 'goals' || editingField === 'assists' || editingField === 'missedBalls') && (
                            <>
                                <label>
                                    Игра:<br />
                                    <input
                                        type="text"
                                        value={formLabel}
                                        onChange={e => setFormLabel(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </label>
                                <br />
                                <label>
                                    Количество:<br />
                                    <input
                                        type="number"
                                        min={1}
                                        value={formValue}
                                        onChange={e => setFormValue(e.target.value)}
                                        required
                                    />
                                </label>
                            </>
                        )}

                        {(editingField === 'redCards' || editingField === 'yellowCards') && (
                            <label>
                                Количество:<br />
                                <input
                                    type="number"
                                    min={0}
                                    value={formValue}
                                    onChange={e => setFormValue(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </label>
                        )}

                        <div className={styles.buttonRow}>
                            <button type="submit">Сохранить</button>
                            <button type="button" onClick={() => setModalOpen(false)}>Отмена</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    );
};

export default PlayerStat;
