import BookDetail from "@/components/client/book.detail";
import LoadingBookSkeleton from "@/components/client/book.loading";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const BookPage = () => {
    const { id } = useParams();
    const { notification } = App.useApp();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        if (id) {
            setIsLoading(true)
            const fecthBookById = async () => {
                const res = await getBookByIdAPI(id);
                if (res && res.data) {
                    setCurrentBook(res.data)
                }
                else {
                    notification.error({
                        message: 'Đã có lỗi xảy ra',
                        description: res.message
                    })
                }
            }
            fecthBookById();
            setIsLoading(false)
        }
    }, [])

    return (
        <>
            {isLoading
                ? <LoadingBookSkeleton />
                :
                <BookDetail
                    currentBook={currentBook}
                />
            }
        </>
    )
}

export default BookPage