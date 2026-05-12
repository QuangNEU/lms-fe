import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useFetch } from '../hooks/useFetch';

export default function Dashboard() {
    const carouselRef = useRef(null);
    const { user } = useContext(AuthContext);
    const fetchAPI = useFetch();

    // States cho Courses
    const [courses, setCourses] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [error, setError] = useState('');

    // States cho Schedule (Lịch)
    const [scheduleEvents, setScheduleEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Gốc thời gian
    const [currentDate] = useState(new Date());

    // ==========================================
    // 1. FETCH DỮ LIỆU KHÓA HỌC
    // ==========================================
    useEffect(() => {
        const fetchMyCourse = async () => {
            try {
                const response = await fetchAPI('http://localhost:5000/courses/mycourse', { method: 'GET' });
                const result = await response.json();

                if (result.success || response.ok) {
                    setCourses(result.data || []);
                } else {
                    setError('Không thể tải danh sách khóa học.');
                }
            } catch (err) {
                console.error("Lỗi mạng:", err);
                setError('Mất kết nối đến máy chủ!');
            } finally {
                setIsLoadingCourses(false);
            }
        }
        fetchMyCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ==========================================
    // 2. FETCH DỮ LIỆU LỊCH THI
    // ==========================================
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Nhớ đổi port nếu backend của bạn khác 5000
                const response = await fetchAPI('http://localhost:5000/schedule', { method: 'GET' });
                const result = await response.json();

                if (result.success) {
                    const now = new Date();
                    const formatted = result.data.map(q => ({
                        id: q.id,
                        title: q.title,
                        courseName: q.Course ? q.Course.course_name : 'Môn học',
                        dateObj: new Date(q.start_time || q.due_date),
                        type: q.quiz_type || 'practice'
                    }));

                    setScheduleEvents(formatted);

                    // Lọc 3 sự kiện sắp diễn ra
                    const future = formatted.filter(e => e.dateObj >= now).sort((a, b) => a.dateObj - b.dateObj);
                    setUpcomingEvents(future.slice(0, 3));
                }
            } catch (err) {
                console.error("Lỗi tải lịch:", err);
            }
        };
        fetchSchedule();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ==========================================
    // 3. TÍNH TOÁN GPA & CREDITS TỰ ĐỘNG
    // ==========================================
    let totalCredits = 0;
    let sumScore = 0;
    let completedCount = 0;

    courses.forEach(course => {
        // Tìm điểm số (Tùy thuộc vào việc API backend trả về total_score nằm ở đâu)
        const score = parseFloat(course.total_score || (course.Enrollment && course.Enrollment.total_score));

        if (!isNaN(score)) {
            sumScore += score;
            completedCount += 1;
            // Giả sử mỗi môn hoàn thành tương đương 3 tín chỉ (Credit). 
            // Nếu DB của bạn có cột credits thì dùng: totalCredits += course.credits
            totalCredits += 3;
        }
    });

    // Quy đổi từ hệ 10 sang GPA hệ 4.0 (Công thức tham khảo)
    const avgScore10 = completedCount > 0 ? (sumScore / completedCount) : 0;
    const calculatedGPA = completedCount > 0 ? ((avgScore10 / 10) * 4).toFixed(2) : "0.00";

    // ==========================================
    // 4. LOGIC VẼ MINI CALENDAR (LỊCH NHỎ)
    // ==========================================
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthYearString = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    let firstDayOfWeek = new Date(year, month, 1).getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const miniGrid = [];
    // Ô tháng trước
    for (let i = 0; i < firstDayOfWeek; i++) {
        miniGrid.unshift({ day: daysInPrevMonth - i, isCurrent: false });
    }
    // Ô tháng này
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = new Date(year, month, i).toDateString();
        const isToday = new Date().toDateString() === dateStr;
        // Kiểm tra xem ngày này có bài thi nào không
        const hasEvent = scheduleEvents.some(e => e.dateObj.toDateString() === dateStr);
        miniGrid.push({ day: i, isCurrent: true, isToday, hasEvent });
    }
    // Ô tháng sau
    const remain = (7 - (miniGrid.length % 7)) % 7;
    for (let i = 1; i <= remain; i++) {
        miniGrid.push({ day: i, isCurrent: false });
    }

    // ==========================================
    // CÁC HÀM TIỆN ÍCH KHÁC
    // ==========================================
    const displayName = user?.full_name ? user.full_name.split(' ').slice(-2).join(' ') : 'Student';
    const scrollLeft = () => carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
    const scrollRight = () => carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });

    const recentCourses = courses
        .filter(course => course.last_accessed_at !== null)
        .slice(0, 12)
        .map((course, index) => {
            const styles = [
                { bgIcon: 'bg-blue-100', textIcon: 'text-blue-600', bgProgress: 'bg-blue-600', icon: 'code' },
                { bgIcon: 'bg-purple-100', textIcon: 'text-purple-600', bgProgress: 'bg-purple-600', icon: 'dns' },
                { bgIcon: 'bg-orange-100', textIcon: 'text-orange-600', bgProgress: 'bg-orange-600', icon: 'database' },
                { bgIcon: 'bg-green-100', textIcon: 'text-green-600', bgProgress: 'bg-green-600', icon: 'terminal' },
                { bgIcon: 'bg-red-100', textIcon: 'text-red-600', bgProgress: 'bg-red-600', icon: 'security' },
            ];
            const style = styles[index % styles.length];
            return {
                id: course.id,
                title: course.course_name,
                module: course.course_code,
                progress: course.progress || Math.floor(Math.random() * 80) + 10,
                ...style
            };
        });

    return (
        <div className="p-8 flex gap-8">
            {/* Central Dashboard Canvas */}
            <div className="flex-[3] space-y-10 min-w-0">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl bg-primary min-h-[220px] flex items-center px-12 group">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img alt="Abstract library background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWEGW-wBDuxCkhWN2D4Hz72BTeb5RE2Kk31SnUj98YukIPtyeeH6dViCijo3oT9BaPQ0rVbFWydNTVpGN1WJvIS01Ld_or6Ke8zpCfFM9FBsIJ3N_pitr8QwwYjhZgG3Egn0SEvnvl8gW0zaDPKzmvpcq3wygmaH_pjDAF8jdbGeuB9cxPY7VN8BcP0KdjXkuWc6aYWYkFISyp-mxdbl8bc2cSCCnvWZAl9yD-tMubCd7DnB6beJMAUP5S_hzxV8Nkgg4YBtk1F-Y" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
                    <div className="relative z-10 w-full flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome back, {displayName}</h2>
                            <p className="text-on-primary-container text-lg font-medium opacity-90">You've completed {completedCount} courses so far. Keep it up!</p>
                        </div>
                        <div className="flex gap-6">
                            {/* GPA ĐỘNG */}
                            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/10">
                                <p className="text-xs text-white/70 uppercase tracking-widest font-bold">GPA</p>
                                <p className="text-3xl font-black text-white">{calculatedGPA}</p>
                            </div>
                            {/* CREDITS ĐỘNG */}
                            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/10">
                                <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Credits</p>
                                <p className="text-3xl font-black text-white">{totalCredits}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recently Accessed Carousel */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-on-surface tracking-tight">Recently Accessed</h3>
                        <div className="flex items-center gap-3">
                            <button onClick={scrollLeft} className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button onClick={scrollRight} className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-2 px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {recentCourses.map((course) => (
                            <Link
                                key={course.id}
                                to={`/courses/${course.id}`}
                                className="bg-surface-container-lowest p-5 rounded-2xl transition-all hover:translate-y-[-4px] cursor-pointer shadow-sm border border-slate-100 min-w-[280px] w-[280px] snap-start shrink-0 group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${course.bgIcon} flex items-center justify-center ${course.textIcon} mb-4 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">{course.icon}</span>
                                </div>
                                <h4 className="font-bold text-lg mb-1 leading-tight truncate" title={course.title}>{course.title}</h4>
                                <p className="text-sm text-on-surface-variant mb-4 truncate" title={course.module}>{course.module}</p>
                                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                    <div className={`${course.bgProgress} h-full`} style={{ width: `${course.progress}%` }}></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Course Overview */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-on-surface tracking-tight">Course Overview</h3>
                    </div>
                    <div className="space-y-4">
                        {isLoadingCourses ? (
                            <div className="text-center py-8 text-slate-500">Đang tải danh sách khóa học...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500 bg-red-50 rounded-2xl">{error}</div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                                Bạn chưa ghi danh khóa học nào.
                            </div>
                        ) : (
                            courses.map((course) => (
                                <Link
                                    key={course.id}
                                    to={`/courses/${course.id}`}
                                    className="bg-white rounded-2xl p-6 flex items-center gap-6 group hover:shadow-xl hover:shadow-blue-900/5 transition-all block border border-slate-100"
                                >
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                            <img
                                                alt={course.course_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                src={`https://ui-avatars.com/api/?name=${course.course_code}&background=random&color=fff&size=256`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-xl text-slate-900">{course.course_code}: {course.course_name}</h4>
                                                    <p className="text-sm text-slate-500">
                                                        Instructor: {course.teacher?.full_name || 'Đang cập nhật'} • {course.semester || 'Học kỳ này'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">IN PROGRESS</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div className="bg-blue-600 h-full" style={{ width: `${course.progress || 30}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{course.progress || 30}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Right Sidebar */}
            <aside className="flex-1 space-y-8 min-w-[320px]">

                {/* 🌟 MINI CALENDAR ĐÃ ĐƯỢC LÀM ĐỘNG 🌟 */}
                <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-lg">{monthYearString}</h4>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="p-1 hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <div key={i} className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {miniGrid.map((cell, idx) => {
                            let className = "p-2 text-sm ";

                            if (!cell.isCurrent) {
                                className += "text-outline opacity-30"; // Ngày tháng trước/sau
                            } else if (cell.isToday) {
                                className += "font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20"; // Hôm nay
                            } else {
                                className += "font-bold relative"; // Ngày bình thường trong tháng
                                // Nếu có sự kiện, thêm chấm tròn đỏ ở dưới
                                if (cell.hasEvent) {
                                    className += " text-primary";
                                }
                            }

                            return (
                                <div key={idx} className={className}>
                                    {cell.day}
                                    {cell.isCurrent && cell.hasEvent && !cell.isToday && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-error rounded-full"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 🌟 UPCOMING ĐÃ ĐƯỢC LÀM ĐỘNG BẰNG DỮ LIỆU TỪ DB 🌟 */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h4 className="font-bold text-lg">Upcoming</h4>
                        <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                            {upcomingEvents.length} THIS WEEK
                        </span>
                    </div>

                    <div className="space-y-6 relative ml-4 before:content-[''] before:absolute before:left-[-1px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-center text-on-surface-variant pl-6">Không có sự kiện nào sắp tới.</p>
                        ) : (
                            upcomingEvents.map((event, idx) => {
                                // Xử lý màu sắc Timeline dưa trên loại bài thi
                                let dotColor = "bg-outline-variant";
                                let textColor = "text-outline";

                                if (event.type === 'final') {
                                    dotColor = "bg-error"; textColor = "text-error";
                                } else if (event.type === 'midterm') {
                                    dotColor = "bg-primary"; textColor = "text-primary";
                                }

                                // Format thứ, ngày, giờ (Vd: THUR • 02:00 PM)
                                const dayName = event.dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
                                const timeStr = event.dateObj.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
                                const dateLabel = `${dayName} • ${timeStr}`;

                                return (
                                    <div key={event.id} className={`relative pl-8 ${idx === 2 ? 'opacity-60' : ''}`}>
                                        <div className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ${dotColor} ring-4 ring-surface`}></div>
                                        <p className={`text-[11px] font-black ${textColor} uppercase tracking-widest leading-none mb-1`}>
                                            {dateLabel}
                                        </p>
                                        <h5 className="font-bold text-on-surface leading-tight">{event.title}</h5>
                                        <p className="text-xs text-on-surface-variant mt-1">{event.courseName}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <Link to="/schedule" className="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant/50 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-sm">event_repeat</span>
                        View Full Calendar
                    </Link>
                </section>

                {/* Support Widget */}
                <div className="bg-primary-container/10 p-6 rounded-3xl border border-primary-container/20">
                    <p className="text-sm font-bold text-primary-container mb-2">Need academic help?</p>
                    <p className="text-xs text-on-secondary-container leading-relaxed mb-4">Connect with a peer tutor or access the writing lab resources directly.</p>
                    <a className="inline-flex items-center gap-2 text-sm font-black text-primary hover:gap-3 transition-all" href="#">
                        Explore Resources <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                </div>
            </aside>
        </div>
    );
}
