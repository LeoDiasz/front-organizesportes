import { Container } from "@mui/material";
import styles from "./styles.module.scss";
import type { ReactNode } from "react";

interface IAppContainerProps {
    children: ReactNode;
}

export const AppContainer = ({children}:IAppContainerProps) => {

    return (
        <Container maxWidth="md" className={styles.container}>
            {children}
            
        </Container>
    )
}