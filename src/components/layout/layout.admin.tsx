import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    DollarOutlined,
    EditOutlined,
    HeartTwoTone,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    UserOutlined,

} from '@ant-design/icons';
import { Avatar, Button, Divider, Dropdown, Layout, Menu, notification, Space, theme, } from 'antd';
import type { MenuProps } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import './layout.admin.scss'
import { logoutAPI } from '@/services/api';


const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[],): MenuItem {
    return ({
        key,
        icon,
        children,
        label,
    }) as MenuItem;
}

const items: MenuItem[] = [
    getItem((
        <Link to={'dashboard'}>
            Dashboard
        </Link>
    ), '1'
        , <AppstoreOutlined
        />),
    getItem(
        (
            <Link to={'managebook'}>
                Manage Books
            </Link>
        ),
        '2',
        <EditOutlined />
    ),
    getItem('Manage Users', 'sub1', <UserOutlined />, [
        getItem(
            (
                <Link to={'manageuser'}>
                    CRUD
                </Link>
            ),
            '3',
            <TeamOutlined />
        )

    ]),
    getItem(
        (
            <Link to={'manageorder'}>
                Manage Orders
            </Link>
        ),
        '4',
        <DollarOutlined />
    ),

];





const LayoutAdmin: React.FC = () => {
    const { urlAvatar, user, setIsAuthenticated, setUser } = useCurrentApp()
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { borderRadiusLG },
    } = theme.useToken();
    useEffect(() => {
        if (user) navigate('dashboard')
    }, [])
    const handleLogout = async () => {
        const res = await logoutAPI()
        if (res.data) {
            setIsAuthenticated(false)
            setUser(null)
            localStorage.removeItem('accessToken')
        }

        notification.success({
            message: 'Thông báo',
            description: res.message,
            placement: 'topRight',
        });

    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center', color: '#ffffff' }}>
                    Admin
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#f4f4f4' }}>
                    <div className='header-admin'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <span className="avatar-user">
                            <Dropdown menu={{ items: itemsDropdown }} placement="bottom" trigger={["click"]}>
                                <Space style={{ cursor: "pointer" }}>
                                    <Avatar src={urlAvatar} />{user?.fullName}
                                </Space>
                            </Dropdown>
                        </span>
                    </div>

                </Header>



                <Content>
                    <Divider style={{ margin: '0px' }}></Divider>
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb> */}


                    <Outlet />

                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    JoyBook Store © {new Date().getFullYear()} Joy Nguyen IT - Made with <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;