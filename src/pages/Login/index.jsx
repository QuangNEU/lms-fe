import { useState } from 'react';
import logoImage from "../../assets/logo.svg"
import styles from './Login.module.scss';

function Login() {
    // 1. Quản lý state của form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 2. Hàm xử lý khi bấm nút Đăng nhập
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Thông tin đăng nhập:', { username, password });

    };
    return (
        <form className={styles.formLogin} onSubmit={handleSubmit}>
            <div className={styles.logoContainer}>
                <img src={logoImage} alt="LMS Logo" className={styles.logo} />
            </div>
            <h2 className={styles.title}>Đăng Nhập LMS</h2>
            <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>Tài khoản</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập..."
                    className={styles.input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Mật khẩu</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu..."
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="submit" className={styles.btnLogin}>
                Đăng Nhập
            </button>

        </form>
    )
}

export default Login;