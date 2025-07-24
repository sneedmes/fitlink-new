import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {User} from "../types/types";

export function useUserFromStorage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUsers = localStorage.getItem("myProject_users");
        if (storedUsers) {
            const users: User[] = JSON.parse(storedUsers);
            const foundUser = users.find(u => u.id === Number(id));
            setUser(foundUser || null);
        }
    }, [id]);

    return [user, setUser] as const;
}
