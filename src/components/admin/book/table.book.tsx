import { DeleteBookAPI, getBooksTableAPI, } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, FormOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, } from 'antd';
import { useRef, useState } from 'react';


import { CSVLink } from 'react-csv';
import ViewBookInfor from './view.detail.book';
import FormAddBook from './add.book';
import FormUpdateBook from './update.book';


type TSearch = {
    mainText: string;
    author: string;

}

const TableBook = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openDrawerViewBook, setOpenDrawerViewBook] = useState<boolean>(false)
    const [dataViewBook, setDataViewBook] = useState<IBookTable | null>(null)
    const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null)
    const [currentBookTable, setCurrentBookTable] = useState<IBookTable[]>([]);
    const [openModalAddBook, setOpenModalAddBook] = useState<boolean>(false)
    const [openModalUpdateBook, setOpenModalUpdateBook] = useState<boolean>(false)
    const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false)

    const formatMoney = (value: number) => {
        return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }

    const confirmDeleteBook = async (id: string) => {
        setIsDeleteBook(true)
        const res = await DeleteBookAPI(id)
        if (res.data) {
            message.success("Xóa sách thành công!")
        }
        else {
            message.error(res?.message)
        }
        refreshTable()
        setIsDeleteBook(false)
    }

    const columns: ProColumns<IBookTable>[] = [

        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={() => {
                            setOpenDrawerViewBook(true)
                            setDataViewBook(entity)
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên sách',
            sorter: true,
            dataIndex: 'mainText',

        },
        {
            title: 'Thể loại',
            sorter: true,
            dataIndex: 'category',
            hideInSearch: true
        },
        {
            title: 'Tác giả',
            sorter: true,
            dataIndex: 'author'
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            render: (_, entity) => {
                // Lấy giá trị trực tiếp từ entity và sử dụng hàm format
                return entity.price ? formatMoney(entity.price) : 'N/A';
            },
            sorter: true,
            hideInSearch: true
        },

        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {

                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"#fa5f38"}
                            style={{ cursor: "pointer", marginRight: '15px' }}
                            onClick={() => {
                                setDataUpdateBook(entity)
                                setOpenModalUpdateBook(true)
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa sách"
                            description="Bạn có chắc chắn muốn xóa quyển sách này?"
                            okText="Xác nhận"
                            onConfirm={() => confirmDeleteBook(entity._id)}
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteBook }}
                        >
                            <DeleteTwoTone
                                twoToneColor={"#fa3838"}
                                style={{ cursor: "pointer" }}
                            />
                        </Popconfirm>

                    </>
                )
            }
        }

    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
                        }
                    }

                    //default

                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === "ascend" ? "updatedAt" : "-updatedAt"}`
                    } else query += `&sort=-updatedAt`;

                    if (sort && sort.category) {
                        query += `&sort=${sort.category === "ascend" ? "category" : "-category"}`
                    }

                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                    }

                    if (sort && sort.price) {
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                    }
                    if (sort && sort.author) {
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                    }

                    const res = await getBooksTableAPI(query);

                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentBookTable(res.data.result)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

                headerTitle="Table Book"
                toolBarRender={() => [
                    <CSVLink data={currentBookTable}
                        filename='export-book.csv'>
                        <Button
                            icon={<FormOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalAddBook(true)}

                    >
                        Add New
                    </Button>,





                ]}
            />
            <ViewBookInfor
                openDrawerViewBook={openDrawerViewBook}
                setOpenDrawerViewBook={setOpenDrawerViewBook}
                dataViewBook={dataViewBook}
                setDataViewBook={setDataViewBook}
            />


            <FormAddBook
                openModalAddBook={openModalAddBook}
                setOpenModalAddBook={setOpenModalAddBook}
                refreshTable={refreshTable}
            />

            <FormUpdateBook
                openModalUpdateBook={openModalUpdateBook}
                setOpenModalUpdateBook={setOpenModalUpdateBook}
                refreshTable={refreshTable}
                dataUpdateBook={dataUpdateBook}
                setDataUpdateBook={setDataUpdateBook}
            />



        </>
    );
};

export default TableBook;