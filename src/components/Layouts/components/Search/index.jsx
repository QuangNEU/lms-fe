import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '../../../Popper/Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { AccountItem } from '../../../AccountItems';
import { useEffect, useState, useRef } from 'react';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);
function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showSearchRessul, setShowSeacrhResult] = useState(true);
    const [loading, setLoading] = useState(false);

    const inputRef = useRef();
    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([])
            return;
        }
        setLoading(true);
        fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(searchValue)}&type=less`)
            .then(res => res.json())
            .then(res => {
                setSearchResult(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(true);
            })
    }, [searchValue])

    const handleHideResult = () => {
        setShowSeacrhResult(false)
    }
    return (
        <HeadlessTippy
            interactive
            appendTo={document.body}
            visible={searchResult.length > 0 && showSearchRessul}
            onClickOutside={handleHideResult}
            render={attrs => (

                <div className={cx('search-result')} tabIndex="-1">
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>
                            Accounts
                        </h4>
                        {searchResult.map((result) => (
                            <AccountItem key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>

            )}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    value={searchValue}
                    placeholder='Search account and video'
                    spellCheck={false}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setShowSeacrhResult(true)}
                />
                {!!searchValue && !loading && (
                    <button
                        className={cx('clear')}
                        onClick={
                            () => {
                                setSearchValue('');
                                setSearchResult([]);
                                inputRef.current.focus();
                            }
                        }
                    >
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}

                {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                <button className={cx('search-button')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy >
    );
}

export default Search;