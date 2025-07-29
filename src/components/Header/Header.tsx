import style from "./Header.module.css";
import {Button} from "../Button/Button";
import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from "react";
import logo from '../../assets/logo.png';
import {useAuth} from "../../context/auth-context";

const Header = () => {
    const {logout, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("myProject_currentUser") || "{}");

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const renderNav = () => {
        if (!currentUser?.id) {
            return (
                <div className={style.nav_reg}>
                    <span>
                        <Button title="Главная" onClick={() => navigate('/')} type='header' isActive={false} />
                    </span>
                    <Button title="Войти" onClick={() => navigate('/auth')} type='header' isActive={false} />
                </div>
            );
        }

        const commonButtons = currentUser.role === 'Тренер' ? (
            <>
                <Button title="События" onClick={() => navigate('/events')} type='header' isActive={false} />
                <Button title="Доска" onClick={() => navigate('/tactical-board')} type='header' isActive={false} />
                <Button title="Команда" onClick={() => navigate('/team')} type='header' isActive={false} />
                <Button title="Тренировки" onClick={() => navigate('/workouts')} type='header' isActive={false} />
                <Button title="Профиль" onClick={() => navigate('/profile')} type='header' isActive={false} />
            </>
        ) : (
            <>
                <Button title="События" onClick={() => navigate('/events')} type='header' isActive={false} />
                <Button title="Статистика" onClick={() => navigate('/statistics')} type='header' isActive={false} />
                <Button title="Команда" onClick={() => navigate('/team')} type='header' isActive={false} />
                <Button title="Тренировки" onClick={() => navigate('/workouts')} type='header' isActive={false} />
                <Button title="Профиль" onClick={() => navigate('/profile')} type='header' isActive={false} />
            </>
        );

        return (
            <div className={style.nav_coach}>
                {commonButtons}
                <span>
                    <Button title="Выйти" onClick={handleLogout} type='header' isActive={false} />
                </span>
            </div>
        );
    };

    return (
        <>
            {isMobile && (
                <div className={style.burger} onClick={() => setMenuOpen(!menuOpen)}>
                    <span style={{ backgroundColor: menuOpen ? 'white' : 'black' }}></span>
                    <span style={{ backgroundColor: menuOpen ? 'white' : 'black' }}></span>
                    <span style={{ backgroundColor: menuOpen ? 'white' : 'black' }}></span>
                </div>
            )}

            <header className={`${style.header} ${isMobile ? (menuOpen ? style.open : style.closed) : ''}`}>
                <section className={style.container}>
                    <div>
                        <img src={logo} alt="logo"/>
                    </div>
                    {renderNav()}
                </section>
            </header>
        </>
    );
};

export default Header;
