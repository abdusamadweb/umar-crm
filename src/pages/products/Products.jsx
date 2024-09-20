import './Products.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Tooltip} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData} from "../../api/request.js";
import toast from "react-hot-toast";
import Calculator from "../../components/calculator/Calculator.jsx";
import Tables from "../../components/tables/Tables.jsx";

const Products = () => {

    const [form] = Form.useForm()
    const [formUsd] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [search, setSearch] = useState('')

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())

    const [usd, setUsd] = useState(localStorage.getItem('usd') || 12650)


    // fetch data
    const fetchData = async () => {
        const eSearch = encodeURIComponent(search)
        const url = search !== ''
            ? `products?where[name][like]=${eSearch}`
            : `products`

        const { data } = await $api.get(url)
        return search !== '' ? data.reverse() : data.slice(1).reverse()
    }
    const { data, refetch } = useQuery(
        ['products', search],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // fetch usd
    const fetchUsd = async () => {
        const { data } = await $api.get('/usd')
        return data[0]
    }
    const { data: dataUsd, refetch: refetchUsd } = useQuery(
        ['usd'],
        fetchUsd,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )
    useEffect(() => {
        if (dataUsd !== undefined) {
            setUsd(dataUsd)
        }
    }, [dataUsd])


    // add & edit
    const { mutate } = useMutation({
        mutationFn: (values) => {
            setLoading(true)
            return addOrEdit(
                'products',
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
            return deleteData('products', id)
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
            form.setFieldsValue(selectedItem)
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    // add money
    const { mutate: editUsdMutate } = useMutation({
        mutationFn: (values) => {
            setLoading(true)

            const item = {
                ...selectedItem,
                id: null,
                usd: +values.usd
            }
            return addOrEdit('usd', item, selectedItem?.id)
        },
        onSuccess: async () => {
            await refetchUsd()
            toast.success('Озгарди!')

            setModal('close')
            setSelectedItem(null)
            setLoading(false)
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
            setLoading(false)
        }
    })

    const editUsd = (values) => {
        editUsdMutate(values)
        localStorage.setItem('usd', values.usd)
    }


    // form
    useEffect(() => {
        if (selectedItem) {
            formUsd.setFieldsValue({
                ...selectedItem
            })
        } else {
            formUsd.resetFields()
        }
    }, [formUsd, selectedItem])


    // display data
    const keysToNotDisplay = ['locale', 'id', 'dollar', 'total', 'profit', 'date']
    const keysToNotDisplayForm = ['locale', 'id', 'total', 'profit', 'date']

    const filteredKeys = selectedItem !== null ? Object.keys(selectedItem).filter(key => !keysToNotDisplay.includes(key)) : []
    const filteredKeysForm = selectedItem !== null ? Object.keys(selectedItem).filter(key => !keysToNotDisplayForm.includes(key)) : []

    const formatValue = (key, value) => {
        if (key === 'date') {
            return value.slice(0, 10)
        } else if (key === 'name') {
            return value
        } else if (key === 'samorezCount') {
            return `${value} кг`
        } else if (key === 'tg') {
            return <a target='_blank' href={value}>{value}</a>
        } else if (key.includes('Metr')) {
            return `${value} метр`
        } else if (key.includes('Count')) {
            return `${value} та`
        } else if (key.includes('razmer') || key.includes('Visota')) {
            return `${value} см`
        }
        return value + ' $'
    }

    const sumFilteredKeys = (item) => {
        const keysToNotDisplay = ['locale', 'id', 'date', 'price', 'dollar', 'name', 'razmer', 'spinkaVisota', 'sidenyaVisota', 'razmerKreslo', 'tg']

        if (item === null) {
            return 0
        }

        const filteredKeys = Object.keys(item)
            .filter(key => !keysToNotDisplay.includes(key) && !key.includes('Metr') && !key.includes('Count'))

        return filteredKeys.reduce((acc, key) => acc + Number(item[key]), 0)
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
            title: 'Номи',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Нархи',
            className: 'fw500',
            dataIndex: 'price',
            key: 'price',
            render: (_, { price }) => <span>{ formatPrice(price*usd?.usd || 0) } сум</span>,
        },
        {
            title: 'Фойда',
            className: 'fw500',
            dataIndex: 'profit',
            key: 'profit',
            render: (_, item) =>
                <span className='green'>+{ formatPrice((item.price - sumFilteredKeys(item)) * usd?.usd || 0) } сум</span>,
        },
        {
            title: 'Обший расход',
            className: 'fw500',
            dataIndex: 'total',
            key: 'total',
            render: (_, item) =>
                <span className='red'>-{ formatPrice(sumFilteredKeys(item) * usd?.usd || 0) } сум</span>
        },
        {
            title: 'Курс $',
            dataIndex: 'dollar',
            key: 'dollar',
            render: () => <span>{ formatPrice(usd?.usd) } сум</span>,
        },
        {
            title: 'Сана',
            dataIndex: 'date',
            key: 'date',
            render: (_, { date }) => <span>{ new Date(date).toLocaleDateString() }</span>,
        },
        {
            title: 'Размер',
            className: 'fw500',
            dataIndex: 'razmer',
            key: 'razmer',
            render: (_, { razmer }) =>
                <span>{ razmer } см</span>
        },
        {
            title: 'Амаллар',
            key: 'actions',
            width: '170px',
            render: (_, item) => (
                <div className="actions">
                    {
                        item.tg &&
                        <a className='actions__btn tg' href={item.tg} target='_blank'>
                            <i className="fa-brands fa-telegram"/>
                        </a>
                    }
                    <button className='actions__btn view' onClick={() => {
                        setModal('show')
                        setSelectedItem(item)
                    }}>
                        <i className="fa-regular fa-eye"/>
                    </button>
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
        <div className="products page">
            <Calculator modal={modal} setModal={setModal}/>
            <div className="container">
                <Title
                    title='Моллар - хисоб китоби'
                    additional={
                        <Tooltip title='Долларни озгартириш'>
                            <button className='additional-btn' onClick={() => {
                                setModal('usd')
                                setSelectedItem(usd)
                            }}>
                                <i className="fa-solid fa-dollar-sign"/>
                            </button>
                        </Tooltip>
                    }
                />
                <div className="content">
                    <h3 className='fw500 mb1'>Доллар: { formatPrice(usd.usd) } сум</h3>
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
                className='main-modal add-edit'
                title="Озгартириш"
                open={modal === 'edit'}
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
                >
                    <div className='ant-form-content'>
                        {filteredKeysForm.map((key) => (
                            <Form.Item
                                key={key}
                                name={key}
                                label={key?.charAt(0).toUpperCase() + key.slice(1)}
                            >
                                <Input placeholder={key?.charAt(0).toUpperCase() + key.slice(1)}/>
                            </Form.Item>
                        ))}
                    </div>
                    <div className='end mt1'>
                        <Button type="primary" htmlType="submit" size='large' loading={loading}>
                            Тасдиклаш
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                className='main-modal'
                title='Харажати'
                open={modal === 'show'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <div className='mini-cards row align-center'>
                    <div className='card'>
                        <span className='title'>Фойда:</span>
                        <span className='value green'>{ formatPrice(selectedItem?.price - sumFilteredKeys(selectedItem) || 0) } $</span>
                    </div>
                    <div className='card'>
                        <span className='title'>Харажати:</span>
                        <span className='value red'>{ formatPrice(sumFilteredKeys(selectedItem) || 0) } $</span>
                    </div>
                    <div className='card'>
                        <span className='title'>Доллар:</span>
                        <span className='value'>{ usd?.usd || 0 } сум</span>
                    </div>
                </div>
                <ul className='modal-list flex-column'>
                    {filteredKeys.map((key) => (
                        <li className='item' key={key}>
                            <span className='item__label'>{ key }:</span>
                            <span className='item__dots'/>
                            <span className='item__value'>{ formatValue(key, selectedItem[key]) }</span>
                        </li>
                    ))}
                </ul>
                <div className='end mt1'>
                    <Button type="primary" size='large' onClick={() => setModal('edit')}>
                        Озгартириш
                    </Button>
                </div>
            </Modal>
            <Modal
                className='main-modal'
                title="Долларни озгартириш"
                open={modal === 'usd'}
                onCancel={() => setModal('close')}
            >
                <Form
                    form={formUsd}
                    onFinish={editUsd}
                    layout='vertical'
                    validateMessages={validateMessages}
                >
                    <Form.Item
                        name='usd'
                        label="Доллар"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Доллар' type='number' suffix={'сум'} />
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

export default Products