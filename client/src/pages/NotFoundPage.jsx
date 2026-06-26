import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import SEO from '../components/SEO';

const NotFoundPage = () => {
    return (
        <>
            <SEO title="Page Not Found" />

            <div className="section-container section-padding text-center">
                <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                <h2 className="heading-2 mb-4">Page Not Found</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <FiHome />
                    Back to Home
                </Link>
            </div>
        </>
    );
};

export default NotFoundPage;
