import './DateFilter.scss'
import React, {useState} from 'react';
import Calendar from "react-calendar";

const DateFilter = ({ fromDate, toDate, setFromDate, setToDate }) => {

    const [calendar, setCalendar] = useState(false)

    fromDate?.setHours(0,0,0,)
    toDate?.setHours(23,59,59,)


    return (
        <div className="date-filter">
            <button className='btn' onClick={() => setCalendar(!calendar)}>
                <i className="fa-solid fa-filter"/>
            </button>
            <div className={`calendar ${calendar ? 'open' : 'close'}`}>
                <div className="row no-wrap">
                    <div className='calendar__content'>
                        <span className='txt'>. . . дан</span>
                        <Calendar onChange={setFromDate} />
                    </div>
                    <div className='calendar__content'>
                        <span className='txt'>. . . гача</span>
                        <Calendar onChange={setToDate} />
                    </div>
                </div>
                <div className="bg" onClick={() => setCalendar(false)}/>
            </div>
        </div>
    );
};

export default DateFilter;