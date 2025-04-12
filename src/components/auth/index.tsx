import { Button, Result } from "antd"
import { useCurrentApp } from "../context/app.context"
import { Link, useLocation } from "react-router-dom"

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp()
    let location = useLocation();
    if (isAuthenticated === false) {
        return (
            <>
                <Result
                    status="404"
                    title="Bạn chưa đăng nhập"
                    subTitle="Vui lòng đăng nhập để sử dụng tính năng này."
                    extra={
                        <Link to={'/login'}>
                            <Button type="primary">Đăng nhập</Button>
                        </Link>
                    }
                />
            </>
        )
    }
    else if (isAuthenticated && location.pathname === '/admin' && user?.role === 'USER') {
        return (
            <>
                <Result
                    status="403"
                    title="Quyền truy cập bị từ chối"
                    subTitle="Tài khoản của bạn không có quyền truy cập trang này"
                    extra={<Button type="primary">
                        <Link to={'/'}>
                            Back Home
                        </Link>
                    </Button>}
                />
            </>
        )
    }
    else {
        return (
            <>
                {props.children}
            </>
        )
    }

}

export default ProtectedRoute