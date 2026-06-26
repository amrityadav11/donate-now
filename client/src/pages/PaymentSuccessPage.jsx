import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { FiCheckCircle, FiDownload, FiHome } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const donationId = searchParams.get('donation');
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (donationId) {
            fetchDonation();
        }
    }, [donationId]);

    const fetchDonation = async () => {
        try {
            const data = await donationService.getDonation(donationId);
            setDonation(data.donation);
        } catch (error) {
            console.error('Failed to fetch donation:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <>
            <SEO title="Payment Successful" />

            <div className="section-container section-padding">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-green-600 text-6xl" />
                    </div>

                    {/* Success Message */}
                    <h1 className="heading-2 mb-4 text-green-600">Payment Successful!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Thank you for your generous donation. Your support makes a real difference!
                    </p>

                    {/* Donation Details */}
                    {donation && (
                        <div className="card p-8 mb-8 text-left">
                            <h2 className="text-xl font-bold mb-6 text-center">Donation Details</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                    <span className="font-semibold">{donation.paymentId}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                    <span className="font-semibold text-xl text-primary-600">
                                        {formatCurrency(donation.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <span className="text-gray-600 dark:text-gray-400">Campaign:</span>
                                    <span className="font-semibold">{donation.campaign?.title}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                    <span className="font-semibold">{formatDate(donation.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className="font-semibold text-green-600">Success</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn-primary flex items-center justify-center gap-2">
                            <FiHome />
                            Back to Home
                        </Link>
                        {donationId && (
                            <Link
                                to={`/donations/${donationId}/receipt`}
                                className="btn-outline flex items-center justify-center gap-2"
                            >
                                <FiDownload />
                                Download Receipt
                            </Link>
                        )}
                    </div>

                    {/* Additional Info */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                        A confirmation email with your receipt has been sent to your email address.
                    </p>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccessPage;
