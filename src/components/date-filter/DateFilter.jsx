import './DateFilter.scss'
import React, {useState} from 'react';
import Calendar from "react-calendar";
import {Tooltip} from "antd";

const DateFilter = ({ fromDate, toDate, setFromDate, setToDate }) => {

    const [calendar, setCalendar] = useState(false)
    const fDate = new Date(fromDate).toLocaleDateString()
    const tDate = new Date(toDate).toLocaleDateString()


    return (
        <div className="date-filter">
            <Tooltip placement="topRight" title={fDate + ' ~ ' + tDate}>
                <button className='btn' onClick={() => setCalendar(!calendar)}>
                    <i className="fa-solid fa-filter"/>
                </button>
                <div className={`calendar ${calendar ? 'open' : 'close'}`}>
                    <div className="row no-wrap">
                        <div className='calendar__content'>
                            <span className='txt'>. . . дан</span>
                            <Calendar onChange={setFromDate} defaultValue={fromDate}/>
                        </div>
                        <div className='calendar__content'>
                            <span className='txt'>. . . гача</span>
                            <Calendar onChange={setToDate} defaultValue={toDate} />
                        </div>
                    </div>
                    <div className="bg" onClick={() => setCalendar(false)}/>
                </div>
            </Tooltip>
        </div>
    );
};

export default DateFilter;