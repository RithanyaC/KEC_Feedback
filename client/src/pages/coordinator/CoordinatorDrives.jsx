import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Users, Calendar, Building, Check, Search } from 'lucide-react';

const CoordinatorDrives = () => {
    const [drives, setDrives] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStudentModal, setShowStudentModal] = useState({ show: false, driveId: null });
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Create Form State
    const [newDrive, setNewDrive] = useState({ companyName: '', date: '', department: 'CSE' }); // Default Dept placeholder

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const { data } = await api.get('/drive/department');
            setDrives(data);
        } catch (error) {
            console.error("Failed to fetch drives", error);
        }
    };

    const handleCreateDrive = async (e) => {
        e.preventDefault();
        try {
            await api.post('/drive/create', newDrive);
            setShowCreateModal(false);
            fetchDrives();
            alert("Drive created successfully!");
        } catch (error) {
            alert("Failed to create drive");
        }
    };

    const openStudentModal = async (driveId, dept) => {
        setShowStudentModal({ show: true, driveId });
        try {
            // Pass driveId to fetch pre-existing eligibility
            const { data } = await api.get(`/drive/students/${dept}?driveId=${driveId}`);
            setStudents(data);

            // Pre-select students who are already eligible
            const preSelected = data.filter(s => s.isEligible).map(s => s.id);
            setSelectedStudents(preSelected);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStudent = (id) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const submitStudents = async () => {
        try {
            await api.post(`/drive/${showStudentModal.driveId}/add-students`, {
                studentIds: selectedStudents
            });
            alert('Students added successfully!');
            setShowStudentModal({ show: false, driveId: null });
            fetchDrives();
        } catch (error) {
            alert('Failed to add students');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Placement Drives</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Drive
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map(drive => (
                    <div key={drive.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Building className="w-5 h-5 mr-2 text-indigo-500" />
                                    {drive.companyName}
                                </h3>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(drive.date).toLocaleDateString()}
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded">
                                {drive._count?.eligibleStudents || 0} Eligible
                            </span>
                        </div>
                        <button
                            onClick={() => openStudentModal(drive.id, drive.department)}
                            className="w-full mt-4 flex items-center justify-center py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Manage Students
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Drive Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Drive</h2>
                        <form onSubmit={handleCreateDrive} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name</label>
                                <input className="w-full border rounded p-2" required
                                    value={newDrive.companyName} onChange={e => setNewDrive({ ...newDrive, companyName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input type="date" className="w-full border rounded p-2" required
                                    value={newDrive.date} onChange={e => setNewDrive({ ...newDrive, date: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select className="w-full border rounded p-2"
                                    value={newDrive.department} onChange={e => setNewDrive({ ...newDrive, department: e.target.value })}>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Students Modal */}
            {showStudentModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl h-[80vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Select Eligible Students</h2>

                        <div className="flex-1 overflow-y-auto border rounded-lg p-2 space-y-2">
                            {students.length === 0 ? <p className="text-center text-gray-500 py-4">No students found in this department.</p> : students.map(student => (
                                <div key={student.id}
                                    onClick={() => toggleStudent(student.id)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${selectedStudents.includes(student.id) ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${selectedStudents.includes(student.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}>
                                        {selectedStudents.includes(student.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{student.name}</p>
                                        <p className="text-sm text-gray-500">{student.rollNumber} | {student.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 mt-2 border-t flex justify-between items-center">
                            <span className="text-sm text-gray-600">{selectedStudents.length} students selected</span>
                            <div className="flex gap-3">
                                <button onClick={() => setShowStudentModal({ show: false, driveId: null })} className="px-4 py-2 border rounded">Cancel</button>
                                <button onClick={submitStudents} className="px-4 py-2 bg-indigo-600 text-white rounded">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinatorDrives;
