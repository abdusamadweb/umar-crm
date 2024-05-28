import './Works.scss'
import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Form, Input, InputNumber, Modal, Popconfirm, Segmented, Select, Table, Tooltip} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";
import {Link} from "react-router-dom";

const Works = () => {

    const [modal, setModal] = useState('close')

    const [value, setValue] = useState('Абшивка')


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
            title: 'Ходим',
            dataIndex: 'name',
            key: 'name',
            render: (_, { name }) => <span>{ name }</span>,
        },
        {
            title: 'Бошланган санаси',
            dataIndex: 'fromDate',
            key: 'fromDate',
        },
        {
            title: 'Докон',
            dataIndex: 'partners',
            key: 'partners'
        },
        {
            title: 'Иш хаки',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money }) => <span>{ money ? formatPrice(money) : 'ишбай' }</span>,
        },
        {
            title: 'Амаллар',
            key: 'actions',
            render: (_, { id }) => (
                <div className="actions">
                    {/*<button className='actions__btn view' onClick={() => setModal('view')}>*/}
                    {/*    <i className="fa-solid fa-eye"/>*/}
                    {/*</button>*/}
                    <button className='actions__btn edit' onClick={() => setModal('edit')}>
                        <i className="fa-regular fa-pen-to-square"/>
                    </button>
                    <Popconfirm
                        title="Архивлашни хохлайсизми?"
                        description=' '
                        okText="Ха"
                        cancelText="Йок"
                        // onConfirm={() => deleteWorker(id)}
                    >
                        <Tooltip title="Архивлаш" placement="bottom">
                            <button className='actions__btn'>
                                <i className="fa-solid fa-box-open"/>
                            </button>
                        </Tooltip>
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
        <div className='works page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Килинвотган ишлар'
                        btn='Кошиш'
                        click={() => setModal('add')}
                        icon={true}
                        additional={
                            <Tooltip title='Архив кисми'>
                                <Link className='additional-btn' to='archive'>
                                    <i className="fa-solid fa-box-open"/>
                                </Link>
                            </Tooltip>
                        }
                    />
                    <div className="content">
                        <div className="content__tabs center mb1">
                            <Segmented
                                size={'large'}
                                options={['Абшивка', 'Карказ', 'Тикув']}
                                value={value}
                                onChange={setValue}
                            />
                        </div>
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </div>
            <Modal
                title={modal === 'add' ? "Кошиш" : "Озгартириш"}
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
                        name='worker'
                        label="Ходим"
                        rules={[{ required: true }]}
                    >
                        <Select
                            size='large'
                            defaultValue={'lucy'}
                            // onChange={handleChange}
                            options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name='job'
                        label="Иш хаки"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Иш хаки' type='number' />
                    </Form.Item>
                    <Form.Item
                        name='partner'
                        label="Докон"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Докон' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Works;