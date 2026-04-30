import { Link, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useEffect, useState } from 'react';

export default function CourseMembers() {
    const { id } = useParams();
    const fetchAPI = useFetch();

    // --- KHAI BÁO STATE ---
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLetter, setSelectedLetter] = useState('ALL');
    const [courseInfo, setCourseInfo] = useState(null); // 🌟 Thêm state lưu tên khóa học

    const removeVietnameseTones = (str) => {
        if (!str) return '';
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    // --- GỌI API ---
    // --- GỌI API (Lấy Tên khóa học + Danh sách thành viên) ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Gọi song song 2 API cho nhanh
                const [courseRes, membersRes] = await Promise.all([
                    fetchAPI(`http://localhost:5000/courses/${id}`, { method: 'GET' }),
                    fetchAPI(`http://localhost:5000/courses/${id}/members`, { method: 'GET' })
                ]);

                const courseResult = await courseRes.json();
                const membersResult = await membersRes.json();

                if (courseRes.ok && courseResult.success) {
                    setCourseInfo(courseResult.data);
                }

                if (membersRes.ok && membersResult.success) {
                    setMembers(membersResult.data);
                } else {
                    setError('Không thể tải danh sách thành viên');
                }
            } catch (err) {
                if (err.message !== 'Unauthorized') {
                    setError('Mất kết nối tới máy chủ');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id]);

    // --- LOGIC TÌM KIẾM ---
    const filteredMembers = members.filter(member => {
        const matchName = member.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchEmail = member.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchName || matchEmail;
    });

    // --- FORMAT THỜI GIAN ---
    const formatLastAccess = (dateString) => {
        if (!dateString) return 'Chưa truy cập';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };


    const filteredMembersAZ = members.filter(member => {
        const fullName = member.full_name || 'Người dùng ẩn danh';
        const email = member.email || '';

        // BƯỚC 1: Xử lý tìm kiếm (Tìm trên toàn bộ Họ và Tên)
        // Dùng hàm tẩy dấu để gõ 'nguyen' vẫn ra 'Nguyễn'
        const normalizedFullName = removeVietnameseTones(fullName).toLowerCase();
        const normalizedSearch = removeVietnameseTones(searchTerm).toLowerCase();

        const matchSearch = normalizedFullName.includes(normalizedSearch) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());

        // BƯỚC 2: Xử lý lọc A-Z (Chỉ lọc theo TÊN - Từ cuối cùng)
        // Cắt chuỗi thành mảng: "Nguyễn Thùy Linh" -> ["Nguyễn", "Thùy", "Linh"]
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[nameParts.length - 1]; // Lấy chữ cuối cùng ("Linh")

        // Lấy chữ cái đầu tiên của Tên và tẩy dấu ("Linh" -> "L", "Ánh" -> "A")
        const firstLetterOfName = removeVietnameseTones(firstName).charAt(0).toUpperCase();

        const matchLetter = selectedLetter === 'ALL' || firstLetterOfName === selectedLetter;

        // BƯỚC 3: Trả về kết quả thỏa mãn cả 2 điều kiện
        return matchSearch && matchLetter;
    });

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Breadcrumbs & Header */}
            {/* Header & Breadcrumbs */}
            <div className="mb-8">
                <nav className="flex text-sm text-on-surface-variant mb-3 font-medium">
                    <Link className="hover:text-primary transition-colors" to={`/courses`}>My Courses</Link>
                    <span className="mx-2 opacity-50">/</span>
                    {/* 🌟 ĐỔI THÀNH TÊN KHÓA HỌC ĐỘNG */}
                    <Link className="hover:text-primary transition-colors truncate max-w-[200px]" to={`/courses/${id}`}>
                        {courseInfo?.course_name || `Khóa học #${id}`}
                    </Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="text-on-surface">Members</span>
                </nav>
                <div className="flex items-center justify-between">
                    {/* 🌟 ĐỔI THÀNH TÊN KHÓA HỌC ĐỘNG (HOẶC MÃ KHÓA HỌC) */}
                    <h2 className="text-3xl font-extrabold headline tracking-tight text-on-surface truncate pr-4">
                        {courseInfo ? `${courseInfo.course_code} - ${courseInfo.course_name}` : 'Danh sách thành viên'}
                    </h2>

                    <div className="flex gap-3 shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-lg text-on-surface font-semibold hover:bg-surface-container-highest transition-colors">
                            <span className="material-symbols-outlined text-[20px]">person_add</span> Add User
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md">
                            <span className="material-symbols-outlined text-[20px]">mail</span> Message All
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Navigation Tabs */}
            <div className="flex border-b border-outline-variant/20 mb-8">
                <Link to={`/courses/${id}`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Curriculum
                </Link>
                <Link to={`/courses/${id}/members`} className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">
                    Members
                </Link>
                <Link to={`/courses/${id}/grades`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Grades
                </Link>
                <Link to={`/courses/${id}/assignments`} className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                    Assignments
                </Link>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-12 gap-6 mb-10">
                <div className="col-span-12 md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-on-surface-variant font-medium text-sm">Class Statistics</h3>
                        <div className="flex items-end gap-6 pt-2">
                            <div>
                                {/* 🌟 Đổ data tổng số user vào đây */}
                                <p className="text-3xl font-black headline text-primary">{members.length}</p>
                                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Total Students</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100"></div>
                            <div>
                                <p className="text-3xl font-black headline text-on-surface">1</p>
                                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Instructors</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100"></div>
                            <div>
                                <p className="text-3xl font-black headline text-on-surface">98%</p>
                                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter">Engagement</p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <img alt="Graph illustration" className="opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4cHy7G049R2g1V_nk7i2QHhshnuwhOFf4tXlvg3cRlLke3iSdfgZQCvBC4fR3NwnLDnmD9ZUBsB7J2_BVCpF3vUe-ea4F2TOmtfZPBYyN7BfLhaicNqLJZcVjke6UiqjyggzhWqVGhaYWey2MwwkNBsnBU63n4DK56sFA5F02WcMNFjJy-ds9Q1VDTYRpM8U-f2I9qwdJu3FE6BwAkfAI4xx7OxfItkd_lArKD4DytrDEXrmjoVxAMvR5YpNm2XR0iK-dkX7fZaY" />
                    </div>
                </div>
                <div className="col-span-12 md:col-span-4 bg-primary text-white rounded-xl p-6 shadow-md relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-blue-100 font-medium text-sm">Active Sessions</h3>
                        <p className="text-4xl font-black headline mt-2">12</p>
                        <p className="text-sm text-blue-100/80 mt-1">Users online right now</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20">
                        <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                    </div>
                </div>
            </div>

            {/* Controls & Table Section */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                {/* Filter Bar */}
                <div className="p-6 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[300px] relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            {/* 🌟 Gắn state tìm kiếm vào input của bạn */}
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm outline-none"
                                placeholder="Search by name or email address..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select className="px-4 py-3 bg-surface-container border-none rounded-xl text-sm font-medium text-on-surface-variant focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option>All Roles</option>
                                <option>Giảng viên</option>
                                <option>Học viên</option>
                            </select>
                            <select className="px-4 py-3 bg-surface-container border-none rounded-xl text-sm font-medium text-on-surface-variant focus:ring-2 focus:ring-primary/20 cursor-pointer">
                                <option>All Groups</option>
                                <option>Group A</option>
                                <option>Group B</option>
                            </select>
                        </div>
                    </div>
                    {/* A-Z Filter */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                        <span className="text-xs font-bold text-on-surface-variant mr-3 uppercase">Filter by name:</span>

                        {/* Nút ALL */}
                        <button
                            onClick={() => setSelectedLetter('ALL')}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold shrink-0 transition-colors ${selectedLetter === 'ALL'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-on-surface-variant hover:bg-surface-container'
                                }`}
                        >
                            ALL
                        </button>

                        {/* Vòng lặp các nút từ A đến Z */}
                        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
                            <button
                                key={letter}
                                onClick={() => setSelectedLetter(letter)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors shrink-0 ${selectedLetter === letter
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-on-surface-variant hover:bg-surface-container'
                                    }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Member Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-left">
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Access</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Hiển thị Loading hoặc Error ngay trong bảng để không nát layout */}
                            {isLoading && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
                            )}
                            {error && (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                            )}

                            {/* 🌟 ĐỔ DỮ LIỆU TỪ API VÀO ĐÚNG HTML CỦA BẠN */}
                            {!isLoading && !error && filteredMembersAZ.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <img
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                                                src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.full_name || 'U'}&background=random`}
                                            />
                                            <div>
                                                <p className="font-bold text-on-surface">{member.full_name || 'Người dùng ẩn danh'}</p>
                                                <p className="text-xs text-on-surface-variant">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[11px] font-bold rounded uppercase tracking-wider">
                                            {member.role || 'Student'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface capitalize">
                                            {member.status === 'in_progress' ? 'Đang học' : member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-on-surface-variant">
                                            {formatLastAccess(member.last_accessed_at)}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors text-slate-400">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!isLoading && !error && filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        Không tìm thấy học viên nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50">
                    <p className="text-sm text-on-surface-variant">
                        Showing <span className="font-bold text-on-surface">{filteredMembers.length > 0 ? 1 : 0} - {filteredMembers.length}</span> of <span className="font-bold text-on-surface">{members.length}</span> members
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-semibold text-on-surface bg-surface-container rounded-lg opacity-50 cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 text-sm font-semibold text-on-surface bg-surface-container rounded-lg hover:bg-surface-container-high transition-colors">Next</button>
                    </div>
                </div>
            </section>
        </div>
    );
}