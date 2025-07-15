export interface User {
    id: number; // Уникальный ID пользователя
    name: string; // Имя пользователя
    surname: string; // Фамилия пользователя
    fatherName?: string, // Отчество пользователя
    photo: string; // URL или путь к фото
    dateOfBirth: string; // Дата рождения
    email: string; // Почта пользователя
    role: 'Тренер' | 'Спортсмен'; // Роль пользователя
    team?: Team // Команда пользователя
    statistics?: Statistic[] // Статистика пользователя
    events?: EventsTypes[] // Созданные события
    workouts?: WorkoutTypes[];
}

export interface Statistic {
    goals: number,
    assists: number,
    redCards: number,
    yellowCards: number,
    missedBalls: number,
    games: number;
    attendance: {
        [date: string]: boolean
    }; // ключ — строка в формате 'YYYY-MM-DD', значение — был ли игрок в этот день
}

export interface EventsTypes {
    userId: number; // ID пользователя, создавшего событие
    id: number; // Уникальный ID события
    title: string; // Название
    desc: string, // Описание
    time: string; // Время
    date: string; // Дата
    members: number; // Количество участников
    joinedUsers: number[]; // массив Id участников
    isPrivate: boolean; // Приватность события
}

export interface WorkoutTypes {
    userId: number; // ID пользователя, создавшего тренировку
    id: number; // Уникальный ID тренировки
    title: string; // Название тренировки
    isPrivate: boolean; // Тренировка для команды или приватная
    items: ExerciseItem[]; // Массив упражнений с картинками
}

export interface ExerciseItem {
    exercise: string; // название упражнения
    image: string; // рисунок упражнения
}

export type Team = {
    id: number; // Уникальный ID команды
    name: string; // Название команды
    img?: string; // Логотип команды
    schedule: {
        label: string
        date: string
        time: string
    }; // Расписание тренировок
    members: User[]; // Массив пользователей в команде
};
