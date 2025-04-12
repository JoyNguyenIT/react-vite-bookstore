import { changePasswordAPI } from "@/services/api";
import { Button, Col, Form, Input, message, Row } from "antd";
import { useEffect } from "react";

interface IProps {
    user: IUser | null,
    setOpenManageUser: (v: boolean) => void
}

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
};

const ChangePassword = (props: IProps) => {
    const { user, setOpenManageUser } = props
    const [form] = Form.useForm();

    const onFinish = async (value: FieldType) => {
        const { email, oldpass, newpass } = value
        const res = await changePasswordAPI(email, oldpass, newpass)
        if (res && res.data) {
            localStorage.removeItem("accessToken")
            message.success('Đổi mật khẩu thành công, bạn cần đăng nhập lại')
        }
        else {
            message.error(res.message)
        }

        setOpenManageUser(false)
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email
            })
        }

    }, [])

    return (
        <>
            <Row gutter={10} style={{ margin: "20px" }}>
                <Col md={12}>
                    <Form
                        form={form}
                        labelCol={{ span: 24 }}
                        onFinish={(value) => onFinish(value)}
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mật khẩu hiện tại"
                            name="oldpass"
                            rules={[{ required: true, message: 'Please input your old password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mật khẩu mới"
                            name="newpass"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default ChangePassword