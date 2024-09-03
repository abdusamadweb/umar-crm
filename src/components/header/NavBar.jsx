import React from 'react';
import {NavLink} from "react-router-dom";

const NavBar = ({ openMenu, setOpenMenu }) => {

    const nav = [
        {
            name: 'Статистика',
            link: '/'
        },
        {
            name: 'Заказлар',
            link: '/partners'
        },
        {
            name: 'Ходимлар',
            link: '/workers'
        },
        {
            name: 'Харажатлар',
            link: '/xarajatlar'
        },
        {
            name: 'Пул менежменти',
            link: '/money-manage'
        },
        {
            name: 'Бошка харажатлар',
            link: '/other'
        },
        // {
        //     name: 'Килинган ишлар',
        //     link: '/works'
        // },
        // {
        //     name: 'Давомат',
        //     link: '/davomat'
        // },
        {
            name: 'Хисоб китоб',
            link: '/products'
        },
        {
            name: 'Қарзлар',
            link: '/debt'
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