import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CoordinatorApproved = () => {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Fetch public feedbacks filtered by this coordinator's department
                const { data } = await api.get(`/feedback/public`, {
                    params: { department: user?.department }
                });
                setFeedbacks(data);
            } catch (error) {
                console.error("Failed to fetch approved feedbacks", error);
            }
        };
        if (user?.department) {
            fetchFeedbacks();
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Approved Feedbacks ({user?.department})</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Company</th>
                            <th className="px-6 py-4 font-medium">Student</th>
                            <th className="px-6 py-4 font-medium">Round</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {feedbacks.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.companyName}</td>
                                <td className="px-6 py-4 text-gray-600">{item.student.name}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                        {item.roundType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {feedbacks.length === 0 && <div className="p-8 text-center text-gray-500">No approved feedbacks yet.</div>}
            </div>
        </div>
    );
};

export default CoordinatorApproved;
