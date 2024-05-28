import './Price.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, Modal, Popconfirm, Table, Tooltip} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";
import * as math from 'mathjs'

const Price = () => {

    const [modal, setModal] = useState('close')


    // table
    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (_, __, index) => <span>{ index+1 }</span>,
        },
        {
            title: 'Номи',
            dataIndex: 'name',
            key: 'name',
            render: (_, { name }) => <span>{ name }</span>,
        },
        {
            className: 'description',
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '40%'
        },
        {
            title: 'Харажат',
            dataIndex: 'cost',
            key: 'cost',
            render: (_, { cost }) => <span>{ formatPrice(cost) } сум</span>,
        },
        {
            title: 'Амаллар',
            key: 'actions',
            width: '150px',
            render: (_, { id }) => (
                <div className="actions">
                    <button className='actions__btn edit' onClick={() => setModal('edit')}>
                        <i className="fa-regular fa-pen-to-square"/>
                    </button>
                    <Popconfirm
                        title="Очиришни хохлайсизми?"
                        description=' '
                        okText="Ха"
                        cancelText="Йок"
                        // onConfirm={() => deleteWorker(id)}
                    >
                        <button className='actions__btn delete'>
                            <i className="fa-regular fa-trash-can"/>
                        </button>
                    </Popconfirm>
                </div>
            ),
        },
    ]

    const data = [
        {
            key: '1',
            name: 'Комуналка',
            cost: 3200000,
            description: 'lorem20 asd as daskj',
        },
        {
            key: '2',
            name: 'Аренда',
            cost: 420000,
        },
    ]


    // form
    const validateMessages = {
        required: '${label} толдирилиши шарт!',
    }

    const onFormSubmit = (values) => {
        console.log(values);
    }


    // calculator
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');

    const handleClick = (e) => {

        if (isNaN(e)) {
            // If an operator button is clicked
            if (selectedOperator && selectedOperator !== e) {
                // If a different operator is already selected, update the selected operator
                setSelectedOperator(e);
                setInput(input.slice(0, -1).concat(e));
            } else if (!selectedOperator) {
                // Otherwise, select the operator and append it to the input
                setSelectedOperator(e);
                setInput(input.concat(e));
            }
        } else {
            // If a number button is clicked
            if (selectedOperator) {
                // If an operator is already selected, append the number to the input after the operator
                if (input.slice(-1) === selectedOperator) {
                    setInput(input.concat(e));
                } else {
                    setInput(input + selectedOperator + e);
                }
                setSelectedOperator('');
            } else {
                // Otherwise, simply append the number to the input
                setInput(input.concat(e));
            }
        }
    };
    console.log(input)

    const clear = () => {
        setInput('');
        setResult('');
        setSelectedOperator('');
    };

    const calculate = () => {
        try {
            setResult(math.evaluate(input).toString());
            setSelectedOperator('');
        } catch (err) {
            setResult('Error');
        }
    };

    const percentage = () => {
        try {
            const evalResult = math.evaluate(input) / 100; // Calculate percentage
            setInput(evalResult.toString());
            setResult(evalResult.toString());
            setSelectedOperator('');
        } catch (error) {
            setResult('Error');
        }
    }


    return (
        <div className="price page">
            <div className="container">
                <Title
                    title='Пул менежменти'
                    btn='Кошиш'
                    click={() => setModal('add')}
                    icon={true}
                    additional={
                        <Tooltip title='Калькулятор'>
                            <button className='additional-btn' onClick={() => setModal('calc')}>
                                <i className="fa-solid fa-calculator"/>
                            </button>
                        </Tooltip>
                    }
                />
                <div className="content">
                    <h3 className="content__title fw600 mb2">
                        Хаммаси болиб: <span>{formatPrice(170000)}</span> сум
                        <div className='grid align-center'>
                            <span/>
                            <i className="fa-solid fa-plus"/>
                            <i className="fa-solid fa-equals"/>
                            <div>
                                <span className='red'>{formatPrice(370000)}</span> сум
                            </div>
                        </div>
                        Бошка харажатлар: <span>{formatPrice(200000)}</span> сум
                    </h3>
                    <Table columns={columns} dataSource={data} />
                </div>
            </div>
            <Modal
                title={modal === 'add' ? "Харажат кошиш" : "Харажат озгартириш"}
                style={{
                    top: 20,
                }}
                open={modal !== 'close' && modal !== 'calc'}
                // onOk={() => setModal('close')}
                onCancel={() => setModal('close')}
                okText='Тасдиклаш'
                cancelText='Бекор килиш'
            >
                <Form
                    onFinish={onFormSubmit}
                    layout='vertical'
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name='cost'
                        label="Харажат"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder='Харажат' />
                    </Form.Item>
                    <Form.Item
                        name='amount'
                        label="Нарх"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder='Нарх' type='number' />
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label="Описание"
                    >
                        <Input.TextArea placeholder='Описание' />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                className='price-modal'
                title='Калькулятор'
                style={{
                    top: 20,
                    right: 190,
                }}
                width='300px'
                open={modal === 'calc'}
                // onOk={() => setModal('close')}
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
        </div>
    );
};

export default Price;