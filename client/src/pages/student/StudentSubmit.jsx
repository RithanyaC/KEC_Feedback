import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Send, Building2, Plus, Trash2, BookOpen, Lightbulb, User, Briefcase, DollarSign, Layers, MessageSquare, Star } from 'lucide-react';

const StudentSubmit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [drives, setDrives] = useState([]);

    // Core details
    const [formData, setFormData] = useState({
        companyName: '',
        driveId: '',
        jobRole: '',
        package: '',
        overallDifficulty: 'Medium',
        tips: '',
        suggestions: ''
    });

    // Rounds state
    const [rounds, setRounds] = useState([
        { roundNumber: 1, roundType: '', duration: '', difficulty: 'Medium', questions: '', experience: '' }
    ]);

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await api.get('/drive/my-drives');
            if (response && Array.isArray(response.data)) {
                setDrives(response.data);
            } else {
                setDrives([]);
            }
        } catch (error) {
            console.error(error);
            setDrives([]);
        }
    };

    const handleDriveChange = (e) => {
        const selectedDrive = drives.find(d => d.id === e.target.value);
        if (selectedDrive) {
            setFormData(prev => ({
                ...prev,
                driveId: selectedDrive.id,
                companyName: selectedDrive.companyName
            }));
        } else {
            setFormData(prev => ({ ...prev, driveId: e.target.value, companyName: '' }));
        }
    };

    const handleCoreChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Round Management
    const addRound = () => {
        setRounds([...rounds, {
            roundNumber: rounds.length + 1,
            roundType: '',
            duration: '',
            difficulty: 'Medium',
            questions: '',
            experience: ''
        }]);
    };

    const removeRound = (index) => {
        if (rounds.length === 1) return;
        const newRounds = rounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 }));
        setRounds(newRounds);
    };

    const handleRoundChange = (index, field, value) => {
        const newRounds = [...rounds];
        newRounds[index][field] = value;
        setRounds(newRounds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.companyName) return alert("Select a company.");

        const payload = {
            ...formData,
            rounds: rounds
        };

        setLoading(true);
        try {
            await api.post('/feedback/submit', payload);
            alert('Feedback submitted successfully!');
            navigate('/student/feedbacks');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to submit. Check inputs.';
            alert(`Error: ${msg}`);
            if (error.response?.data?.errors) {
                console.log("Validation Errors:", error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (drives.length === 0) return (
        <div className="max-w-3xl mx-auto text-center py-12">
            <h2 className="text-xl font-bold text-gray-700">No Eligible Drives Found</h2>
            <p className="text-gray-500 mt-2">You can only submit feedback for placement drives you have been marked eligible for.</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Interview Feedback Form</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Company & Role Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                        <Building2 className="w-5 h-5 mr-2" /> Company & Role
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company</label>
                            <select name="driveId" required className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
                                value={formData.driveId} onChange={handleDriveChange}
                            >
                                <option value="">Select Company</option>
                                {drives.map(d => <option key={d.id} value={d.id}>{d.companyName} ({new Date(d.date).toLocaleDateString()})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Job Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input name="jobRole" required placeholder="e.g. SDE-1" className="w-full border p-2 pl-9 rounded focus:ring-2 focus:ring-indigo-500"
                                    value={formData.jobRole} onChange={handleCoreChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Package (CTC)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input name="package" placeholder="e.g. 12 LPA" className="w-full border p-2 pl-9 rounded focus:ring-2 focus:ring-indigo-500"
                                    value={formData.package} onChange={handleCoreChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Overall Difficulty</label>
                            <select name="overallDifficulty" className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500"
                                value={formData.overallDifficulty} onChange={handleCoreChange}>
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Rounds Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Layers className="w-5 h-5 mr-2" /> Interview Rounds
                    </h2>

                    {rounds.map((round, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-700">Round {round.roundNumber}</h3>
                                {rounds.length > 1 && (
                                    <button type="button" onClick={() => removeRound(index)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-sm font-medium display-block mb-1">Round Type</label>
                                    <input required placeholder="e.g. Coding" className="w-full border p-2 rounded"
                                        value={round.roundType} onChange={(e) => handleRoundChange(index, 'roundType', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium display-block mb-1">Duration</label>
                                    <input placeholder="e.g. 60 mins" className="w-full border p-2 rounded"
                                        value={round.duration} onChange={(e) => handleRoundChange(index, 'duration', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium display-block mb-1">Difficulty</label>
                                    <select className="w-full border p-2 rounded"
                                        value={round.difficulty} onChange={(e) => handleRoundChange(index, 'difficulty', e.target.value)}>
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium display-block mb-1">Questions Asked</label>
                                <textarea rows="2" placeholder="List questions..." className="w-full border p-2 rounded resize-none"
                                    value={round.questions} onChange={(e) => handleRoundChange(index, 'questions', e.target.value)} />
                            </div>

                            <div>
                                <label className="text-sm font-medium display-block mb-1">Round Experience</label>
                                <textarea required rows="3" placeholder="Describe the experience..." className="w-full border p-2 rounded resize-none"
                                    value={round.experience} onChange={(e) => handleRoundChange(index, 'experience', e.target.value)} />
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addRound} className="flex items-center text-indigo-600 font-semibold hover:bg-indigo-50 px-4 py-2 rounded-lg transition border border-dashed border-indigo-300 w-full justify-center">
                        <Plus className="w-5 h-5 mr-2" /> Add Another Round
                    </button>
                </div>

                {/* 3. Overall Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-600">
                        <Star className="w-5 h-5 mr-2" /> Overall Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Preparation Tips</label>
                            <textarea name="tips" rows="3" className="w-full border p-2 rounded resize-none"
                                value={formData.tips} onChange={handleCoreChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Suggestions for Juniors</label>
                            <textarea name="suggestions" rows="3" className="w-full border p-2 rounded resize-none"
                                value={formData.suggestions} onChange={handleCoreChange} />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg">
                        {loading ? 'Submitting...' : 'Submit Complete Feedback'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentSubmit;
