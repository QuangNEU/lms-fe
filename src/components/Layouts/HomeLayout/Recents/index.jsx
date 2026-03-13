import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import styles from "./Recents.module.scss"
import Button from "../../../Buttons"
import Course from "../../../Courses"

const cx = classNames.bind(styles)
const mockCoursesList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
function Recents() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setItemsPerPage(1);
            } else if (width < 768) {
                setItemsPerPage(2);
            } else if (width < 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(4);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    const handlePrev = () => {
        if (currentIndex > 0) {
            const newIndex = Math.max(0, currentIndex - itemsPerPage);
            setCurrentIndex(newIndex)
        }
    }

    const handleNext = () => {
        if (currentIndex + itemsPerPage < mockCoursesList.length) {
            setCurrentIndex(currentIndex + itemsPerPage)
        }
    }

    const visibleCourse = mockCoursesList.slice(currentIndex, currentIndex + itemsPerPage)
    return (
        <div className={cx('wrapper')}>
            <h3>Các khóa học gần đây</h3>
            <div className={cx('box')}>
                <div className={cx('action')}>
                    <Button onClick={handlePrev} disabled={currentIndex === 0}>&lt;</Button>
                    <Button onClick={handleNext} disabled={currentIndex + itemsPerPage >= mockCoursesList.length}>&gt;</Button>
                </div>
                <div className={cx('recentCourse')}>
                    {visibleCourse.map((courseItem, index) =>
                        (<Course key={index}></Course>)
                    )}
                </div>
            </div>
        </div>
    )
}
export default Recents