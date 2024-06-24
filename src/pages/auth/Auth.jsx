import './Auth.scss'
import React, {useState} from 'react';
import {Button, Form, Input} from "antd";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {TOKEN} from "../../api/apiConfig.js";

const Auth = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)


    const auth = ({ login, password }) => {
        setLoading(true)

        if (login === 'admin' && password === '1') {
            sessionStorage.setItem('token', TOKEN)

            toast.success('Хуш келибсиз!')
            setTimeout(() => navigate('/'), 1500)
        } else {
            toast.error('Хато!')
            setLoading(false)
        }
    }


    return (
        <div className="login">
            <div className="login__inner">
                <h2 className="login__title mb2">Кириш</h2>
                <Form
                    name="basic"
                    layout='vertical'
                    onFinish={auth}
                >
                    <Form.Item
                        label="Логин"
                        name="login"
                        rules={[
                            {
                                required: true,
                                message: 'Логинни киритинг!',
                            },
                        ]}
                    >
                        <Input placeholder='Логин' />
                    </Form.Item>
                    <Form.Item
                        label="Парол"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Ппаролни киритинг!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='Парол' />
                    </Form.Item>
                    <Button
                        className="login__button"
                        type="primary"
                        htmlType="submit"
                        size='large'
                        loading={loading}
                    >
                        Тасдиклаш
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Auth;