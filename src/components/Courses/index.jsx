import styles from "./Courses.module.scss"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)
function Course() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx("coursePic")} >
                <img src=""></img>
            </div>
            <div className={cx('semester')}>HK1-2025-2026</div>
            <div className={cx('courseName')}>Khoa hoc 1</div>
        </div>
    )
}

export default Course