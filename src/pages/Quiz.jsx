import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'; // Nhớ đảm bảo đường dẫn hook chính xác

export default function Quiz() {
    const { id } = useParams(); // ID của bài Quiz (ví dụ: 2)
    const navigate = useNavigate();
    const fetchAPI = useFetch();

    // --- THAY THẾ MOCK DATA BẰNG STATES ---
    const [quizInfo, setQuizInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // Dạng: { question_id: option_id }
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- GỌI API LẤY ĐỀ THI ---
    useEffect(() => {
        const fetchQuizData = async () => {
            setIsLoading(true);
            try {
                const res = await fetchAPI(`http://localhost:5000/quizzes/${id}/take`, { method: 'GET' });
                const data = await res.json();

                // 🛑 XỬ LÝ KHI BÁC BẢO VỆ CHẶN (Status 403 hoặc success = false)
                if (res.status === 403 || !data.success) {
                    alert(data.message || "Bạn không có quyền truy cập bài thi này!");
                    navigate(`/courses/1/assignments`); // Đẩy học viên về trang danh sách
                    return;
                }

                if (data.data) {
                    setQuizInfo(data.data);
                    setQuestions(data.data.Questions || []);
                    setTimeLeft(data.data.duration_minutes * 60);
                }
            } catch (error) {
                console.error("Lỗi khi tải đề thi:", error);
                alert("Có lỗi xảy ra khi kết nối tới máy chủ.");
                navigate(`/courses/1/assignments`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [id]);

    // --- LOGIC ĐỒNG HỒ ---
    useEffect(() => {
        if (timeLeft <= 0 || isLoading) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit(); // Tự động nộp khi hết giờ
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isLoading]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // --- GỌI API NỘP BÀI CHẤM ĐIỂM TỰ ĐỘNG ---
    const submitToServer = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetchAPI(`http://localhost:5000/quizzes/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            const result = await res.json();

            if (result.success) {
                // Tạm thời hardcode courseId = 1 để chuyển hướng, có thể lấy từ Context/State sau
                navigate(`/courses/1/assignments`);
            } else {
                alert("Có lỗi xảy ra khi nộp bài.");
            }
        } catch (error) {
            console.error("Lỗi nộp bài:", error);
            alert("Mất kết nối tới máy chủ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (window.confirm("Are you sure you want to submit your quiz? You cannot change your answers after submitting.")) {
            submitToServer();
        }
    };

    const handleAutoSubmit = () => {
        alert("Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài của bạn.");
        submitToServer();
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Đang chuẩn bị đề thi...</div>;
    }

    if (questions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Đề thi này chưa có câu hỏi nào.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
            {/* Left side: Quiz Content */}
            <div className="flex-[3]">
                {/* Header Section */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <nav className="flex text-sm text-on-surface-variant mb-2 font-medium">
                            <Link className="hover:text-primary transition-colors" to="/courses/1/assignments">Assignments</Link>
                            <span className="mx-2 opacity-50">/</span>
                            <span className="text-on-surface">Quiz</span>
                        </nav>
                        <h2 className="text-3xl font-extrabold headline tracking-tight text-on-surface">{quizInfo?.title || 'Đang tải...'}</h2>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Time Remaining</span>
                        <div className={`text-2xl font-black ${timeLeft < 300 ? 'text-error animate-pulse' : 'text-primary'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>

                {/* Mobile Timer View */}
                <div className="md:hidden flex justify-between items-center bg-surface-container-low p-4 rounded-xl mb-6">
                    <span className="text-sm font-bold text-on-surface-variant">Time Remaining:</span>
                    <span className={`text-xl font-black ${timeLeft < 300 ? 'text-error animate-pulse' : 'text-primary'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Question Area */}
                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-on-surface">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                        {answers[currentQuestion.id] ? (
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Answered
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
                                Unanswered
                            </span>
                        )}
                    </div>

                    <div className="flex-1">
                        <h4 className="text-xl font-semibold text-on-surface mb-8 leading-relaxed">
                            {currentQuestion.content} {/* Đổi text thành content */}
                        </h4>

                        <div className="space-y-3">
                            {currentQuestion.Options?.map((option, idx) => {
                                const isSelected = answers[currentQuestion.id] === option.id;
                                const alphabetLabel = ['A', 'B', 'C', 'D', 'E'][idx]; // Sinh A, B, C, D động

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${isSelected
                                            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary'
                                            : 'bg-white border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                                            }`}>
                                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-bold text-slate-500 mr-3">{alphabetLabel}.</span>
                                            <span className={`font-medium ${isSelected ? 'text-primary-dark' : 'text-on-surface'}`}>
                                                {option.content} {/* Đổi text thành content */}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${currentQuestionIndex === 0
                                ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                                : 'text-on-surface hover:bg-surface-container'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${currentQuestionIndex === questions.length - 1
                                ? 'text-slate-300 bg-slate-50 cursor-not-allowed'
                                : 'bg-primary text-white hover:opacity-90 shadow-sm'
                                }`}
                        >
                            Next
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side: Progress Bar & Sidebar Maps */}
            <div className="flex-1 space-y-6">
                {/* Progress Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-slate-100 lg:sticky lg:top-8">
                    <h4 className="font-bold text-on-surface mb-4">Quiz Navigation</h4>
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {questions.map((q, idx) => {
                            const answered = !!answers[q.id];
                            const isCurrent = idx === currentQuestionIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`
                    h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                    ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${answered ? 'bg-primary text-white shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}
                  `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-primary overflow-hidden"></span>
                                Answered
                            </span>
                            <span>{Object.keys(answers).length}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded bg-surface-container overflow-hidden"></span>
                                Unanswered
                            </span>
                            <span>{questions.length - Object.keys(answers).length}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-secondary-container hover:bg-secondary-container-hover text-on-secondary-container rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                        {!isSubmitting && <span className="material-symbols-outlined text-[18px]">send</span>}
                    </button>
                </div>

                {/* Warning / Instructions */}
                <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        Important
                    </h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Do not refresh the page during the quiz. Ensure you have a stable connection. Once you submit, your score will be final.
                    </p>
                </div>
            </div>
        </div>
    );
}