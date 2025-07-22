import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import style from "./Teams.module.css";
import { useNavigate } from "react-router-dom";
import { TeamType, User } from "../../types/types";
import { Button } from "../../components/Button/Button";
import {ScheduleModal} from "./ScheduleModal/ScheduleModal";

const Team = () => {
    const navigate = useNavigate();
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const [teams, setTeams] = useState<TeamType[]>(JSON.parse(localStorage.getItem("myProject_teams") || "[]"));
    const [teamId, setTeamId] = useState<number | null>(null);
    const currentTeam = teams.find(team => team.id === teamId);
    const [memberInput, setMemberInput] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [showMenuFor, setShowMenuFor] = useState<number | null>(null);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('myProject_users') || '[]');
        const current = JSON.parse(localStorage.getItem('myProject_currentUser') || '{}');
        const savedTeams: TeamType[] = JSON.parse(localStorage.getItem("myProject_teams") || "[]");
        const userTeams = savedTeams.filter(team =>
            current.team?.some((t: any) => t.id === team.id)
        );

        const filtered = users.filter((user: User) => user.id !== current.id);

        setTeams(userTeams);
        setTeamId(userTeams.length ? userTeams[0].id : null);
        setAllUsers(filtered);
        setFilteredUsers(filtered);
    }, [currentUser.id]);

    if (!currentUser || !currentUser.id) {
        return <p className={style.error}>Данные пользователя недоступны.</p>;
    }

    const handleDeleteTeam = () => {
        if (!teamId) return;

        if (window.confirm(`Удалить команду "${currentTeam?.name}"? Это навсегда!`)) {
            const updatedTeams = teams.filter(team => team.id !== teamId);
            localStorage.setItem("myProject_teams", JSON.stringify(updatedTeams));
            setTeams(updatedTeams);
            setTeamId(updatedTeams.length ? updatedTeams[0].id : null);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setMemberInput(value);

        const memberIds = currentTeam?.members.map(m => m.id) || [];
        const selectedIds = selectedMembers.map(m => m.id);

        const filtered = allUsers.filter(user => {
            const fullName = `${user.name} ${user.surname}`.toLowerCase();
            const isInTeam = memberIds.includes(user.id);
            const isSelected = selectedIds.includes(user.id);
            return fullName.includes(value) && !isInTeam && !isSelected;
        });

        setFilteredUsers(filtered);
    };

    const handleSelectUser = (user: User) => {
        if (user.id === currentUser?.id) return;

        if (!selectedMembers.find(m => m.id === user.id)) {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleRemoveMember = (id: number) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== id));
    };

    const handleAddMembersToTeam = () => {
        if (!teamId || !currentTeam) return;

        const newMembers = selectedMembers.filter(
            sel => !currentTeam.members.some(m => m.id === sel.id)
        );

        if (newMembers.length === 0) return;

        const updatedTeam: TeamType = {
            ...currentTeam,
            members: [...currentTeam.members, ...newMembers],
        };

        const updatedTeams = teams.map(team =>
            team.id === teamId ? updatedTeam : team
        );

        setTeams(updatedTeams);
        localStorage.setItem("myProject_teams", JSON.stringify(updatedTeams));

        let users: User[] = JSON.parse(localStorage.getItem("myProject_users") || "[]");

        users = users.map(user => {
            if (newMembers.some(m => m.id === user.id)) {
                const userTeams = user.team ? [...user.team] : [];
                if (!userTeams.find(t => t.id === updatedTeam.id)) {
                    userTeams.push(updatedTeam);
                }
                return { ...user, team: userTeams };
            }
            return user;
        });

        let updatedCurrentUser = currentUser;
        if (newMembers.some(m => m.id === currentUser.id)) {
            const currentUserTeams = currentUser.team ? [...currentUser.team] : [];
            if (!currentUserTeams.find(t => t.id === updatedTeam.id)) {
                currentUserTeams.push(updatedTeam);
            }
            updatedCurrentUser = { ...currentUser, team: currentUserTeams };
            localStorage.setItem("myProject_currentUser", JSON.stringify(updatedCurrentUser));
        }

        localStorage.setItem("myProject_users", JSON.stringify(users));

        setSelectedMembers([]);
        setMemberInput('');
        setFilteredUsers(allUsers);
    };

    const handleKickUser = (userId: number) => {
        if (!currentTeam || !teamId) return;

        const updatedMembers = currentTeam.members.filter(m => m.id !== userId);
        const updatedTeam = { ...currentTeam, members: updatedMembers };
        const updatedTeams = teams.map(team =>
            team.id === teamId ? updatedTeam : team
        );
        setTeams(updatedTeams);
        localStorage.setItem("myProject_teams", JSON.stringify(updatedTeams));

        let users: User[] = JSON.parse(localStorage.getItem("myProject_users") || "[]");
        users = users.map(u => {
            if (u.id === userId) {
                return {
                    ...u,
                    team: u.team?.filter(t => t.id !== teamId) || []
                };
            }
            return u;
        });
        localStorage.setItem("myProject_users", JSON.stringify(users));
        setShowMenuFor(null);
    };

    const renderMemberCard = (user: User, pathPrefix: string) => (
        <div className={style.card} key={user.id}>
            <div className={style.card_main}>
                <img src={user.photo} alt="" className={style.avatar} />
                <Button
                    type="player"
                    title={`${user.name} ${user.surname}`}
                    onClick={() => navigate(`/${pathPrefix}-info/${user.id}`)}
                    isActive={false}
                />
            </div>
            <div className={style.member_container}>
                <p className={style.label}>{user.role.slice(0, 2)}</p>
                {currentUser.id === currentTeam?.userId && user.id !== currentUser.id && (
                    <div className={style.dropdown_wrapper}>
                        <button className={style.menu_button}
                                onClick={() => setShowMenuFor(showMenuFor === user.id ? null : user.id)}>⋮
                        </button>
                        {showMenuFor === user.id && (
                            <div className={style.dropdown}>
                                <button onClick={() => handleKickUser(user.id)} className={style.remove_option}>Удалить
                                    участника
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <Title title={currentTeam?.name || "Команда"} />
            <div className="content">
                {(teams.length === 0 || !teamId || !currentTeam) ? (
                    <>
                        <h2 className={style.without_team}>У вас пока нет команды. Попросите тренера добавить вас!</h2>
                        {currentUser.role === 'Тренер' && (
                            <Button
                                type={'active'}
                                title={'Создать команду'}
                                onClick={() => navigate('/create-team')}
                                isActive={true}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {teamId && (
                            <>
                                <div className={style.upper}>
                                    <h2>Состав команды</h2>

                                    <Button
                                        type={'edit'}
                                        title={'Расписание'}
                                        onClick={() => setOpen(true)}
                                        isActive={false}
                                    />
                                    <ScheduleModal
                                        isOpen={open}
                                        onClose={() => setOpen(false)}
                                        currentUser={currentUser}
                                        currentTeam={currentTeam}
                                        setTeams={setTeams}
                                    />

                                </div>
                                <div className={style.structure}>
                                    {(() => {
                                        const coaches = currentTeam.members.filter(m => m.role === 'Тренер');
                                        const players = currentTeam.members.filter(m => m.role === 'Спортсмен');

                                        return (
                                            <>
                                                {coaches.length > 0 && (
                                                    <div className={style.coaches}>
                                                        <h4>Тренеры</h4>
                                                        {coaches.map(coach => renderMemberCard(coach, 'coach'))}
                                                    </div>
                                                )}
                                                {players.length > 0 && (
                                                    <div className={style.players}>
                                                        <h4>Спортсмены</h4>
                                                        {players.map(player => renderMemberCard(player, 'player'))}
                                                    </div>
                                                )}
                                                {currentTeam.userId && currentUser.id === currentTeam.userId && (
                                                    <div className={style.search_container}>
                                                        <label htmlFor="addMember">Добавить участников</label>
                                                        <input
                                                            className={style.add_input}
                                                            type="text"
                                                            id="addMember"
                                                            name="addMember"
                                                            placeholder="Поиск по имени"
                                                            value={memberInput}
                                                            onChange={handleSearch}
                                                        />

                                                        {filteredUsers.length > 0 && filteredUsers.length <= 1 && (
                                                            <ul className={style.search_list}>
                                                                {filteredUsers.map(user => (
                                                                    <li key={user.id}
                                                                        onClick={() => handleSelectUser(user)}>
                                                                        {user.name} {user.surname} ({user.role})
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}

                                                        {selectedMembers.length > 0 && (
                                                            <div className={style.preview_members}>
                                                                <h5>Выбранные участники:</h5>
                                                                <ul>
                                                                    {selectedMembers.map(user => (
                                                                        <li key={user.id} className={style.member_chip}>
                                                                            <p>{user.name} {user.surname} ({user.role})</p>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveMember(user.id)}
                                                                                className={style.remove_button}>
                                                                                ✕
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <button
                                                                    onClick={handleAddMembersToTeam}
                                                                    disabled={selectedMembers.length === 0}
                                                                    className={style.add_button}
                                                                >
                                                                    Добавить выбранных участников
                                                                </button>
                                                            </div>
                                                        )}
                                                        <div className={style.delete_team}><Button
                                                            type="edit"
                                                            title="Удалить команду"
                                                            onClick={handleDeleteTeam}
                                                            isActive={true}
                                                        /></div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Team;
