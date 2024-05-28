import './Page404.scss'
import React from 'react'
import {Link} from "react-router-dom";
import {Button} from "antd";

const page404 = () => {

    return (
        <div className='page404 grid-center'>
            <div className="container">
                <p className='title mb1'>404 Page Not found</p>
                <Button type='primary'>
                    <Link to='/'>Бош сахифага</Link>
                </Button>
            </div>
        </div>
    )
}

export default page404