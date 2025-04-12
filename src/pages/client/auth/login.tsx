import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI, registerAPI } from 'services/api';
import { App } from 'antd';
import 'pages/client/auth/login.scss'
import { useCurrentApp } from '@/components/context/app.context';


type FieldType = {
    email: string;
    password: string;
};


const LoginPage: React.FC = () => {
    const { notification } = App.useApp();
    const [isSubmit, SetIsSubmit] = useState(false)
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        SetIsSubmit(true)
        const { email, password, } = values
        const res = await loginAPI(email, password);
        if (res && res.error && res.message) {
            notification.error({
                message: 'Thông báo lỗi',
                description: res.message,
                placement: 'topRight',
            });

        }
        if (res && res.data) {
            setIsAuthenticated(true)
            setUser(res.data.user)
            localStorage.setItem('accessToken', res.data.access_token);
            notification.success({
                message: 'Đăng nhập thành công',
                description: 'Chuyển hướng đến trang chủ',
                placement: 'topRight',
            });

            navigate('/')
        }
        SetIsSubmit(false)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login-page'>
            <div className='container'>
                <h2 className='title-text'>Đăng Nhập </h2>
                <Divider />
                <Form
                    name="basic"
                    labelCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Email chưa hợp lệ',
                            },
                            {
                                required: true,
                                message: 'Email không được để trống',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={isSubmit}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
                <Divider >Or</Divider>
                <div className='item-footer'>
                    <span>Chưa có tài khoản?<Link to={'/register'} className='register-link'>Đăng ký</Link></span>
                </div>
            </div>
        </div>
    )
}

export default LoginPage       
