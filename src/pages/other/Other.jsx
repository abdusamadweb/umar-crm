import './Other.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, InputNumber, Modal, Popconfirm, Select, Table} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";

const Other = () => {

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
        <div className="other page">
            <div className="container">
                <Title
                    title='Бошка харажатлар'
                    btn='Кошиш'
                    click={() => setModal('add')}
                    icon={true}
                />
                <div className="content">
                    <h3 className="content__title fw600 mb2">Хаммаси болиб: <span>{ formatPrice(170000) }</span> сум</h3>
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

export default Other;