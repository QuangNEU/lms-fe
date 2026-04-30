import Login from "../pages/Login"
import Grades from "../pages/Grades";
import Assignments from "../pages/Assignments";
import AIAssistant from "../pages/AIAssistant";
import AIAssistantDashboard from "../pages/AIDashboard";
import Setting from "../pages/Setting";
import CourseMembers from "../pages/CourseMembers";
import CourseDetail from "../pages/CourseDetail";
import Schedule from "../pages/Schedule";
import Dashboard from "../pages/Dashboard"
import Quiz from "../pages/Quiz";

const publicRoutes = [
    { path: '/login', component: Login }
]

const privateRoutes = [
    { path: '', component: Dashboard },
    { path: 'courses/:id', component: CourseDetail },
    { path: 'courses/:id/members', component: CourseMembers },
    { path: 'courses/:id/grades', component: Grades },
    { path: 'courses/:id/assignments', component: Assignments },
    { path: 'schedule', component: Schedule },
    { path: 'ai-assistant', component: AIAssistantDashboard },
    { path: 'ai-assistant/:id', component: AIAssistant },
    { path: 'settings', component: Setting },
    { path: 'courses/:courseId/quizzes/:id/take', component: Quiz }
]
export { publicRoutes, privateRoutes }