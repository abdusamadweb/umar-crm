import './Home.scss'
import {useEffect, useMemo, useState} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Title from "../../components/title/Title.jsx"
import $api from "../../api/apiConfig.js"
import {useQuery} from "react-query"
import CountUp from 'react-countup';

const Home = () => {

    // filter results
    const [calendar, setCalendar] = useState(false)
    const today = new Date()
    const [filteredData, setFilteredData] = useState([])

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    fromDate.setHours(0,0,0,)
    fromDate.getTime()
    toDate.setHours(23,59,59,)
    toDate.getTime()


    // fetch workers
    const fetchWorkers = async () => {
        const { data } = await $api.get('/workers')
        return data
    }
    const { data: workers } = useQuery(
        ['workers'],
        fetchWorkers,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // fetch works
    const fetchWorks = async () => {
        const { data } = await $api.get('/works')
        return data
    }
    const { data: works } = useQuery(
        ['works'],
        fetchWorks,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // fetch expenses
    const fetchOtherExpenses = async () => {
        const { data } = await $api.get('other-expenses')
        return data
    }
    const { data: otherExpenses } = useQuery(
        ['other-expenses'],
        fetchOtherExpenses,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )

    const fetchExpenses = async () => {
        const { data } = await $api.get('expenses')
        return data
    }
    const { data: expenses } = useQuery(
        ['expenses'],
        fetchExpenses,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // reducers
    const [totals, setTotals] = useState({ tWorkers: 0, tWorks: 0, tExpenses: 0 })

    const calcAll = useMemo(() => {
        const tWorkers = workers?.length
        const tWorks = works?.length
        const tExpenses = expenses?.reduce((sum, i) => sum + (i.money || 0), 0) +
            otherExpenses?.reduce((sum, i) => sum + (i.money || 0), 0)

        return { tWorkers, tWorks, tExpenses }
    }, [workers, works, expenses, otherExpenses])

    useEffect(() => {
        setTotals(calcAll)
    }, [calcAll])


    return (
        <div className='home page'>
            <div className="container">
                <div className="home__inner">
                    <Title title='Статистика' />
                    <div className="home__content content">
                        <div className='content__wrapper mb2'>
                            <div className='content__titles'>
                                <h3 className="content__title">Хаммаси болиб</h3>
                            </div>
                            <div className='boxes grid'>
                                <div className='content__diver'>
                                    <span className='content__txt'>Ходимлар</span>
                                    <span className='content__num num'>
                                        <CountUp end={totals.tWorkers} separator=" " /> ta
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-users-viewfinder"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Мебеллар</span>
                                    <span className='content__num num'>
                                        <CountUp end={totals.tWorks} separator=" " /> ta
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-chart-line"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Тушум</span>
                                    <span className='content__num num'>
                                        <CountUp end={0} separator=" " /> sum
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-money-bill-transfer"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Харажатлар</span>
                                    <span className='content__num num'>
                                        <CountUp end={totals.tExpenses} separator=" " /> sum
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-money-bill-trend-up"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Толанган ойликлар</span>
                                    <span className='content__num num'>
                                        <CountUp end={0} separator=" " /> sum
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-file-invoice-dollar"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='content__wrapper'>
                            <div className='content__titles row between align-center relative'>
                                {/*<h3 className="content__title">{ fromDate.toLocaleDateString() === today.toLocaleDateString() && toDate.toLocaleDateString() === today.toLocaleDateString() ? 'Bugungi' : (fromDate.toLocaleDateString() + ' ~ ' + toDate.toLocaleDateString()) }</h3>*/}
                                <button className='content__filter' onClick={() => setCalendar(!calendar)}>
                                <i className="fa-solid fa-filter icon"/>
                                </button>
                                <div className={`calendar ${calendar ? 'open' : 'close'}`}>
                                    <div className="row no-wrap">
                                        <div className='calendar__content'>
                                            <span className='txt'>. . . dan</span>
                                            <Calendar
                                                onChange={setFromDate}
                                                value={fromDate}
                                            />
                                        </div>
                                        <div className='calendar__content'>
                                            <span className='txt'>. . . gacha</span>
                                            <Calendar
                                                onChange={setToDate}
                                                value={toDate}
                                            />
                                            <button className='btn' onClick={() => setCalendar(false)}>OK</button>
                                        </div>
                                    </div>
                                    <div className="bg" onClick={() => setCalendar(false)}/>
                                </div>
                            </div>
                            <div className='boxes grid'>
                                <div className='content__diver'>
                                    <span className='content__txt'>Ходимлар</span>
                                    <span className='content__num num'>
                                        {/*<CountUpp id={'debtors1'} count={result?.data?.debtors} /> ta*/}
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-users-viewfinder"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Мебеллар</span>
                                    <span className='content__num num'>
                                        {/*<CountUpp id={'allDebts1'} count={result?.data?.allDebts} /> ta*/}
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-chart-line"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Тушум</span>
                                    <span className='content__num num'>
                                        {/*<CountUpp id={'debtsOut1'} count={result?.data?.debtsOut} /> ta*/}
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-money-bill-transfer"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Харажатлар</span>
                                    <span className='content__num num'>
                                        {/*<CountUpp id={'debtsIn1'} count={result?.data?.debtsIn} /> ta*/}
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-money-bill-trend-up"/>
                                    </div>
                                </div>
                                <div className='content__diver'>
                                    <span className='content__txt'>Толанган ойликлар</span>
                                    <span className='content__num'>
                                        {/*<CountUpp id={'debtsAmount1'} count={result?.data?.debtsAmount} /> sum*/}
                                    </span>
                                    <div className='icons'>
                                        <i className="fa-solid fa-file-invoice-dollar"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
