export { };


declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message?: string;
        statusCode?: number | string;
        data?: T;
    }
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]

    }
    interface IRegister {
        _id: string,
        email: string,
        fullName: string
    }
    interface ILogin {
        access_token: string,
        user: IUser
    }

    interface IUser {
        email: string,
        phone: string,
        fullName: string,
        role: string,
        avatar: string,
        id: string
    }

    interface IFetchAccount {
        user: IUser
    }
    interface ILogOut {
        data: string
    }

    interface IUserTable {
        _id: string,
        fullName: string,
        email: string,
        phone: string,
        role: string,
        avatar: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    }

    interface IImportUser {
        countSuccess: number,
        countError: number,
        detail: any
    }

    interface IDataImport {
        fullName: string;
        email: string;
        password: string;
        phone: string;

    }

    interface IBookTable {
        _id: string,
        thumbnail: string,
        slider: string[],
        mainText: string,
        author: string,
        price: number,
        sold: number,
        quantity: number,
        category: string,
        createdAt: Date,
        updatedAt: Date,
    }

    interface Product {
        _id: string,
        quantity: number,
        details: IBookTable
    }

    interface IPayment {
        name: string,
        address: string,
        phone: string,
        totalPrice: number,
        detail: Product[]
    }

    interface IHistory {
        createdAt: string,
        name: string,
        address: string,
        phone: string,
        totalPrice: number,
        detail: IDetailBook[],
        email: string,
        updatedAt: string,
        userId: string
        _id: string
    }

    interface IDashBoard {
        countOrder: number,
        countUser: number
    }

    interface IDetailBook {
        bookName: string,
        quantity: number,
        _id: string
    }
}