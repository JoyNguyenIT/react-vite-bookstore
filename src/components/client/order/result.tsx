import { Button, Result } from "antd"
import { Link } from "react-router-dom";

const ResultOrder = () => {
    return (
        <>
            <Result
                status="success"
                title="Đặt hàng thành công"
                subTitle="Hệ thống đã ghi lại thông tin đơn hàng của bạn"
                extra={[
                    <Button type="primary" key="console">
                        <Link to={"/"}>
                            Trang chủ
                        </Link>
                    </Button>,
                    <Button key="buy">
                        <Link to={"/history"}>
                            Lịch sử mua hàng
                        </Link>

                    </Button>,
                ]}
            />
        </>
    )
}

export default ResultOrder;