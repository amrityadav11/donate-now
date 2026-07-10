import { Navigate, useLocation } from 'react-router-dom';
import { userService } from '../services/userService';

/**
 * Guards routes that require a logged-in user (not admin).
 * Redirects to home and opens auth modal via state if not logged in.
 */
const UserProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isLoggedIn = userService.isLoggedIn();

    if (!isLoggedIn) {
        // Pass intended destination so login modal can redirect back
        return <Navigate to="/" state={{ openAuth: true, from: location.pathname }} replace />;
    }

    return children;
};

export default UserProtectedRoute;
