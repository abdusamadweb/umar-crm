import './Products.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Table} from "antd";
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
        const { data } = await $api.get('other-expenses')
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['other-expenses'],
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
                'other-expenses',
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
            title: 'Фойда',
            dataIndex: 'profit',
            key: 'profit',
            render: (_, { profit }) => <span className='green'>+{ profit } сум</span>,
        },
        {
            title: 'Обший расход',
            dataIndex: 'total',
            key: 'total',
            render: (_, { total }) => <span className='red'>-{ total } сум</span>,
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
            render: (_, { material }) => <span>{ material } $</span>,
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
        <div className="other page">
            <Calculator modal={modal} setModal={setModal} />
            <div className="container">
                <Title
                    title='Моллар - хисоб китоби'
                    btn='Кошиш'
                    click={() => setModal('add')}
                    icon={true}
                />
                <div className="content">
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 550 }}
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
                >
                    <Form.Item
                        name='name'
                        label="Харажат"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Харажат'/>
                    </Form.Item>
                    <Form.Item
                        name='money'
                        label="Нарх"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder='Нарх' type='number'/>
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