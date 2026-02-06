import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Check, X, MessageSquare, AlertCircle } from 'lucide-react';

const CoordinatorDashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);
    const [rejectModal, setRejectModal] = useState({ show: false, id: null });
    const [remarks, setRemarks] = useState('');

    const fetchPending = async () => {
        try {
            const { data } = await api.get('/feedback/coordinator/pending');
            setFeedbacks(data);
        } catch (error) {
            console.error("Failed to fetch pending feedbacks", error);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this feedback?')) return;
        setActionLoading(id);
        try {
            await api.patch(`/feedback/${id}/status`, { status: 'APPROVED' });
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve feedback");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectClick = (id) => {
        setRejectModal({ show: true, id });
        setRemarks('');
    };

    const confirmReject = async (e) => {
        e.preventDefault();
        setActionLoading(rejectModal.id);
        try {
            await api.patch(`/feedback/${rejectModal.id}/status`, { status: 'REJECTED', remarks });
            setFeedbacks(prev => prev.filter(f => f.id !== rejectModal.id));
            setRejectModal({ show: false, id: null });
        } catch (error) {
            console.error("Failed to reject", error);
            alert("Failed to reject feedback");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Pending Reviews</h1>

            <div className="grid grid-cols-1 gap-6">
                {feedbacks.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{item.companyName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded uppercase tracking-wide">
                                        {item.jobRole}
                                    </span>
                                    <span className="text-sm text-gray-500">• {item.overallDifficulty} Overall</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900">{item.student.name}</p>
                                <p className="text-sm text-gray-500">{item.student.rollNumber}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Rounds Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Interview Rounds
                                </h4>
                                {item.rounds && item.rounds.map((round, idx) => (
                                    <div key={idx} className="border-l-2 border-indigo-200 pl-3">
                                        <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                            <span>Round {round.roundNumber}: {round.roundType}</span>
                                            <span>{round.difficulty}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">{round.experience}</p>
                                        {round.questions && (
                                            <p className="text-gray-500 text-xs mt-1 italic">Q: {round.questions}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {(item.tips || item.suggestions) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.tips && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <span className="text-xs font-bold text-blue-700 uppercase block mb-1">Tips</span>
                                            <p className="text-sm text-blue-900">{item.tips}</p>
                                        </div>
                                    )}
                                    {item.suggestions && (
                                        <div className="bg-amber-50 p-3 rounded-lg">
                                            <span className="text-xs font-bold text-amber-700 uppercase block mb-1">Suggestions</span>
                                            <p className="text-sm text-amber-900">{item.suggestions}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleRejectClick(item.id)}
                                disabled={actionLoading === item.id}
                                className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(item.id)}
                                disabled={actionLoading === item.id}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow disabled:opacity-50"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                            </button>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Check className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No pending feedbacks to review.</p>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <AlertCircle className="w-6 h-6" />
                            <h2 className="text-lg font-bold">Reject Feedback</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejection. This will be visible to the admin.
                        </p>
                        <form onSubmit={confirmReject}>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none h-32"
                                placeholder="E.g., Incomplete information, inappropriate language..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                required
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setRejectModal({ show: false, id: null })}
                                    className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinatorDashboard;
