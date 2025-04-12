import { putUpdateBookAPI, putUpdateInforUserAPI, UploadBookImgAPI } from "@/services/api";
import { UploadOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Form, GetProp, Input, message, Row, Upload, UploadFile } from "antd"
import { App, UploadProps } from "antd/lib";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";

interface IProps {
    user: IUser | null
    urlAvatar: string
    setOpenManageUser: (v: boolean) => void
    setUser: (v: IUser) => void
}

interface FieldType {
    email: string,
    fullName: string,
    phone: string,
    _id: string,
    avatar: string,
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ChangeInfor = (props: IProps) => {
    const { user, urlAvatar, setOpenManageUser, setUser } = props
    const [form] = Form.useForm()
    const [avatar, setAvatar] = useState<string>()
    const [fileAvatar, setFileAvatar] = useState<UploadFile | undefined>()

    const handleUploadAvatar = async (options: any) => {
        const { file } = options
        const res = await UploadBookImgAPI(file, "avatar")
        if (res && res.data) {
            const uploadFile: UploadFile = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${res.data.fileUploaded}`,
            }
            setFileAvatar(uploadFile)
            setAvatar(uploadFile.url)
        }
    }

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                _id: user.id,
                avatar: user.avatar
            })
            setAvatar(urlAvatar)
        }
    }, [])

    const handleSubmit = async (value: FieldType) => {
        const { fullName, phone, _id } = value
        const res = await putUpdateInforUserAPI(_id, fullName, phone, fileAvatar?.name)
        if (res && res.data) {
            setUser({
                ...user!,
                fullName,
                phone,
                avatar: avatar!,
            })
            message.success('Upadate user success!')
        }
        else {
            message.error(res.message)
        }
        setOpenManageUser(false)
    }

    return (
        <div>
            <Row gutter={[20, 20]}>
                <Col md={12}>
                    <Avatar
                        size={{ xxl: 150 }}
                        src={avatar}
                    />
                    <div style={{ marginTop: 30 }}>
                        <Upload
                            showUploadList={false}
                            maxCount={1}
                            name="avatar"
                            beforeUpload={beforeUpload}
                            customRequest={(options) => handleUploadAvatar(options)}
                        >
                            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                        </Upload>
                    </div>
                </Col>
                <Col md={12}>
                    <Form
                        name="form-update"
                        form={form}
                        onFinish={(value) => handleSubmit(value)}
                    >
                        {/* Hidden _id field - doesn't need Row/Col */}
                        <Form.Item<FieldType> name="_id" hidden>
                            <Input />
                        </Form.Item>

                        {/* Email field */}
                        <Row gutter={10}>
                            <Col span={24}>
                                <Form.Item
                                    label="Email"
                                    labelCol={{ span: 24 }}
                                    name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email' }]}
                                >
                                    <Input disabled style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Name field */}
                        <Row gutter={10}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Tên hiển thị"
                                    name="fullName"
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col >
                        </Row>

                        {/* Phone field */}
                        <Row gutter={10}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    label="Số điện thoại"
                                    labelCol={{ span: 24 }}
                                    name="phone"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Submit button */}
                        <Row gutter={10}>

                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>

                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default ChangeInfor