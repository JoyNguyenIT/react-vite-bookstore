import { useEffect, useState } from 'react';
import type { UploadFile, UploadProps } from 'antd';
import { Form, Input, Modal, Divider, Row, Col, InputNumber, Select, Upload, Image, message, notification } from 'antd';
import { getCategoryBook, putUpdateBookAPI, UploadBookImgAPI } from '@/services/api';
import { GetProp } from 'antd/lib';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FieldType {
    _id: string;
    author: string;
    mainText: string;
    category: string;
    price: number;
    quantity: number;
    slider: File[] | undefined;
    thumbnail: File[];
    sold: number
};

type UserUploadType = "thumbnail" | "slider"

interface IProps {
    openModalUpdateBook: boolean,
    setOpenModalUpdateBook: (v: boolean) => void
    refreshTable: () => void
    dataUpdateBook: IBookTable | null
    setDataUpdateBook: (v: IBookTable | null) => void
}

const FormUpdateBook = (props: IProps) => {
    const [form] = Form.useForm();
    const { setDataUpdateBook, openModalUpdateBook, setOpenModalUpdateBook, refreshTable, dataUpdateBook } = props
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isSubmit, setIsSubmit] = useState(false)
    const [previewImage, setPreviewImage] = useState('');
    const [thumbnailImg, setThumbnailImg] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
    const [listCategory, setListCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

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

    useEffect(() => {
        if (dataUpdateBook) {
            const arrThumbnail = [{
                uid: uuidv4(),
                name: dataUpdateBook.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook.thumbnail}`,
            }]

            const arrSlider = dataUpdateBook.slider.map((item) => {
                return {
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                }
            })
            form.setFieldsValue({
                _id: dataUpdateBook._id,
                mainText: dataUpdateBook.mainText,
                author: dataUpdateBook.author,
                category: dataUpdateBook.category,
                price: dataUpdateBook.price,
                quantity: dataUpdateBook.quantity,
                slider: arrSlider,
                thumbnail: arrThumbnail,
                sold: dataUpdateBook.sold
            })
            setFileListSlider(arrSlider as any)
            setThumbnailImg(arrThumbnail as any)
        }
    }, [dataUpdateBook])

    const onSubmit = async (values: IBookTable) => {
        setIsSubmit(true)
        values.sold = 0
        console.log(values)
        const { _id, mainText, author, price, sold, quantity, category } = values
        const thumbnail = thumbnailImg?.[0]?.name ?? ""
        const slider = fileListSlider?.map(item => item.name) ?? []
        const res = await putUpdateBookAPI(
            _id,
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
            message.success('Cập nhật book thành công');
            form.resetFields();
            setFileListSlider([]);
            setThumbnailImg([]);
            setOpenModalUpdateBook(false);
            setDataUpdateBook(null)
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
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
                open={openModalUpdateBook}
                title="Cập nhật sách"
                okText="Cập nhật"
                cancelText="Hủy"
                okButtonProps={{ loading: isSubmit }}
                confirmLoading={isSubmit}
                onCancel={() => {
                    form.resetFields()
                    setFileListSlider([])
                    setThumbnailImg([])
                    setDataUpdateBook(null)
                    setOpenModalUpdateBook(false)
                }}
                destroyOnClose={true}
            >
                <Divider></Divider>
                <Form
                    form={form}
                    name="form_in_modal"
                    onFinish={(values) => onSubmit(values)}>
                    <Row gutter={10}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="_id"
                            name="_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Tên sách"
                                name="mainText"
                                labelCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Tên sách không được để trống' }]}
                            >
                                <Input value={dataUpdateBook?.mainText} />
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

export default FormUpdateBook;