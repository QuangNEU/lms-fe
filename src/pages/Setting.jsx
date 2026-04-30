export default function Settings() {
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

                <div className="p-8 space-y-8">
                    {/* Profile Section */}
                    <section>
                        <h3 className="text-lg font-bold text-on-surface mb-4">Personal Information</h3>
                        <div className="flex items-center gap-6 mb-6">
                            <div className="relative">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrQWD2Z9cFbJNbTGyjxQFJ5JzuDZ9y7XPK6bnxuhbt1RcDxj598NrXAFJsSYqsZ4_m44fRZrJxOjrdciDa-yxPf4R37EZrSdMPFT7YyDOkOck8hxwkv9pDIHZXc4DCkAy6gqa25xNrfGs6HRPNB9OI88ilYtuR9-WzJnHEERPwbB1hfciXNYAtVrIfCpdlG1ycuQU58XGwnYBA7qkF-p_FFSx-CKQFNlAwas41lcPUkkj6BwlkAoFUe8V2aeeSsa-8Zi3zKMf0jLw" alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-surface" />
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                </button>
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-surface-container rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">Upload New Picture</button>
                                <p className="text-xs text-on-surface-variant mt-2">JPG, GIF or PNG. Max size of 800K</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">First Name</label>
                                <input type="text" defaultValue="Jonathan" className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Last Name</label>
                                <input type="text" defaultValue="Vance" className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                                <input type="email" defaultValue="j.vance@atheneum.edu" className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Bio</label>
                                <textarea rows={4} defaultValue="Computer Science student focusing on network architecture and distributed systems." className="w-full px-4 py-3 bg-surface-container border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    <div className="flex justify-end gap-4">
                        <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
                        <button className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-md hover:opacity-90 transition-opacity">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
