import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Select, Tooltip} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import Tables from "../../components/tables/Tables.jsx";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData} from "../../api/request.js";
import toast from "react-hot-toast";

const Debt = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [search, setSearch] = useState('')

    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())


    // fetch data
    const fetchData = async () => {
        const eSearch = encodeURIComponent(search)
        const url = search !== ''
            ? `debt?timestamps&where[where][like]=${eSearch}`
            : `debt?timestamps`

        const { data } = await $api.get(url)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['debt', search],
        fetchData,
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
                'debt',
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
            return deleteData('debt', id)
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
            })
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    // calculate debts
    const [totalProfit, setTotalProfit] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)

    const calculateTotalProfit = (debts) => {
        const total = debts.reduce((sum, i) => {
            if (!i.debt) {
                return sum + (i.money || 0)
            }
            return sum
        }, 0)
        setTotalProfit(total)
    }
    const calculateTotalExpenses = (debts) => {
        const total = debts.reduce((sum, i) => {
            if (i.debt) {
                return sum - (i.money || 0)
            }
            return sum
        }, 0)
        setTotalExpenses(total)
    }

    useEffect(() => {
        if (data) {
            calculateTotalProfit(data)
            calculateTotalExpenses(data)
        }
    }, [data])


    // form
    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                debt: selectedItem.debt || false,
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
            title: 'Микдори',
            className: 'fw600',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money, debt }) => <span className={debt ? 'red' : 'green'}>{ debt ? '-' : '+' }{ formatPrice(money) } $</span>,
        },
        {
            title: 'Сана',
            className: 'fw500',
            dataIndex: 'date',
            key: 'date',
            render: (_, { date }) => <span>{ new Date(date).toLocaleString() }</span>,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            render: (_, { description }) => <span>{ description || '__' }</span>,
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
        <div className="debt page">
            <div className="container">
                <Title
                    title='Пул менежменти'
                    btn='Кошиш'
                    click={() => setModal('add')}
                    icon={true}
                />
                <div className="content">
                    <div className="cards">
                        <div className='card'>
                            <div className='card__titles'>
                                <h3 className='title'>Қарзлар берилган:</h3>
                                <i className="fa-solid fa-money-bill-transfer"/>
                            </div>
                            <span className='card__num green'>+{formatPrice(totalProfit)} $</span>
                        </div>
                        <div className='card'>
                            <div className='card__titles'>
                                <h3 className='title'>Қарз олинган:</h3>
                                <i className="fa-solid fa-money-bill-trend-up"/>
                            </div>
                            <span className='card__num red'>{formatPrice(totalExpenses)} $</span>
                        </div>
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
                    initialValues={{ debt: true }}
                >
                    <Form.Item
                        name='debt'
                        label="Тури"
                        rules={[{required: true}]}
                    >
                        <Select size="large" placeholder="Танланг">
                            <Select.Option value={true}>
                                Қарз
                            </Select.Option>
                            <Select.Option value={false}>
                                Қарз берилган
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='name'
                        label="Номи"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Номи'/>
                    </Form.Item>
                    <Form.Item
                        name='money'
                        label="Нарх"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Нарх' type='number'/>
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

export default Debt;