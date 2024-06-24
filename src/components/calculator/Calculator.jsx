import React, {useState} from 'react'
import {Modal} from "antd"
import * as math from "mathjs"

const Calculator = ({ modal, setModal }) => {

    const [input, setInput] = useState('')
    const [result, setResult] = useState('')
    const [selectedOperator, setSelectedOperator] = useState('')

    const handleClick = (e) => {

        if (isNaN(e)) {
            // If an operator button is clicked
            if (selectedOperator && selectedOperator !== e) {
                // If a different operator is already selected, update the selected operator
                setSelectedOperator(e)
                setInput(input.slice(0, -1).concat(e))
            } else if (!selectedOperator) {
                // Otherwise, select the operator and append it to the input
                setSelectedOperator(e)
                setInput(input.concat(e))
            }
        } else {
            // If a number button is clicked
            if (selectedOperator) {
                // If an operator is already selected, append the number to the input after the operator
                if (input.slice(-1) === selectedOperator) {
                    setInput(input.concat(e))
                } else {
                    setInput(input + selectedOperator + e)
                }
                setSelectedOperator('')
            } else {
                // Otherwise, simply append the number to the input
                setInput(input.concat(e))
            }
        }
    }

    const clear = () => {
        setInput('')
        setResult('')
        setSelectedOperator('')
    }

    const calculate = () => {
        try {
            setResult(math.evaluate(input).toString())
            setSelectedOperator('')
        } catch (err) {
            setResult('Error')
        }
    }

    const percentage = () => {
        try {
            const evalResult = math.evaluate(input) / 100 // Calculate percentage
            setInput(evalResult.toString())
            setResult(evalResult.toString())
            setSelectedOperator('')
        } catch (error) {
            setResult('Error')
        }
    }


    return (
        <Modal
            className='price-modal'
            title='Калькулятор'
            width='300px'
            open={modal === 'calc'}
            onCancel={() => setModal('close')}
            footer={false}
        >
            <div className="calculator">
                <div className="display">
                    <input type="text" value={input} disabled/>
                    <div className="result">{result}</div>
                </div>
                <div className="">
                    <div className='buttons'>
                        <button onClick={clear}>C</button>
                        <button onClick={percentage}>
                            <i className="fa-solid fa-percent"/>
                        </button>
                        <button onClick={() => handleClick('/')}>
                            <i className="fa-solid fa-divide"/>
                        </button>
                    </div>
                    <div className='buttons'>
                        {['7', '8', '9'].map((i) => (
                            <button key={i} onClick={() => handleClick(i)}>{i}</button>
                        ))}
                        <button onClick={() => handleClick('*')}>
                            <i className="fa-solid fa-xmark"/>
                        </button>
                    </div>
                    <div className='buttons'>
                        {['4', '5', '6'].map((i) => (
                            <button key={i} onClick={() => handleClick(i)}>{i}</button>
                        ))}
                        <button onClick={() => handleClick('-')}>
                            <i className="fa-solid fa-minus"/>
                        </button>
                    </div>
                    <div className='buttons'>
                        {['1', '2', '3'].map((i) => (
                            <button key={i} onClick={() => handleClick(i)}>{i}</button>
                        ))}
                        <button onClick={() => handleClick('+')}>
                            <i className="fa-solid fa-plus"/>
                        </button>
                    </div>
                    <div className='buttons'>
                        {['0', '.'].map((i) => (
                            <button key={i} onClick={() => handleClick(i)}>{i}</button>
                        ))}
                        <button onClick={() => calculate()}>
                            <i className="fa-solid fa-equals"/>
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Calculator