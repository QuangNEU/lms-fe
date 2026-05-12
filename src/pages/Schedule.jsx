import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

export default function Schedule() {
    const fetchAPI = useFetch();

    // 1. CÁC STATE QUẢN LÝ DỮ LIỆU
    const [allEvents, setAllEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. STATE QUẢN LÝ THỜI GIAN HIỆN TẠI
    const [currentDate] = useState(new Date());

    // Hàm phụ trợ: Lấy class màu sắc dựa trên loại bài kiểm tra
    const getEventColor = (type) => {
        switch (type) {
            case 'final': return 'bg-red-100 text-red-700 border-red-600';
            case 'midterm': return 'bg-purple-100 text-purple-700 border-purple-600';
            case 'practice':
            default: return 'bg-blue-100 text-blue-700 border-blue-600';
        }
    };

    // ==========================================
    // LOGIC GỌI API & XỬ LÝ DỮ LIỆU
    // ==========================================
    useEffect(() => {
        const loadScheduleData = async () => {
            try {
                const response = await fetchAPI(`${import.meta.env.VITE_API_URL}/schedule`, {
                    method: 'GET'
                });

                const result = await response.json();

                if (result.success) {
                    const now = new Date();

                    // Format lại toàn bộ dữ liệu trả về từ DB
                    const formattedEvents = result.data.map(quiz => {
                        // Lấy thời gian bắt đầu và kết thúc
                        const startObj = new Date(quiz.start_time);
                        const dueObj = new Date(quiz.due_date);

                        // Format giờ (VD: 08:00 AM)
                        const startTimeStr = startObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        const dueTimeStr = dueObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                        return {
                            id: quiz.id, // Nhớ dùng quiz.id nhé
                            title: quiz.title,
                            courseName: quiz.Course ? quiz.Course.course_name : 'Unknown Course',
                            fullDateObj: startObj,
                            month: startObj.toLocaleString('en-US', { month: 'short' }),
                            day: startObj.getDate().toString().padStart(2, '0'),
                            // Nối 2 mốc thời gian lại với nhau
                            timeRange: `${startTimeStr} - ${dueTimeStr}`,
                            type: quiz.quiz_type || 'practice'
                        };
                    });

                    setAllEvents(formattedEvents);

                    // Lọc những bài chưa thi và sắp xếp
                    const futureEvents = formattedEvents.filter(e => e.fullDateObj >= now);
                    futureEvents.sort((a, b) => a.fullDateObj - b.fullDateObj);

                    setUpcomingEvents(futureEvents.slice(0, 3));
                }
            } catch (error) {
                console.error('Lỗi khi tải lịch:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadScheduleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ==========================================
    // LOGIC TỰ ĐỘNG TÍNH TOÁN VẼ LƯỚI LỊCH (GRID)
    // ==========================================
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthYearString = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    let firstDayOfWeek = new Date(year, month, 1).getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarGrid = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarGrid.unshift({
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            dateString: new Date(year, month - 1, daysInPrevMonth - i).toDateString()
        });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const thisDate = new Date(year, month, i);
        calendarGrid.push({
            day: i,
            isCurrentMonth: true,
            isToday: thisDate.toDateString() === new Date().toDateString(),
            dateString: thisDate.toDateString()
        });
    }

    const remainingSlots = (7 - (calendarGrid.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
        calendarGrid.push({
            day: i,
            isCurrentMonth: false,
            dateString: new Date(year, month + 1, i).toDateString()
        });
    }

    // ==========================================
    // RENDER GIAO DIỆN
    // ==========================================
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                        <span>Portal</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="font-semibold text-primary">Academic Calendar</span>
                    </nav>
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">{monthYearString}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-surface-container-high p-1 rounded-xl">
                        <button className="px-4 py-2 bg-surface-container-lowest shadow-sm rounded-lg text-sm font-bold text-primary">Month</button>
                        <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Week</button>
                        <button className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Day</button>
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform">
                        <span className="material-symbols-outlined text-sm">sync</span>
                        Sync with Calendar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* --- BẢNG LỊCH CHÍNH --- */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm ring-1 ring-black/[0.02]">
                        <div className="calendar-grid border-b border-surface-container-high pb-4 mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">{day}</div>
                            ))}
                        </div>

                        <div className="calendar-grid min-h-[700px]">
                            {calendarGrid.map((cell, index) => {
                                const dayEvents = allEvents.filter(e => e.fullDateObj.toDateString() === cell.dateString);

                                return (
                                    <div
                                        key={index}
                                        className={`p-2 border-r border-b border-surface-container-low min-h-[120px] transition-colors
                                            ${!cell.isCurrentMonth ? 'opacity-30 bg-surface-container-low/30' : 'hover:bg-surface cursor-pointer'}
                                            ${cell.isToday ? 'bg-blue-50/40 relative group' : ''}
                                        `}
                                    >
                                        <span className={`text-sm font-bold block mb-2 ${cell.isToday ? 'text-primary' : 'text-on-surface'}`}>
                                            {cell.day}
                                        </span>

                                        {cell.isToday && <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none"></div>}

                                        <div className="space-y-1.5">
                                            {dayEvents.map(event => (
                                                <div
                                                    key={event.id}
                                                    // Đổi màu động dựa theo quiz_type
                                                    className={`${getEventColor(event.type)} px-2 py-1 rounded-md border-l-2 shadow-sm`}
                                                >
                                                    <div className="text-[10px] font-bold truncate">{event.title}</div>
                                                    {/* HIỂN THỊ KHOẢNG THỜI GIAN TRÊN LỊCH CHÍNH */}
                                                    <div className="text-[8.5px] font-medium opacity-80 flex items-center gap-0.5 mt-0.5">
                                                        <span className="material-symbols-outlined text-[10px]">schedule</span>
                                                        {event.timeRange}
                                                    </div>
                                                </div>
                                            ))}
                                            {cell.isToday && <div className="mt-2 text-[9px] font-bold text-primary uppercase text-center">Today</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 items-center px-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Practice / Assignment</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-600"></div><span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Midterm Exams</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div><span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Final Exams / Deadlines</span></div>
                    </div>
                </div>

                {/* --- CỘT SIDEBAR --- */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-8">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline font-bold text-on-surface">Mini View</h3>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                            </div>
                        </div>
                        <div className="text-center text-xs text-on-surface-variant italic">Mini calendar UI goes here</div>
                    </div>

                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline font-bold text-on-surface">Upcoming This Week</h3>
                            <button className="text-primary text-xs font-bold hover:underline">View All</button>
                        </div>

                        <div className="space-y-6">
                            {isLoading ? (
                                <p className="text-sm text-center text-on-surface-variant">Đang tải lịch...</p>
                            ) : upcomingEvents.length === 0 ? (
                                <p className="text-sm text-center text-on-surface-variant">Không có bài kiểm tra nào sắp tới.</p>
                            ) : (
                                upcomingEvents.map((event) => {
                                    // Set màu cho icon lịch bên sidebar
                                    let badgeColor = "bg-blue-50 text-blue-600";
                                    if (event.type === 'midterm') badgeColor = "bg-purple-50 text-purple-600";
                                    if (event.type === 'final') badgeColor = "bg-red-50 text-red-600";

                                    return (
                                        <div key={event.id} className="flex gap-4 group">
                                            <div className={`flex flex-col items-center justify-center min-w-[48px] h-12 rounded-xl transition-colors ${badgeColor}`}>
                                                <span className="text-[10px] font-bold uppercase opacity-80">{event.month}</span>
                                                <span className="text-lg font-extrabold leading-none">{event.day}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${badgeColor.split(' ')[1]}`}>
                                                    {event.type}
                                                </p>
                                                <h4 className="text-sm font-bold text-on-surface leading-tight">{event.title}</h4>
                                                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                    {event.courseName}
                                                </p>
                                                {/* HIỂN THỊ KHOẢNG THỜI GIAN TRÊN SIDEBAR */}
                                                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                    {event.timeRange}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl p-6 text-white group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 z-0"></div>
                        <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 z-0 scale-110 group-hover:scale-100 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSI_qnSRiQ0J9AhNBoO4UyYD-CJB3vLOdN3OWo8vQDdOlFSWPvGoo1zO0VotGDBR8ammEaN4ifFI1-PDvTw10xgzGqAWxJ7FXSACjCmlsYqXEsthsYy9gEj0Uy5sweFg0CpgqXM1Ghop5siUsNiBz8HsG4MpIMDV84nmGf3uQbnL-22OR73DNna3vGcbz2JbPCQk2wpioRSVSfWEd-Mew2Fn_kxQKsRCubf61f9csoKaelJ2vL1fV6lQXWDTyWJ6Dbzf7rxcVP9So" alt="Faculty" />
                        <div className="relative z-10">
                            <h3 className="font-headline font-bold text-lg mb-2">Office Hours</h3>
                            <p className="text-xs text-blue-100 mb-4 leading-relaxed">Book a 15-min consultation with your course advisor this Wednesday.</p>
                            <button className="w-full py-2.5 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-colors">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
}
