import './Header.scss'
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import NavBar from "./NavBar.jsx";

const Header = () => {

    const [openMenu, setOpenMenu] = useState(false)


    return (
        <div className={`header ${openMenu ? 'open' : ''} `}>
            <div className="container">
                <div className="header__inner">
                    <Link className='header__logos' to='/'>
                        <h1 className={`header__logo ${openMenu && 'opa'}`}>UMAR - CRM</h1>
                    </Link>
                    <NavBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    <div className='burger-menu'>
                        <button onClick={() => setOpenMenu(true)}>
                            <i className={`fa-solid fa-bars-staggered icon ${openMenu ? 'close' : 'open'}`}/>
                        </button>
                        <button onClick={() => setOpenMenu(false)}>
                            <i className={`fa-solid fa-xmark icon ${openMenu ? 'open left' : 'close'}`}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;