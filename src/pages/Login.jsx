import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('')
        setIsLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('access_token', result.data.token)
                login(result.data.token)
                navigate('/')
            }
            else {
                setError(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }
        }
        catch (err) {
            console.error("Lỗi mạng:", err);
            setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex text-slate-900 font-sans">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2400&auto=format&fit=crop")' }}
                >
                    <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight">Nexus Academic</span>
                    </div>

                    <h1 className="text-white text-6xl font-bold leading-tight mb-6 tracking-tight">
                        The Digital<br />Atheneum.
                    </h1>
                    <p className="text-blue-100/80 text-xl max-w-md leading-relaxed mb-16">
                        A sanctuary for higher learning, where data meets intuition to empower the next generation of academic excellence.
                    </p>

                    <div className="flex gap-16">
                        <div>
                            <p className="text-white text-4xl font-bold mb-1">42k+</p>
                            <p className="text-blue-200 text-xs font-bold tracking-widest uppercase">Students</p>
                        </div>
                        <div>
                            <p className="text-white text-4xl font-bold mb-1">1.2k+</p>
                            <p className="text-blue-200 text-xs font-bold tracking-widest uppercase">Institutions</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Card */}
                <div className="relative z-10 mt-auto">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-sm flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Knowledge First</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">Access over 500 academic repositories.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-[440px]">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 text-sm mb-8">Enter your credentials to access your academic dashboard.</p>

                        {/* SSO Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 transition-colors">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 transition-colors">
                                <img src="https://www.svgrepo.com/show/452062/microsoft.svg" alt="Microsoft" className="w-4 h-4" />
                                Microsoft
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center justify-center mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative bg-white px-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Or email login
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@university.edu"
                                    className="w-full px-4 py-3.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    onChange={(e) => setEmail(e.target.value)
                                    }
                                    required
                                    value={email}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-slate-900">Password</label>
                                    <a href="#" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-4 pr-12 py-3.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600">Stay logged in for 30 days</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0047cc] hover:bg-[#003bb3] disabled:bg-blue-300 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/20 transition-all mt-6"
                            >
                                {isLoading ? 'Đang xác thực...' : 'Sign In'}
                                {!isLoading && <span className="material-symbols-outlined text-[18px]">login</span>}
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-600 mt-8">
                            New to Nexus? <a href="#" className="font-bold text-blue-700 hover:text-blue-800">Create academic account</a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                    <p>© 2024 Nexus Academic LMS.<br />The Digital Atheneum.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
