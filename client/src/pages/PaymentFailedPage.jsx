import { Link } from 'react-router-dom';
import { FiXCircle, FiHome, FiRefreshCw } from 'react-icons/fi';
import SEO from '../components/SEO';

const PaymentFailedPage = () => {
    return (
        <>
            <SEO title="Payment Failed" />

            <div className="section-container section-padding">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Failed Icon */}
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiXCircle className="text-red-600 text-6xl" />
                    </div>

                    {/* Failed Message */}
                    <h1 className="heading-2 mb-4 text-red-600">Payment Failed</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        We're sorry, but your payment could not be processed. Please try again.
                    </p>

                    {/* Reasons */}
                    <div className="card p-8 mb-8 text-left">
                        <h2 className="text-xl font-bold mb-4">Common Reasons for Payment Failure:</h2>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Insufficient funds in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Incorrect card details entered</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Card expired or inactive</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Payment cancelled by you</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>•</span>
                                <span>Technical issue with payment gateway</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.history.back()}
                            className="btn-primary flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw />
                            Try Again
                        </button>
                        <Link to="/" className="btn-outline flex items-center justify-center gap-2">
                            <FiHome />
                            Back to Home
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                        <p>Need help? Contact us at <a href="mailto:support@donation.com" className="text-primary-600 hover:underline">support@donation.com</a></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentFailedPage;
