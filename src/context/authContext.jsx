import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Tạo một cái Kho rỗng
export const AuthContext = createContext();

// 2. Tạo một Component "Người bảo vệ" để bọc ứng dụng lại
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Chứa thông tin giải mã (Tên, Role...)
    const [loading, setLoading] = useState(true); // Trạng thái chờ load trang ban đầu


    const handleSetUserFromToken = (token) => {
        try {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        } catch (error) {
            console.error("Token lỗi:", error);
            setUser(null);
        }
    };
    // Hàm chạy 1 lần duy nhất khi người dùng mới mở Web lên
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            handleSetUserFromToken(token); // Tái sử dụng code
        }
        setLoading(false); // Xong việc kiểm tra thì tắt loading
    }, []);

    const login = (token) => {
        localStorage.setItem('access_token', token); // Cất ví
        handleSetUserFromToken(token); // Tái sử dụng code giải mã và cập nhật state
    };


    useEffect(() => {
        let timeoutId;

        // Chỉ chạy nếu user tồn tại và có thuộc tính exp (hạn sử dụng)
        if (user && user.exp) {
            const currentTime = Date.now();
            const expireTime = user.exp * 1000; // Đổi từ giây sang mili-giây
            const timeUntilExpiry = expireTime - currentTime; // Thời gian còn lại

            if (timeUntilExpiry > 0) {
                // Nếu thẻ còn hạn: Cài báo thức
                timeoutId = setTimeout(() => {
                    alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại!");
                    logout(); // Tự động đuổi ra ngoài
                }, timeUntilExpiry);
            } else {
                // Đề phòng trường hợp thẻ đã hết hạn từ trước nhưng vẫn kẹt trong máy
                logout();
            }
        }

        // HÀM DỌN DẸP (Cực kỳ quan trọng):
        // Nếu người dùng chủ động bấm "Đăng xuất" trước khi hết giờ,
        // React sẽ chạy hàm này để hủy cái báo thức đi, tránh bị lỗi bộ nhớ.
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [user]);

    // Hàm Đăng xuất dùng chung cho cả ứng dụng
    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const displayName = user?.full_name ? user.full_name.split(' ').slice(-2).join(' ') : "Student"

    // Những dữ liệu/hàm nào muốn chia sẻ cho các trang khác thì bỏ vào value
    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading, displayName, login }}>
            {children}
        </AuthContext.Provider>
    );
};