import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Send, Building2, Layers, BookOpen, Lightbulb, MessageSquare } from 'lucide-react';

const StudentSubmit = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        roundType: '',
        experience: '',
        difficulty: 'Medium',
        tips: '',
        suggestions: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/feedback/submit', formData);
            alert('Feedback submitted successfully! Waiting for approval.');
            navigate('/student/feedbacks');
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Share Interview Experience</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                name="companyName"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g. Google"
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Round Type</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                name="roundType"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g. Technical Round 1"
                                value={formData.roundType}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interview Experience</label>
                    <div className="relative">
                        <textarea
                            name="experience"
                            required
                            rows="6"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none leading-relaxed"
                            placeholder="Describe asked questions, problems, and overall flow..."
                            value={formData.experience}
                            onChange={handleChange}
                        ></textarea>
                        <MessageSquare className="absolute right-3 bottom-3 text-gray-300 w-5 h-5" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <div className="flex gap-4">
                        {['Easy', 'Medium', 'Hard'].map((level) => (
                            <label key={level} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={level}
                                    checked={formData.difficulty === level}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 text-gray-700">{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Tips (Optional)</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                                name="tips"
                                rows="3"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Resources, topics to focus..."
                                value={formData.tips}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions for Juniors (Optional)</label>
                        <div className="relative">
                            <Lightbulb className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                                name="suggestions"
                                rows="3"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="General advice..."
                                value={formData.suggestions}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-70"
                    >
                        <Send className="w-5 h-5 mr-2" />
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentSubmit;
