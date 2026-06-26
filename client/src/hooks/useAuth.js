import { authService } from '../services/authService';

export const useAuth = () => {
    const isAuthenticated = authService.isAuthenticated();
    const admin = authService.getCurrentAdmin();

    const logout = () => {
        authService.logout();
        window.location.href = '/admin/login';
    };

    return {
        isAuthenticated,
        admin,
        logout,
    };
};
