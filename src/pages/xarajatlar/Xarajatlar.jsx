import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Tooltip} from "antd";
import {Link} from "react-router-dom";

const Xarajatlar = () => {

    const [modal, setModal] = useState('close')


    return (
        <div className="xarajatlar page">
            <div className="container">
                <div className="xarajatlar__inner">
                    <Title
                        title='Доконлар'
                        btn='Кошиш'
                        click={() => setModal('add')}
                        icon={true}
                    />
                    <div className="content">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Xarajatlar;