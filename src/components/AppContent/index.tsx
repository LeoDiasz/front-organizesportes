import { Box } from "@mui/material"
import type { ReactNode } from "react"

interface IAppContentProps {
    children: ReactNode;
}

export const AppContent = ({children}: IAppContentProps) => {


    return (
         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "10rem 0"}}>
            {children}        
         </Box>
    )
}