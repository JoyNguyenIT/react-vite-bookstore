import { getHistoryAPI } from "@/services/api"
import { FORMATE_DATE_VN } from "@/services/helper";
import { Divider, Drawer, Table, TableColumnsType, Tag } from "antd";
import dayjs from "dayjs";
import { values } from "lodash";
import { useEffect, useState } from "react"

interface DataType {
    stt: number,
    time: string,
    sumPrice: string,
    state: "Thành công" | "Thất bại",
    detail: any
}

interface IBookInforHistory {
    bookName: string,
    quantity: number,
    _id: string
}

const History = () => {
    const [booksOrder, setBooksOrder] = useState<IHistory[]>([])
    const [currentBook, setCurrentBook] = useState<IBookInforHistory | null>()
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const columns: TableColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (values) => {
                return <span>{values}</span>
            }
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            render: (values) => {
                return (
                    <span>
                        {values}
                    </span>
                )
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'sumPrice',
            render: (values) => {
                return (
                    <span>

                        {values}

                    </span >
                )
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            render: (value: string[]) => {
                return (
                    <span>
                        <Tag color="green">
                            {value}
                        </Tag>
                    </span >
                )
            },

        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            render: (value: IBookInforHistory) => {
                return (
                    <a
                        onClick={() => handleOpenDrawer(value)}
                    >
                        Xem chi tiết
                    </a>
                )
            }
        },
    ];
    const fetchOrderHistory = async () => {
        const res = await getHistoryAPI()
        if (res && res.data) {
            setBooksOrder(res.data)
        }
    }
    useEffect(() => {
        fetchOrderHistory()
    }, [])

    const handleOpenDrawer = (book: IBookInforHistory) => {
        if (book) {
            setCurrentBook(book)
            setOpenDrawer(true)
        }
    }

    const handleClose = () => {

        setCurrentBook(null)
        setOpenDrawer(false)

    }

    const data: DataType[] = booksOrder.map((book, index) => {
        return ({
            stt: index + 1,
            time: dayjs(book.createdAt).locale('vn').format(FORMATE_DATE_VN),
            sumPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.totalPrice),
            state: "Thành công" as "Thành công" | "Thất bại",
            detail: book.detail[index]
        })
    })
    return (
        <div className="page-history">
            <div className="history-container"
                style={{ margin: '40px 40px' }}
            >
                Lịch sử mua hàng
                <Divider />
                <Table<DataType>
                    columns={columns}
                    dataSource={data}
                    bordered
                />
            </div>
            <Drawer
                title='Chi tiết đơn hàng'
                open={openDrawer}
                placement={"right"}
                onClose={() => handleClose()}
                size="default"
            >
                <ul>
                    <li>Tên sách: {currentBook?.bookName}</li>
                    <li>Số lượng: {currentBook?.quantity}</li>
                </ul>
                <Divider />
            </Drawer>
        </div>
    )
}

export default History