import Header from "../components/Header"
import Footer from "../components/Footer"
import styles from "./DefaultLayout.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                {children}
            </div>
            <Footer />
        </div>
    )
}
export default DefaultLayout;