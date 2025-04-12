import React, { useState } from 'react';
import { Divider, Form, Input, Modal, App } from 'antd';
import { createUserAPI } from '@/services/api';
import { ActionType } from '@ant-design/pro-components';

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

interface IProps {
    actionRef: React.RefObject<ActionType>;
    openModalAddUser: boolean
    setOpenModalAddUser: (v: boolean) => void
}

const ModalAddNewUser = (props: IProps) => {
    const [form] = Form.useForm();

    const { message } = App.useApp()


    const { openModalAddUser, setOpenModalAddUser, actionRef } = props


    const onSubmit = async (values: FieldType) => {
        const res = await createUserAPI(values.fullName, values.email, values.password, values.phone)
        console.log(res)
        if (res.data) {
            message.success('Thêm người dùng thành công!')
            actionRef.current?.reload()
            setOpenModalAddUser(false)
            form.resetFields()

        }
        else {
            message.error(res.message)
        }

    };

    return (
        <>
            <Modal
                open={openModalAddUser}
                title="Thêm mới người dùng"
                okText="Tạo mới"
                cancelText="Hủy"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => setOpenModalAddUser(false)}
                destroyOnClose
                modalRender={(dom) => (
                    <>
                        <Form
                            layout="vertical"
                            form={form}
                            name="form_in_modal"
                            initialValues={{ modifier: 'public' }}
                            clearOnDestroy
                            onFinish={(values) => onSubmit(values)}
                        >
                            {dom}
                        </Form>
                    </>
                )}
            >
                <Divider></Divider>
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

            </Modal>
        </>
    );
};

export default ModalAddNewUser;