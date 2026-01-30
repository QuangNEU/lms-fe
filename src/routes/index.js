import Home from "../pages/Home"
import Course from "../pages/Course"
import Login from "../pages/Login"

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/course/:id', component: Course },
    { path: '/login', component: Login }
]

const privateRoutes = []
export { publicRoutes, privateRoutes }