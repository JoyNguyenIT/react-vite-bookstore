import OrderDetail from '@/components/client/order/orderDetail';
import Payment from '@/components/client/order/payment';
import ResultOrder from '@/components/client/order/result';
import '@/styles/order.scss'
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Row, Steps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderPage = () => {
    const items = [
        {
            title: 'Đơn hàng'
        },
        {
            title: 'Đặt hàng'
        },
        {
            title: 'Thanh toán'
        }
    ]

    const [current, setCurrent] = useState<number>(0)

    return (
        <div style={{ backgroundColor: "#d7d7d7", padding: "20px 0px" }}>
            <div className="order-container" style={{ maxWidth: "1440px" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}> <HomeOutlined /></Link>,
                        },

                        {
                            title: 'Chi Tiết Giỏ Hàng',
                        },
                    ]}
                />
                <div className='order-steps'>
                    <Steps
                        current={current}
                        items={items}
                    />
                </div>

                {current === 0 &&
                    <OrderDetail setCurrent={setCurrent} />
                }
                {current === 1 &&
                    <Payment setCurrent={setCurrent} />
                }
                {current === 2 &&
                    <ResultOrder />
                }

            </div>
        </div>
    )
}

export default OrderPage;


