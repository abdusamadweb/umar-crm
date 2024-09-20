import './Header.scss'
import React, {useEffect, useState} from 'react';
import {Link, useHref} from "react-router-dom";
import NavBar from "./NavBar.jsx";
import {protectedRoutes} from "../../routes/route.jsx";
import logo from "../../assets/images/logo.png";
import {useQuery} from "react-query";
import {formatPrice} from "../../assets/scripts/global.js";

const Header = () => {

    const href = useHref()

    const [openMenu, setOpenMenu] = useState(false)


    // fetch usd
    const fetchUsd = async () => {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/4371a7a442c6dcd487d16ae5/latest/USD`)
        return response.json()
    }

    const { data } = useQuery('usdToUzsRate', fetchUsd)
    const usd = data?.conversion_rates.UZS.toFixed() || localStorage.getItem('usdAPI')
    useEffect(() => {
        localStorage.setItem('usdAPI', data?.conversion_rates.UZS.toFixed())
    }, [data])


    return (
        <div className={`header ${openMenu ? 'open' : ''} `} style={{display: protectedRoutes.some(route => href === route.path) && 'block'}}>
            <div className="container d-flex flex-column between h100">
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
                <div className='header__usd fz181111'>
                    <span className='fw600'>$ USD -</span>
                    <span className='fw600 usd'>{ formatPrice(usd) } сум</span>
                </div>
            </div>
        </div>
    );
};

export default Header;