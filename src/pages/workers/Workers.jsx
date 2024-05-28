import './Workers.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, InputNumber, Modal, Popconfirm, Table, Tag} from "antd";
import {formatPhone, formatPrice} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useQuery} from "react-query";

const Workers = () => {

    const [modal, setModal] = useState('close')


    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get('/workers')
        return data
    }
    const { data, refetch } = useQuery(
        ['workers'],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )
    console.log(data)


    const deleteItem = (id) => {

        refetch()
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
            dataIndex: 'phone',
            key: 'phone',
            render: (_, { phone }) => <span>{ formatPhone(phone) || '_' }</span>,
        },
        {
            title: 'Йоши',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Лавозими',
            key: 'position',
            dataIndex: 'position',
            render: (_, { position }) => {
                let color = 'geekblue'
                if (position === 'абшивка') {
                    color = 'volcano'
                } else if (position === 'каркас' || position === 'карказ') {
                    color = 'green'
                } else if (position === 'тикув' || position === 'тикувчи') {
                    color = 'yellow'
                }
                return (
                    <Tag color={color} key={position}>
                        { position?.toUpperCase() || '_' }
                    </Tag>
                )
            },
        },
        {
            title: 'Маоши',
            dataIndex: 'salary',
            key: 'salary',
            render: (_, { salary }) => <span>{ salary ? `${formatPrice(salary)} сум` : 'ишбай' }</span>,
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
                        onConfirm={() => deleteItem(id)}
                    >
                        <button className='actions__btn delete'>
                            <i className="fa-regular fa-trash-can"/>
                        </button>
                    </Popconfirm>
                </div>
            ),
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
                        name='phone'
                        label="Телефон"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input placeholder='Телефон' type='tel' defaultValue='+998' />
                    </Form.Item>
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
                        name='salary'
                        label="Маоши"
                    >
                        <Input placeholder='Маоши' />
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