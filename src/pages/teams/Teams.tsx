import React, {useEffect, useState} from 'react';
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import style from "./Teams.module.css";
import {useNavigate} from "react-router-dom";
import {TeamType, User} from "../../types/types";
import {Button} from "../../components/Button/Button";

const Team = () => {
    const navigate = useNavigate();
    const currentUser: User = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");
    const [teams, setTeams] = useState<TeamType[]>([]);
    const [teamId, setTeamId] = useState<number | null>(null);
    const currentTeam = teams.find(team => team.id === teamId);

    useEffect(() => {
        const savedTeams = JSON.parse(localStorage.getItem("myProject_teams") || "[]");
        setTeams(savedTeams);
        if (savedTeams.length) setTeamId(savedTeams[0].id);
    }, []);

    if (!currentUser || !currentUser.id) {
        return <p className={style.error}>Данные пользователя недоступны.</p>;
    }

    const renderMemberCard = (user: User, pathPrefix: string) => (
        <div className={style.card} key={user.id}>
            <div><img src={user.photo} alt="user" className={style.avatar}/>
                <Button
                    type="player"
                    title={`${user.name} ${user.surname}`}
                    onClick={() => navigate(`/${pathPrefix}/${user.id}`)}
                    isActive={false}
                /></div>
            <p className={style.label}>{user.role.slice(0, 2)}</p>
        </div>
    );

    const handleDeleteTeam = () => {
        if (!teamId) return;

        if (window.confirm(`Удалить команду "${currentTeam?.name}"? Это навсегда!`)) {
            const updatedTeams = teams.filter(team => team.id !== teamId);
            localStorage.setItem("myProject_teams", JSON.stringify(updatedTeams));
            setTeams(updatedTeams);
            setTeamId(updatedTeams.length ? updatedTeams[0].id : null); // ⬅️ вот это важно!
        }
    };

    return (
        <>
            <Header/>
            <Title title={currentTeam?.name || "Команда"}/>
            <div className="content">
                {teams.length === 0 || !currentTeam ? (
                    <>
                        <h2 style={{marginBottom: 30}}>У вас пока нет команды</h2>
                        {currentUser.role === 'Тренер' ? (
                                <Button
                                    type={'active'}
                                    title={'Создать команду'}
                                    onClick={() => navigate('/create-team')}
                                    isActive={true}
                                />
                            )
                            :
                            <select
                                value={teamId ?? ""}
                                onChange={e => {
                                    const value = e.target.value;
                                    setTeamId(value === "" ? null : Number(value));
                                }}
                            >
                                <option value="">Выберите команду</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>}
                    </>
                ) : (
                    <>
                        {teamId && (
                            <>
                                <h2>Состав команды</h2>
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
                                                    <Button
                                                        type="edit"
                                                        title="Удалить команду"
                                                        onClick={handleDeleteTeam}
                                                        isActive={true}
                                                    />
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
