import React from 'react';
import {NavLink} from "react-router-dom";

const NavBar = ({ openMenu, setOpenMenu }) => {

    const nav = [
        {
            name: 'Статистика',
            link: '/'
        },
        {
            name: 'Килинган ишлар',
            link: '/works'
        },
        {
            name: 'Доконлар',
            link: '/partners'
        },
        {
            name: 'Ходимлар',
            link: '/workers'
        },
        {
            name: 'Давомат',
            link: '/davomat'
        },
        {
            name: 'Пул менежменти',
            link: '/money-manage'
        },
        {
            name: 'Бошка харажатлар',
            link: '/other'
        },
    ]


    return (
        <nav className={`nav ${openMenu ? 'open' : ''}`}>
            <ul className="nav__list">
                {
                    nav.map((item, i) => (
                        <li className="nav__item" onClick={() => setOpenMenu(false)} key={i}>
                            <NavLink className='nav__link row between align-center' to={item.link}>
                                <span>{ item.name }</span>
                                <i className="fa-solid fa-chevron-right icon"/>
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
};

export default NavBar;