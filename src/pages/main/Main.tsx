import React from 'react';
import style from './Main.module.css'
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import ItemLink from "../../assets/materials/main-item.jpg"
import ItemCode from "../../assets/materials/main-code.png"
import ItemCoach from "../../assets/materials/main-coach.jpg"
import ItemPlayer from "../../assets/materials/main-player.png"

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

            </div>
        </>
    );
};