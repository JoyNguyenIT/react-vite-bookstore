import ChangeInfor from "@/components/auth/change.infor";
import ChangePassword from "@/components/auth/change.password";
import { useCurrentApp } from "@/components/context/app.context";
import { Modal, Tabs, TabsProps } from "antd";

interface IProps {
    openManageUser: boolean
    setOpenManageUser: (v: boolean) => void
}

const ManageAccount = (props: IProps) => {

    const { openManageUser, setOpenManageUser } = props
    const { user, urlAvatar, setUser } = useCurrentApp()
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <ChangeInfor
                user={user}
                urlAvatar={urlAvatar}
                setOpenManageUser={setOpenManageUser}
                setUser={setUser}
            />,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <ChangePassword
                user={user}
                setOpenManageUser={setOpenManageUser}
            />,
        }
    ];
    return (

        <Modal
            title={"Quản lý tài khoản"}
            open={openManageUser}
            onCancel={() => setOpenManageUser(false)}
            width={1000}
            footer={null}

        >
            <Tabs
                defaultActiveKey={"1"}
                items={items}
            />
        </Modal>


    )
}

export default ManageAccount;