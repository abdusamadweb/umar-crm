import './Header.scss'
import React, {useState} from 'react';
import {Link, useHref} from "react-router-dom";
import NavBar from "./NavBar.jsx";
import {protectedRoutes} from "../../routes/route.jsx";
import logo from "../../assets/images/logo.png";

const Header = () => {

    const href = useHref()

    const [openMenu, setOpenMenu] = useState(false)


    return (
        <div className={`header ${openMenu ? 'open' : ''} `} style={{display: protectedRoutes.some(route => href === route.path) && 'block'}}>
            <div className="container">
                <div className="header__inner">
                    <Link className='header__logos' to='/'>
                        <img className={`header__logo ${openMenu && 'opa'}`} src={logo} alt="logo"/>
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