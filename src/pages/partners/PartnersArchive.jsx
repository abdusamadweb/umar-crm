import React from 'react';
import Title from "../../components/title/Title.jsx";
import {Popconfirm, Table} from "antd";
import {formatPrice} from "../../assets/scripts/global.js";
import $api from "../../api/apiConfig.js";
import {useMutation, useQuery} from "react-query";
import {deleteData} from "../../api/request.js";
import toast from "react-hot-toast";

const PartnersArchive = () => {

    // fetch data
    const fetchData = async () => {
        const { data } = await $api.get(`/partners-archive`)
        return data.reverse()
    }
    const { data, refetch } = useQuery(
        ['partners-archive'],
        fetchData,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        }
    )


    // delete
    const { mutate: deleteItem } = useMutation({
        mutationFn: (id) => {
            return deleteData('partners-archive', id)
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
            render: (_, { id }) => (
                <div className="actions">
                    <Popconfirm
                        title="Очиришни хохлайсизми?"
                        okText="Ха"
                        cancelText="Йок"
                        placement='topRight'
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
                        title='Архивланган ва сотилган махсулотлар'
                        navigate={true}
                    />
                    <div className="content">
                        <Table columns={columns} dataSource={data} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnersArchive;