import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import jsPDF from 'jspdf';
import { Download, Search, Filter } from 'lucide-react';

const StudentFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState(''); // Optional: client-side filter if not passed to API

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Fetch public feedbacks. 
                // We'll filter by search term on client side for smoother experience unless large data
                const { data } = await api.get('/feedback/public', {
                    params: { company: search }
                });
                setFeedbacks(data);
            } catch (error) {
                console.error(error);
            }
        };
        // Debounce search ideally, but simple here
        const handler = setTimeout(() => fetchFeedbacks(), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const downloadPDF = (item) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, 210, 40, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("Placement Feedback Report", 105, 25, null, null, 'center');

        // Content
        let y = 55;
        doc.setTextColor(33, 33, 33);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(item.companyName, 20, y);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`${item.roundType} | ${item.difficulty} | ${item.student.department}`, 20, y + 7);

        y += 20;

        const addSection = (title, content) => {
            if (!content) return;
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(79, 70, 229);
            doc.text(title, 20, y);
            y += 8;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50, 50, 50);

            const splitText = doc.splitTextToSize(content, 170);
            doc.text(splitText, 20, y);
            y += (splitText.length * 5) + 10;
        };

        addSection('Interview Experience', item.experience);
        addSection('Preparation Tips', item.tips);
        addSection('Suggestions', item.suggestions);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated on ${new Date().toLocaleDateString()} by Placement Portal`, 105, 280, null, null, 'center');

        doc.save(`${item.companyName}_Feedback_${item.student.name}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Placement Insights</h1>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search Company..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-sm w-full md:w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{item.companyName}</h3>
                                <p className="text-xs text-gray-500 font-medium">{item.roundType}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${item.difficulty === 'Hard' ? 'bg-red-50 text-red-600' :
                                    item.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-green-50 text-green-600'}`}>
                                {item.difficulty}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-4 flex-1 mb-6">
                            {item.experience}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="text-xs text-gray-500">
                                <span className="font-semibold">{item.student.name}</span> <br />
                                {item.student.department}
                            </div>
                            <button
                                onClick={() => downloadPDF(item)}
                                className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                                title="Download PDF"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No feedbacks found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFeedbacks;
