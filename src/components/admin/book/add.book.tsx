import { useEffect, useState } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { Form, Input, Modal, Divider, Row, Col, InputNumber, Select, Upload, Image, message, notification } from 'antd';
import { createBookAPI, getCategoryBook, UploadBookImgAPI } from '@/services/api';
import { GetProp } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FieldType {
    author: string;
    mainText: string;
    category: string;
    price: number;
    quantity: number;
    slider: File[];
    thumbnail: File[];
    sold: number
};

type UserUploadType = "thumbnail" | "slider"

interface IProps {
    openModalAddBook: boolean,
    setOpenModalAddBook: (v: boolean) => void
    refreshTable: () => void
}

const FormAddBook = (props: IProps) => {
    const [form] = Form.useForm();
    const { openModalAddBook, setOpenModalAddBook, refreshTable } = props
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [thumbnailImg, setThumbnailImg] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);



    const onSubmit = async (values: IBookTable) => {
        values.sold = 0
        const { mainText, author, price, sold, quantity, category } = values
        const thumbnail = thumbnailImg?.[0]?.name ?? ""
        const slider = fileListSlider?.map(item => item.name) ?? []
        const res = await createBookAPI(
            mainText,
            author,
            category,
            price,
            quantity,
            slider,
            thumbnail,
            sold
        )
        if (res && res.data) {
            message.success('Tạo mới book thành công');
            form.resetFields();
            setFileListSlider([]);
            setThumbnailImg([]);
            setOpenModalAddBook(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
    }

    const handleUploadFile = async (options: any, typeImg: UserUploadType) => {
        const { onSuccess, file } = options
        onSuccess("Ok")
        const res = await UploadBookImgAPI(options.file, "book")
        if (res && res.data) {
            const uploadFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`,
            }
            if (typeImg === 'slider') {
                setFileListSlider((prevState) => prevState.concat({ ...uploadFile }));
            }
            else {
                setThumbnailImg([{ ...uploadFile }])
            }
        }

    }

    const handleRemove = (file: UploadFile, typeImg: UserUploadType) => {
        if (typeImg === 'thumbnail') {
            setThumbnailImg([])
        }
        else {
            let newSlider = fileListSlider.filter(item => item.uid !== file.uid)
            setFileListSlider(newSlider)
        }
    }

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryBook()
            if (res.data) {
                let dataRes = res.data.map((item) => {
                    return {
                        label: item,
                        value: item
                    }
                })
                setListCategory(dataRes)
            }
        }

        fetchCategory()
    }, [])


    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Modal
                width={"50vw"}
                onOk={() => form.submit()}
                open={openModalAddBook}
                title="Thêm mới sách"
                okText="Tạo mới"
                cancelText="Hủy"
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                onCancel={() => setOpenModalAddBook(false)}
                destroyOnClose
            >
                <Divider></Divider>
                <Form
                    form={form}
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                    clearOnDestroy
                    onFinish={(values) => onSubmit(values)}>
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tên sách"
                                name="mainText"
                                labelCol={{ span: 24 }}

                                rules={[{ required: true, message: 'Tên sách không được để trống' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tác giả"
                                name="author"
                                labelCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Tác giả không được để trống' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={10}>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Giá tiền"
                                name="price"
                                labelCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Giá tiền không được để trống' }]}
                            >
                                <InputNumber
                                    min={1}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Thể loại"
                                name="category"
                                labelCol={{ span: 24 }}

                                rules={[{ required: true, message: 'Thể loại không được để trống' }]}
                            >
                                <Select

                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item<FieldType>
                                label="Số lượng"
                                name="quantity"
                                labelCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Số lượng không được để trống' }]}
                            >
                                <InputNumber
                                    style={{ width: 200 }}
                                    min={0}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={12}>

                            <Form.Item<FieldType>
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                labelCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Vui lòng thêm ảnh thumbnail' }]}
                                valuePropName='fileList'
                                getValueFromEvent={(norm) => {
                                    // Chuẩn hóa giá trị từ sự kiện
                                    return Array.isArray(norm) ? norm : norm && norm.fileList;
                                }}
                            >
                                <Upload
                                    beforeUpload={beforeUpload}
                                    listType="picture-card"
                                    fileList={thumbnailImg}
                                    onPreview={handlePreview}
                                    maxCount={1}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    customRequest={(options) => handleUploadFile(options, "thumbnail")}
                                >
                                    {thumbnailImg.length >= 8 ? null : uploadButton}
                                </Upload>

                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}

                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Ảnh Slider"
                                name="slider"
                                labelCol={{ span: 24 }}
                                valuePropName='fileList'
                                getValueFromEvent={(norm) => {
                                    // Chuẩn hóa giá trị từ sự kiện
                                    return Array.isArray(norm) ? norm : norm && norm.fileList;
                                }}
                                rules={[{ required: true, message: 'Vui lòng thêm ảnh slider' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileListSlider}
                                    onPreview={handlePreview}
                                    beforeUpload={beforeUpload}
                                    multiple
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    customRequest={(options) => handleUploadFile(options, "slider")}
                                >
                                    {fileListSlider.length >= 8 ? null : uploadButton}
                                </Upload>

                            </Form.Item>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{ display: 'none' }}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default FormAddBook;