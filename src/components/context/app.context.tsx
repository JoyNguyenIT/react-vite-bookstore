import { fetchAccountAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean,
    isLoading: boolean
    user: IUser | null,
    cart: Product[] | null,
    urlAvatar: string,
    setIsAuthenticated: (v: boolean) => void,
    setUser: (v: IUser | null) => void
    setIsLoading: (v: boolean) => void,
    setCart: (v: Product[] | null) => void
}

const CurrentAppContext = createContext<IAppContext | null>(null);

interface TProp {
    children: React.ReactNode
}



export const AppProvider = (props: TProp) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<IUser | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [cart, setCart] = useState<Product[] | null>([])
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            const carts = localStorage.getItem("carts")
            const delay = (ms: number): Promise<void> => {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            if (res.data) {
                await delay(1000)
                setIsAuthenticated(true)
                setUser(res.data.user)
                if (carts) {
                    setCart(JSON.parse(carts))
                }
            }
            setIsLoading(false);
        }
        fetchAccount()
    }, [])

    return (
        <>
            {isLoading === false ?
                <CurrentAppContext.Provider value={{
                    isAuthenticated, user, setIsAuthenticated, setUser, isLoading, setIsLoading,
                    urlAvatar, cart, setCart
                }} >
                    {props.children}
                </CurrentAppContext.Provider>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%"
                }
                }>
                    <PacmanLoader
                        color={"#99D9F2"}
                        loading={isLoading}
                        cssOverride={{}}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            }
        </>
    );

};

export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentAppContext;
};