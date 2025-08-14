import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/auth-context";
import Title from "../../components/Title/Title";
import style from './login-register.module.css'
import {Button} from "../../components/Button/Button";
import { Eye, EyeOff } from "lucide-react";
import defaultPhoto from "../../assets/default-profile-photo.png";

export const LoginRegister = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const {login: authenticate} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [role, setRole] = useState<"Тренер" | "Спортсмен">("Спортсмен");

    const handleTabChange = (index: number) => {
        setTabIndex(index);
        setError("");
    };

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            setError("Заполните все поля.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("myProject_users") || "[]");
        const user = users.find(
            (u: any) => u.email === email && u.password === password
        );

        if (!user) {
            setError("Неверная почта или пароль.");
            return;
        }

        authenticate(user);
        navigate("/events");
    };

    const handleRegister = () => {
        if (
            !lastName.trim() ||
            !firstName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !dateOfBirth ||
            !role
        ) {
            setError("Заполните все обязательные поля.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("myProject_users") || "[]");
        if (users.find((u: any) => u.email === email)) {
            setError("Пользователь с такой почтой уже существует.");
            return;
        }

        const newUser = {
            id: Date.now(),
            name: firstName,
            surname: lastName,
            fatherName: fatherName.trim() ? fatherName : undefined,
            photo: defaultPhoto,
            dateOfBirth,
            email,
            password,
            role,
            team: [],
        };

        localStorage.setItem("myProject_users", JSON.stringify([...users, newUser]));
        authenticate(newUser);
        navigate("/events");
    };

    return (
        <>
            {/*<Header/>*/}
            <Title title={'Регистрация'}/>

            <div className='content'>
                <div className={style.login_container}>
                    <div className={style.tabs}>
                        <button className={tabIndex === 0 ? `${style.tab_active}` : `${style.tab_default}`}
                                onClick={() => handleTabChange(0)}>
                            <h3>Войти</h3>
                        </button>
                        <button className={tabIndex === 1 ? `${style.tab_active}` : `${style.tab_default}`}
                                onClick={() => handleTabChange(1)}>
                            <h3>Регистрация</h3>
                        </button>
                    </div>

                    {tabIndex === 0 ? (
                        <div className={style.signin}>
                            {error && <div>{error}</div>}
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="Почта"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <div className={style.input_wrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            position: "absolute",
                                            right: "0.75rem",
                                            top: "40%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>

                                <Button type={'submit'} title={"Войти"} onClick={() => null} isActive={true}/>
                            </form>
                        </div>
                    ) : (
                        <div className={style.signup}>
                            {error && <div>{error}</div>}
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleRegister();
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="Почта"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Имя"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Фамилия"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Отчество (необязательно)"
                                    value={fatherName}
                                    onChange={e => setFatherName(e.target.value)}
                                />
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                />
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value as "Тренер" | "Спортсмен")}
                                >
                                    <option value="Тренер">Тренер</option>
                                    <option value="Спортсмен">Спортсмен</option>
                                </select>

                                <div className={style.input_wrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            position: "absolute",
                                            right: "0.75rem",
                                            top: "40%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                                <Button type={'submit'} title={"Создать аккаунт"} onClick={() => null} isActive={true}/>
                            </form>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        padding: '15px 20px',
                        background: '#f9f9f9',
                        borderRadius: 10,
                        border: '1px solid #ddd',
                        fontSize: 14,
                        lineHeight: '1.5',
                        textAlign: "center",
                    }}
                >
                    <p style={{margin: '8px 0 0'}}>
                        <u>Если вы запустили тестирование, то вот данные для входа:</u><br/>
                        <b>Тренер:</b> user1@mail.ru / 123456<br/>
                        <b>Спортсмен:</b> user3@mail.ru / 123456
                    </p>
                    <p style={{margin: '8px 0 0'}}>
                        Можно также зарегистрироваться и создать новый аккаунт — база пользователей уже есть.
                    </p>
                    <p style={{margin: '8px 0 0'}}>
                        Тактическую доску удобнее открывать с ПК. <br/>
                        При ошибках или вопросах — свяжитесь со мной через соцсети. Приятного пользования! 🙏
                    </p>
                </div>

            </div>
        </>
    );
};
