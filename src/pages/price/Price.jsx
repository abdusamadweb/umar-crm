import './Price.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Segmented, Select, Tooltip} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData} from "../../api/request.js";
import toast from "react-hot-toast";
import Calculator from "../../components/calculator/Calculator.jsx";
import Tables from "../../components/tables/Tables.jsx";
import Card from "../../components/card/Card.jsx";

const Price = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [tab, setTab] = useState(localStorage.getItem('money-manage') || 'Хаммаси')

    const [search, setSearch] = useState('')

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())


    // fetch data
    const fetchData = async () => {
        const eSearch = encodeURIComponent(search)
        const url = search !== ''
            ? `expenses?timestamps${tab !== 'Хаммаси' && `&where[category]=${tab}`}&where[name][like]=${eSearch}`
            : `expenses?timestamps${tab !== 'Хаммаси' && `&where[category]=${tab}`}`

        const { data } = await $api.get(url)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['expenses', search, tab],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )

    // fetch other expenses
    const fetchOtherExpenses = async () => {
        const { data } = await $api.get('other-expenses')
        return data.reverse()
    }
    const { data: otherExpenses } = useQuery(
        ['other-expenses'],
        fetchOtherExpenses,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // add & edit
    const { mutate } = useMutation({
        mutationFn: (values) => {
            setLoading(true)
            return addOrEdit(
                'expenses',
                { ...values, date: selectedItem ? selectedItem.date : new Date() },
                selectedItem?.id || false
            )
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

    const onFormSubmit = (values) => {
        mutate(values)
    }


    // delete
    const { mutate: deleteItem } = useMutation({
        mutationFn: (id) => {
            return deleteData('other-expenses', id)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Очирилди!')
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
        }
    })


    // form
    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                expense: selectedItem.expense,
            })
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    // calculate expenses
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const [totalOtherExpenses, setTotalOtherExpenses] = useState(0)

    const calculateTotalProfit = (expenses) => {
        const total = expenses.reduce((sum, i) => {
            if (!i.expense) {
                return sum + (i.money || 0)
            }
            return sum
        }, 0)
        setTotalProfit(total)
    }
    const calculateTotalExpenses = (expenses) => {
        const total = expenses.reduce((sum, i) => {
            if (i.expense) {
                return sum - (i.money || 0)
            }
            return sum
        }, 0)
        setTotalExpenses(total)
    }
    const calculateTotalOtherExpenses = (expenses) => {
        const total = expenses.reduce((sum, i) => sum - (i.money || 0), 0)
        setTotalOtherExpenses(total)
    }

    useEffect(() => {
        if (data && otherExpenses) {
            calculateTotalProfit(data)
            calculateTotalExpenses(data)
            calculateTotalOtherExpenses(otherExpenses)
        }
    }, [data, otherExpenses])


    // change tab
    const changeTab = (val) => {
        setTab(val)
        localStorage.setItem('money-manage', val)
    }

    useEffect(() => {
        if (search !== '') {
            setTab('Хаммаси')
        }
    }, [search])


    // form
    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                expense: selectedItem.expense || false,
            })
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    // table
    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            width: 30,
            render: (_, __, index) => <span>{ index+1 }</span>,
        },
        {
            title: 'Номи',
            dataIndex: 'name',
            key: 'name',
            render: (_, { name }) => <span>{ name }</span>,
        },
        {
            className: 'fw600',
            title: 'Харажат',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money, expense }) => <span className={expense ? 'red' : 'green'}>{ expense ? '-' : '+' }{ formatPrice(money) } сум</span>,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (_, { description }) => <span>{ description || '__' }</span>,
        },
        {
            className: 'fw500',
            title: 'Сана',
            dataIndex: 'date',
            key: 'date',
            render: (_, { date }) => <span>{ new Date(date).toLocaleString() }</span>,
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
                        onConfirm={() => deleteItem(item.id)}
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
        <div className="price page">
            <Calculator modal={modal} setModal={setModal} />
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
                    <div className="cards">
                        <Card
                            title='Хаммаси болиб'
                            value={(totalExpenses + totalOtherExpenses) + totalProfit}
                            icon={<i className="fa-solid fa-file-invoice-dollar"/>}
                        />
                        <Card
                            title='Тушум'
                            value={totalProfit}
                        />
                        <Card
                            title='Харажатлар'
                            value={totalExpenses}
                            icon={<i className="fa-solid fa-money-bill-trend-up"/>}
                        />
                        <Card
                            title='Бошка харажатлар'
                            value={totalOtherExpenses}
                            icon={<i className="fa-solid fa-chart-line"/>}
                        />
                    </div>
                    <div className="tabs center mb1">
                        <Segmented
                            size={'large'}
                            options={['Хаммаси', 'Оила', 'Ишхона', 'Ходимлар']}
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
            <Modal
                className='main-modal'
                title={modal === 'add' ? "Кошиш" : "Озгартириш"}
                open={modal !== 'close' && modal !== 'calc'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <Form
                    onFinish={onFormSubmit}
                    layout='vertical'
                    validateMessages={validateMessages}
                    form={form}
                    initialValues={{ expense: true }}
                >
                    <Form.Item
                        name='expense'
                        label="Тури"
                        rules={[{required: true}]}
                    >
                        <Select size="large" placeholder="Танланг">
                            <Select.Option value={false}>
                                Фойда
                            </Select.Option>
                            <Select.Option value={true}>
                                Харажат
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='name'
                        label="Харажат номи"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Харажат номи'/>
                    </Form.Item>
                    <Form.Item
                        name='money'
                        label="Нарх"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Нарх' type='number'/>
                    </Form.Item>
                    <Form.Item
                        name='category'
                        label="Категория"
                        rules={[{ required: true }]}
                    >
                        <Select size="large" placeholder="Танланг">
                            <Select.Option value={'Оила'}>
                                Оила
                            </Select.Option>
                            <Select.Option value={'Ишхона'}>
                                Ишхона
                            </Select.Option>
                            <Select.Option value={'Ходимлар'}>
                                Ходимлар
                            </Select.Option>
                        </Select>
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

export default Price;