import classNames from "classnames/bind"
import styles from "./Recents.module.scss"
import Button from "../../../Buttons"
import Course from "../../../Courses"

const cx = classNames.bind(styles)
function Recents() {
    return (
        <div className={cx('wrapper')}>
            <h3>Các khóa học gần đây</h3>
            <div className={cx('box')}>
                <div className={cx('action')}>
                    <Button ></Button>
                    <Button ></Button>
                </div>
                <div className={cx('recentCourse')}>
                    <Course></Course>
                    <Course></Course>
                    <Course></Course>
                    <Course></Course>
                </div>
            </div>
        </div>
    )
}
export default Recents