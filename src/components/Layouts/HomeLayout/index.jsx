import Header from "../components/Header"
import Recents from "./Recents"
import Events from "./Events"
import Schedules from "./Schedules"
import Footer from "../components/Footer"
import styles from "./HomeLayout.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)
function HomeLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <Header />
            <div className={cx("container")}>
                <div className={cx("main-content")}>
                    <Recents />
                    {children}
                </div>
                <div className={cx('side-content')}>
                    <Events />
                    <Schedules />
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default HomeLayout