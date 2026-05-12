import { useState, useEffect } from 'react';
// Nhớ import useFetch từ đúng đường dẫn của bạn nhé!
import { useFetch } from '../hooks/useFetch';

export default function Settings() {
    // Gọi custom hook ra để dùng
    const fetchAPI = useFetch();

    // 1. Khởi tạo State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 2. TỰ ĐỘNG LẤY DỮ LIỆU KHI MỞ TRANG
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Dùng fetchAPI của bạn, nhớ truyền đúng URL nhé 
                // (Nếu đã có proxy thì dùng '/api/users/profile', chưa có thì ghi full URL ${import.meta.env.VITE_API_URL}/api...)
                const response = await fetchAPI(`${import.meta.env.VITE_API_URL}/users/profile`, {
                    method: 'GET'
                });

                const data = await response.json();

                if (data.success && data.data) {
                    const user = data.data;

                    setEmail(user.email || '');
                    setAvatarUrl(user.avatar_url || '');

                    // Tách full_name từ DB thành First Name và Last Name
                    if (user.full_name) {
                        const nameParts = user.full_name.trim().split(' ');
                        setFirstName(nameParts[0] || '');
                        setLastName(nameParts.slice(1).join(' ') || '');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi kéo dữ liệu hồ sơ:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3. HÀM XỬ LÝ LƯU DỮ LIỆU
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Dùng fetchAPI, chỉ cần truyền URL, method và body. Token tự lo!
            const response = await fetchAPI(`${import.meta.env.VITE_API_URL}/users/profile`, {
                method: 'PUT',
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    avatar_url: avatarUrl
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Cập nhật thông tin cá nhân thành công!');
            } else {
                alert('Cập nhật thất bại: ' + data.message);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            alert('Lỗi kết nối máy chủ hoặc Token hết hạn!');
        } finally {
            setIsSaving(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-on-surface-variant font-medium">Đang tải dữ liệu hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold headline tracking-tight text-on-surface">Settings</h2>
                <p className="text-on-surface-variant mt-2">Manage your account preferences and application settings.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary">Profile</button>
                    <button className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Notifications</button>
                    <button className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Appearance</button>
                    <button className="px-6 py-4 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">Security</button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-on-surface mb-4">Personal Information</h3>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative">
                                <img
                                    src={avatarUrl || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-surface"
                                />
                                <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                            </div>
                            <div>
                                <button type="button" className="px-4 py-2 bg-surface-container rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">Upload New Picture</button>
                                <p className="text-xs text-on-surface-variant mt-2">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    <div className="flex justify-end gap-4">
                        <button type="button" className="px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-md transition-opacity ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
