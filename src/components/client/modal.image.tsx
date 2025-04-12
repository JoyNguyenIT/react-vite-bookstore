import React, { useRef, useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import ImageGallery from "react-image-gallery";

interface IProps {
    isModalOpen: boolean,
    setIsModalOpen: (v: boolean) => void
    images: {
        original: string,
        thumbnail: string,
        originalClass: string,
        thumbnailClass: string
    }[],
    currentIndex: number,
    title: string | undefined

}

const ModalImage = (props: IProps) => {

    const { isModalOpen, setIsModalOpen, images, currentIndex, title } = props
    const refImages = useRef<ImageGallery>(null)
    const [activeIndex, setActiveIndex] = useState(0);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal
                title={title}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Row gutter={[20, 20]}>
                    <Col span={24} style={{ marginTop: '25px' }}>
                        <ImageGallery
                            items={images}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            autoPlay={false}
                            showBullets={false}
                            startIndex={currentIndex}
                            ref={refImages}
                            onSlide={(i) => setActiveIndex(i)}
                            slideDuration={0}
                            showNav={false}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ModalImage;