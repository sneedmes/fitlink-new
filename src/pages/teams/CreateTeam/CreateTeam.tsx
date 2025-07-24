import React, { useEffect, useState } from 'react';
import Header from "../../../components/Header/Header";
import Title from "../../../components/Title/Title";
import { Button } from "../../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import style from "./CreateTeam.module.css";
import { User, TeamType } from "../../../types/types";

const CreateTeam = () => {
    const navigate = useNavigate();

    const [teamName, setTeamName] = useState('');
    const [memberInput, setMemberInput] = useState('');
    const [logoData, setLogoData] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const users: User[] = JSON.parse(localStorage.getItem('myProject_users') || '[]');
        const current: User = JSON.parse(localStorage.getItem('myProject_currentUser') || '{}');

        const filtered = users.filter((user: User) =>
            user.id !== current.id && (!user.team || user.team.length === 0)
        );

        setCurrentUser(current);
        setAllUsers(filtered);
        setFilteredUsers(filtered);
    }, []);

    // const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;
    //     const reader = new FileReader();
    //     reader.onload = function (ev) {
    //         if (typeof ev.target?.result === 'string') {
    //             setLogoData(ev.target.result);
    //         }
    //     };
    //     reader.readAsDataURL(file);
    // };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setMemberInput(value);

        const filtered = allUsers.filter(user =>
            `${user.name} ${user.surname}`.toLowerCase().includes(value)
        );
        setFilteredUsers(filtered);
    };

    const handleSelectUser = (user: User) => {
        if (user.id === currentUser?.id) return;

        if (!selectedMembers.find(m => m.id === user.id)) {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const handleRemoveMember = (id: number) => {
        setSelectedMembers(prev => prev.filter(user => user.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !teamName.trim()) return;

        const newTeamId = Date.now();

        const newTeam: TeamType = {
            id: newTeamId,
            userId: currentUser.id,
            name: teamName,
            img: logoData || undefined,
            members: [currentUser, ...selectedMembers],
        };

        const storedTeams: TeamType[] = JSON.parse(localStorage.getItem('myProject_teams') || '[]');
        localStorage.setItem('myProject_teams', JSON.stringify([newTeam, ...storedTeams]));

        const allUsersRaw: User[] = JSON.parse(localStorage.getItem('myProject_users') || '[]');

        const newUpdatedUsers: User[] = allUsersRaw.map(user => {
            if (user.id === currentUser.id || selectedMembers.find(m => m.id === user.id)) {
                return {
                    ...user,
                    team: user.team ? [...user.team, newTeam] : [newTeam],
                };
            }
            return user;
        });

        localStorage.setItem('myProject_users', JSON.stringify(newUpdatedUsers));
        localStorage.setItem('myProject_currentUser', JSON.stringify(
            newUpdatedUsers.find(u => u.id === currentUser.id)
        ));

        navigate('/team');
    };

    return (
        <>
            <Header />
            <Title title={'Создать команду'} />
            <div className='content'>
                <div className={style.create_team_container}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Название команды</label>
                        <input
                            type="text"
                            id="name"
                            name="team_name"
                            value={teamName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)}
                            required
                        />

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

                        {filteredUsers.length > 0 && filteredUsers.length <= 3 && (
                            <ul className={style.search_list}>
                                {filteredUsers.map(user => (
                                    <li key={user.id} onClick={() => handleSelectUser(user)}>
                                        {user.name} {user.surname} ({user.role})
                                    </li>
                                ))}
                            </ul>
                        )}

                        {selectedMembers.length > 0 && (
                            <div className={style.preview_members}>
                                <h4>Выбранные участники:</h4>
                                <ul>
                                    {selectedMembers.map(user => (
                                        <li key={user.id} className={style.member_chip}>
                                            <span>{user.name} {user.surname} ({user.role})</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(user.id)}
                                                className={style.remove_button}>
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/*<label htmlFor="logo" className={style.load_img}>*/}
                        {/*    <h5>Загрузить логотип</h5>*/}
                        {/*</label>*/}
                        {/*<input*/}
                        {/*    className={style.img_input}*/}
                        {/*    type="file"*/}
                        {/*    id="logo"*/}
                        {/*    onChange={handleLogoChange}*/}
                        {/*/>*/}

                        {/*{logoData && (*/}
                        {/*    <div className={style.logo_preview}>*/}
                        {/*        <p>Превью логотипа:</p>*/}
                        {/*        <img src={logoData} alt="Logo preview" className={style.logo_image} />*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        <Button
                            type="active"
                            title={'Создать команду'}
                            isActive={true}
                            onClick={() => null}
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateTeam;
