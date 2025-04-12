import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from 'services/api';
import { App } from 'antd';
import 'pages/client/auth/register.scss'


type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};


const RegisterPage: React.FC = () => {
    const { message } = App.useApp();
    const [isSubmit, SetIsSubmit] = useState(false)
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        SetIsSubmit(true)
        const { email, fullName, password, phone } = values
        const res = await registerAPI(fullName, email, password, phone);
        console.log(">>>check res", res)

        if (res && res.error && res.message) {
            message.error(res.message)

        }
        if (res && res.data) {
            message.success('Đăng ký thành công, chuyển hướng đến trang đăng nhập')
            setTimeout(() => navigate('/login'), 5000)
        }
        SetIsSubmit(false)
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='register-page'>
            <div className='container'>
                <h2 className='title-text'>Đăng Ký Tài Khoản</h2>
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
                    <Form.Item<FieldType>
                        label="Họ Tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>

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

                    <Form.Item<FieldType>
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" loading={isSubmit} className='btn-regis'>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
                <Divider >Or</Divider>
                <div className='item-footer'>
                    <span>Đã có tài khoản?<Link to={'/login'} className='login-link'>Đăng nhập</Link></span>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage       
