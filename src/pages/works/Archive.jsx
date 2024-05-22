import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Popconfirm, Segmented, Table, Tooltip} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";
import {Link} from "react-router-dom";

const Archive = () => {

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
            title: 'Ким кивотканлиги',
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
            title: 'Тугаган санаси',
            dataIndex: 'toDate',
            key: 'toDate',
        },
        {
            title: 'Кайси жойдалиги',
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
                    <Popconfirm
                        title="Очиришни хохлайсизми?"
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


    return (
        <div className='works page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Архивланган ишлар'
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
        </div>
    );
};

export default Archive;