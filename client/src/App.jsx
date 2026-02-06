import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCoordinators from './pages/admin/AdminCoordinators';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';

import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CoordinatorApproved from './pages/coordinator/CoordinatorApproved';

import StudentSubmit from './pages/student/StudentSubmit';
import StudentFeedbacks from './pages/student/StudentFeedbacks';

const Unauthorized = () => <div className="p-8 text-red-600 text-2xl text-center mt-10">Unauthorized Access</div>;

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/admin" element={<Layout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="coordinators" element={<AdminCoordinators />} />
                            <Route path="feedbacks" element={<AdminFeedbacks />} />
                        </Route>
                    </Route>

                    {/* Coordinator Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['COORDINATOR']} />}>
                        <Route path="/coordinator" element={<Layout />}>
                            <Route path="dashboard" element={<CoordinatorDashboard />} />
                            <Route path="approved" element={<CoordinatorApproved />} />
                        </Route>
                    </Route>

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                        <Route path="/student" element={<Layout />}>
                            <Route path="submit" element={<StudentSubmit />} />
                            <Route path="feedbacks" element={<StudentFeedbacks />} />
                        </Route>
                    </Route>

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
