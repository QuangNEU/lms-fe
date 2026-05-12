import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useFetch } from '../hooks/useFetch';

export default function Grades() {
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Lấy thông tin user đang đăng nhập
    const fetchAPI = useFetch();

    const [courseInfo, setCourseInfo] = useState(null);
    const [myScore, setMyScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGradeData = async () => {
            try {
                // 1. Lấy tên khóa học
                const courseRes = await fetchAPI(`${import.meta.env.VITE_API_URL}/courses/${id}`, { method: 'GET' });
                const courseData = await courseRes.json();
                if (courseData.success) setCourseInfo(courseData.data);

                // 2. Lấy điểm của user hiện tại (Tạm thời mượn API members và lọc ra chính mình)
                const membersRes = await fetchAPI(`${import.meta.env.VITE_API_URL}/courses/${id}/members`, { method: 'GET' });
                const membersData = await membersRes.json();

                if (membersData.success && user) {
                    // Tìm bản ghi enrollment của chính học viên này
                    const myEnrollment = membersData.data.find(m => m.email === user.email);
                    if (myEnrollment) {
                        setMyScore(myEnrollment.score || 0); // Lấy điểm tổng
                    }
                }
            } catch (error) {
                console.error("Lỗi tải điểm:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGradeData();
    }, [id, user]);

    // Hàm quy đổi điểm số (0-100) sang điểm chữ
    const getLetterGrade = (score) => {
        if (score >= 9.0) return 'A+';
        if (score >= 8.5) return 'A';
        if (score >= 8.0) return 'B+';
        if (score >= 7.5) return 'B';
        if (score >= 7.0) return 'B-';
        if (score >= 6.5) return 'C+';
        if (score >= 6.0) return 'C';
        if (score >= 5.0) return 'D';
        return 'F';
    };

    const letterGrade = getLetterGrade(myScore);

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Breadcrumbs & Header */}
            <div className="mb-8">
                <nav className="flex text-sm text-on-surface-variant mb-3 font-medium">
                    <Link className="hover:text-primary transition-colors" to="/courses">My Courses</Link>
                    <span className="mx-2 opacity-50">/</span>
                    <Link className="hover:text-primary transition-colors" to={`/courses/${id}`}>
                        {courseInfo?.course_name || `Khóa học #${id}`}
                    </Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="text-on-surface">Grades</span>
                </nav>
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold headline tracking-tight text-on-surface truncate pr-4">
                        {courseInfo?.course_name || 'Đang tải...'}
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-on-surface font-semibold hover:bg-surface-container-highest transition-colors shrink-0">
                        <span className="material-symbols-outlined text-[20px]">print</span>
                        Print Transcript
                    </button>
                </div>
            </div>

            {/* Course Navigation Tabs */}
            <div className="flex border-b border-outline-variant/20 mb-8">
                <Link to={`/courses/${id}`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Curriculum
                </Link>
                <Link to={`/courses/${id}/members`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Members
                </Link>
                <Link to={`/courses/${id}/grades`} className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">
                    Grades
                </Link>
                <Link to={`/courses/${id}/assignments`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Assignments
                </Link>
            </div>

            {/* Grade Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-blue-100 font-medium text-sm mb-1">Current Overall Grade</h3>
                        <div className="flex items-baseline gap-3 mt-2">
                            {/* 🌟 ĐIỂM CHỮ VÀ ĐIỂM SỐ ĐƯỢC RÁP TỪ DB */}
                            <span className="text-5xl font-black headline">{letterGrade}</span>
                            <span className="text-xl font-bold text-blue-100">{myScore}%</span>
                        </div>
                        <p className="text-xs text-blue-100/80 mt-4">Dựa trên tiến độ hiện tại</p>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-20" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>

                {/* --- KHU VỰC BÊN DƯỚI TẠM THỜI GIỮ GIAO DIỆN CỨNG --- */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
                    <h3 className="text-on-surface-variant font-medium text-sm mb-4">Grade Breakdown (Sắp ra mắt)</h3>
                    <div className="space-y-3 opacity-60">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Assignments (40%)</span>
                                <span className="text-primary">--%</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                        {/* Các thanh điểm khác giữ nguyên cấu trúc HTML của bạn... */}
                    </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-blue-600 text-3xl">hourglass_empty</span>
                    </div>
                    <h3 className="font-bold text-on-surface">Chờ cập nhật</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Hệ thống bài tập chi tiết đang được xây dựng.</p>
                </div>
            </div>

            {/* Detailed Grades Table */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100 overflow-hidden opacity-60">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-on-surface">Graded Items (Ví dụ)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        {/* Giữ nguyên toàn bộ cấu trúc Table cực xịn của bạn ở đây */}
                        <thead>
                            <tr className="bg-surface-container-low text-left">
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Feedback</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-sm text-on-surface">Assignment 1: Data Models</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Assignment</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant">Updating...</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-on-surface-variant">—</span>
                                </td>
                                <td className="px-6 py-4"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}