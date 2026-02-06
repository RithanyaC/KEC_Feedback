import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, GraduationCap, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rollNumber: '',
        department: '',
        semester: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                rollNumber: formData.rollNumber,
                department: formData.department,
                semester: formData.semester
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex">
                {/* Left Side - Image/Branding */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-8 backdrop-blur-sm">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Join the Placement Portal</h2>
                        <p className="text-indigo-100 leading-relaxed">
                            Share your interview experiences, gain insights from seniors, and help your juniors succeed. Together we grow.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm text-indigo-200">Already have an account?</p>
                        <Link to="/login" className="flex items-center text-white font-medium hover:text-indigo-100 transition-colors mt-2">
                            Sign In <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/30 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-700/30 blur-3xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-screen">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">College Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="student@college.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Roll Number</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        name="rollNumber"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="12345"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Semester</label>
                                <select
                                    name="semester"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                    value={formData.semester}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <select
                                name="department"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg mt-6"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="md:hidden mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 font-medium">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
