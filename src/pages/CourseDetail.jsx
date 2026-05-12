import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useEffect, useState } from 'react';

export default function CourseDetail() {
    const { id } = useParams();
    const fetchAPI = useFetch();

    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [openModuleId, setOpenModuleId] = useState(null);

    // Hàm xử lý khi click vào 1 chương
    const toggleModule = (moduleId) => {
        // Nếu click lại vào chương đang mở thì đóng nó lại, ngược lại thì mở chương mới
        setOpenModuleId(prev => prev === moduleId ? null : moduleId);
    };

    // 💡 HÀM MỚI: Xử lý mở PDF sang tab mới chuẩn style NEU
    const handleOpenMaterial = (item) => {
        if (item.type === 'quiz') {
            // Logic cho bài thi (Có thể chuyển hướng sang trang thi sau)
            alert("Đây là bài thi, tính năng đang phát triển!");
            return;
        }

        // Logic cho bài giảng (PDF/Video)
        if (!item.file_url) {
            alert("Bài giảng này chưa có file đính kèm!");
            return;
        }

        // Mở file PDF sang tab mới để kích hoạt trình đọc PDF mặc định của trình duyệt
        window.open(item.file_url, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const response = await fetchAPI(`${import.meta.env.VITE_API_URL}/courses/${id}`, {
                    method: 'GET'
                });
                const result = await response.json();
                if (response.ok) {
                    setCourse(result.data);
                } else {
                    setError('Mất kết nối tới máy chủ');
                }
                console.log(result.data);

            } catch (err) {
                if (err.message !== 'Unauthorized') {
                    setError(err.message || 'Có lỗi xảy ra');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourseDetail();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải thông tin khóa học...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!course) return <div className="p-8 text-center text-slate-500">Không tìm thấy khóa học!</div>;

    return (
        <div className="max-w-[1400px] mx-auto p-8 flex gap-8">
            {/* Center Content Area */}
            <div className="flex-1 space-y-8">
                {/* Course Hero Section */}
                <section className="relative h-72 rounded-3xl overflow-hidden shadow-sm">
                    <img
                        alt="Course Hero Banner"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDATnWiuUwx-UBBSmsnAA8-GVhNVyzpsLrnzaeZzIaVoXcvh2DzuGiW12D3jfPOlOCDK4EYVcTBuC0LUAOHkaAK12HIA3I3oM1-zdBT3I2DCY2xRhBVpcUiLXbveO8w_FaHibe2FOjtZ84D9UG7g_K4PJzRSOtt6QBYw2fZ6Z7ENlPlBr4mCIOO3WPna-rWdaa1zLajdM62699O_R9GaeeAfXm6xeyBZtRqeQN6UJaBgcs4ALN9U68B7E0Y4MznK-aLdnbARMw0Kbc"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent"></div>
                    <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                        <div className="mb-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                            { }
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4 max-w-2xl leading-tight">{course.course_code} - {course.course_name}</h1>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-surface-bright transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                Continue Learning
                            </button>
                            <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/20">
                                View Syllabus
                            </button>
                        </div>
                    </div>
                </section>

                {/* Course Navigation Tabs */}
                <div className="flex border-b border-outline-variant/20">
                    <Link to={`/courses/${id}`} className="px-6 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
                        Curriculum
                    </Link>
                    <Link to={`/courses/${id}/members`} className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        Members
                    </Link>
                    <Link to={`/courses/${id}/grades`} className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        Grades
                    </Link>
                    <Link to={`/courses/${id}/assignments`} className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                        Assignments
                    </Link>
                </div>

                {/* Curriculum Area */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">Course Curriculum</h2>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                            <span>0% Complete</span>
                            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* 🌟 VÒNG LẶP RENDER CÁC CHƯƠNG (MODULES) */}
                    {course.modules && course.modules.length > 0 ? (
                        course.modules.map((module, index) => (
                            <div key={module.id} className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">

                                {/* Header của Chương (Click để mở/đóng) */}
                                <div
                                    className="p-6 bg-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => toggleModule(module.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                            {/* Format số thứ tự: 1 -> 01 */}
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{module.title}</h3>
                                            <p className="text-sm text-slate-500">{module.description || 'Không có mô tả'}</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400">
                                        {openModuleId === module.id ? 'expand_less' : 'expand_more'}
                                    </span>
                                </div>

                                {/* Danh sách Bài học bên trong (Chỉ hiện khi chương này đang mở) */}
                                {openModuleId === module.id && (
                                    <div className="p-4 space-y-3 bg-slate-50">
                                        {module.items && module.items.length > 0 ? (
                                            module.items.map((item) => (
                                                <div
                                                    key={`${item.type}-${item.id}`}
                                                    className="bg-white p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer"
                                                    onClick={() => handleOpenMaterial(item)} // 💡 GẮN SỰ KIỆN ONCLICK VÀO ĐÂY
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Đổi Icon và Màu sắc dựa vào Type (Lesson hay Quiz) */}
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'quiz' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            <span className="material-symbols-outlined">
                                                                {item.type === 'quiz' ? 'quiz' : 'play_circle'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-semibold block">{item.title}</span>
                                                            <span className="text-xs text-slate-500">
                                                                {item.type === 'quiz' ? `Kiểm tra • ${item.duration_minutes} phút` : 'Bài giảng video/tài liệu'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-bold text-sm">
                                                            {item.type === 'quiz' ? 'Bắt đầu' : 'Vào học'}
                                                        </button>
                                                        {/* Vòng tròn checkmark */}
                                                        <div className="w-6 h-6 border-2 border-slate-200 rounded-full"></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-sm text-slate-400 py-4">Chương này chưa có bài học.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-200 text-slate-500">
                            Giảng viên chưa cập nhật nội dung cho khóa học này.
                        </div>
                    )}
                </section>
            </div>

            {/* Right Sidebar Area */}
            <aside className="w-80 space-y-8">
                {/* Faculty Card */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Course Faculty</h4>
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            alt="Instructor Avatar"
                            className="w-16 h-16 rounded-2xl object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6conqNomp4odixE4ihvgDtKL9F1E-kV0-lv_JGeAs5GBpgfO7zcArgMoYNluqqIf7fGXEvv0EybNbcjFRG47pcMSBu3kad3vi2O7oQc2gWsiQW1R-nCnWNkAwG73x43mNAQFCOTpTfiGa83udwYMw0DDVg3_0rysGQzn_0vuX-UQDJKgOm6hzR9bzy2krsZ3YhLC9deTJlWHTjl9djAV9v6dABX9Wr6kcza-_c1Gb42-YZcbNJmvWnHkK3p8wP_LXEjno07jOIFo"
                        />
                        <div>
                            <p className="font-bold text-lg text-primary">{course.teacher?.full_name || 'Giảng viên'}</p>
                            <p className="text-xs text-on-surface-variant">Lead Instructor • Network Security Specialist</p>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-primary/5 text-primary text-sm font-bold rounded-xl hover:bg-primary/10 transition-colors">
                        Message Instructor
                    </button>
                </div>

                {/* Announcements */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Announcements</h4>
                        <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold">New</span>
                    </div>
                    <div className="space-y-6">
                        <div className="relative pl-4 border-l-2 border-primary">
                            <span className="text-[10px] text-on-surface-variant font-bold">OCT 24, 2023</span>
                            <h5 className="text-sm font-bold mt-1">Midterm Exam Schedule</h5>
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Please review the updated midterm schedule in the Resources folder...</p>
                        </div>
                        <div className="relative pl-4 border-l-2 border-outline-variant">
                            <span className="text-[10px] text-on-surface-variant font-bold">OCT 18, 2023</span>
                            <h5 className="text-sm font-bold mt-1">Lab Environment Update</h5>
                            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">Cisco Packet Tracer v8.2 is now required for Chapter 3 labs.</p>
                        </div>
                    </div>
                    <button className="w-full mt-6 text-sm font-bold text-primary hover:underline">View All Notifications</button>
                </div>

                {/* Essential Resources */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Essential Resources</h4>
                    <div className="grid grid-cols-1 gap-3">
                        <a className="group bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all" href="#">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">menu_book</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Course E-books</p>
                                <p className="text-[10px] opacity-70">4 Primary Textbooks</p>
                            </div>
                        </a>
                        <a className="group bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all" href="#">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">terminal</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Lab Environments</p>
                                <p className="text-[10px] opacity-70">Virtual Lab Access</p>
                            </div>
                        </a>
                        <a className="group bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all" href="#">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">forum</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Discussion Forum</p>
                                <p className="text-[10px] opacity-70">Connect with Peers</p>
                            </div>
                        </a>
                    </div>
                </div>
            </aside>
        </div>
    );
}
