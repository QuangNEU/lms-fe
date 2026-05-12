import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const navItems = [
        { to: '/', icon: 'dashboard', label: 'Dashboard' },
        { to: '/courses/1', icon: 'school', label: 'My Courses' },
        { to: '/schedule', icon: 'calendar_today', label: 'Schedule' },
        { to: '/ai-assistant', icon: 'smart_toy', label: 'AI Assistant' },
        { to: '/settings', icon: 'settings', label: 'Settings' },
    ];

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-900 flex flex-col py-8 px-4 z-50 border-r border-slate-200 dark:border-slate-800">
            <div className="mb-10 px-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-100 leading-tight">Atheneum</h1>
                    <p className="text-xs text-slate-500 font-medium">Student Portal</p>
                </div>
            </div>
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors scale-95 active:duration-150 ${isActive
                                ? 'text-blue-700 dark:text-blue-300 font-bold border-r-4 border-blue-700 dark:border-blue-300 bg-slate-200/50 dark:bg-slate-800/50'
                                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="mt-auto px-2">
                <button className="w-full bg-primary-container text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
                    View All Courses
                </button>
            </div>
        </aside>
    );
}
