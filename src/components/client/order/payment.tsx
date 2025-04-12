import { useCurrentApp } from "@/components/context/app.context"
import { createOrderAPI } from "@/services/api"
import "@/styles/order.scss"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Form, Input, InputNumber, Radio, Row, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import { FormProps } from "antd/lib"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type FieldType = {
    fullName: string;
    phone: string;
    method: string;
    address: string
};

interface Iprops {
    setCurrent: (value: number) => void
}

const Payment = (props: Iprops) => {
    const { cart, setCart, } = useCurrentApp()
    const [sumPrice, setSumPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setCurrent } = props

    useEffect(() => {
        if (cart && cart.length > 0) {
            let sum = 0;
            cart.map((book) => {
                sum = sum + book.details.price * book.quantity;
            })
            setSumPrice(sum)
        }
    }, [cart])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values) {
            setIsLoading(true)
            const { fullName, address, phone } = values
            const details = cart?.map((book) => {
                return ({
                    bookName: book.details.mainText,
                    quantity: book.quantity,
                    _id: book._id
                })
            }) as IDetailBook[];
            if (details && details.length > 0) {
                const res = await createOrderAPI(fullName, address, phone, sumPrice, details);
                if (res && res.data) {
                    setCart(null);
                    localStorage.removeItem("carts");
                    setIsLoading(false)
                    setCurrent(2)
                }
            }

        }
    };


    const onChangeInput = (value: number, book: IBookTable) => {
        if (!value || value < 1) return;
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && book) {
            const carts = JSON.parse(cartStorage) as Product[];
            let ExistIndex = carts.findIndex((item) => item._id === book?._id)
            if (ExistIndex > -1) {
                carts[ExistIndex].quantity = value;
            }
            localStorage.setItem("carts", JSON.stringify(carts));
            setCart(carts);
        }

    };

    const handleDeleteBook = (book: IBookTable) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && book) {
            const cart = JSON.parse(cartStorage) as Product[];
            let newCart = cart.filter((item) => item._id !== book._id);
            localStorage.setItem("carts", JSON.stringify(newCart))
            setCart(newCart)
        }
    }
    return (
        <div className="order-container" >
            <Row gutter={[20, 20]} style={{ backgroundColor: "#d7d7d7", }}>
                <Col md={18} xs={24}>
                    {cart?.map((book, index) => {
                        return (
                            <div className="book-order" key={`book-order-${index}`}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.details?.thumbnail}`}
                                    style={{ width: 70, height: 70 }}
                                />
                                <div className="book-infor">
                                    <div>
                                        {book.details.mainText}
                                    </div>
                                    <div className="book-price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.details.price ?? 0)}
                                    </div>
                                </div>
                                <div className="input-quantity">
                                    <InputNumber min={1} value={book.quantity} onChange={(value) => onChangeInput(value as number, book.details)} />
                                </div>
                                <div>
                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.details.price * book.quantity)}
                                </div>
                                <div className="delete-book">
                                    <DeleteOutlined
                                        style={{ color: "red", marginRight: 10, cursor: "pointer" }}
                                        onClick={() => handleDeleteBook(book.details)}
                                    />
                                </div>

                            </div>
                        )
                    })}
                    <div>
                        <Link to={"/"}>
                            Quay trở lại
                        </Link>
                    </div>
                </Col>
                <Col md={6} xs={24}>
                    <div className="sumPrice-cart">
                        <Form
                            layout="vertical"
                            style={{ maxWidth: "600px" }}
                            onFinish={onFinish}
                        >
                            <Form.Item<FieldType>
                                label="Hình thức thanh toán"
                                name="method"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn phương thức thanh toán'
                                    }
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                                    <Radio value="BANKING"> Chuyển khoản ngân hàng</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Họ tên"
                                name="fullName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Họ tên không được để trống',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Số điện thoại không được để trống',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Địa chỉ nhận hàng"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Địa chỉ không được để trống',
                                    },
                                ]}
                            >
                                <TextArea allowClear />
                            </Form.Item>

                            <div className="sum-temp">
                                <span>Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                                </span>
                            </div>
                            <Divider />
                            <div className="final-sum">
                                <span>Tổng tiền</span>
                                <span className="sum-currency">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sumPrice)}
                                </span>
                            </div>
                            <Divider />
                            <Button
                                danger
                                variant="solid"
                                type="primary"
                                htmlType="submit"
                                style={{ width: "100%" }}
                                loading={isLoading}
                            >Đặt Hàng({cart?.length})</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div >
    )
}

export default Payment