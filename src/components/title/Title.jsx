import './Title.scss'
import React from 'react';

const Title = ({ title, btn, click, icon, additional }) => {

    if (!btn) return <h2 className="page-title">{ title }</h2>

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