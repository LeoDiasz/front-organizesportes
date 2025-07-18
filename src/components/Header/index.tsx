import { AppBar, Avatar, Box, Chip, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { AppContainer } from '../AppContainer';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../pages/Login';
import toast from 'react-hot-toast';
import { PAGE } from '../../constants';
import theme from '../../theme';

export default function Header() {
    const navigate = useNavigate();
    const { organization, logout } = useUserStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSignOut = async () => {
        setAnchorEl(null);
        try {
            logout();
            await firebaseSignOut(auth);
            localStorage.removeItem("token");
            navigate(PAGE.LOGIN());
            toast.success('Você foi desconectado(a).');
        } catch (error) {
            toast.error('Erro ao fazer logout. Tente novamente.');
        }
    };

    return (
        <AppBar color='default' sx={{ padding: "6px 0", justifyContent: "space-between"}}>
            <AppContainer>

                <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <Box>
                        <img
                            src="/logo.png"
                            alt="OrganizeEsportes Logo"
                            style={{ width: "130px ", cursor: 'pointer' }}
                            onClick={() => navigate(PAGE.HOME())}
                        />
                    </Box>
                    <Box>
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', gap: "0.5rem" }}>
                                <Typography display={isMobile ? "none" : "inherit"} sx={{ minWidth: 100, fontWeight: "bold" }}>{organization?.name}</Typography>
                                <Chip label={`Modalidade: ${organization?.modality}`} color='primary' sx={{ fontWeight: "bold", display: isMobile ? "none" : "inherit" }} />
                                <Tooltip title="Perfil">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem   >
                                    <Avatar /> {organization?.name}
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleSignOut}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Sair
                                </MenuItem>
                            </Menu>
                        </>
                    </Box>
                </Toolbar>
            </AppContainer>
        </AppBar>

    );
}
