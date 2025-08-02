import React, {useState, ChangeEvent} from "react";
import style from "./profile.module.css";
import Title from "../../components/Title/Title";
import Toast from "../../components/Toast/Toast";
import {Button} from "../../components/Button/Button";

export const Profile = () => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("myProject_currentUser") || "{}")
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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
        if (field === "mail" && !/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value)) {
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

    const handleSave = () => {
        const hasError = Object.values(errors).some((e) => e);
        if (hasError) {
            setToast({message: "Заполните все поля", type: "error"});
            return;
        }

        updateUserInLocalStorage(currentUser);
        setToast({message: "Профиль успешно сохранён!", type: "success"});

        setTimeout(() => setToast(null), 3000);
    };

    if (!currentUser) {
        return <p className={style.error}>Данные пользователя недоступны.</p>;
    }

    return (
        <>
            {/*<Header/>*/}
            <Title title="Профиль"/>
            <div className="content" style={{position: "relative"}}>

                <div className={style.profile}>
                    <h3>Данные пользователя</h3>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className={style.upper_container}>
                            <div className={style.upper_inputs}>
                                <label htmlFor="name">Имя</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={currentUser.name || ""}
                                    onChange={(e) => handleFieldChange("name", e.target.value)}
                                />

                                <label htmlFor="surname">Фамилия</label>
                                <input
                                    type="text"
                                    id="surname"
                                    name="surname"
                                    value={currentUser.surname || ""}
                                    onChange={(e) => handleFieldChange("surname", e.target.value)}
                                />

                                <label htmlFor="fatherName">Отчество (необязательно)</label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    name="fatherName"
                                    value={currentUser.fatherName || ""}
                                    onChange={(e) => handleFieldChange("fatherName", e.target.value)}
                                />
                            </div>

                            <div>
                                <img
                                    src={currentUser.photo || "/default-avatar.png"}
                                    alt="Аватар"
                                />
                                <label htmlFor="photo-upload" title="Изменить фото">
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        accept="image/png, image/jpeg"
                                        style={{display: 'none'}}
                                        onChange={handlePhotoChange}
                                    />
                                    <h6>Изменить фото</h6>
                                </label>
                            </div>
                        </div>


                        <label htmlFor="dateOfBirth">Дата рождения</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={currentUser.dateOfBirth || ""}
                            onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
                        />

                        <div className={style.form_span}>
                            <div className={style.form_input}>
                                <label htmlFor="mail">Почта</label>
                                <input
                                    type="email"
                                    id="mail"
                                    name="mail"
                                    value={currentUser.email || ""}
                                    onChange={(e) => handleFieldChange("mail", e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={handleSave}
                                title="Сохранить"
                                type="edit"
                                isActive={true}
                            />
                            {toast && <Toast message={toast.message} type={toast.type}/>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
