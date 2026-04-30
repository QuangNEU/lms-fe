import { Link } from 'react-router-dom';

export default function Schedule() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Page Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                        <span>Portal</span>
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                        <span className="font-semibold text-primary">Academic Calendar</span>
                    </nav>
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">October 2024</h2>
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
                {/* Main Calendar Block */}
                <div className="col-span-12 lg:col-span-8 xl:col-span-9">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm ring-1 ring-black/[0.02]">
                        {/* Days of Week Header */}
                        <div className="calendar-grid border-b border-surface-container-high pb-4 mb-2">
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Mon</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tue</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Wed</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Thu</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Fri</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sat</div>
                            <div className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sun</div>
                        </div>
                        {/* Calendar Grid */}
                        <div className="calendar-grid min-h-[700px]">
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] opacity-30">
                                <span className="text-sm font-medium">30</span>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors cursor-pointer group">
                                <span className="text-sm font-bold text-on-surface mb-2 block">1</span>
                                <div className="space-y-1">
                                    <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-blue-600">Advanced Calc I</div>
                                    <div className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-purple-600">Midterm: Psych</div>
                                </div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors">
                                <span className="text-sm font-bold text-on-surface mb-2 block">2</span>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors">
                                <span className="text-sm font-bold text-on-surface mb-2 block">3</span>
                                <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-blue-600">Macro Economics</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors">
                                <span className="text-sm font-bold text-on-surface mb-2 block">4</span>
                                <div className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-red-600">Thesis Proposal</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">5</span></div>
                            <div className="p-2 border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">6</span></div>

                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">7</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] bg-blue-50/40 relative group">
                                <span className="text-sm font-bold text-primary mb-2 block">8</span>
                                <div className="absolute inset-0 border-2 border-primary/20 pointer-events-none"></div>
                                <div className="space-y-1">
                                    <div className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-md font-bold truncate shadow-sm">Advanced Calc I</div>
                                    <div className="bg-white border border-slate-200 text-slate-700 text-[10px] px-2 py-1 rounded-md font-bold truncate">Lab Session</div>
                                </div>
                                <div className="mt-2 text-[9px] font-bold text-primary uppercase text-center">Today</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">9</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors">
                                <span className="text-sm font-bold">10</span>
                                <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-blue-600">Macro Economics</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">11</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">12</span></div>
                            <div className="p-2 border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">13</span></div>

                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">14</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">15</span>
                                <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-blue-600">Advanced Calc I</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">16</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">17</span>
                                <div className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-blue-600">Macro Economics</div>
                                <div className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-red-600 mt-1">Quiz 3: Macro</div>
                            </div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">18</span></div>
                            <div className="p-2 border-r border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">19</span></div>
                            <div className="p-2 border-b border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">20</span></div>

                            <div className="p-2 border-r border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">21</span></div>
                            <div className="p-2 border-r border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">22</span>
                                <div className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-md font-bold truncate border-l-2 border-purple-600">Final Presentation</div>
                            </div>
                            <div className="p-2 border-r border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">23</span></div>
                            <div className="p-2 border-r border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">24</span></div>
                            <div className="p-2 border-r border-surface-container-low min-h-[120px] hover:bg-surface transition-colors"><span className="text-sm font-bold">25</span></div>
                            <div className="p-2 border-r border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">26</span></div>
                            <div className="p-2 border-surface-container-low min-h-[120px] bg-surface-container-low/30"><span className="text-sm font-medium">27</span></div>
                        </div>
                    </div>
                    {/* Event Legend */}
                    <div className="mt-6 flex flex-wrap gap-6 items-center px-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Academic Classes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Deadlines</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Exams & Quizzes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Personal/Other</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-8">
                    {/* Calendar Picker (Mini) */}
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline font-bold text-on-surface">Mini View</h3>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                                <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 text-center">
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase">M</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase">T</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase">W</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase">T</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase">F</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase text-error">S</div>
                            <div className="text-[10px] font-bold text-on-surface-variant opacity-50 uppercase text-error">S</div>
                            <div className="text-xs py-1.5 opacity-20">30</div>
                            <div className="text-xs py-1.5 font-medium">1</div>
                            <div className="text-xs py-1.5 font-medium">2</div>
                            <div className="text-xs py-1.5 font-medium">3</div>
                            <div className="text-xs py-1.5 font-medium">4</div>
                            <div className="text-xs py-1.5 font-medium">5</div>
                            <div className="text-xs py-1.5 font-medium">6</div>
                            <div className="text-xs py-1.5 font-medium">7</div>
                            <div className="text-xs py-1.5 bg-primary text-white rounded-full font-bold">8</div>
                            <div className="text-xs py-1.5 font-medium">9</div>
                            <div className="text-xs py-1.5 font-medium">10</div>
                            <div className="text-xs py-1.5 font-medium">11</div>
                            <div className="text-xs py-1.5 font-medium">12</div>
                            <div className="text-xs py-1.5 font-medium">13</div>
                        </div>
                    </div>

                    {/* Upcoming Section */}
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-headline font-bold text-on-surface">Upcoming This Week</h3>
                            <button className="text-primary text-xs font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center justify-center min-w-[48px] h-12 bg-surface-container rounded-xl group-hover:bg-primary/5 transition-colors">
                                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Oct</span>
                                    <span className="text-lg font-extrabold leading-none text-primary">09</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Lecture</p>
                                    <h4 className="text-sm font-bold text-on-surface leading-tight">Advanced Calculus II</h4>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        10:30 AM - 12:00 PM
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center justify-center min-w-[48px] h-12 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                    <span className="text-[10px] font-bold uppercase text-red-400">Oct</span>
                                    <span className="text-lg font-extrabold leading-none text-red-600">10</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">Deadline</p>
                                    <h4 className="text-sm font-bold text-on-surface leading-tight">Physics Lab Report 4</h4>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">flag</span>
                                        Due by 11:59 PM
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="flex flex-col items-center justify-center min-w-[48px] h-12 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                    <span className="text-[10px] font-bold uppercase text-purple-400">Oct</span>
                                    <span className="text-lg font-extrabold leading-none text-purple-600">12</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-0.5">Exam</p>
                                    <h4 className="text-sm font-bold text-on-surface leading-tight">Economic Principles</h4>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        Hall B-42
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Faculty Contact / Quick Link */}
                    <div className="relative overflow-hidden rounded-2xl p-6 text-white group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 z-0"></div>
                        <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 z-0 scale-110 group-hover:scale-100 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSI_qnSRiQ0J9AhNBoO4UyYD-CJB3vLOdN3OWo8vQDdOlFSWPvGoo1zO0VotGDBR8ammEaN4ifFI1-PDvTw10xgzGqAWxJ7FXSACjCmlsYqXEsthsYy9gEj0Uy5sweFg0CpgqXM1Ghop5siUsNiBz8HsG4MpIMDV84nmGf3uQbnL-22OR73DNna3vGcbz2JbPCQk2wpioRSVSfWEd-Mew2Fn_kxQKsRCubf61f9csoKaelJ2vL1fV6lQXWDTyWJ6Dbzf7rxcVP9So" />
                        <div className="relative z-10">
                            <h3 className="font-headline font-bold text-lg mb-2">Office Hours</h3>
                            <p className="text-xs text-blue-100 mb-4 leading-relaxed">Book a 15-min consultation with your course advisor this Wednesday.</p>
                            <button className="w-full py-2.5 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-xl hover:bg-blue-50 transition-colors">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contextual FAB */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
    );
}
