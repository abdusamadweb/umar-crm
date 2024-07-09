import CountUp from 'react-countup'

const Card = ({ title, value, txt, icon }) => {

    return (
        <div className='card'>
            <div className='card__titles'>
                <h3 className='title'>{ title }:</h3>
                {
                    icon ? icon : <i className="fa-solid fa-money-bill-transfer"/>
                }
            </div>
            <div className={`card__num ${value > -1 ? 'green' : 'red'}`}>
                { value > 0 && '+' }<CountUp end={value} separator=" " /> { txt || 'сум' }
            </div>
        </div>
    );
};

export default Card;