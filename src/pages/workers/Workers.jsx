import './Workers.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, InputNumber, Modal, Popconfirm, Table, Tag} from "antd";
import {formatPhone, formatPrice} from "../../assets/scripts/global.js";

const Workers = () => {

    const [modal, setModal] = useState('close')


    const deleteWorker = (id) => {

    }


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
            title: 'Ф.И.О',
            dataIndex: 'name',
            key: 'name',
            render: (_, { name }) => <span>{ name }</span>,
        },
        {
            title: 'Телефон',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (_, { phoneNumber }) => <span>{ formatPhone(phoneNumber) || '_' }</span>,
        },
        {
            title: 'Йоши',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Лавозими',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                tags.map((tag) => {
                    let color = 'geekblue'
                    if (tag === 'абшивка') {
                        color = 'volcano'
                    } else if (tag === 'каркас' || tag === 'карказ') {
                        color = 'green'
                    } else if (tag === 'тикув' || tag === 'тикувчи') {
                        color = 'yellow'
                    }
                    return (
                        <Tag color={color} key={tag}>
                            { tag.toUpperCase() || '_' }
                        </Tag>
                    )
                })
            ),
        },
        {
            title: 'Маоши',
            dataIndex: 'salary',
            key: 'salary',
            render: (_, { salary }) => <span>{ salary ? formatPrice(salary) : 'ишбай' }</span>,
        },
        {
            title: 'Турар жойи',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Амаллар',
            key: 'actions',
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
                        onConfirm={() => deleteWorker(id)}
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
            name: 'Анвар',
            age: 32,
            address: 'Хасанбой',
            tags: ['абшивка'],
            phoneNumber: '+998330012223'
        },
        {
            key: '2',
            name: 'Бахтийор',
            age: 42,
            address: 'Юнусобод',
            tags: ['карказ'],
        },
        {
            key: '3',
            name: 'Дилорам Барнаева',
            age: 32,
            address: 'Чорсу',
            tags: ['тикувчи'],
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
        <div className='workers page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Ходимлар'
                        btn='Кошиш'
                        click={() => setModal('add')}
                        icon={true}
                    />
                    <div className="content">
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </div>
            <Modal
                title={modal === 'add' ? "Ходим кошиш" : "Ходимни озгартириш"}
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
                    <div className='d-flex between align-center g1'>
                        <Form.Item
                            className='age'
                            name='name'
                            label="Ф.И.О"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder='Исм шариф' />
                        </Form.Item>
                        <Form.Item
                            name='age'
                            label="Йоши"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <InputNumber placeholder='Йоши' type='number' max={99} min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name='job'
                        label="Сохаси"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder='Сохаси' />
                    </Form.Item>
                    <Form.Item
                        name='address'
                        label="Турар жойи"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.TextArea placeholder='Турар жойи' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Workers;