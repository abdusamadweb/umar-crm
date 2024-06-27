import './Works.scss'
import React, {useEffect, useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Button, Form, Input, Modal, Popconfirm, Segmented, Select, Table, Tooltip} from "antd";
import {formatPrice, validateMessages} from "../../assets/scripts/global.js";
import {Link} from "react-router-dom";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {addOrEdit, deleteData, fetchCategory} from "../../api/request.js";
import toast from "react-hot-toast";

const Works = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [loading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [value, setValue] = useState(localStorage.getItem('work') || 'Абшивка')

    const changeWork = (val) => {
        setValue(val)
        localStorage.setItem('work', val)
    }


    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get(`/works?whereRelation[category][name]=${value}`)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['works', value],
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
            setLoading(true)
            return addOrEdit(
                'works',
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
            return deleteData('workers', id)
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
                name: `${values.mebelName} - ${values.worker.name} ${values.category.name}`,
                description: `${values.worker.name} - ${values.mebelName}ни ${values.category.name}сини килди. ${new Date(values.createdAt).toLocaleString()} дан ${new Date().toLocaleString()} га кадар тугатилди`,
                money: values.money,
                date: new Date(),
                expense: true,
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
                worker: values.worker.id,
                category: values.category.id,
                mebelName: values.mebelName,
                description: values.description,
                createdAt: values.createdAt,
                archivedAt: new Date(),
                where: values.where,
                money: values.money,
            }
            return addOrEdit('works-archive', item)
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
                category: selectedItem.category?.id,
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
            title: 'Ходим',
            dataIndex: 'worker',
            key: 'worker',
            render: (_, { worker }) => <span>{ worker.name }</span>,
        },
        {
            title: 'Мебел номи',
            dataIndex: 'mebelName',
            key: 'mebelName',
            render: (_, { mebelName }) => <span>{ mebelName || '__' }</span>,
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '22%',
            render: (_, { description }) => <span>{ description || '__' }</span>,
        },
        {
            className: 'fw500',
            title: 'Бошланган санаси',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, { createdAt }) => <span>{ new Date(createdAt).toLocaleString() }</span>,
        },
        {
            title: 'Докон',
            dataIndex: 'where',
            key: 'where'
        },
        {
            title: 'Иш хаки',
            dataIndex: 'money',
            key: 'money',
            render: (_, { money }) => <span>{ money ? `${formatPrice(money)} сум` : 'ишбай' }</span>,
        },
        {
            title: 'Амаллар',
            key: 'actions',
            render: (_, item) => (
                <div className="actions">
                    {/*<button className='actions__btn view' onClick={() => setModal('view')}>*/}
                    {/*    <i className="fa-solid fa-eye"/>*/}
                    {/*</button>*/}
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
                                onChange={changeWork}
                            />
                        </div>
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
                        name='category'
                        label="Сохаси"
                        rules={[{required: true}]}
                    >
                        <Select size="large" placeholder="Танланг">
                            {category?.map(i => (
                                <Select.Option key={i?.id} value={i?.id}>
                                    {i?.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='mebelName'
                        label="Мебел номи"
                    >
                        <Input placeholder='Мебел номи'/>
                    </Form.Item>
                    <Form.Item
                        name='description'
                        label="Описание"
                    >
                        <Input.TextArea placeholder='Описание'/>
                    </Form.Item>
                    <Form.Item
                        name='money'
                        label="Иш хаки"
                    >
                        <Input placeholder='Иш хаки' type='number'/>
                    </Form.Item>
                    <Form.Item
                        name='where'
                        label="Докон"
                        rules={[{required: true}]}
                    >
                        <Input placeholder='Докон'/>
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

export default Works;