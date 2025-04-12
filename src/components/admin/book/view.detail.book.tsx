import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Descriptions, Divider, Drawer, Image, Upload } from 'antd';
import type { DescriptionsProps, GetProp, UploadProps } from 'antd';
import dayjs from 'dayjs';
import { UploadFile } from 'antd/lib';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    dataViewBook: IBookTable | null
    openDrawerViewBook: boolean
    setOpenDrawerViewBook: (v: boolean) => void
    setDataViewBook: (v: IBookTable | null) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ViewBookInfor: React.FC<IProps> = (props) => {

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imgList, setImgList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState('');
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const { openDrawerViewBook, setOpenDrawerViewBook, dataViewBook, setDataViewBook } = props

    useEffect(() => {
        console.log(dataViewBook)
        let listThumbnail: any = {}, listSlider: UploadFile[] = [];
        if (dataViewBook?.thumbnail) {
            listThumbnail = {
                uid: uuidv4(),
                name: dataViewBook?.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewBook.thumbnail}`
            }
        }

        if (dataViewBook?.slider && dataViewBook.slider.length > 0) {
            dataViewBook.slider.map((item) => {
                listSlider.push({
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                })
            },

            )
            setFileList([listThumbnail, ...listSlider])
        }

    }, [dataViewBook])
    const onClose = () => {
        setOpenDrawerViewBook(false)
        setDataViewBook(null)
    }
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Id',
            span: { xs: 1, sm: 2, md: 2 },
            children: dataViewBook?._id,
        },
        {
            key: '2',
            label: 'Tên sách',
            children: dataViewBook?.mainText,
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '3',
            label: 'Tác giả',
            children: dataViewBook?.author,
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '4',
            label: 'Giá tiền',
            children: dataViewBook?.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }),
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '5',
            label: 'Thể loại',
            children: <Badge status="processing" text={dataViewBook?.category} />,
            span: { xs: 24, sm: 24, md: 24 },
        },
        {
            key: '6',
            label: 'Created At',
            children: dataViewBook?.createdAt ? dayjs(dataViewBook.createdAt).format('DD-MM-YYYY') : 'N/A',
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '7',
            label: 'Updated At',
            children: dataViewBook?.updatedAt ? dayjs(dataViewBook.updatedAt).format('DD-MM-YYYY') : 'N/A',
            span: { xs: 1, sm: 2, md: 2 },
        },

    ];

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                placement={'right'}
                width={'60vw'}
                onClose={onClose}
                open={openDrawerViewBook}

            >
                <Descriptions title="Thông tin người dùng" bordered items={items} />
                <Divider orientation="left" > Ảnh Books </Divider>
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    showUploadList={{ showRemoveIcon: false }}
                >

                </Upload>
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
            </Drawer>
        </>
    )
}

export default ViewBookInfor;