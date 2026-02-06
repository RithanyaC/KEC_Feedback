import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await api.get('/admin/admin/all');
                setFeedbacks(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFeedbacks();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">All Feedback Submissions</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Student</th>
                            <th className="px-6 py-4 font-medium">Company</th>
                            <th className="px-6 py-4 font-medium">Round</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Experience</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {feedbacks.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{item.student.name}</div>
                                    <div className="text-xs text-gray-500">{item.student.rollNumber} | {item.student.department}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{item.companyName}</td>
                                <td className="px-6 py-4 text-gray-600">{item.roundType}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="w-48 truncate text-gray-500 text-sm" title={item.experience}>{item.experience}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {feedbacks.length === 0 && <div className="p-8 text-center text-gray-500">No feedbacks found.</div>}
            </div>
        </div>
    );
};

export default AdminFeedbacks;
