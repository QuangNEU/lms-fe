import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { useFetch } from '../hooks/useFetch';

export default function Dashboard() {
    const carouselRef = useRef(null);
    const { user, logout } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')
    const fetchAPI = useFetch();

    useEffect(() => {
        const fetchMyCourse = async () => {
            try {
                const response = await fetchAPI('http://localhost:5000/courses/mycourse', {
                    method: 'GET',
                });
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    setCourses(data.data);
                    console.log(courses)
                } else {
                    setError('Không thể tải danh sách khóa học.');
                }
            }
            catch (err) {
                console.error("Lỗi mạng:", err);
                setError('Mất kết nối đến máy chủ!');
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchMyCourse()
    }, [])

    const displayName = user?.full_name ? user.full_name.split(' ').slice(-2).join(' ') : 'Student';

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    // 🌟 Lấy 12 khóa học mới nhất từ mảng courses và tự động thêm UI (Màu sắc, Icon)
    // 🌟 LỌC NHỮNG KHÓA ĐÃ TRUY CẬP VÀ LẤY TỐI ĐA 12 KHÓA GẦN NHẤT
    const recentCourses = courses
        .filter(course => course.last_accessed_at !== null) // BẮT BUỘC: Chỉ lấy khóa đã từng truy cập
        .slice(0, 12)
        .map((course, index) => {
            // Bộ 5 màu sắc và icon sinh động để gán luân phiên
            const styles = [
                { bgIcon: 'bg-blue-100', textIcon: 'text-blue-600', bgProgress: 'bg-blue-600', icon: 'code' },
                { bgIcon: 'bg-purple-100', textIcon: 'text-purple-600', bgProgress: 'bg-purple-600', icon: 'dns' },
                { bgIcon: 'bg-orange-100', textIcon: 'text-orange-600', bgProgress: 'bg-orange-600', icon: 'database' },
                { bgIcon: 'bg-green-100', textIcon: 'text-green-600', bgProgress: 'bg-green-600', icon: 'terminal' },
                { bgIcon: 'bg-red-100', textIcon: 'text-red-600', bgProgress: 'bg-red-600', icon: 'security' },
            ];

            // Toán tử chia lấy dư (%) giúp lặp lại màu sắc khi danh sách dài hơn 5
            const style = styles[index % styles.length];

            return {
                id: course.id,
                title: course.course_name,
                module: course.course_code,
                // Giả lập tiến độ ngẫu nhiên từ 10% đến 90%
                progress: course.progress || Math.floor(Math.random() * 80) + 10,
                ...style
            };
        });
    console.log(user)
    return (
        <div className="p-8 flex gap-8">
            {/* Central Dashboard Canvas */}
            <div className="flex-[3] space-y-10 min-w-0">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl bg-primary min-h-[220px] flex items-center px-12 group">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img
                            alt="Abstract library background"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWEGW-wBDuxCkhWN2D4Hz72BTeb5RE2Kk31SnUj98YukIPtyeeH6dViCijo3oT9BaPQ0rVbFWydNTVpGN1WJvIS01Ld_or6Ke8zpCfFM9FBsIJ3N_pitr8QwwYjhZgG3Egn0SEvnvl8gW0zaDPKzmvpcq3wygmaH_pjDAF8jdbGeuB9cxPY7VN8BcP0KdjXkuWc6aYWYkFISyp-mxdbl8bc2cSCCnvWZAl9yD-tMubCd7DnB6beJMAUP5S_hzxV8Nkgg4YBtk1F-Y"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
                    <div className="relative z-10 w-full flex justify-between items-end">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome back, {displayName}</h2>
                            <p className="text-on-primary-container text-lg font-medium opacity-90">You've completed 82% of your semester goals. Keep it up!</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/10">
                                <p className="text-xs text-white/70 uppercase tracking-widest font-bold">GPA</p>
                                <p className="text-3xl font-black text-white">3.88</p>
                            </div>
                            <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[100px] border border-white/10">
                                <p className="text-xs text-white/70 uppercase tracking-widest font-bold">Credits</p>
                                <p className="text-3xl font-black text-white">18</p>
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
                        {isLoading ? (
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
                                            {/* Tạo ảnh cover bằng API Avatar dựa trên mã môn học */}
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
                                                    <div className="bg-blue-600 h-full w-[30%]"></div>
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">30%</span>
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
                {/* Mini Calendar Widget */}
                <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-lg">October 2023</h4>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                            <button className="p-1 hover:bg-surface-container rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">M</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">T</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">W</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">T</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">F</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">S</div>
                        <div className="text-[10px] font-black text-on-surface-variant uppercase opacity-50">S</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        <div className="p-2 text-sm text-outline opacity-30">26</div>
                        <div className="p-2 text-sm text-outline opacity-30">27</div>
                        <div className="p-2 text-sm text-outline opacity-30">28</div>
                        <div className="p-2 text-sm text-outline opacity-30">29</div>
                        <div className="p-2 text-sm text-outline opacity-30">30</div>
                        <div className="p-2 text-sm font-bold">1</div>
                        <div className="p-2 text-sm font-bold">2</div>
                        <div className="p-2 text-sm font-bold">3</div>
                        <div className="p-2 text-sm font-bold">4</div>
                        <div className="p-2 text-sm font-bold">5</div>
                        <div className="p-2 text-sm font-bold">6</div>
                        <div className="p-2 text-sm font-bold">7</div>
                        <div className="p-2 text-sm font-bold">8</div>
                        <div className="p-2 text-sm font-bold">9</div>
                        <div className="p-2 text-sm font-bold">10</div>
                        <div className="p-2 text-sm font-bold">11</div>
                        <div className="p-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20">12</div>
                        <div className="p-2 text-sm font-bold">13</div>
                        <div className="p-2 text-sm font-bold">14</div>
                        <div className="p-2 text-sm font-bold">15</div>
                        <div className="p-2 text-sm font-bold">16</div>
                    </div>
                </section>

                {/* Upcoming Deadlines Timeline */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h4 className="font-bold text-lg">Upcoming</h4>
                        <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">3 THIS WEEK</span>
                    </div>
                    <div className="space-y-6 relative ml-4 before:content-[''] before:absolute before:left-[-1px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-error ring-4 ring-surface"></div>
                            <p className="text-[11px] font-black text-error uppercase tracking-widest leading-none mb-1">TODAY • 11:59 PM</p>
                            <h5 className="font-bold text-on-surface leading-tight">Biotech Research Paper</h5>
                            <p className="text-xs text-on-surface-variant mt-1">Submit via TurnItIn portal</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface"></div>
                            <p className="text-[11px] font-black text-primary uppercase tracking-widest leading-none mb-1">THUR • 02:00 PM</p>
                            <h5 className="font-bold text-on-surface leading-tight">Economic Model Workshop</h5>
                            <p className="text-xs text-on-surface-variant mt-1">Room 402, Behavioral Sciences</p>
                        </div>
                        <div className="relative pl-8 opacity-60">
                            <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-outline-variant ring-4 ring-surface"></div>
                            <p className="text-[11px] font-black text-outline uppercase tracking-widest leading-none mb-1">FRI • 09:00 AM</p>
                            <h5 className="font-bold text-on-surface leading-tight">Urban Planning Quiz</h5>
                            <p className="text-xs text-on-surface-variant mt-1">20 Multiple Choice questions</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant/50 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all">
                        <span className="material-symbols-outlined text-sm">event_repeat</span>
                        Sync with Calendar
                    </button>
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
