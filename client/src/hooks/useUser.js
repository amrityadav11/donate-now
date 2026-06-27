import { useState, useCallback } from 'react';
import { userService } from '../services/userService';

export const useUser = () => {
    const [user, setUser] = useState(() => userService.getCurrentUser());

    const refresh = useCallback(() => {
        setUser(userService.getCurrentUser());
    }, []);

    const logout = useCallback(() => {
        userService.logout();
        setUser(null);
    }, []);

    return { user, isLoggedIn: !!user, refresh, logout };
};
