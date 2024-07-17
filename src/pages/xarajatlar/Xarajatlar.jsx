import './Xrajatlar.scss'
import React, {useEffect, useMemo, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import {Button, Form, Input, Modal, Popconfirm, Segmented} from "antd";
import Tables from "../../components/tables/Tables.jsx";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit} from "../../api/request.js";
import toast from "react-hot-toast";
import Card from "../../components/card/Card.jsx";

const Xarajatlar = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [search, setSearch] = useState('')

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())

    const [tab, setTab] = useState(localStorage.getItem('xarajatlar') || 'Абшивка')


    // fetch data
    const fetchData = async () => {
        const eSearch = encodeURIComponent(search)
        const url = search !== ''
            ? `xarajatlar?timestamps${tab !== 'Хаммаси' && `&where[category]=${tab}`}&where[name][like]=${eSearch}`
            : `xarajatlar?timestamps${tab !== 'Хаммаси' && `&where[category]=${tab}`}`

        const { data } = await $api.get(url)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['xarajatlar', search, tab],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // add money
    const { mutate: addMoneyMutate } = useMutation({
        mutationFn: (values) => {
            setLoading(true)

            const item = {
                name: selectedItem.name,
                category: selectedItem.category,
                money: selectedItem.money ? selectedItem.money + (+values.money) : +values.money,
                description: selectedItem.description,
            }
            return addOrEdit('xarajatlar', item, selectedItem?.id)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Кошилди!')

            setModal('close')
            setSelectedItem(null)
            setLoading(false)
            form.resetFields()
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
            setLoading(false)
        }
    })

    // add money to money-management
    const { mutate: addMoneyManage } = useMutation({
        mutationFn: (values) => {
            setLoading(true)

            const item = {
                name: selectedItem.name,
                description: values.description,
                category: 'Ишхона',
                money: +values.money,
                date: new Date(),
                expense: true,
            }
            return addOrEdit('expenses', item)
        },
        onSuccess: async () => {
            toast.success('Кошилди!')

            setModal('close')
            setSelectedItem(null)
            setLoading(false)
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
            setLoading(false)
        }
    })

    const addMoney = (values) => {
        addMoneyMutate(values)
        addMoneyManage(values)
    }


    // totals
    const [totals, setTotals] = useState({ tExpenses: 0 })

    const calcAll = useMemo(() => {
        const tExpenses = data?.reduce((sum, i) => sum - (i.money || 0), 0)

        return { tExpenses }
    }, [data])

    useEffect(() => {
        setTotals(calcAll)
    }, [calcAll])


    // change tab
    const changeTab = (val) => {
        setTab(val)
        localStorage.setItem('xarajatlar', val)
    }

    useEffect(() => {
        if (search !== '') {
            setTab('Хаммаси')
        }
    }, [search])


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
            render: (_, item) => <button className='fw500 txt' onClick={() => {
                setModal('money')
                setSelectedItem(item)
            }}>{ item.name }</button>,
        },
        {
            title: 'Сумма',
            className: 'fw500',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money }) => <span className='red fw500'>-{ formatPrice(money || 0) } сум</span>,
        },
        {
            title: 'Охирги марта',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (_, { created_at }) => <span>{ created_at || '__' }</span>,
        },
        {
            title: 'Амаллар',
            key: 'actions',
            width: '150px',
            render: (_, item) => (
                <div className="actions">
                    <button className='actions__btn edit' onClick={() => {
                        setModal('edit')
                        setSelectedItem(item)
                    }}>
                        <i className="fa-regular fa-pen-to-square"/>
                    </button>
                    <Popconfirm
                        title="Очиришни хохлайсизми?"
                        description=' '
                        okText="Ха"
                        cancelText="Йок"
                        placement='topRight'
                        // onConfirm={() => deleteItem(item?.id)}
                    >
                        <button className='actions__btn delete'>
                            <i className="fa-regular fa-trash-can"/>
                        </button>
                    </Popconfirm>
                </div>
            ),
        },
    ]


    return (
        <div className="xarajatlar page">
            <div className="container">
                <div className="xarajatlar__inner">
                    <Title
                        title='Харажатлар'
                        btn='Кошиш'
                        click={() => setModal('add')}
                        icon={true}
                    />
                    <div className="content">
                        <div className="cards">
                            <Card
                                title='Хаммаси болиб'
                                value={totals.tExpenses}
                                icon={<i className="fa-solid fa-file-invoice-dollar"/>}
                            />
                        </div>
                        <div className="tabs center mb1">
                            <Segmented
                                className="tab1"
                                size={'large'}
                                options={['Хаммаси']}
                                value={tab}
                                onChange={changeTab}
                            />
                            <Segmented
                                size={'large'}
                                options={['Абшивка', 'Карказ', 'Продукта', 'Бензин']}
                                value={tab}
                                onChange={changeTab}
                            />
                        </div>
                        <Tables
                            data={data}
                            columns={columns}
                            setSearch={setSearch}
                            fromDate={fromDate}
                            toDate={toDate}
                            setFromDate={setFromDate}
                            setToDate={setToDate}
                        />
                    </div>
                </div>
            </div>
            <Modal
                className='main-modal'
                title="Харажат кошиш"
                open={modal === 'money'}
                onCancel={() => setModal('close')}
            >
                <Form
                    form={form}
                    onFinish={addMoney}
                    layout='vertical'
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name='money'
                        label="Пул кошиш"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Пул кошиш' type='number' suffix={'сум'} />
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label="Описание"
                    >
                        <Input.TextArea placeholder='Описание'/>
                    </Form.Item>
                    <div className='end mt1'>
                        <Button type="primary" htmlType="submit" size='large' loading={loading}>
                            Тасдиклаш
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Xarajatlar;