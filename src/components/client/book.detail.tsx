import { App, Breadcrumb, Col, Rate, Row } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import 'src/styles/book.scss'
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { HomeOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { FaCartPlus } from "react-icons/fa";
import ModalImage from "./modal.image";
import { useCurrentApp } from "../context/app.context";
import { Link, useNavigate } from "react-router-dom";

interface IProps {
    currentBook: IBookTable | null
}

type USerAction = 'MINUS' | 'PLUS'


const BookDetail = (props: IProps) => {
    const { currentBook } = props
    const { setCart, user } = useCurrentApp()
    const { message } = App.useApp()
    const navigate = useNavigate()
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])
    const [currentQuatity, setCurrentQuatity] = useState<number>(1);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const refImages = useRef<ImageGallery>(null)


    const showModal = () => {
        setCurrentIndex(refImages?.current?.getCurrentIndex() ?? 0)
        setIsModalOpen(true);
    };


    const handleChangeQuatity = (type: USerAction) => {
        if (type == 'MINUS' && currentQuatity > 1) setCurrentQuatity(currentQuatity - 1);
        else if (type == 'PLUS') {
            if (currentQuatity === currentBook?.quantity) return;
            setCurrentQuatity(currentQuatity + 1)
        }
    }

    const handleChangeInputQuantity = (value: string) => {
        if (currentBook) {
            if (+value > 0 && +value <= +currentBook?.quantity) {
                setCurrentQuatity(+value)
            }
        }

    }

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error('Bạn cần đăng nhập để tiếp tục')
            return;
        }
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            const carts = JSON.parse(cartStorage) as Product[];
            let isExistIndex = carts.findIndex((i) => i._id == currentBook._id);
            if (isExistIndex <= -1) {
                carts.push({
                    _id: currentBook._id,
                    quantity: currentQuatity,
                    details: currentBook
                })
            }
            else {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + currentQuatity
            }
            localStorage.setItem("carts", JSON.stringify(carts))
            setCart(carts)
            message.success("Thêm vào giỏ hàng thành công!")
        } else {
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuatity,
                details: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))
            setCart(data)
        }

        if (isBuyNow) {
            navigate('/order');
        }
    }

    useEffect(() => {
        if (currentBook) {
            const images = [];
            if (currentBook.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image",
                    }
                )
            }

            if (currentBook.slider) {
                currentBook.slider.map((item) => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image",
                        }
                    )
                })
            }
            setImageGallery(images);
        }
    }, [currentBook])

    return (
        <>
            <div style={{
                backgroundColor: '#efefef',
                padding: '20px',
                minHeight: "calc(100vh - 150px)",
                marginTop: '10px'
            }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}> <HomeOutlined /></Link>,
                        },

                        {
                            title: 'Xem chi tiết sách',
                        },
                    ]}
                />
                <div className="book-detail-container">

                    <Row gutter={[20, 20]}
                    >
                        <Col md={10} sm={24}>
                            <ImageGallery
                                ref={refImages}
                                items={imageGallery}
                                showFullscreenButton={false}
                                showPlayButton={false}
                                autoPlay={false}
                                showBullets={false}
                                onClick={showModal}
                                showNav={false}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                            <div className="main-text" style={{ fontWeight: '300', fontSize: '25px' }}>{currentBook?.mainText}</div>
                            <div className="rate">
                                <Rate value={5} disabled style={{ fontSize: '10px' }} />
                                <span style={{ marginLeft: '1em' }}>Đã bán {currentBook?.sold}</span>
                            </div>
                            <div className="price">
                                <span className="currency">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook ? currentBook?.price : 0)}
                                </span>
                            </div>
                            <div className='delivery'>
                                <div>
                                    <span className='left'>Vận chuyển</span>
                                    <span className='right'>Miễn phí vận chuyển</span>
                                </div>
                            </div>
                            <div className='quantity'>
                                <div>
                                    <span className='left'>Số Lượng</span>
                                    <span className='right'>
                                        <button onClick={() => handleChangeQuatity('MINUS')}><MinusOutlined /></button>
                                        <input onChange={(event) => handleChangeInputQuantity(event.target.value)} value={currentQuatity} />
                                        <button onClick={() => handleChangeQuatity('PLUS')}><PlusOutlined /></button>
                                    </span>
                                </div>
                            </div>
                            <div className="cart">
                                <span className="left">
                                    <button onClick={() => handleAddToCart()}><FaCartPlus /> Thêm vào giỏ hàng</button>
                                </span>
                                <span className="right">
                                    <button onClick={() => handleAddToCart(true)}>Mua ngay</button>
                                </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalImage
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                images={imageGallery}
                currentIndex={currentIndex}
                title={currentBook?.mainText}
            />
        </>
    )
}

export default BookDetail