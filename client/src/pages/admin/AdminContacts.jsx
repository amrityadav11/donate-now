import { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { formatDate } from '../../utils/helpers';
import Loading from '../../components/Loading';
import {
    FiMail, FiTrash2, FiEye, FiX, FiCheckCircle,
    FiMessageSquare, FiAlertCircle, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    read: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replying, setReplying] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchContacts();
    }, [page, filterStatus]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 15 };
            if (filterStatus) params.status = filterStatus;
            const data = await contactService.getAllContacts(params);
            setContacts(data.contacts);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const openContact = async (contact) => {
        setSelected(contact);
        setReplyText('');

        // Mark as read if it's new
        if (contact.status === 'new') {
            try {
                await contactService.updateContactStatus(contact._id, { status: 'read' });
                setContacts((prev) =>
                    prev.map((c) => (c._id === contact._id ? { ...c, status: 'read' } : c))
                );
                setSelected((prev) => ({ ...prev, status: 'read' }));
            } catch (err) {
                // non-critical
            }
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            toast.error('Reply message cannot be empty');
            return;
        }
        try {
            setReplying(true);
            await contactService.updateContactStatus(selected._id, {
                status: 'replied',
                replyMessage: replyText.trim(),
            });
            const updated = { ...selected, status: 'replied' };
            setSelected(updated);
            setContacts((prev) =>
                prev.map((c) => (c._id === selected._id ? { ...c, status: 'replied' } : c))
            );
            setReplyText('');
            toast.success('Reply sent successfully');
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setReplying(false);
        }
    };

    const handleStatusChange = async (contactId, newStatus) => {
        try {
            await contactService.updateContactStatus(contactId, { status: newStatus });
            setContacts((prev) =>
                prev.map((c) => (c._id === contactId ? { ...c, status: newStatus } : c))
            );
            if (selected?._id === contactId) {
                setSelected((prev) => ({ ...prev, status: newStatus }));
            }
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (contactId) => {
        try {
            await contactService.deleteContact(contactId);
            setContacts((prev) => prev.filter((c) => c._id !== contactId));
            if (selected?._id === contactId) setSelected(null);
            setShowDeleteConfirm(null);
            toast.success('Contact deleted');
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    if (loading) return <Loading />;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold">Contact Messages</h1>

                {/* Status filter */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Filter:</span>
                    {['', 'new', 'read', 'replied', 'closed'].map((s) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contacts List */}
                <div className="card overflow-hidden">
                    {contacts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FiMail size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No messages found</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {contacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        onClick={() => openContact(contact)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selected?._id === contact._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                            } ${contact.status === 'new' ? 'font-semibold' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {contact.status === 'new' && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                    )}
                                                    <p className="text-sm font-medium truncate">{contact.name}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{contact.subject}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{formatDate(contact.createdAt)}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs rounded-full flex-shrink-0 ${STATUS_STYLES[contact.status]}`}>
                                                {contact.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="p-1 rounded disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FiChevronLeft />
                                    </button>
                                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                                    <button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="p-1 rounded disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <FiChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Detail Panel */}
                {selected ? (
                    <div className="card p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold">{selected.subject}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    From: <span className="font-medium text-gray-700 dark:text-gray-300">{selected.name}</span>
                                    {' · '}{selected.email}
                                    {selected.phone && ` · ${selected.phone}`}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{formatDate(selected.createdAt)}</p>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Status Actions */}
                        <div className="flex flex-wrap gap-2">
                            {['read', 'replied', 'closed'].map((s) => (
                                <button
                                    key={s}
                                    disabled={selected.status === s}
                                    onClick={() => handleStatusChange(selected._id, s)}
                                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${STATUS_STYLES[s]} hover:opacity-80`}
                                >
                                    Mark {s}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowDeleteConfirm(selected._id)}
                                className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 hover:opacity-80 ml-auto"
                            >
                                <FiTrash2 className="inline mr-1" size={12} />
                                Delete
                            </button>
                        </div>

                        {/* Message */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                        </div>

                        {/* Reply Box */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 flex items-center gap-1">
                                <FiMessageSquare size={14} />
                                Reply via Email
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows="4"
                                placeholder="Type your reply here..."
                                className="input-field resize-none"
                            />
                            <button
                                onClick={handleReply}
                                disabled={replying || !replyText.trim()}
                                className="mt-2 btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {replying ? (
                                    <><div className="spinner w-4 h-4 border-2"></div> Sending...</>
                                ) : (
                                    <><FiCheckCircle size={14} /> Send Reply</>
                                )}
                            </button>
                            <p className="text-xs text-gray-400 mt-1">
                                Reply will be sent to {selected.email} and status set to "replied"
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="card p-8 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                        <FiMail size={48} className="opacity-20 mb-3" />
                        <p className="text-sm">Select a message to view details</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="card p-6 max-w-sm w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FiAlertCircle className="text-red-500" size={24} />
                            <h3 className="text-lg font-bold">Delete Message</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this contact message? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContacts;
