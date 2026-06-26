import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { formatCurrency, formatDate } from '../utils/helpers';
import { FiPrinter, FiArrowLeft, FiCheckCircle, FiDownload } from 'react-icons/fi';
import Loading from '../components/Loading';
import SEO from '../components/SEO';

const DonationReceiptPage = () => {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const printRef = useRef(null);

    useEffect(() => {
        fetchReceipt();
    }, [id]);

    const fetchReceipt = async () => {
        try {
            const data = await donationService.getDonationReceipt(id);
            setDonation(data.donation || data);
        } catch (err) {
            // Fallback: try getting the donation directly
            try {
                const data = await donationService.getDonation(id);
                setDonation(data.donation);
            } catch {
                setError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <Loading fullScreen />;

    if (error || !donation) {
        return (
            <div className="section-container section-padding text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Receipt not found.</p>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        );
    }

    return (
        <>
            <SEO title="Donation Receipt" />

            {/* Print styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-content, #receipt-content * { visibility: visible; }
                    #receipt-content { position: fixed; top: 0; left: 0; width: 100%; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="section-container section-padding">
                <div className="max-w-2xl mx-auto">
                    {/* Actions - hidden on print */}
                    <div className="flex items-center justify-between mb-6 no-print">
                        <Link
                            to={`/payment/success?donation=${id}`}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                        >
                            <FiArrowLeft size={16} />
                            Back
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="btn-primary flex items-center gap-2"
                        >
                            <FiPrinter size={16} />
                            Print / Save as PDF
                        </button>
                    </div>

                    {/* Receipt Card */}
                    <div id="receipt-content" className="card p-8">
                        {/* Header */}
                        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheckCircle className="text-green-600" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold">Donation Receipt</h1>
                            <p className="text-gray-500 text-sm mt-1">Thank you for your generosity!</p>
                        </div>

                        {/* Receipt Number */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Receipt Number</p>
                            <p className="font-mono font-bold text-lg">
                                {donation.receiptNumber || `RCP-${id?.slice(-8).toUpperCase()}`}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 mb-6">
                            <ReceiptRow label="Donation Date" value={formatDate(donation.createdAt)} />
                            <ReceiptRow
                                label="Donor Name"
                                value={
                                    donation.isAnonymous
                                        ? 'Anonymous Donor'
                                        : donation.donorName || 'Anonymous Donor'
                                }
                            />
                            {donation.donorEmail && (
                                <ReceiptRow label="Email" value={donation.donorEmail} />
                            )}
                            {donation.donorPhone && (
                                <ReceiptRow label="Phone" value={donation.donorPhone} />
                            )}
                            <ReceiptRow label="Campaign" value={donation.campaign?.title || '—'} />
                            <ReceiptRow
                                label="Payment Method"
                                value={donation.paymentMethod || 'Online Payment'}
                            />
                            {donation.paymentId && (
                                <ReceiptRow
                                    label="Transaction ID"
                                    value={<span className="font-mono text-sm">{donation.paymentId}</span>}
                                />
                            )}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <ReceiptRow
                                    label="Amount Donated"
                                    value={
                                        <span className="text-2xl font-bold text-primary-600">
                                            {formatCurrency(donation.amount)}
                                        </span>
                                    }
                                />
                            </div>
                            <ReceiptRow
                                label="Payment Status"
                                value={
                                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-semibold">
                                        {donation.status === 'success' ? 'Successful' : donation.status}
                                    </span>
                                }
                            />
                        </div>

                        {/* Message */}
                        {donation.message && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Message</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{donation.message}"</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500">
                            <p>This receipt is generated automatically and is valid as proof of donation.</p>
                            <p className="mt-1">For tax exemption queries, please contact us via the Contact page.</p>
                        </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 no-print">
                        <Link to="/campaigns" className="btn-secondary text-center">
                            Support More Causes
                        </Link>
                        <Link to="/" className="btn-primary text-center">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

const ReceiptRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:w-1/3">{label}</span>
        <span className="font-medium sm:text-right sm:w-2/3">{value}</span>
    </div>
);

export default DonationReceiptPage;
