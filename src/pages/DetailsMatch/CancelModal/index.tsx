import { Box, Button, Modal, Stack, Typography } from "@mui/material"
import { useUserStore } from "../../../store/userStore";
import { MatchServices } from "../../../services/match.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PAGE } from "../../../constants";

interface ICreateModalProps {
    isOpen: boolean;
    handleClose: () => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid primary',
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
};

const CancelModal = ({ isOpen, handleClose }: ICreateModalProps) => {
    const { match, organization, setMatch, setIsLoading } = useUserStore();
    const matchServices = MatchServices.getInstance();
    const navigate = useNavigate();

    const onSubmit = async () => {
        if (match && organization) {
            setIsLoading(true);
            matchServices.cancelMatch({ id: match.id, idOrganization: organization.id }).then(response => {
                setMatch(response.data);
                toast.success("Partida cancelada com sucesso!");
                handleClose();
                navigate(PAGE.HOME());

            }).catch(err => {
                toast.error(err);
            }).finally(() => setIsLoading(false));
        }
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={style}>
                <Stack justifyContent="center" width="100%" gap="2rem" textAlign="center">
                    <Typography variant="body1">Você tem certeza que quer cancelar a partida?</Typography>
                    <Stack direction="row" gap="1rem" justifyContent="center" >
                        <Button variant="outlined" color="primary" size="large" onClick={handleClose}>Voltar</Button>
                        <Button variant="contained" color="error" size="large" onClick={onSubmit}>Cancelar</Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    )
}

export default CancelModal