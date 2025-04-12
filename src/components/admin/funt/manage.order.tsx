import { getBooksTableAPI, getOrderTableAPI, } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';


type TSearch = {
    fullname: string;
    address: string;

}

const ManageOrder = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });




    const formatMoney = (value: number) => {
        return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
    const columns: ProColumns<IHistory>[] = [

        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
        },
        {
            title: 'Full Name',
            sorter: false,
            dataIndex: 'name',

        },
        {
            title: 'Địa chỉ',
            sorter: false,
            dataIndex: 'address',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            render: (_, entity) => {
                // Lấy giá trị trực tiếp từ entity và sử dụng hàm format
                return entity.totalPrice ? formatMoney(entity.totalPrice) : 'N/A';
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInTable: false,
            hideInSearch: true
        },

    ];

    return (
        <>
            <ProTable<IHistory, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";

                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.fullname) {
                            query += `&fullname=/${params.fullname}/i`
                        }
                        if (params.address) {
                            query += `&author=/${params.address}/i`
                        }
                    }
                    //default
                    if (sort && sort.totalPrice) {
                        query += `&sort=${sort.totalPrice === "ascend" ? "price" : "-price"}`
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "price" : "-price"}`
                    }
                    const res = await getOrderTableAPI(query);

                    if (res.data) {
                        setMeta(res.data.meta);
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

                headerTitle="Table Orders"
            />
        </>
    );
};

export default ManageOrder;