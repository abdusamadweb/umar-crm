import './Davomat.scss'
import React, {useEffect, useState} from 'react'
import Title from "../../components/title/Title.jsx"
import {TimePicker} from "react-time-picker"
import moment from 'moment'
import dayjs from "dayjs";


const Davomat = () => {

    const sheetUrl = "https://docs.google.com/spreadsheets/d/1s-3ZEdNRPYVmuftMiFK5EKY0FY7q8rL7zkTih_rcXO0/edit?usp=sharing"


    return (
        <div className='davomat page'>
            <div className="container">
                <div className="davomat__inner">
                    <Title title='Давомат'/>
                    <iframe
                        className='iframe'
                        src={sheetUrl}
                        frameBorder="0"
                        width="100%"
                        height="800px"
                    />
                </div>
            </div>
        </div>
    )
}

export default Davomat