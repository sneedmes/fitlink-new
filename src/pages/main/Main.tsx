import React from 'react';
import style from './Main.module.css'
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import ItemLink from "../../assets/materials/main-item.jpg"
import ItemCode from "../../assets/materials/main-code.png"
import ItemCoach from "../../assets/materials/main-coach.jpg"
import ItemPlayer from "../../assets/materials/main-player.png"
import {DayData, EventsTypes, TeamType, User, WorkoutTypes} from "../../types/types";
import {Button} from "../../components/Button/Button";
import defaultPhoto from "../../assets/default-profile-photo.png";

export const Main = () => {
    const about = [
        {
            title: 'FitLink – спортивная экосистема будущего',
            description: 'Цифровая тренировочная экосистема для команд и спортсменов: инструменты для тренеров, персонализированные планы и улучшенное командное взаимодействие.',
            img: ItemLink
        },
        {
            title: 'Немного о разработчиках',
            description: 'Мы — команда, влюблённая в спорт и технологии. Объединяем опыт в разработке и спорте, чтобы сделать тренировочный процесс удобнее и эффективнее.\n' +
                '\n' +
                '💡 Сердце проекта — Сусанна Даллакян (@sneedme, dallaqyan0610@gmail.com).\n' +
                '\n' +
                '🧭 Павел — организатор и менеджер, вдохновляет и не даёт нам сойти с пути.\n' +
                '\n' +
                '🎓 И, конечно, наш наставник — Фатеев Владимир Алексеевич, без которого мы бы шли к цели в разы дольше.\n',
            img: ItemCode
        },
    ]

    const addAll = () => {
        if (
            localStorage.getItem("myProject_users") ||
            localStorage.getItem("myProject_events") ||
            localStorage.getItem("myProject_workouts") ||
            localStorage.getItem("myProject_teams")
        ) return;

        const users: User[] = [];
        const events: EventsTypes[] = [];
        const workouts: WorkoutTypes[] = [];

        const getCurrentWeekSchedule = (): DayData[] => {
            const result: DayData[] = [];
            const today = new Date();

            const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const dateFormatted = `${day}.${month}`;

                // Делаем метку дня недели по текущему дню (0=Вс)
                const label = weekdays[date.getDay()];

                result.push({
                    label,
                    date: dateFormatted,
                    time: i % 2 === 0 ? "18:00" : "19:00",
                });
            }

            return result;
        };

        const teamId = 1;
        const team: TeamType = {
            userId: 1,
            id: teamId,
            name: "ФитЛинк Юнайтед",
            img: defaultPhoto,
            schedule: getCurrentWeekSchedule(),
            members: [],
            requests: []
        };

        // Женские имена и фамилии для 2 тренеров + 15 спортсменок
        const realUsersData = [
            { name: "Анна", surname: "Тренерова", role: "Тренер" },
            { name: "Екатерина", surname: "Кириллова", role: "Тренер" },

            { name: "Мария", surname: "Иванова", role: "Спортсмен" },
            { name: "Ольга", surname: "Васильева", role: "Спортсмен" },
            { name: "Наталья", surname: "Новикова", role: "Спортсмен" },
            { name: "Татьяна", surname: "Соколова", role: "Спортсмен" },
            { name: "Ирина", surname: "Макарова", role: "Спортсмен" },
            { name: "Елена", surname: "Федорова", role: "Спортсмен" },
            { name: "Анастасия", surname: "Михайлова", role: "Спортсмен" },
            { name: "Юлия", surname: "Лебедева", role: "Спортсмен" },
            { name: "Виктория", surname: "Орлова", role: "Спортсмен" },
            { name: "Светлана", surname: "Зайцева", role: "Спортсмен" },
            { name: "Дарья", surname: "Сергева", role: "Спортсмен" },
            { name: "Ксения", surname: "Волкова", role: "Спортсмен" },
            { name: "Полина", surname: "Николаева", role: "Спортсмен" },
            { name: "Евгения", surname: "Морозова", role: "Спортсмен" },
            { name: "Валерия", surname: "Петрова", role: "Спортсмен" }
        ];

        realUsersData.forEach((data, index) => {
            const id = index + 1;
            const user: User = {
                id,
                name: data.name,
                surname: data.surname,
                photo: defaultPhoto,
                dateOfBirth: "2000-01-01",
                email: `user${id}@mail.ru`,
                password: "123456",
                role: data.role as "Тренер" | "Спортсмен",
                team: [{ ...team, members: [] }],
                statistics: {},
                events: [],
                workouts: []
            };
            users.push(user);
            team.members.push(user);
        });

        // 3 общих события (созданы тренерами)
        for (let i = 1; i <= 3; i++) {
            const event: EventsTypes = {
                userId: i <= 2 ? i : 1,
                id: i,
                title: `Общее событие ${i}`,
                desc: `Описание общего события ${i}`,
                time: "18:00",
                date: `2025-08-0${i}`,
                members: users.length,
                joinedUsers: users.map(u => u.id),
                isPrivate: false
            };
            events.push(event);
        }

        // 2 общие тренировки (созданы тренерами)
        for (let i = 1; i <= 2; i++) {
            const workout: WorkoutTypes = {
                userId: i <= 2 ? i : 1,
                id: i,
                title: `Общая тренировка ${i}`,
                isPrivate: false,
                items: [
                    { exercise: "Бег", image: "" },
                    { exercise: "Пресс", image: "" }
                ]
            };
            workouts.push(workout);
        }

        users.forEach(user => {
            user.events = [...events];
            user.workouts = [...workouts];
        });

        localStorage.setItem("myProject_users", JSON.stringify(users));
        localStorage.setItem("myProject_events", JSON.stringify(events));
        localStorage.setItem("myProject_workouts", JSON.stringify(workouts));
        localStorage.setItem("myProject_teams", JSON.stringify([team]));
    };


    return (
        <>
            <Header/>
            <Title title={'Главная'}/>

            <div className='content'>
                <div className={`${style.info_main}`}>
                    {about.slice(0, 1).map((info) => (
                        <div className={style.main_container}>
                            <div className={style.main_text}>
                                <h1>{info.title}</h1>
                                <h3>{info.description}</h3>
                            </div>
                            <img src={info.img} alt="" style={{width: 200, height: 200}}/>
                        </div>

                    ))}
                </div>

                <div className={style.info_developers}>
                    {about.slice(1, 2).map((info) => (
                        <div className={style.main_container}>
                            <div className={style.main_text}>
                                <h1>{info.title}</h1>
                                <h3>{info.description}</h3>
                            </div>
                            <img src={info.img} alt=""/>
                        </div>
                    ))}
                </div>


                <div className={`${style.info_coach}`}>
                    <div className={style.main_container}>
                        <div className={style.main_text}>
                            <h1>Что получит тренер?</h1>
                            <h3>
                                <ul>
                                    <li>Возможность отслеживать и изменять статистику спортсмена</li>
                                    <li>Тактическую доску для моделирования</li>
                                    <li>Создание тренировок для себя и для команды</li>
                                    <li>Создание мероприятий для команды и для спортивного сообщества</li>
                                </ul>
                            </h3>
                        </div>
                        <img src={ItemCoach} alt=""/>
                    </div>
                </div>

                <div className={`${style.info_athlete}`}>
                    <div className={style.main_container}>
                        <div className={style.main_text}>
                            <h1>Что получит спортсмен?</h1>
                            <h3>
                                <ul>
                                    <li>Создание индивидуальных тренировок</li>
                                    <li>Отслеживание своей статистки и своих достижений</li>
                                    <li>Расписание тренировок на неделю</li>
                                    <li>Создание мероприятий для команды и для спортивного сообщества</li>
                                </ul>
                            </h3>
                        </div>
                        <img src={ItemPlayer} alt=""/></div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
                    <Button type={'active'} onClick={() => addAll()} isActive={true}
                            title={'Начать тестовую программу'}/>
                    <Button type={'player'} onClick={() => localStorage.clear()} isActive={true}
                            title={'Очистить localstorage'}/>
                </div>
            </div>
        </>
    );
};