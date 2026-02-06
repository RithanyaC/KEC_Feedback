import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import jsPDF from 'jspdf';
import { Download, Search, Briefcase, DollarSign, Star, Clock, HelpCircle } from 'lucide-react';

const StudentFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Fetch public feedbacks. 
                const { data } = await api.get('/feedback/public', {
                    params: { company: search }
                });
                setFeedbacks(data);
            } catch (error) {
                console.error(error);
            }
        };
        const handler = setTimeout(() => fetchFeedbacks(), 500);
        return () => clearTimeout(handler);
    }, [search]);

    const downloadPDF = (item) => {
        const doc = new jsPDF();
        let y = 20;

        // Title
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, 210, 30, 'F');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("Placement Experience Report", 105, 20, null, null, 'center');

        y = 40;
        doc.setTextColor(33, 33, 33);

        // Core Info
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(item.companyName, 14, y);
        y += 7;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.jobRole} | ${item.package || 'N/A'} | ${item.overallDifficulty}`, 14, y);
        y += 7;
        doc.setTextColor(100, 100, 100);
        doc.text(`Shared by: ${item.student.name} (${item.student.department})`, 14, y);

        y += 15;
        doc.setDrawColor(200, 200, 200);
        doc.line(14, y, 196, y);
        y += 10;

        const addText = (text, size = 10, color = [50, 50, 50], isBold = false) => {
            doc.setFontSize(size);
            doc.setTextColor(...color);
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            const split = doc.splitTextToSize(text || 'N/A', 180);
            doc.text(split, 14, y);
            y += (split.length * 5) + 4;
        };

        // Rounds
        item.rounds.forEach((round, index) => {
            if (y > 250) { doc.addPage(); y = 20; }

            doc.setFillColor(245, 247, 255);
            doc.rect(14, y - 5, 182, 18, 'F');
            doc.setFontSize(12);
            doc.setTextColor(79, 70, 229);
            doc.setFont("helvetica", "bold");
            doc.text(`Round ${round.roundNumber}: ${round.roundType}`, 18, y + 6);
            y += 20;

            doc.setFontSize(10);
            doc.setTextColor(33, 33, 33);
            doc.text(`Duration: ${round.duration || '-'} | Difficulty: ${round.difficulty}`, 14, y);
            y += 8;

            if (round.questions) {
                doc.setFont("helvetica", "bold");
                doc.text("Questions:", 14, y);
                y += 5;
                addText(round.questions);
            }

            if (round.experience) {
                doc.setFont("helvetica", "bold");
                doc.text("Experience:", 14, y);
                y += 5;
                addText(round.experience);
            }
            y += 5;
        });

        // Overall Tips
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229);
        doc.text("Overall Insights", 14, y);
        y += 10;

        addText("Preparation Tips:", 11, [0, 0, 0], true);
        addText(item.tips);

        y += 5;
        addText("Suggestions for Juniors:", 11, [0, 0, 0], true);
        addText(item.suggestions);

        doc.save(`${item.companyName}_${item.student.name}_Feedback.pdf`);
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
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
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
                                <h3 className="text-xl font-bold text-gray-900">{item.companyName}</h3>
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <Briefcase className="w-4 h-4 mr-1" /> {item.jobRole}
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${item.overallDifficulty === 'Hard' ? 'bg-red-50 text-red-600' :
                                    item.overallDifficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-green-50 text-green-600'}`}>
                                {item.overallDifficulty}
                            </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                            <DollarSign className="w-4 h-4 mr-1" /> {item.package || 'Not disclosed'}
                        </div>

                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Interview Rounds</h4>
                            <div className="space-y-2">
                                {item.rounds.slice(0, 3).map((r, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span>R{r.roundNumber}: {r.roundType}</span>
                                        <span className="text-gray-400 text-xs">{r.difficulty}</span>
                                    </div>
                                ))}
                                {item.rounds.length > 3 && <div className="text-xs text-indigo-600">+{item.rounds.length - 3} more rounds</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                            <div className="text-xs text-gray-500">
                                <span className="font-semibold">{item.student.name}</span> <br />
                                {item.student.department}
                            </div>
                            <button
                                onClick={() => downloadPDF(item)}
                                className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                            >
                                <Download className="w-4 h-4 mr-1" /> PDF
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {feedbacks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No approved feedbacks available.
                </div>
            )}
        </div>
    );
};

export default StudentFeedbacks;
