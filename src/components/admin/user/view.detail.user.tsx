import React from 'react';
import { Avatar, Badge, Descriptions, Drawer } from 'antd';
import type { DescriptionsProps } from 'antd';
import dayjs from 'dayjs';

interface IProps {
    detailUser: IUserTable | undefined
    openDrawer: boolean
    setOpenDrawer: (v: boolean) => void
    setDetailUser: (v: IUserTable | undefined) => void
}


const ViewUserInfor: React.FC<IProps> = (props) => {

    const { detailUser, setOpenDrawer, openDrawer, setDetailUser } = props
    const onClose = () => {
        setOpenDrawer(false)
        setDetailUser(undefined)
    }

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${detailUser?.avatar}`
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Id',
            span: { xs: 1, sm: 2, md: 1 },
            children: detailUser?._id,
        },
        {
            key: '2',
            label: 'Tên hiển thị',
            children: detailUser?.fullName,
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '3',
            label: 'Email',
            children: detailUser?.email,
            span: { xs: 1, sm: 2, md: 1 },
        },
        {
            key: '4',
            label: 'Số điện thoại',
            children: detailUser?.phone,
            span: { xs: 1, sm: 2, md: 2 },
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status="processing" text={detailUser?.role} />,

        },
        {
            key: '6',
            label: 'Avatar',
            children: <Avatar src={avatarURL} />,
            span: { xs: 1, sm: 2, md: 3 },
        },
        {
            key: '7',
            label: 'Created At',
            children: detailUser?.createdAt ? dayjs(detailUser.createdAt).format('DD-MM-YYYY') : 'N/A',
            span: { xs: 1, sm: 2, md: 1 },
        },
        {
            key: '8',
            label: 'Updated At',
            children: detailUser?.updatedAt ? dayjs(detailUser.updatedAt).format('DD-MM-YYYY') : 'N/A',
            span: { xs: 1, sm: 2, md: 2 },
        },




    ];

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                placement={'right'}
                width={'50vw'}
                onClose={onClose}
                open={openDrawer}

            >
                <Descriptions title="Thông tin người dùng" bordered items={items} />
            </Drawer>
        </>
    )
}

export default ViewUserInfor;