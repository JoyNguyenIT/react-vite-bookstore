import { Col, Row, Skeleton } from "antd"
import 'src/styles/book.scss'

const LoadingBookSkeleton = () => {
    return (
        <>
            <div style={{
                backgroundColor: '#efefef',
                padding: '20px',
                minHeight: "calc(100vh - 150px)",
                marginTop: '10px'
            }}>
                <div className="book-detail-container">
                    <Row gutter={[20, 20]}
                    >
                        <Col md={10} sm={24}>
                            <Skeleton.Input
                                active
                                block
                                style={{
                                    width: '100%',
                                    height: 350
                                }}
                            />
                            <div style={{ marginTop: 20, justifyContent: "center", gap: 15, display: "flex", overflow: 'hidden' }}>
                                <Skeleton.Image
                                    active
                                />
                                <Skeleton.Image
                                    active
                                />
                                <Skeleton.Image
                                    active
                                />
                            </div>

                        </Col>
                        <Col md={14} sm={24}>
                            <div>
                                <Skeleton active paragraph={{ rows: 3 }} />
                            </div>
                            <div style={{ marginTop: 50 }}>
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                            <div style={{ marginTop: 50 }}>
                                <Skeleton.Button active style={{ width: 100, marginRight: 20 }} />
                                <Skeleton.Button active style={{ width: 100 }} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default LoadingBookSkeleton