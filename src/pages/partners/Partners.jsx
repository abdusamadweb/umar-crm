import './Partners.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Select, Table, Tooltip} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import {Link} from "react-router-dom";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData} from "../../api/request.js";
import toast from "react-hot-toast";

const Partners = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)


    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get(`/partners`)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['partners'],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // fetch workers
    const fetchWorkers = async () => {
        const { data } = await $api.get('/workers')
        return data.reverse()
    }
    const { data: workers } = useQuery(
        ['workers'],
        fetchWorkers,
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
                'partners',
                { ...values, createdAt: selectedItem ? selectedItem.createdAt : new Date() },
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
            return deleteData('partners', id)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Очирилди!')
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
        }
    })


    // add expense
    const { mutate: addExpense } = useMutation({
        mutationFn: (values) => {
            const item = {
                name: `${values.mebelName} - СОТИЛДИ`,
                description: `${values.mebelName} - ${values.where} сотилди. ${values.worker.name} томонидан килинган ${values.mebelName} ${new Date(values.createdAt).toLocaleString()} шу санада койилган ва ${new Date().toLocaleString()} да ${values.where} да сотилди.`,
                money: values.money,
                date: new Date(),
                expense: false,
            }
            return addOrEdit('expenses', item)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Харажатга кошилди!')
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
        }
    })


    // archive
    const { mutate: archiveMutate } = useMutation({
        mutationFn: (values) => {
            const item = {
                where: values.where,
                worker: values.worker.id,
                mebelName: values.mebelName,
                money: values.money,
                createdAt: values.createdAt,
                archivedAt: new Date(),
                material: values.material,
                materialNumber: values.materialNumber,
                materialPrice: values.materialPrice,
                materialWhere: values.materialWhere,
            }
            return addOrEdit('partners-archive', item)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Архивланди!')
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
        }
    })

    const archiveItem = (values) => {
        archiveMutate(values)
        deleteItem(values.id)
        addExpense(values)
    }


    // form
    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                worker: selectedItem.worker?.id,
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
            width: 50,
            render: (_, __, index) => <span>{ index+1 }</span>,
        },
        {
            title: 'Ким киганлиги',
            dataIndex: 'worker',
            key: 'worker',
            render: (_, { worker }) => <span>{ worker.name }</span>,
        },
        {
            title: 'Докон',
            dataIndex: 'where',
            key: 'where'
        },
        {
            title: 'Мебел номи',
            dataIndex: 'mebelName',
            key: 'mebelName',
            render: (_, { mebelName }) => <span>{ mebelName || '__' }</span>,
        },
        {
            title: 'Канчага койилганлиги',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money }) => <span>{ money ? `${formatPrice(money)} сум` : 'ишбай' }</span>,
        },
        {
            className: 'fw500',
            title: 'Койилган санаси',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, { createdAt }) => <span>{ new Date(createdAt).toLocaleString() }</span>,
        },
        {
            title: 'Материал',
            dataIndex: 'material',
            key: 'material',
            render: (_, { material, materialNumber }) => <span>{ material + ' - ' + materialNumber }</span>,
        },
        {
            title: 'Материал нархи',
            dataIndex: 'materialPrice',
            key: 'materialPrice',
            render: (_, { materialPrice }) => <span>{ formatPrice(materialPrice) } сум</span>,
        },
        {
            title: 'Материал катан олинган',
            dataIndex: 'materialWhere',
            key: 'materialWhere',
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
                        title="Архивлашни хохлайсизми?"
                        description=' '
                        okText="Ха"
                        cancelText="Йок"
                        placement='topRight'
                        onConfirm={() => archiveItem(item)}
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


    return (
        <div className='works page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Доконлар'
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
                        <Table
                            columns={columns}
                            dataSource={data}
                            scroll={{ x: 750 }}
                        />
                    </div>
                </div>
            </div>
            <Modal
                className='main-modal'
                title={modal === 'add' ? "Кошиш" : "Озгартириш"}
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
                    <Form.Item
                        name='where'
                        label="Докон"
                        rules={[{required: true}]}
                    >
                        <Input placeholder='Докон'/>
                    </Form.Item>
                    <Form.Item
                        name='worker'
                        label="Ходим"
                        rules={[{required: true}]}
                    >
                        <Select size="large" placeholder="Танланг">
                            {workers?.map(i => (
                                <Select.Option key={i?.id} value={i?.id}>
                                    {i?.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='mebelName'
                        label="Мебел номи"
                        rules={[{required: true}]}
                    >
                        <Input placeholder='Мебел номи'/>
                    </Form.Item>
                    <Form.Item
                        name='money'
                        label="Нархи"
                        rules={[{required: true}]}
                    >
                        <Input placeholder='Иш хаки' type='number'/>
                    </Form.Item>
                    <div className='grid' style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 1rem' }}>
                        <Form.Item
                            style={{ height: '44px' }}
                            name='material'
                            label="Материал номи"
                        >
                            <Input placeholder='Материал номи'/>
                        </Form.Item>
                        <Form.Item
                            name='materialNumber'
                            label="Материал номери"
                        >
                            <Input placeholder='Материал номери' type='number'/>
                        </Form.Item>
                        <Form.Item
                            name='materialPrice'
                            label="Материал нархи"
                        >
                            <Input placeholder='Материал нархи' type='number'/>
                        </Form.Item>
                        <Form.Item
                            name='materialWhere'
                            label="Материал каердан олинганлиги"
                        >
                            <Input placeholder='Материал каердан олинганлиги'/>
                        </Form.Item>
                    </div>
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

export default Partners;