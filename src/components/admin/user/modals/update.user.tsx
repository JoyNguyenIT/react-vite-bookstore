import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, App } from 'antd';
import { createUserAPI, putUpdateUserAPI } from '@/services/api';
import { ActionType } from '@ant-design/pro-components';

type FieldType = {
    fullName: string;
    email: string;
    _id: string;
    phone: string;
};

interface IProps {
    actionRef: React.RefObject<ActionType>;
    setDataUserUpdate: (v: IUserTable | null) => void
    dataUserUpdate: IUserTable | null
    openModalUpdate: boolean
    setOpenModalUpdate: (v: boolean) => void
}



const ModalUpdateUser = (props: IProps) => {
    const [form] = Form.useForm();

    const { message } = App.useApp()


    const { openModalUpdate, setOpenModalUpdate, actionRef, dataUserUpdate, setDataUserUpdate } = props

    useEffect(() => {
        if (dataUserUpdate) {
            form.resetFields()
            form.setFieldsValue({
                _id: dataUserUpdate._id,
                email: dataUserUpdate.email,
                fullName: dataUserUpdate.fullName,
                phone: dataUserUpdate.phone,
            })
        }
    }, [dataUserUpdate])

    const onSubmit = async (values: FieldType) => {

        const res = await putUpdateUserAPI(values._id, values.fullName, values.phone)

        if (res.data) {
            message.success('Cập nhật người dùng thành công')
            actionRef.current?.reload()
            setOpenModalUpdate(false)
            setDataUserUpdate(null)
            form.resetFields()

        }
        else {
            message.error(res.message)
        }

    };

    return (
        <>
            <Modal
                open={openModalUpdate}
                title="Cập nhật người dùng"
                okText="Cập nhật"
                cancelText="Hủy"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => {
                    setOpenModalUpdate(false)
                    setDataUserUpdate(null)
                    form.resetFields()
                }}
                destroyOnClose
                modalRender={(dom) => (
                    <>
                        <Form
                            layout="vertical"
                            form={form}
                            name="form_update"
                            initialValues={{ modifier: 'public' }}
                            onFinish={(values) => onSubmit(values)}
                        >
                            {dom}
                        </Form>
                    </>
                )}
            >
                <Divider></Divider>
                <Form.Item<FieldType>
                    label="ID"
                    name="_id"
                    hidden
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>

                    name="email"
                    label="Email"
                    rules={[

                        {
                            required: true,
                            message: "Email không được để trống"
                        },
                        {
                            type: "email",
                            message: "Email không đúng định dạng"
                        }
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Tên hiển thị"
                    name="fullName"
                    rules={[{ required: true, message: 'Tên không được để trống' }]}
                >
                    <Input />
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

export default ModalUpdateUser;