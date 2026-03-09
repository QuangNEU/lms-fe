import classNames from "classnames/bind"
import styles from "./Events.module.scss"

const cx = classNames.bind(styles)
function Events() {
    return (
        <div className={classNames('wrapper')}>
            Events
        </div>
    )
}
export default Events