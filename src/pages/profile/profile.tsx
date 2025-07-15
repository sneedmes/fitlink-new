import React, {useState, ChangeEvent, KeyboardEvent} from "react";
import s from "./profile.module.scss";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";

export const Profile = () => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    );
    const [editField, setEditField] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                const photo = reader.result as string;
                const updatedUser = {...currentUser, photo};
                setCurrentUser(updatedUser);
                updateUserInLocalStorage(updatedUser);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const validateField = (field: string, value: string) => {
        if (value.trim() === "") return "Поле не может быть пустым.";
        if (field === "email" && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return "Введите корректный адрес почты.";
        }
        return "";
    };

    const handleFieldChange = (field: string, value: string) => {
        setCurrentUser((prev: any) => ({...prev, [field]: value}));
        const error = validateField(field, value);
        setErrors((prev) => ({...prev, [field]: error}));
    };

    const updateUserInLocalStorage = (updatedUser: any) => {
        const users = JSON.parse(localStorage.getItem("myProject_users") || "[]");
        const updatedUsers = users.map((user: any) =>
            user.id === updatedUser.id ? updatedUser : user
        );
        localStorage.setItem("myProject_users", JSON.stringify(updatedUsers));
        localStorage.setItem("myProject_currentUser", JSON.stringify(updatedUser));
    };

    const handleBlur = (field: string) => {
        if (errors[field]) return;
        updateUserInLocalStorage(currentUser);
        setEditField(null);
    };

    const handleKeyDown = (field: string, event: KeyboardEvent) => {
        if (event.key === "Enter" && !errors[field]) handleBlur(field);
    };

    const handleFocus = (field: string) => {
        if (editField && errors[editField]) return;
        setEditField(field);
    };

    if (!currentUser) {
        return <p className={s.error}>Данные пользователя недоступны.</p>;
    }

    return (
        <>
            <Header/>
            <Title title={'События'}/>
            <div className="content">
                <div className={s.profile}>
                    <h2>Личный кабинет</h2>
                    <div className={s.profileInfo}>
                        <div className={s.avatarContainer}>
                            <img
                                src={currentUser.photo || "/default-avatar.png"}
                                alt="Аватар"
                                className={s.avatar}
                            />
                            <label className={s.changePhotoBtn}>
                                📷
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    hidden
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                        <div className={s.details}>
                            {["lastName", "firstName", "middleName", "email"].map((field) => (
                                <div key={field} className={s.detailItem}>
                                    {editField === field ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={currentUser[field] || ""}
                                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                                onBlur={() => handleBlur(field)}
                                                onKeyDown={(e) => handleKeyDown(field, e)}
                                                className={errors[field] ? s.inputError : ""}
                                            />
                                            {errors[field] && <span className={s.errorText}>{errors[field]}</span>}
                                        </div>
                                    ) : (
                                        <p
                                            onClick={() => handleFocus(field)}
                                            className={s.fieldText}
                                        >
                                            {field === "lastName"
                                                ? `Фамилия: ${currentUser.lastName}`
                                                : field === "firstName"
                                                    ? `Имя: ${currentUser.firstName}`
                                                    : field === "middleName"
                                                        ? `Отчество: ${currentUser.middleName || "Нет данных"}`
                                                        : `Почта: ${currentUser.email}`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
