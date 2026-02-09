import Home from "../pages/Home"
import Course from "../pages/Course"
import Login from "../pages/Login"
import HomeLayout from "../components/Layouts/HomeLayout"
import DefaultLayout from "../components/Layouts/DefaultLayout"

const publicRoutes = [
    { path: '/login', component: Login, layout: DefaultLayout }
]

const privateRoutes = [
    { path: '/', component: Home, layout: HomeLayout },
    { path: '/course/:id', component: Course, layout: DefaultLayout },
]
export { publicRoutes, privateRoutes }