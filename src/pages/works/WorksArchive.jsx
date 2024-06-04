import React, {useState} from 'react';
import Title from "../../components/title/Title.jsx";
import {Popconfirm, Segmented, Table} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {deleteData} from "../../api/request.js";
import toast from "react-hot-toast";

const WorksArchive = () => {

    const [value, setValue] = useState(localStorage.getItem('work') || 'Абшивка')

    const changeWork = (val) => {
        setValue(val)
        localStorage.setItem('work', val)
    }


    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get(`/works-archive?whereRelation[category][name]=${value}`)
        return data
    }
    const { data, refetch } = useQuery(
        ['works-archive', value],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // delete
    const { mutate: deleteItem } = useMutation({
        mutationFn: (id) => {
            return deleteData('works-archive', id)
        },
        onSuccess: async () => {
            await refetch()
            toast.success('Очирилди!')
        },
        onError: async () => {
            toast.error('Серверда муаммо!')
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
            width: '20%',
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
            className: 'fw500',
            title: 'Тугаган санаси',
            dataIndex: 'archivedAt',
            key: 'archivedAt',
            render: (_, { archivedAt }) => <span>{ new Date(archivedAt).toLocaleString() }</span>,
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
            render: (_, { id }) => (
                <div className="actions">
                    {/*<button className='actions__btn view' onClick={() => setModal('view')}>*/}
                    {/*    <i className="fa-solid fa-eye"/>*/}
                    {/*</button>*/}
                    <Popconfirm
                        title="Очиришни хохлайсизми?"
                        okText="Ха"
                        cancelText="Йок"
                        onConfirm={() => deleteItem(id)}
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
        <div className='works page'>
            <div className="container">
                <div className="workers__inner">
                    <Title
                        title='Архивланган ишлар'
                        navigate={true}
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
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorksArchive;