import style from "./Header.module.css"
import {Button} from "../Button/Button";
import {useNavigate} from 'react-router-dom';
import React from "react";
import logo from '../../assets/logo.png';
import {useAuth} from "../../context/auth-context";

const Header = () => {
    const {logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const currentUser= JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")

    const handleLogout = () => {
        logout(); // Выходим из системы
        navigate("/"); // Перенаправляем на главную
    };

    if (!currentUser || !currentUser.id) {
        return (
            <header className='header'>
                <section className={`${style.container}`}>
                    <div>
                        <img src={logo} alt=""/>
                    </div>
                    <div className={`${style.nav_reg}`}>
                        <span>
                            <Button type={'header'}
                                    title={"Главная"}
                                    onClick={() => navigate('/')}
                                    isActive={false}/>
                        </span>
                        <Button type={'header'}
                                title={"Войти"}
                                onClick={() => navigate('/auth')}
                                isActive={false}/>
                    </div>
                </section>
            </header>
        )
    }

    return (
        <header className='header'>
            <section className={`${style.container}`}>
                <div>
                    <img src={logo} alt=""/>
                </div>
                {(isAuthenticated && currentUser.role === 'Тренер') ?
                    <div className={`${style.nav_coach}`}>
                        <Button type={'header'}
                                title={"События"}
                                onClick={() => navigate('/events')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Доска"}
                                onClick={() => navigate('/tactical-board')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Команда"}
                                onClick={() => navigate('/team')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Тренировки"}
                                onClick={() => navigate('/workouts')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Профиль"}
                                onClick={() => navigate('/profile')}
                                isActive={false}/>
                        <span>
                                    <Button type={'header'}
                                            title={"Выйти"}
                                            onClick={() => handleLogout()}
                                            isActive={false}/>
                                </span>
                    </div>
                    : (isAuthenticated && currentUser.role === 'Спортсмен') &&
                    <div className={`${style.nav_coach}`}>
                        <Button type={'header'}
                                title={"События"}
                                onClick={() => navigate('/events')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Статистика"}
                                onClick={() => navigate(`/player-stat/`)}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Команда"}
                                onClick={() => navigate('/team')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Тренировки"}
                                onClick={() => navigate('/workouts')}
                                isActive={false}/>
                        <Button type={'header'}
                                title={"Профиль"}
                                onClick={() => navigate('/profile')}
                                isActive={false}/>
                        <span>
                                    <Button type={'header'}
                                            title={"Выйти"}
                                            onClick={() => handleLogout()}
                                            isActive={false}/>
                                </span>
                    </div>
                }
            </section>
        </header>
    );
};

export default Header;