import type { ReactNode } from "react";
import { useUserStore } from "../../store/userStore";
import { Backdrop, CircularProgress } from "@mui/material";

interface IAppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: IAppLayoutProps) => {
    const {isLoading} = useUserStore();

    return (
        <>
            {children}
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}