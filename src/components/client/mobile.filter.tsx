import { Button, Checkbox, Col, Divider, Drawer, Form, InputNumber, Rate, Row } from "antd"

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};

interface IProps {
    listCategory: String[];
    onFinish: (value: FieldType) => void
    handleChangeFilter: (value: string[]) => void
    openFilter: boolean
    setOpenFilter: (value: boolean) => void
}

const MobileFilter = (props: IProps) => {
    const { listCategory, onFinish, handleChangeFilter, openFilter, setOpenFilter } = props
    const [form] = Form.useForm()
    const onClose = () => {
        setOpenFilter(false)
    }
    return (
        <>
            <Drawer open={openFilter} onClose={onClose}>
                <Form
                    form={form}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="category"
                        label="Danh mục sản phẩm"
                        labelCol={{ span: 24 }}
                    >
                        <div>
                            <Checkbox.Group
                                style={{ width: '100%' }}
                                onChange={(checkedValue) => handleChangeFilter(checkedValue)}
                            >
                                <Row gutter={[15, 15]}>
                                    {listCategory?.map((item) => {
                                        return (
                                            <Col span={24} key={`${item}-category`}>
                                                <Checkbox value={`${item}`}>{item}</Checkbox>
                                            </Col>
                                        )
                                    })}

                                </Row>
                            </Checkbox.Group>
                        </div>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        name="price"
                        label="Khoảng giá"
                        labelCol={{ span: 24 }}
                    >
                        <Row gutter={[10, 10]} style={{ width: '100%' }}>
                            <Col sm={14} xs={14}>
                                <Form.Item
                                    name={["range", 'from']}
                                >
                                    <InputNumber
                                        name="from"
                                        min={0}
                                        placeholder="đ Từ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{ width: '100%' }}

                                    />
                                </Form.Item>
                            </Col>
                            <Col sm={14} xs={14}>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ Đến"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ marginTop: '3em' }}>
                            <Button onClick={() => form.submit()}
                                style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                        </div>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        name="rate"
                        label="Đánh giá"
                        labelCol={{ span: 24 }}
                    >

                        <div>
                            <Rate value={5} disabled style={{ fontSize: '15px' }} />
                        </div>
                        <div>
                            <Rate value={4} disabled style={{ fontSize: '15px' }} />
                            <span className="ant-rate-span">trở lên</span>
                        </div>
                        <div>
                            <Rate value={3} disabled style={{ fontSize: '15px' }} />
                            <span className="ant-rate-span">trở lên</span>
                        </div>
                        <div>
                            <Rate value={2} disabled style={{ fontSize: '15px' }} />
                            <span className="ant-rate-span">trở lên</span>
                        </div>
                        <div>
                            <Rate value={1} disabled style={{ fontSize: '15px' }} />
                            <span className="ant-rate-span">trở lên</span>
                        </div>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
}

export default MobileFilter