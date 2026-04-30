import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'; // Đảm bảo đường dẫn đúng

export default function AIAssistantDashboard() {
    const navigate = useNavigate();
    const fetchAPI = useFetch();

    const [notebooks, setNotebooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mảng màu để gán ngẫu nhiên cho các thẻ sổ ghi chú cho đẹp
    const colors = ['bg-orange-50', 'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-red-50', 'bg-indigo-50'];

    // 1. LẤY DANH SÁCH SỔ GHI CHÚ TỪ BACKEND
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const response = await fetchAPI('http://localhost:5000/ai/sessions');
                const result = await response.json();
                if (result.success) {
                    setNotebooks(result.data);
                }
            } catch (error) {
                console.error("Lỗi tải danh sách session:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSessions();
    }, []);

    // 2. HÀM TẠO SỔ GHI CHÚ MỚI
    const handleCreateNotebook = async () => {
        const title = prompt("Nhập tên sổ ghi chú mới:", "Sổ ghi chú mới");
        if (!title) return;

        try {
            const response = await fetchAPI('http://localhost:5000/ai/session', {
                method: 'POST',
                body: JSON.stringify({ title })
            });
            const result = await response.json();

            if (result.success) {
                // Sau khi tạo xong, bay thẳng vào trang 3 cột với ID vừa tạo
                navigate(`/ai-assistant/${result.data.id}`);
            }
        } catch (error) {
            alert("Không thể tạo sổ ghi chú mới!");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white p-8 h-[calc(100vh-64px)] no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold text-slate-800">Trợ lý học tập AI</h1>
                    <button
                        onClick={handleCreateNotebook}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Tạo sổ ghi chú mới
                    </button>
                </div>

                {/* Sổ ghi chú gần đây */}
                <div>
                    <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">history</span>
                        Sổ ghi chú của bạn
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-100 animate-pulse rounded-2xl"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Nút Tạo nhanh */}
                            <div
                                onClick={handleCreateNotebook}
                                className="h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:text-blue-600 transition-all shadow-sm">
                                    <span className="material-symbols-outlined">add</span>
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">Bắt đầu học tập</span>
                            </div>

                            {/* Render danh sách từ DB */}
                            {notebooks.map((nb, index) => (
                                <div
                                    key={nb.id}
                                    onClick={() => navigate(`/ai-assistant/${nb.id}`)}
                                    className={`${colors[index % colors.length]} h-48 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all relative flex flex-col justify-between group border border-black/5`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-slate-700">description</span>
                                        </div>
                                        <button className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-bold text-slate-800 leading-snug mb-2 line-clamp-2">{nb.title}</h3>
                                        <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            {new Date(nb.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Trường hợp chưa có sổ ghi chú nào */}
                    {!isLoading && notebooks.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">auto_stories</span>
                            <p className="text-slate-400 font-medium">Bạn chưa có sổ ghi chú nào. Hãy tạo cái đầu tiên!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}