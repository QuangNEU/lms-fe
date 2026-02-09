import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import logo from '../../../../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faBell } from '@fortawesome/free-solid-svg-icons';

import Search from '../Search';
import Button from '../../../Buttons/index'

const cx = classNames.bind(styles)
let currentUser = true
function Header() {
    return (
        <header className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <img src={logo} className={cx('logo-icon')}></img>
                    <h2 className={cx('logo-text')}>Smart-LMS</h2>
                </div>
                <Search></Search>
                <div className={cx('action')}>
                    {currentUser ? (
                        <>
                            <Tippy delay={[0, 10]} content='Message' placement='bottom'>
                                <button className={cx('action-btn')}>
                                    <FontAwesomeIcon icon={faMessage}></FontAwesomeIcon>
                                </button>
                            </Tippy>
                            <Tippy delay={[0, 10]} content='Notification' placement='bottom'>
                                <button className={cx('action-btn')}>
                                    <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button primary>Log in</Button>
                        </>
                    )
                    }
                </div>
            </div>
        </header>
    )
}

export default Header;