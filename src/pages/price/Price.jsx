import './Price.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, Modal, Popconfirm, Table, Tooltip} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";

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
                open={modal !== 'close'}
                onOk={() => setModal('close')}
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
                </Form>
            </Modal>
        </div>
    );
};

export default Price;