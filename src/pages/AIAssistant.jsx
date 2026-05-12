import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import MindMapViewer from './MindMapViewers';

export default function AIAssistantContent() {
    const params = useParams();
    const sessionId = params.sessionId || params.id;

    // --- STATES ---
    const [sources, setSources] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMindMapModalOpen, setIsMindMapModalOpen] = useState(false);
    // --- REFS ---
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Hàm lấy token (Sửa lại cho đúng với cách dự án của bạn lưu token)
    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token'); // Hoặc lấy từ state/context của bạn
        return {
            'Authorization': `Bearer ${token}`
        };
    };

    // ==========================================
    // 1. TẢI DỮ LIỆU BAN ĐẦU
    // ==========================================
    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoadingData(true);
            try {
                // CHẠY SONG SONG 2 API CÙNG LÚC
                const [historyRes, sourcesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/ai/history/${sessionId}`, { headers: getAuthHeaders() }),
                    fetch(`${import.meta.env.VITE_API_URL}/materials/lesson/${sessionId}`, { headers: getAuthHeaders() })
                ]);

                // CHUYỂN JSON SONG SONG
                const [historyData, sourcesData] = await Promise.all([
                    historyRes.json(),
                    sourcesRes.json()
                ]);

                // XỬ LÝ KẾT QUẢ
                if (historyData.success) {
                    setMessages(historyData.data);
                }

                if (sourcesData.success) {
                    const formattedSources = sourcesData.data.map(s => ({ ...s, active: true }));
                    setSources(formattedSources);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu ban đầu:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        if (sessionId) loadInitialData();
    }, [sessionId]);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // ==========================================
    // 2. XỬ LÝ UPLOAD TÀI LIỆU
    // ==========================================
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', sessionId); // Dùng sessionId thay cho lessonId trong kiến trúc mới

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/materials/upload`, {
                method: 'POST',
                headers: getAuthHeaders(), // KHÔNG set Content-Type, trình duyệt tự xử lý cho FormData
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                const newSource = { ...result.data, active: true };
                setSources([newSource, ...sources]); // Thêm lên đầu danh sách
            } else {
                alert("Lỗi upload: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Đã xảy ra lỗi khi upload tài liệu.");
        } finally {
            setIsUploading(false);
            event.target.value = null; // Reset input để có thể chọn lại cùng 1 file
        }
    };

    // ==========================================
    // 3. XỬ LÝ GỬI TIN NHẮN CHAT
    // ==========================================
    const handleSendMessage = async () => {
        if (!chatInput.trim() || isSending) return;

        const userMessage = chatInput.trim();
        setChatInput(''); // Xóa ô nhập liệu ngay lập tức

        // Thêm tin nhắn của User vào giao diện tạm thời
        const tempUserMsg = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, tempUserMsg]);
        setIsSending(true);

        try {
            // Lấy danh sách ID của các tài liệu đang được CHỌN (checkbox)
            const activeMaterialIds = sources.filter(s => s.active).map(s => s.id);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    message: userMessage,
                    materialIds: activeMaterialIds
                })
            });

            const result = await response.json();
            if (result.success) {
                // Thêm tin nhắn của AI trả về vào giao diện
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: result.data.answer, metadata: result.data.mindmap }
                ]);
            } else {
                alert("AI gặp sự cố: " + result.message);
                // Có thể xóa tin nhắn user vừa nhập nếu lỗi (tùy chọn)
            }
        } catch (error) {
            console.error("Lỗi khi chat:", error);
            alert("Lỗi kết nối đến AI.");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Ngăn xuống dòng
            handleSendMessage();
        }
    };

    const handleDeleteMaterial = async (id) => {
        // Hiện thông báo xác nhận trước khi xóa cho chắc ăn
        if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/materials/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const result = await response.json();

            if (result.success) {
                // Xóa file khỏi state để giao diện biến mất ngay lập tức
                setSources(prev => prev.filter(source => source.id !== id));
            } else {
                alert("Lỗi khi xóa: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi xóa tài liệu:", error);
            alert("Không thể kết nối đến server để xóa.");
        }
    };
    // Lọc ngược mảng messages để tìm cái mindmap mới nhất có shouldUpdate = true
    const latestMindMap = [...messages].reverse().find(msg => msg.metadata && msg.metadata.shouldUpdate === true)?.metadata;

    return (
        <div className="flex gap-4 p-4 h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50/50">

            {/* ========================================== */}
            {/* CỘT 1: NGUỒN TÀI LIỆU (SOURCES)            */}
            {/* ========================================== */}
            <div className="w-[280px] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 shrink-0 h-full overflow-hidden">
                <div className="p-4 border-b border-slate-100 shrink-0">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.mp4"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={isUploading}
                        className={`w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm font-bold text-slate-500 transition-all flex items-center justify-center gap-2 ${isUploading ? 'opacity-50 cursor-wait bg-slate-50' : 'hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50'}`}
                    >
                        {isUploading ? (
                            <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Đang tải lên...</>
                        ) : (
                            <><span className="material-symbols-outlined text-[18px]">add</span> Thêm nguồn</>
                        )}
                    </button>
                </div>
                <div className="p-3 bg-slate-50/50 border-b border-slate-100 shrink-0">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                        <input type="text" placeholder="Tìm trong nguồn..." className="w-full text-sm bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-3 outline-none focus:border-blue-400" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
                    {isLoadingData ? (
                        <div className="p-4 text-center text-xs text-slate-400 animate-pulse">Đang tải nguồn...</div>
                    ) : sources.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">Chưa có nguồn tài liệu nào.</div>
                    ) : (
                        sources.map(source => (
                            <div key={source.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg group transition-colors">
                                <input
                                    type="checkbox"
                                    checked={source.active}
                                    onChange={() => {
                                        const newSources = [...sources];
                                        const index = newSources.findIndex(s => s.id === source.id);
                                        newSources[index].active = !newSources[index].active;
                                        setSources(newSources);
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                                />
                                <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${source.file_url?.includes('.pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <span className="material-symbols-outlined text-[16px]">{source.file_url?.includes('.pdf') ? 'picture_as_pdf' : 'videocam'}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700 truncate flex-1 cursor-pointer hover:text-blue-600" title={source.title}>{source.title}</p>
                                <button
                                    onClick={() => handleDeleteMaterial(source.id)}
                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 shrink-0">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ========================================== */}
            {/* CỘT 2: KHUNG CHAT (TRUNG TÂM)              */}
            {/* ========================================== */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 h-full overflow-hidden">
                <div className="h-14 border-b border-slate-100 flex items-center px-5 justify-between bg-white shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
                        Phiên làm việc hiện tại
                    </h2>
                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>

                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth">
                    {isLoadingData ? (
                        <div className="flex justify-center items-center h-full text-slate-400 text-sm animate-pulse">Đang tải lịch sử...</div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                            <span className="material-symbols-outlined text-5xl opacity-50">forum</span>
                            <p className="text-sm">Hãy đặt câu hỏi dựa trên tài liệu bạn đã tải lên.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <span className="material-symbols-outlined text-sm">{msg.role === 'user' ? 'person' : 'smart_toy'}</span>
                                </div>
                                <div className={`flex-1 max-w-[90%] ${msg.role === 'user' ? 'bg-slate-100 p-3.5 rounded-2xl rounded-tr-none' : ''}`}>
                                    <div className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </div>

                                    {/* Nếu AI trả về Sơ đồ tư duy */}
                                    {msg.metadata && msg.metadata.shouldUpdate && (
                                        <div className="mt-4 p-3 bg-white border border-blue-100 rounded-xl w-64 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-3 group">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <span className="material-symbols-outlined text-blue-600">account_tree</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Sơ đồ tư duy</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Đã tạo tự động</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Hiệu ứng AI đang gõ chữ */}
                    {isSending && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <span className="material-symbols-outlined text-sm animate-pulse">smart_toy</span>
                            </div>
                            <div className="flex-1 max-w-[90%] flex items-center">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex items-end gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-xl shrink-0">
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        </button>
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-none resize-none max-h-32 py-2.5 px-2 text-sm focus:ring-0 text-slate-700 placeholder:text-slate-400 outline-none"
                            placeholder="Nhập câu hỏi hoặc yêu cầu tóm tắt..."
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim() || isSending}
                            className={`p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-sm shrink-0 ${!chatInput.trim() || isSending ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-400 mt-2">AI có thể mắc lỗi. Vui lòng kiểm tra lại các thông tin quan trọng.</p>
                </div>
            </div>

            {/* ========================================== */}
            {/* CỘT 3: STUDIO & ACTIONS                    */}
            {/* ========================================== */}
            <div className="w-[300px] flex flex-col gap-4 shrink-0 h-full">

                {/* Khối Studio */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 shrink-0">
                    <h3 className="text-xs font-extrabold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600 text-[18px]">magic_button</span>
                        Studio
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex flex-col gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-left group">
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">podcasts</span>
                            <span className="text-[11px] font-bold leading-tight">Podcast Audio</span>
                        </button>
                        <button className="flex flex-col gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors text-left group">
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">slideshow</span>
                            <span className="text-[11px] font-bold leading-tight">Bản trình bày</span>
                        </button>
                        <button className="flex flex-col gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-left group">
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">style</span>
                            <span className="text-[11px] font-bold leading-tight">Thẻ ghi nhớ</span>
                        </button>
                        <button className="flex flex-col gap-2 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-left group">
                            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">quiz</span>
                            <span className="text-[11px] font-bold leading-tight">Bài kiểm tra</span>
                        </button>
                    </div>
                </div>

                {/* Khối Mind Map Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600 text-[18px]">account_tree</span>
                            Sơ đồ bài học
                        </h3>
                        <button
                            onClick={() => setIsMindMapModalOpen(true)}
                            disabled={!latestMindMap}
                            className={`text-[10px] font-bold hover:underline ${latestMindMap ? 'text-blue-600' : 'text-slate-300 cursor-not-allowed'}`}
                        >
                            Mở lớn
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group cursor-pointer" onClick={() => latestMindMap && setIsMindMapModalOpen(true)}>
                        {/* Gọi Component vẽ sơ đồ */}
                        <MindMapViewer data={latestMindMap} />

                        {/* Overlay khi hover nếu có dữ liệu */}
                        {latestMindMap && (
                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center pointer-events-none">
                                <span className="px-4 py-2 bg-white text-blue-600 font-bold text-xs rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Mở toàn màn hình
                                </span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
            {isMindMapModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-8">
                    <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">account_tree</span>
                                Sơ đồ tư duy chi tiết
                            </h2>
                            <button
                                onClick={() => setIsMindMapModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-slate-50/50">
                            <MindMapViewer data={latestMindMap} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}