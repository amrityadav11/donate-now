import { useState, useEffect } from 'react';
import { campaignService } from '../../services/campaignService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
    FiCheckCircle, FiXCircle, FiEye, FiX, FiUser,
    FiMail, FiPhone, FiTarget, FiCalendar, FiClock
} from 'react-icons/fi';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
    const map = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
        active: 'bg-green-100  text-green-800  dark:bg-green-900/40  dark:text-green-300',
        rejected: 'bg-red-100    text-red-800    dark:bg-red-900/40    dark:text-red-300',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

const AdminCampaignRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selected, setSelected] = useState(null);   // detail modal
    const [rejectModal, setRejectModal] = useState(null);   // { id, title }
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => { fetchRequests(); }, [filterStatus]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await campaignService.getCampaignRequests({ status: filterStatus });
            setRequests(data.campaigns);
        } catch {
            toast.error('Failed to load campaign requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Approve and publish this campaign?')) return;
        setActionLoading(true);
        try {
            await campaignService.approveCampaign(id);
            toast.success('Campaign approved and published!');
            setSelected(null);
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to approve');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) { toast.error('Please provide a reason'); return; }
        setActionLoading(true);
        try {
            await campaignService.rejectCampaign(rejectModal.id, rejectReason);
            toast.success('Campaign request rejected');
            setRejectModal(null);
            setRejectReason('');
            setSelected(null);
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Campaign Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Review and approve public campaign submissions
                    </p>
                </div>

                {/* Status filter tabs */}
                <div className="flex gap-2">
                    {['pending', 'active', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filterStatus === s
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase">
                            <tr>
                                <th className="px-5 py-3 text-left">Campaign</th>
                                <th className="px-5 py-3 text-left">Requester</th>
                                <th className="px-5 py-3 text-left">Category</th>
                                <th className="px-5 py-3 text-left">Goal</th>
                                <th className="px-5 py-3 text-left">Submitted</th>
                                <th className="px-5 py-3 text-left">Status</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {requests.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                    <td className="px-5 py-4">
                                        <p className="font-medium line-clamp-1 max-w-[200px]">{req.title}</p>
                                        {req.endDate && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <FiCalendar size={10} /> Ends {formatDate(req.endDate)}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-medium">{req.requestedBy?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{req.requestedBy?.email}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        {req.category?.icon} {req.category?.name}
                                    </td>
                                    <td className="px-5 py-4 text-sm font-medium">
                                        {formatCurrency(req.goalAmount)}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-500">
                                        {formatDate(req.createdAt)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelected(req)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                                                title="View details"
                                            >
                                                <FiEye size={17} />
                                            </button>
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600"
                                                        title="Approve"
                                                    >
                                                        <FiCheckCircle size={17} />
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal({ id: req._id, title: req.title })}
                                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                                                        title="Reject"
                                                    >
                                                        <FiXCircle size={17} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {requests.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <FiClock size={32} className="mx-auto mb-3 opacity-40" />
                            <p>No {filterStatus} requests</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Detail Modal ─────────────────────────────────────────────── */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-bold">Campaign Request Details</h2>
                            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {/* Status + title */}
                            <div className="flex items-start gap-3">
                                <StatusBadge status={selected.status} />
                                <h3 className="text-xl font-bold leading-tight">{selected.title}</h3>
                            </div>

                            {/* Requester */}
                            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 space-y-2">
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Requester</p>
                                {[
                                    [FiUser, selected.requestedBy?.name],
                                    [FiMail, selected.requestedBy?.email],
                                    [FiPhone, selected.requestedBy?.phone ? `+91 ${selected.requestedBy.phone}` : null],
                                ].map(([Icon, val], i) => val && (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <Icon className="text-gray-400 flex-shrink-0" size={14} />
                                        <span>{val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Campaign info */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-0.5">Category</p>
                                    <p className="font-semibold">{selected.category?.icon} {selected.category?.name}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-0.5">Goal Amount</p>
                                    <p className="font-semibold">{formatCurrency(selected.goalAmount)}</p>
                                </div>
                                {selected.endDate && (
                                    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-0.5">End Date</p>
                                        <p className="font-semibold">{formatDate(selected.endDate)}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                                    <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                                    <p className="font-semibold">{formatDate(selected.createdAt)}</p>
                                </div>
                            </div>

                            {/* Short description */}
                            {selected.shortDescription && (
                                <div>
                                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Short Description</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{selected.shortDescription}</p>
                                </div>
                            )}

                            {/* Story */}
                            <div>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">Full Story</p>
                                <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 max-h-48 overflow-y-auto">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{selected.story}</p>
                                </div>
                            </div>

                            {/* Rejection reason (if rejected) */}
                            {selected.status === 'rejected' && selected.rejectionReason && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rejection Reason</p>
                                    <p className="text-sm text-red-700 dark:text-red-300">{selected.rejectionReason}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        {selected.status === 'pending' && (
                            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => { setRejectModal({ id: selected._id, title: selected.title }); }}
                                    className="flex-1 py-3 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FiXCircle size={16} /> Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(selected._id)}
                                    disabled={actionLoading}
                                    className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    <FiCheckCircle size={16} />
                                    {actionLoading ? 'Publishing...' : 'Approve & Publish'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Reject Reason Modal ───────────────────────────────────────── */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <FiXCircle className="text-red-500" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Reject Campaign</h3>
                                <p className="text-xs text-gray-500 line-clamp-1">{rejectModal.title}</p>
                            </div>
                        </div>
                        <label className="block text-sm font-medium mb-2">Reason for rejection <span className="text-red-500">*</span></label>
                        <textarea
                            rows={4}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="e.g. Incomplete information, does not meet guidelines, duplicate campaign..."
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-sm text-gray-600 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleRejectSubmit} disabled={actionLoading}
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-60">
                                {actionLoading ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaignRequests;
