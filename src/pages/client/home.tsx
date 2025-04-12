import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons"
import 'styles/home.scss'
import { Button, Checkbox, Col, Divider, Form, InputNumber, Pagination, Rate, Row, Spin, Tabs } from 'antd';
import type { FormProps } from 'antd';
import { TabsProps } from "antd/lib";
import { useEffect, useState } from "react";
import { getBooksTableAPI, getCategoryBook } from "@/services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import MobileFilter from "@/components/client/mobile.filter";
import { isMobile } from 'react-device-detect';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};

const items: TabsProps['items'] = [
    {
        key: "sort=-sold",
        label: `Phổ biến`,
        children: <></>,
    },
    {
        key: 'sort=-updatedAt',
        label: `Hàng Mới`,
        children: <></>,
    },
    {
        key: 'sort=price',
        label: `Giá Thấp Đến Cao`,
        children: <></>,
    },
    {
        key: 'sort=-price',
        label: `Giá Cao Đến Thấp`,
        children: <></>,
    },
];



const HomePage = () => {
    const [form] = Form.useForm()
    const { searchBook } = useOutletContext() as any
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });
    const [listCategory, setListCategory] = useState<String[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(5)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [checkedCategory, setCheckedCategory] = useState<String>()
    const [rangePriceFilter, setRangePriceFilter] = useState<String>()
    const [activeKeyTab, setActiveKeyTab] = useState<String>()
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const naigate = useNavigate()
    const fetchBookPaginate = async () => {
        setIsLoading(true)
        let query = `current=${currentPage}&pageSize=${pageSize}`
        if (searchBook) {
            query += `&mainText=/${searchBook}/i`;
        }
        if (rangePriceFilter) {
            query += rangePriceFilter
        }
        if (checkedCategory) {
            query += checkedCategory
        }
        if (activeKeyTab) {
            query += `&${activeKeyTab}`
        }

        else {
            query += '&sort=-sold'
        }
        const res = await getBooksTableAPI(query)
        if (res && res.data) {
            setMeta(res.data.meta)
            setListBook(res.data.result)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        const fectchCategory = async () => {
            const res = await getCategoryBook()
            if (res && res.data) {
                setListCategory(res.data)
            }
        }
        fectchCategory()
    }, [])

    useEffect(() => {
        fetchBookPaginate()
    }, [pageSize, currentPage, checkedCategory, rangePriceFilter, activeKeyTab, searchBook])
    const handleChangePage = (page: number, size: number) => {
        if (page !== currentPage) setCurrentPage(page)
        if (size !== pageSize) setPageSize(size)
    }

    const handleChangeFilter = (values: string[]) => {
        if (values && values.length > 0) {
            const valuesChecked = values.join(',');
            setCheckedCategory(`&category=${valuesChecked}`)
        }
        else {
            setCheckedCategory('')
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        if (values && values.range.to >= 0 && values.range.from >= 0) {
            setRangePriceFilter(`&price>=${values?.range?.from}&price<=${values?.range?.to}`)
        }
        else {
            setRangePriceFilter('')
        }
    };

    const handleResetForm = () => {
        setCheckedCategory('')
        setRangePriceFilter('')
        form.resetFields();
    }

    const handleChangeTab = (activeKey: string) => {
        setActiveKeyTab(activeKey)
    }

    return (
        <>
            <div className="homepage-content" >
                <Row gutter={[20, 20]} style={{ backgroundColor: '#efefef' }}>
                    <Col md={4} sm={0} xs={0} style={{ padding: '20px' }}>
                        <div style={{ minWidth: 200, padding: '10px', borderRadius: '5px', backgroundColor: '#fff', marginLeft: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>
                                    <FilterTwoTone />
                                    <span style={{ fontWeight: '500' }}>Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined
                                    title="reset"
                                    onClick={() => handleResetForm()}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <Divider />
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
                                    <Row gutter={10} style={{ width: '100%' }}>
                                        <Col md={11} sm={0} xs={0}>
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
                                        <Col md={2} sm={0} xs={0}>
                                            <div>-</div>
                                        </Col>
                                        <Col md={11} sm={0} xs={0}>
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
                        </div>
                    </Col>
                    <Col md={20} xs={24}>
                        <div style={{ borderRadius: '5px', margin: '20px 20px 20px 0px', padding: '15px', backgroundColor: '#fff' }}>
                            <div style={isMobile ? { width: "100%" } : { minWidth: 1100 }}>
                                <Spin tip="Loading" size="large" spinning={isLoading}>
                                    <Tabs
                                        defaultActiveKey="sort=-sold"
                                        items={items}
                                        onChange={(activeKey) => handleChangeTab(activeKey)}
                                    />
                                    <Row>
                                        <Col md={0} xs={24}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                                <span onClick={() => setOpenFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: '500', marginLeft: 5 }}>Lọc</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='customize-row'>
                                        {listBook?.map((item, index) => {
                                            return (
                                                <div className="product-content"
                                                    key={`book-${index}`}
                                                    onClick={() => naigate(`/book/${item._id}`)}
                                                >
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`} className="thumbnail" />
                                                    <div className='text' title={item.mainText}>{item.mainText}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span>Đã bán {item?.sold ?? 0}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Row>

                                    <Divider />
                                    <div className="pagination">
                                        <Pagination
                                            current={meta.current}
                                            total={meta.total}
                                            pageSize={meta.pageSize}
                                            onChange={(page, pageSize) => handleChangePage(page, pageSize)}
                                        />
                                    </div>
                                </Spin>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div >
            <MobileFilter
                listCategory={listCategory}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                onFinish={onFinish}
                handleChangeFilter={handleChangeFilter}
            />
        </>
    )
}

export default HomePage