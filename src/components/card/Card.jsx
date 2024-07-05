import CountUp from 'react-countup'

const Card = ({ title, value, usd, icon }) => {

    return (
        <div className='card'>
            <div className='card__titles'>
                <h3 className='title'>{ title }:</h3>
                {
                    icon ? icon : <i className="fa-solid fa-money-bill-transfer"/>
                }
            </div>
            <div className={`card__num ${value > -1 ? 'green' : 'red'}`}>
                <CountUp end={value} separator=" " /> { usd ? '$' : 'сум' }
            </div>
        </div>
    );
};

export default Card;