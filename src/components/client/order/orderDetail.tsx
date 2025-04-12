import { useCurrentApp } from "@/components/context/app.context"
import "@/styles/order.scss"
import { DeleteOutlined } from "@ant-design/icons"
import { Button, Col, Divider, InputNumber, Row } from "antd"
import { useEffect, useState } from "react"


interface IProps {
    setCurrent: (value: number) => void
}


const OrderDetail = (props: IProps) => {
    const { cart, setCart, } = useCurrentApp()
    const [sumPrice, setSumPrice] = useState<number>(0);
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

    const changeNextStep = () => {
        if (cart && cart.length > 0) {
            setCurrent(1);
        }
    }

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

                </Col>
                <Col md={6} xs={24}>
                    <div className="sumPrice-cart">
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
                        <Button danger variant="solid" type="primary"
                            onClick={changeNextStep}
                        >Mua Hàng({cart?.length})</Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default OrderDetail