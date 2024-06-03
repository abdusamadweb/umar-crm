import './Title.scss'
import React from 'react';
import {useNavigate} from "react-router-dom";

const Title = ({ title, btn, click, icon, additional, navigate }) => {

    const navigatee = useNavigate()

    if (!btn) return (
        <div className='page-title row align-center g1'>
            {
                navigate && <button className='btn' onClick={() => navigatee(-1)}>
                    <i className="fa-solid fa-arrow-left-long"/>
                </button>
            }
            <h2>{title}</h2>
        </div>
    )

    return (
        <div className='titles'>
            <h2 className="titles__title">{ title }</h2>
            <div className='row align-center g1'>
                { additional }
                <button className='titles__btn' onClick={click}>
                    <span>{ btn }</span>
                    { icon && <i className="fa-solid fa-circle-plus"/> }
                </button>
            </div>
        </div>
    );
};

export default Title