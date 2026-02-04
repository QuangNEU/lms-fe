import styles from './Buttons.module.scss';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Button({ to, href, primary, outline, small, large, text, disabled, rounded, onClick, children, passProps, leftIcon, className, rightIcon }) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps
    }
    if (to) {
        props.to = to;
        Comp = Link;
    }
    else if (href) {
        props.href = href;
        Comp = 'a';
    }

    if (disabled) {
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key]
            }
        })
    }
    const classes = cx('wrapper', {
        primary,
        outline,
        small,
        large,
        text,
        disabled,
        rounded,
    }, className);
    return (
        <Comp className={classes}  {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span >{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </ Comp>
    )
}

export default Button;