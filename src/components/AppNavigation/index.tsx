import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { PAGE } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";

export const AppNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Paper sx={{position: "fixed", bottom: 0, left: 0, right: 0, zIndex: "10", padding: "0.2rem"}} elevation={3}>

            <BottomNavigation
                showLabels
                sx={{ width: "100%" }}
                value={location.pathname}
            >
                <BottomNavigationAction label="Home" value={PAGE.HOME()} onClick={() => navigate(PAGE.HOME())} icon={< HomeIcon fontSize="large" />} />
                <BottomNavigationAction label="Criar Partida" value={PAGE.CREATE_MATCH()} onClick={() => navigate(PAGE.CREATE_MATCH())} icon={<AddCircleIcon fontSize="large" />} />
            </BottomNavigation>
        </Paper>

    )
}