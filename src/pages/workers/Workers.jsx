import './Workers.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Tag} from "antd";
import {formatPhone, formatPrice} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData, fetchCategory} from "../../api/request.js";

const { Option } = Select

const Workers = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selectedItem, setSelectedItem] = useState(null)


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


    // fetch category
    const { data: category } = useQuery(
        ['category'],
        fetchCategory,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // add & edit
    const { mutate } = useMutation({
        mutationFn: (values) => {
            console.log(values, 'fn')

            return addOrEdit('workers', values, selectedItem?.id || false);
        },
        onSuccess: async (res) => {
            console.log(res, 'success')
            setModal('close')
        },
        onError: async (err) => {
            console.log(err, 'error')
        }
    })

    const onFormSubmit = (values) => {
        mutate(values)
        setSelectedItem(null)
    }


    // delete
    const { mutate: deleteItem } = useMutation({
        mutationFn: (id) => {

            return deleteData('workers', id)
        },
        onSuccess: async (res) => {
            console.log(res, 'success')
        },
        onError: async (err) => {
            console.log(err, 'error')
        }
    })


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
            key: 'category',
            dataIndex: 'category',
            render: (_, { category }) => {
                let color = 'purple'
                if (category?.name === 'Абшивка') {
                    color = 'volcano'
                } else if (category?.name === 'Карказ') {
                    color = 'green'
                } else if (category?.name === 'Тикувчи') {
                    color = 'gold'
                }
                return (
                    <Tag color={color} key={category?.name}>
                        { category?.name?.toUpperCase() || '_' }
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
                        onConfirm={() => deleteItem(item?.id)}
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

    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                category: selectedItem.category?.name,
            })
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    return (
        <div className='workers page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Ходимлар'
                        btn='Кошишs'
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
                    <div className='d-flex between align-center g1'>
                        <Form.Item
                            className='age'
                            name='name'
                            label="Ф.И.О"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder='Исм шариф' />
                        </Form.Item>
                        <Form.Item
                            name='age'
                            label="Йоши"
                            rules={[{ required: true }]}
                        >
                            <InputNumber placeholder='Йоши' type='number' max={99} min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name='phone'
                        label="Телефон"
                            rules={[{ required: true }]}
                    >
                        <Input placeholder='Телефон' type='tel' defaultValue='+998' />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Сохаси"
                        rules={[{ required: true }]}
                    >
                        <Select size="large" placeholder="Танланг">
                            {category?.map(i => (
                                <Option key={i?.id} value={i?.name}>
                                    {i?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='salary'
                        label="Маоши"
                    >
                        <Input placeholder='Маоши' type='number' />
                    </Form.Item>
                    <Form.Item
                        name='address'
                        label="Турар жойи"
                            rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder='Турар жойи' />
                    </Form.Item>
                    <div className='end mt1'>
                        <Button type="primary" htmlType="submit" size='large'>
                            Тасдиклаш
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default Workers;