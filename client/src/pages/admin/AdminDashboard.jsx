import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, FileText, CheckCircle, XCircle, UserPlus, BookOpen } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalFeedbacks: 0,
        approvedFeedbacks: 0,
        pendingFeedbacks: 0,
        rejectedFeedbacks: 0,
        totalStudents: 0,
        totalCoordinators: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Feedbacks" value={stats.totalFeedbacks} icon={FileText} color="bg-blue-500" />
                <StatCard title="Approved" value={stats.approvedFeedbacks} icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Pending Review" value={stats.pendingFeedbacks} icon={FileText} color="bg-yellow-500" />
                <StatCard title="Rejected" value={stats.rejectedFeedbacks} icon={XCircle} color="bg-red-500" />
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="bg-indigo-500" />
                <StatCard title="Coordinators" value={stats.totalCoordinators} icon={UserPlus} color="bg-purple-500" />
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg mt-8">
                <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
                <p className="opacity-90">
                    Monitor placement activities, manage coordinators, and oversee the feedback process efficiently.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;
