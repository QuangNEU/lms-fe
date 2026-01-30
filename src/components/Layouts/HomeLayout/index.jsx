import Header from "../components/Header"
import Recents from "./Recents"
import Events from "./Events"
import Schedules from "./Schedules"
function HomeLayout({ children }) {
    return (
        <div className="wrapper">
            <Header />
            <div className="container">
                <Recents />
                <Events />
                <Schedules />
            </div>
        </div>

    )
}
export default HomeLayout