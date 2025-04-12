import { useCurrentApp } from "components/context/app.context"
import { FaReact } from "react-icons/fa"
import 'components/layout/app.header.scss'
import { VscSearchFuzzy } from "react-icons/vsc"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { Avatar, Badge, Dropdown, MenuProps, notification, Space, Button, Drawer, Divider, Popover, Empty, Modal } from "antd"
import { Link, useNavigate } from "react-router-dom"
import { logoutAPI } from "@/services/api"
import { useEffect, useState } from "react"
import ManageAccount from "@/pages/client/modal.manage.account"

const AppHeader = (props: any) => {
    const { user, setIsAuthenticated, isAuthenticated, setUser, urlAvatar, cart, setCart } = useCurrentApp()
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState(false)
    const [openManageUser, setOpenManageUser] = useState<boolean>(false)
    const items: MenuProps['items'] = [
        {
            label: (
                <label
                    style={
                        { cursor: "pointer" }}
                    onClick={() => setOpenManageUser(true)}
                >Quản lý tài khoản
                </label>
            ),
            key: 'account',

        },
        {
            key: 'admin',
            label: (
                <Link to={'/history'}>Lịch sử mua hàng</Link>
            ),
        },
        {
            key: 'logout',
            label: (
                <label
                    style={
                        { cursor: "pointer" }
                    }
                    onClick={() => handleLogout()}
                >
                    Đăng xuất
                </label>
            ),
        },
    ];

    useEffect(() => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as Product[];
            setCart(carts);
        }

    }, [])

    const cartContent = (
        <div className="popover-cart">
            <div className="popover-body">
                {cart?.map((book, index) => {
                    return (
                        <div className="book-cart" key={`{book-${index}}`}>
                            <img
                                className="image-carts"
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.details?.thumbnail}`}
                            />
                            <div className="book-mainText">{book.details.mainText}</div>
                            <div className="book-price">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.details.price ?? 0)}
                            </div>
                        </div>
                    )
                })}
            </div>
            {cart && cart?.length > 0 ?
                <div className="popover-footer">
                    <button className="btn-cart" onClick={() => navigate("/order")}>Xem giỏ hàng</button>
                </div>
                : <Empty
                    description="Không có sản phẩm trong giỏ hàng"
                />
            }

        </div>
    )
    if (user?.role === 'ADMIN') {
        items.unshift(
            {
                key: 'admin',
                label: (
                    <Link to={'/admin'}> Trang Quản trị</Link>
                )
            }
        )
    }


    const handleLogout = async () => {
        const res = await logoutAPI()
        if (res.data) {
            setIsAuthenticated(false)
            setUser(null)
            setCart([]);
            localStorage.removeItem('carts')
            localStorage.removeItem('accessToken')
        }

        notification.success({
            message: 'Thông báo',
            description: res.message,
            placement: 'topRight',
        });
    }

    return (
        <>
            <div className="header-container">

                <div className="title-icon-name" onClick={() => navigate('/')}>
                    <span>
                        <FaReact className="react-icon" />
                    </span>
                    <span className="title-name">Joy Nguyễn IT</span>
                </div>
                <div className="toggle-menu" onClick={() => setOpenDrawer(true)}>
                    &#x2630;
                </div>
                <div className="search-input">
                    <span >
                        <VscSearchFuzzy className="search-icon" />
                    </span>
                    <input
                        className="input-item"
                        type="text"
                        placeholder="Bạn tìm gì hôm nay"
                        onChange={(event) => props.setSearchBook(event.target.value)}
                    />
                    {/* {JSON.stringify(user)} */}
                </div>
                <div className="shopping-cart"
                    style={{ cursor: "pointer" }}
                >
                    <Popover title="Sản phẩm mới thêm"
                        className="popover-cart"
                        content={cartContent}
                    >
                        <span>
                            <Badge
                                size="small"
                                count={cart?.length ?? 0}
                                showZero >
                                <ShoppingCartOutlined className="cart-icon" />
                            </Badge>
                        </span>
                    </Popover>
                </div>
                {isAuthenticated === false ?
                    <Link to={'login'}>
                        <Button className="login-button">Đăng nhập</Button>
                    </Link>
                    :
                    <div className="avatar-user">
                        <Dropdown menu={{ items }} placement="bottom" trigger={["click"]}>
                            <Space>
                                <Avatar src={urlAvatar} />{user?.fullName}
                            </Space>
                        </Dropdown>
                    </div>
                }
                <Drawer
                    title="Menu chức năng"
                    placement="left"
                    onClose={() => setOpenDrawer(false)}
                    open={openDrawer}
                    width='250px'
                >
                    <p>Quản lý tài khoản</p>
                    <Divider />
                    {isAuthenticated ?
                        <div>
                            <p onClick={handleLogout}>Đăng xuất</p>
                            <Divider />
                        </div>
                        :
                        <div>
                            <p onClick={() => navigate('/login')}>Đăng nhập</p>
                            <Divider />
                            <p onClick={() => navigate('/register')}>Đăng ký</p>
                            <Divider />
                        </div>
                    }

                </Drawer>

            </div>
            <ManageAccount
                openManageUser={openManageUser}
                setOpenManageUser={setOpenManageUser}
            />
        </>
    )
}

export default AppHeader