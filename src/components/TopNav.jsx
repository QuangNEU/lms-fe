import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function TopNav() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { displayName, logout, user } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        setIsDropdownOpen(!isDropdownOpen)
        logout()
        navigate('/login')
    }
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 transition-all border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative w-full max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-full text-sm focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-lowest transition-all outline-none"
                        placeholder="Search courses, materials, or grades..."
                        type="text"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-surface-container rounded-full transition-colors relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-slate-500 hover:bg-surface-container rounded-full transition-colors">
                    <span className="material-symbols-outlined">help_outline</span>
                </button>
                <div className="w-px h-6 bg-outline-variant/30 mx-2"></div>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-surface-container py-1 px-2 rounded-xl transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold leading-none">{displayName}</p>
                            <p className="text-xs text-on-surface-variant">{user?.role}</p>
                        </div>
                        <img
                            alt="Student Profile Avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE26GGhv0oZUy8UnQS9tewAUucFupyVtWe0svFOw3CPXWaN5vojRbZjEwMsacsP7st9Tq48Ws_sjUnaDhgOtRcpsmMM6M803SDToFwj5pAIvVzem-jlMjvchCLEvvKKWRvAteuhchlSuMTA3kDha3YX0sJFfIYCADoPN1swDNibMIZevHIDka0ttgS20-e9dgPyqYG4phmgM0KQsGwm_IDu5lvStIihX0Rkup5HKf8fS1fKXXO4dq_QrYC571cn0dwDNu7UELSSxU"
                        />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50">
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                Settings
                            </Link>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

