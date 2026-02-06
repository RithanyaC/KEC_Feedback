import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { UserPlus, UserX, UserCheck, Shield } from 'lucide-react';

const AdminCoordinators = () => {
    const [coordinators, setCoordinators] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
    const [error, setError] = useState('');

    const fetchCoordinators = async () => {
        try {
            const { data } = await api.get('/admin/coordinators');
            setCoordinators(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCoordinators();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/admin/coordinators', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', department: '' });
            fetchCoordinators();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await api.patch(`/admin/coordinators/${id}`, { isEnabled: !currentStatus });
            fetchCoordinators();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Placement Coordinators</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Coordinator
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Department</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coordinators.map((coord) => (
                            <tr key={coord.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{coord.name}</td>
                                <td className="px-6 py-4 text-gray-600">{coord.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                        {coord.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${coord.isEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coord.isEnabled ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(coord.id, coord.isEnabled)}
                                        className={`flex items-center text-sm font-medium ${coord.isEnabled ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                                    >
                                        {coord.isEnabled ? <UserX className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                                        {coord.isEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Coordinator</h2>
                        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                className="w-full border p-2 rounded-lg"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required
                            />
                            <input
                                placeholder="Email"
                                className="w-full border p-2 rounded-lg"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required type="email"
                            />
                            <input
                                placeholder="Password"
                                className="w-full border p-2 rounded-lg"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required type="password"
                            />
                            <select
                                required
                                className="w-full border p-2 rounded-lg bg-white"
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoordinators;
