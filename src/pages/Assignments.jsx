import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useFetch } from '../hooks/useFetch';

export default function Assignments() {
    const { id } = useParams(); // courseId
    const { user } = useContext(AuthContext);
    const fetchAPI = useFetch();

    const [courseInfo, setCourseInfo] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Thêm 'Expired' vào các tab mặc định
    const [activeFilter, setActiveFilter] = useState('Active');

    useEffect(() => {
        const fetchAssignments = async () => {
            setIsLoading(true);
            try {
                const courseRes = await fetchAPI(`${import.meta.env.VITE_API_URL}/courses/${id}`, { method: 'GET' });
                const courseData = await courseRes.json();
                if (courseData.success) setCourseInfo(courseData.data);

                const assignRes = await fetchAPI(`${import.meta.env.VITE_API_URL}/courses/${id}/assignments`, { method: 'GET' });
                const assignData = await assignRes.json();

                if (assignData.success) {
                    setAssignments(assignData.data);
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssignments();
    }, [id]);

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' at ' +
            date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    // Đếm số lượng cho các nút Filter
    const activeCount = assignments.filter(a => a.status === 'Active').length;
    const submittedCount = assignments.filter(a => a.status === 'Submitted').length;
    const gradedCount = assignments.filter(a => a.status === 'Graded').length;
    const expiredCount = assignments.filter(a => a.status === 'Expired').length; // Đếm số bài hết hạn

    const displayedAssignments = assignments.filter(a => a.status === activeFilter);

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Breadcrumbs & Header */}
            <div className="mb-8">
                <nav className="flex text-sm text-on-surface-variant mb-3 font-medium">
                    <Link className="hover:text-primary transition-colors" to="/courses">My Courses</Link>
                    <span className="mx-2 opacity-50">/</span>
                    <Link className="hover:text-primary transition-colors truncate max-w-[200px]" to={`/courses/${id}`}>
                        {courseInfo?.course_name || `Khóa học #${id}`}
                    </Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="text-on-surface">Assignments</span>
                </nav>
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-extrabold headline tracking-tight text-on-surface truncate pr-4">
                        {courseInfo?.course_name || 'Đang tải...'}
                    </h2>
                </div>
            </div>

            {/* Course Navigation Tabs */}
            <div className="flex border-b border-outline-variant/20 mb-8">
                <Link to={`/courses/${id}`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Curriculum</Link>
                <Link to={`/courses/${id}/members`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Members</Link>
                <Link to={`/courses/${id}/grades`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Grades</Link>
                <Link to={`/courses/${id}/assignments`} className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">Assignments</Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar pb-2">
                {['Active', 'Submitted', 'Graded', 'Expired'].map(filter => {
                    const count = filter === 'Active' ? activeCount : filter === 'Submitted' ? submittedCount : filter === 'Graded' ? gradedCount : expiredCount;
                    return (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${activeFilter === filter ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            {filter} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Assignment List */}
            <div className="space-y-4">
                {isLoading && <div className="text-center py-12 text-slate-500 font-medium">Đang tải dữ liệu bài tập...</div>}

                {!isLoading && displayedAssignments.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 italic">
                        Không có bài tập nào trong mục này.
                    </div>
                )}

                {!isLoading && displayedAssignments.map((item) => (
                    <div key={item.id} className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${item.status === 'Expired' ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>

                        <div className="flex items-start gap-4 flex-1">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'quiz' ? 'bg-purple-50' : 'bg-blue-50'}`}>
                                <span className={`material-symbols-outlined ${item.type === 'quiz' ? 'text-purple-600' : 'text-blue-600'}`}>
                                    {item.type === 'quiz' ? 'quiz' : 'assignment'}
                                </span>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-on-surface transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.status === 'Active' && (
                                        <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded uppercase tracking-wider shrink-0">Due Soon</span>
                                    )}
                                </div>
                                <p className="text-sm text-on-surface-variant mb-3 max-w-2xl">{item.description}</p>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant">
                                    <div className={`flex items-center gap-1.5 ${item.status === 'Expired' ? 'text-error font-bold' : ''}`}>
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        Due: {formatDateTime(item.due_date)}
                                    </div>
                                    {item.type === 'quiz' && item.time_limit && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px]">timer</span>
                                            {item.time_limit} Minutes
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">military_tech</span>
                                        {item.points} Points
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần Nút bấm trạng thái */}
                        <div className="flex flex-col items-end gap-3 shrink-0">

                            {/* Nút bấm dựa trên trạng thái */}
                            {item.status === 'Active' && (
                                <Link
                                    to={`/courses/${id}/quizzes/${item.id}/take`}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-opacity w-full md:w-auto text-center"
                                >
                                    Start Quiz
                                </Link>
                            )}

                            {item.status === 'Submitted' && (
                                <button className="px-6 py-2.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-sm font-bold w-full md:w-auto cursor-not-allowed">
                                    Pending Review
                                </button>
                            )}

                            {item.status === 'Expired' && (
                                <button disabled className="px-6 py-2.5 bg-surface-container text-on-surface-variant rounded-xl text-sm font-bold w-full md:w-auto cursor-not-allowed flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">lock</span> Closed
                                </button>
                            )}

                            {item.status === 'Graded' && (
                                <div className="text-center bg-green-50 px-6 py-2 rounded-xl border border-green-100">
                                    <span className="text-2xl font-black text-green-600">{item.score}</span>
                                    <span className="text-sm font-bold text-green-700/50"> /{item.points}</span>
                                </div>
                            )}

                            {/* Ghi chú Text nhỏ ở dưới */}
                            <span className="text-xs font-bold text-on-surface-variant">
                                {item.status === 'Active' && 'Ready to start'}
                                {item.status === 'Submitted' && 'Awaiting grades'}
                                {item.status === 'Graded' && 'Graded successfully'}
                                {item.status === 'Expired' && 'Missed deadline'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}