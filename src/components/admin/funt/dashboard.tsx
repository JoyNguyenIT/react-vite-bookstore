import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd"
import { StatisticProps } from "antd/lib";
import { useEffect, useState } from "react";
import CountUp from "react-countup";



const DashBoardAdmin = () => {
    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );
    const [countOrder, setCountOrder] = useState<number>(0)
    const [countUser, setCountUser] = useState<number>(0)
    useEffect(() => {
        const fetchDashboard = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) {
                setCountOrder(res.data.countOrder)
                setCountUser(res.data.countUser)
            }
        }
        fetchDashboard();
    }, [])
    return (
        <>
            <Row
                gutter={16}
                style={{ margin: "10px" }}
            >
                <Col span={8}>
                    <Card >
                        <Statistic
                            title="Tổng Users"
                            value={countUser}
                            formatter={formatter}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card >
                        <Statistic
                            title="Tổng Đơn hàng"
                            value={countOrder}
                            precision={2}
                            formatter={formatter}

                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card >
                        <Statistic
                            title="Tổng sách"
                            value={11}
                            formatter={formatter}
                            precision={2}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default DashBoardAdmin