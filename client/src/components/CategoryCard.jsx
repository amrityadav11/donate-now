import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    return (
        <Link
            to={`/categories/${category.slug}`}
            className="card p-6 hover:scale-105 transition-transform duration-300 text-center group"
        >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                {category.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {category.description}
            </p>
            <p className="text-primary-600 font-semibold">
                {category.campaignCount} Campaign{category.campaignCount !== 1 ? 's' : ''}
            </p>
        </Link>
    );
};

export default CategoryCard;
