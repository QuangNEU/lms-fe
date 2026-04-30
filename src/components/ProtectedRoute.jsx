import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";


const ProtectedRoute = ({ children }) => {
    // Chỉ lấy đúng 2 biến từ Context, không đụng chạm đến localStorage nữa
    const { user, loading } = useContext(AuthContext);

    // 1. CHỜ ĐỢI: Nếu đang trong quá trình check token (loading = true), hiện màn hình chờ
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                {/* Bạn có thể thay bằng icon xoay vòng (spinner) cho đẹp */}
                <div className="animate-pulse text-slate-500 font-medium">
                    Đang kiểm tra quyền truy cập...
                </div>
            </div>
        );
    }

    // 2. PHÁN QUYẾT: Sau khi hết loading, nếu thực sự không có user -> Đuổi!
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. THÀNH CÔNG: Cho phép vào trang nội bộ
    return children;
}

export default ProtectedRoute;