import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function Layout() {
    return (
        <div className="min-h-screen bg-surface text-on-surface font-body">
            <Sidebar />
            <TopNav />
            <main className="ml-64 pt-16 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
