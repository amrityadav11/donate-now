import { useState, useEffect } from 'react';
import { donationService } from '../../services/donationService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loading from '../../components/Loading';
import { FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';

const STATUS_STYLES = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchDonations();
    }, [page, filterStatus]);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 15 };
            if (filterStatus) params.status = filterStatus;
            const data = await donationService.getAllDonations(params);
            setDonations(data.donations);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || data.donations.length);
        } catch (error) {
            console.error('Failed to fetch donations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Donations</h1>
                    <p className="text-sm text-gray-500 mt-1">{total} total records</p>
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">Filter:</span>
                    {['', 'success', 'pending', 'failed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setFilterStatus(s); setPage(1); }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${filterStatus === s
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-8"><Loading /></div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {donations.map((donation) => (
                                        <tr key={donation._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium">
                                                        {donation.isAnonymous ? (
                                                            <span className="text-gray-400 italic">Anonymous</span>
                                                        ) : (
                                                            donation.donorName || 'Anonymous'
                                                        )}
                                                    </p>
                                                    {donation.donorEmail && (
                                                        <p className="text-xs text-gray-500">{donation.donorEmail}</p>
                                                    )}
                                                    {donation.donorPhone && (
                                                        <p className="text-xs text-gray-400">{donation.donorPhone}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm max-w-[200px]">
                                                <p className="truncate">{donation.campaign?.title || '—'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-primary-600 text-sm">
                                                    {formatCurrency(donation.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {donation.paymentId ? donation.paymentId.slice(0, 16) + '...' : '—'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(donation.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[donation.status] || STATUS_STYLES.pending}`}>
                                                    {donation.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {donations.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No donations found{filterStatus ? ` with status "${filterStatus}"` : ''}.
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500">
                                    Page {page} of {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                                                        ? 'bg-primary-600 text-white'
                                                        : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <FiChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDonations;
