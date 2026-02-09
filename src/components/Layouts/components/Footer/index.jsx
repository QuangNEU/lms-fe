import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('row')}>
                    {/* Cột 1: Giới thiệu */}
                    <div className={cx('column')}>
                        <div className={cx('logo-text')}>Smart-LMS</div>
                        <p className={cx('desc')}>
                            Nền tảng học tập trực tuyến hàng đầu dành cho sinh viên công nghệ.
                            Học mọi lúc, mọi nơi, nâng tầm tri thức.
                        </p>
                        <div className={cx('socials')}>
                            <a href="https://facebook.com" className={cx('social-btn')}><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="https://youtube.com" className={cx('social-btn')}><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href="https://tiktok.com" className={cx('social-btn')}><FontAwesomeIcon icon={faTiktok} /></a>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết chung */}
                    <div className={cx('column')}>
                        <h3 className={cx('heading')}>Về Smart-LMS</h3>
                        <ul className={cx('list')}>
                            <li><Link to="/">Giới thiệu</Link></li>
                            <li><Link to="/courses">Khóa học</Link></li>
                            <li><Link to="/blog">Bài viết</Link></li>
                            <li><Link to="/careers">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div className={cx('column')}>
                        <h3 className={cx('heading')}>Hỗ trợ</h3>
                        <ul className={cx('list')}>
                            <li><Link to="/contact">Liên hệ</Link></li>
                            <li><Link to="/privacy">Bảo mật</Link></li>
                            <li><Link to="/terms">Điều khoản</Link></li>
                            <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div className={cx('column')}>
                        <h3 className={cx('heading')}>Liên hệ</h3>
                        <ul className={cx('list', 'contact-info')}>
                            <li>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('icon')} />
                                <span>207 Giải Phóng, Hà Nội</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faPhone} className={cx('icon')} />
                                <span>0987.654.321</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faEnvelope} className={cx('icon')} />
                                <span>contact@smartlms.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className={cx('bottom')}>
                    <p>© 2026 Smart-LMS. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;