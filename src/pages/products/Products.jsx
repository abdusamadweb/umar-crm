import './Products.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Select, Table} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData} from "../../api/request.js";
import toast from "react-hot-toast";
import Calculator from "../../components/calculator/Calculator.jsx";

const Products = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)


    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get('products')
        return data?.slice(1).reverse()
    }
    const { data, refetch } = useQuery(
        ['products'],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // fetch first data
    const fetchData1 = async () => {
        const { data } = await $api.get('products')
        return data?.slice(0, 1)
    }
    const { data: first } = useQuery(
        ['products1'],
        fetchData1,
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


    // calculate expenses
    const [totalExpenses, setTotalExpenses] = useState(0)

    const calculateTotalExpenses = (expenses) => {
        const total = expenses.reduce((sum, i) => sum + (i.money || 0), 0)
        setTotalExpenses(total)
    }

    useEffect(() => {
        if (data) {
            calculateTotalExpenses(data)
        }
    }, [data])


    // display data
    const keysToNotDisplay = ['locale', 'id', 'dollar', 'total', 'profit']
    const keysToNotDisplayForm = ['locale', 'id', 'total', 'profit', 'date']

    const filteredKeys = selectedItem !== null ? Object.keys(selectedItem).filter(key => !keysToNotDisplay.includes(key)) : []
    const filteredKeysForm = selectedItem !== null ? Object.keys(selectedItem).filter(key => !keysToNotDisplayForm.includes(key)) : []

    const formatValue = (key, value) => {
        if (key === 'date') {
            return value.slice(0, 10)
        } else if (key.includes('Metr')) {
            return `${value} метр`
        } else if (key === 'name' || key === 'material') {
            return value
        }
        return value + ' $'
    }

    // const [firstData, setFirstData] = useState({})
    // useEffect(() => {
    //     setFirstData(selectedItem !== null ? Object.keys(selectedItem).filter(key => !keysToNotDisplayForm.includes(key)) : [])
    // }, [first, keysToNotDisplayForm, selectedItem])
    // console.log(firstData)
    //
    // const [selects, setSelects] = useState([])
    // const [counter, setCounter] = useState(0)
    //
    // const addSelect = () => {
    //     setSelects([...selects, counter])
    //     setCounter(counter + 1)
    // }


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
            render: (_, { price, dollar }) => <span>{ formatPrice(price*dollar || 0) } сум</span>,
        },
        {
            title: 'Фойда',
            className: 'fw500',
            dataIndex: 'profit',
            key: 'profit',
            render: (_, { profit }) => <span className='green'>+{ formatPrice(profit || 0) } сум</span>,
        },
        {
            title: 'Обший расход',
            className: 'fw500',
            dataIndex: 'total',
            key: 'total',
            render: (_, { total }) => <span className='red'>-{ formatPrice(total || 0) } сум</span>,
        },
        {
            title: 'Курс $',
            dataIndex: 'dollar',
            key: 'dollar',
            render: (_, { dollar }) => <span>{ formatPrice(dollar) } сум</span>,
        },
        {
            title: 'Сана',
            className: 'fw500',
            dataIndex: 'date',
            key: 'date',
            render: (_, { date }) => <span>{ new Date(date).toLocaleDateString() }</span>,
        },
        {
            title: 'Материал',
            dataIndex: 'material',
            key: 'material',
        },
        {
            title: 'Амаллар',
            key: 'actions',
            width: '170px',
            render: (_, item) => (
                <div className="actions">
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
            <Calculator modal={modal} setModal={setModal} />
            <div className="container">
                <Title
                    title='Моллар - хисоб китоби'
                />
                <div className="content">
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{x: 550}}
                    />
                </div>
            </div>
            {/*<Modal*/}
            {/*    className='main-modal add-edit'*/}
            {/*    title="Кошиш"*/}
            {/*    open={modal === 'add'}*/}
            {/*    onCancel={() => {*/}
            {/*        setModal('close')*/}
            {/*        setSelectedItem(null)*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Form*/}
            {/*        onFinish={onFormSubmit}*/}
            {/*        layout='vertical'*/}
            {/*        validateMessages={validateMessages}*/}
            {/*        form={form}*/}
            {/*    >*/}
            {/*        <div className="ant-form-content">*/}
            {/*            <Select*/}
            {/*                showSearch*/}
            {/*                placeholder="Танланг"*/}
            {/*                optionFilterProp="children"*/}
            {/*            >*/}
            {/*                /!*{*!/*/}
            {/*                /!*    firstData !== null ?*!/*/}
            {/*                /!*        firstData?.map((key) => (*!/*/}
            {/*                /!*            <Select.Option value={key} key={key}>*!/*/}
            {/*                /!*                {key?.charAt(0).toUpperCase() + key.slice(1)}*!/*/}
            {/*                /!*            </Select.Option>*!/*/}
            {/*                /!*        )) : <p>Loading . . .</p>*!/*/}
            {/*                /!*}*!/*/}
            {/*            </Select>*/}
            {/*            {selects?.map((selectId) => (*/}
            {/*                <Select*/}
            {/*                    key={selectId}*/}
            {/*                    showSearch*/}
            {/*                    placeholder="Танланг"*/}
            {/*                    optionFilterProp="children"*/}
            {/*                >*/}
            {/*                    {firstData?.map((key) => (*/}
            {/*                        <Select.Option value={key} key={key}>*/}
            {/*                            {key?.charAt(0).toUpperCase() + key.slice(1)}*/}
            {/*                        </Select.Option>*/}
            {/*                    ))}*/}
            {/*                </Select>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*        <button className='add-btn' type='button' onClick={addSelect}>*/}
            {/*            <i className="fa-solid fa-circle-plus"/>*/}
            {/*        </button>*/}
            {/*        <div className='end mt1'>*/}
            {/*            <Button type="primary" htmlType="submit" size='large' loading={loading}>*/}
            {/*                Тасдиклаш*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </Form>*/}
            {/*</Modal>*/}
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
                <div className='mini-cards row between align-center'>
                    <div className='card'>
                        <span className='title'>Фойда:</span>
                        <span className='value green'>{ selectedItem?.profit || 0 } сум</span>
                    </div>
                    <div className='card'>
                        <span className='title'>Харажати:</span>
                        <span className='value red'>{ selectedItem?.total || 0 } сум</span>
                    </div>
                    <div className='card'>
                        <span className='title'>Доллар:</span>
                        <span className='value'>{ selectedItem?.dollar || 0 } $</span>
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
        </div>
    );
};

export default Products