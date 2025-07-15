import {createContext, useContext, useState, ReactNode, useEffect} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const currentUser = localStorage.getItem("myProject_currentUser");
        setIsAuthenticated(!!currentUser); // Устанавливаем true, если пользователь авторизован
    }, []);

    const login = (user: any) => {
        localStorage.setItem("myProject_currentUser", JSON.stringify(user)); // Сохраняем пользователя в localStorage
        setIsAuthenticated(true); // Устанавливаем состояние авторизации
    };

    const logout = () => {
        localStorage.removeItem("myProject_currentUser"); // Удаляем данные пользователя
        setIsAuthenticated(false); // Сбрасываем авторизацию
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
