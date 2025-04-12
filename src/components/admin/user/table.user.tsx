import { DeleteUserAPI, getUsersTableAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, FormOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, } from 'antd';
import { useRef, useState } from 'react';
import ViewUserInfor from './view.detail.user';
import { Popconfirm } from 'antd';
import ImportUser from './modals/modal.import.user';
import { CSVLink } from 'react-csv';
import ModalAddNewUser from './modals/add.user';
import ModalUpdateUser from './modals/update.user';


type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [detailUser, setDetailUser] = useState<IUserTable | undefined>();
    const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false);

    const [openModalImport, setOpenModalImport] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [dataUserUpdate, setDataUserUpdate] = useState<IUserTable | null>(null);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false)

    const confirmDeleteUser = async (id: string) => {
        setIsDeleteUser(true)
        const res = await DeleteUserAPI(id)
        if (res.data) {
            message.success("Xóa người dùng thành công!")
        }
        else {
            message.error(res?.message)
        }
        refreshTable()
        setIsDeleteUser(false)
    }


    const columns: ProColumns<IUserTable>[] = [

        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {

                return (
                    <a
                        onClick={() => {
                            setDetailUser(entity);
                            setOpenDrawer(true);
                        }}
                        href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {

                return (
                    <>
                        <EditTwoTone
                            twoToneColor={"#fa5f38"}
                            style={{ cursor: "pointer", marginRight: '40px' }}
                            onClick={() => {
                                setDataUserUpdate(entity);
                                setOpenModalUpdate(true);
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa user"
                            description="Bạn có chắc chắn muốn xóa người dùng này?"
                            okText="Xác nhận"
                            onConfirm={() => confirmDeleteUser(entity._id)}
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteUser }}
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
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }

                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }

                    }

                    //default

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;


                    const res = await getUsersTableAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? [])

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

                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink data={currentDataTable}
                        filename='export-user.csv'>
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
                        onClick={() => setOpenModalAddUser(true)}

                    >
                        Add New
                    </Button>,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,



                ]}
            />
            <ViewUserInfor
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                detailUser={detailUser}
                setDetailUser={setDetailUser}
            />



            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />

            <ModalAddNewUser
                actionRef={actionRef}
                openModalAddUser={openModalAddUser}
                setOpenModalAddUser={setOpenModalAddUser}

            />

            <ModalUpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                actionRef={actionRef}
                setDataUserUpdate={setDataUserUpdate}
                dataUserUpdate={dataUserUpdate}
            />


        </>
    );
};

export default TableUser;