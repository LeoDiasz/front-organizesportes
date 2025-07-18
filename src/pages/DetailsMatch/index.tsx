import toast from "react-hot-toast"
import { Alert, Box, Button, Checkbox, useMediaQuery, Chip, Divider, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Card, CardContent} from "@mui/material"
import { CreateGuestModal } from "./CreateGuestModal"
import CancelModal from "./CancelModal"
import Header from "../../components/Header"
import { AppContainer } from "../../components/AppContainer"
import { AppContent } from "../../components/AppContent"
import { AppNavigation } from "../../components/AppNavigation"
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { type Guest, useUserStore } from "../../store/userStore"
import { MatchServices } from "../../services/match.service"
import { GuestServices } from "../../services/guest.service"
import { PAGE } from "../../constants"
import theme from "../../theme"
import { switchStatus } from "../../utils/match.utils"
import type { IGetListMatchsResponse } from "../../model/match.model"

const generateUrlLink = (inviteCode: string) => {
    const url = `${window.location.origin}/partidas/convite/${inviteCode}`
    return url
}

export const DetailsMatch = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { match, organization, setMatch, setIsLoading } = useUserStore();
    const [listGuestPresent, setListGuestPresent] = useState<Guest[]>();
    const [listGuestNotPresent, setListGuestNotPresent] = useState<Guest[]>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenCancelModal, setIsOpenCancelModal] = useState<boolean>(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const matchServices = MatchServices.getInstance();
    const guestServices = GuestServices.getInstance();

    const setListGuests = (match: IGetListMatchsResponse) => {

        if (match && match.guests && match.guests.length > 0) {
            const filterGuestPresent = match.guests.filter(guest => guest.isConfirm);
            const filterGuestNotPresent = match.guests.filter(guest => guest.isConfirm === false);
            setListGuestPresent(filterGuestPresent);
            setListGuestNotPresent(filterGuestNotPresent);
        }
    }

    const copyInviteLink = () => {
        if (match?.inviteCode) {
            navigator.clipboard.writeText(generateUrlLink(match.inviteCode))
                .then(() => toast.success('Link de convite copiado para a área de transferência!'))
                .catch(() => toast.error('Erro ao copiar o link.'));

        }
    };

    const handleGenerateInvite = () => {
        if (match && organization) {
            matchServices.generateCodeMatch({ idMatch: match.id, idOrganization: organization.id }).then(response => {
                setMatch({ ...match, inviteCode: response.data.inviteCode });
                navigator.clipboard.writeText(generateUrlLink(response.data.inviteCode))
                    .then(() => toast.success('Link do convite gerado e copiado para a área de transferência! '))
                    .catch(() => toast.error('Erro ao copiar o link.'));
            }).catch(() => {
                toast.error("Erro ao gerar o link de convite.")
            })
        }
    };

    const handleCloseModal = () => {
        setIsOpenModal(false);
    }

    const handleOpenModal = () => {
        setIsOpenModal(true);
    }

    const handleOpenCancelModal = () => {
        setIsOpenCancelModal(true);
    }

    const handleCloseCancelModal = () => {
        setIsOpenCancelModal(false);
    }

    const handleFinishMatch = async () => {
        if (match && organization) {
            setIsLoading(true);
            matchServices.finishMatch({ id: match.id, idOrganization: organization.id }).then(response => {
                setMatch(response.data);
                toast.success("Partida finalizada com sucesso!");
                navigate(PAGE.HOME());

            }).catch(err => {
                toast.error(err);
            }).finally(() => setIsLoading(false));
        }
    }

    const handleCheckboxChange = (idGuest: string, confirmNow: boolean) => {

        if (match) {
            guestServices.updateGuest({ confirmNow, idGuest, idMatch: match.id }).then(response => {
                if (match.guests) {
                    const newGuests = match.guests.map(guest => {
                        if (guest.id === idGuest) {
                            guest.isConfirm = response.data.isConfirm;
                        }
                        return guest
                    })
                    setMatch({ ...match, guests: newGuests })

                }
            })

        }
    }

    const fetchMatch = (idMatch: string, idOrganization: string) => {
        matchServices.getMatch({ idMatch, idOrganization }).then(response => {
            setMatch(response);
            setListGuests(response);
        })
    }

    const handleDeleteGuest = (idGuest: string) => {

        if (match) {
            guestServices.deleteGuest({ idMatch: match.id, idGuest }).then(() => {
                toast.success("Jogador removido com sucesso.");
                fetchMatch(match.id, organization?.id!)

            }).catch(() => {
                toast.error("Não foi possivel deletar o jogador.")
            })
        }
    }

    const sxDisplayNone = {
        '@media (max-width: 600px)': {
            display: "none"
        }
    }

    const isExistsGuestConfirm = () => {

        if (match?.guests) {
            const isExistsGuest = match.guests.some(item => item.isConfirm === true);

            return !isExistsGuest;
        }

        return false;
    }

    const handleGenerateListConfirm = () => {

        if (match?.guests) {
            const guestsIsConfirm = match.guests
                .filter(guest => guest.isConfirm)
                .map(guest =>
                    `- Nome: ${guest.name}`
                )
                .join('\n'); //

            if (guestsIsConfirm) {
                navigator.clipboard.writeText(guestsIsConfirm)
                    .then(() => toast.success("Lista de jogadores copiada"))
                    .catch(() => toast.success('Erro ao copiar lista de jogadores'));
            } else {
                alert('Nenhum jogador confirmado para a lista.');
            }
        }

    };

    const isDisabledButtonAddGuest = () => {

        if (match) {
            if (match.status === "Cancelada" || match.status === "Finalizada" || (match.numberPlayers === match.numberMaxPlayers)) {
                return true
            }
        }
        return false;
    }

    useEffect(() => {
        if (!match && organization) {
            setIsLoading(true);
            matchServices.getMatch({ idMatch: id, idOrganization: organization?.id! }).then(response => {
                setMatch(response);
                setListGuests(response);

            }).finally(() => setIsLoading(false))
        }

        setListGuests(match!)

    }, [organization, match])

    return (
        <AppContainer>
            <Header />
            <AppContent>
                {match && (
                    <>
                        <Stack width="100%" justifyContent="space-between" sx={{
                            flexDirection: "row", "@media (max-width:600px)": {
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "2rem"
                            }
                        }}>
                            <Box sx={{
                                textAlign: "start", "@media (max-width: 600px)": {
                                    textAlign: "center"
                                }
                            }}>
                                <Typography variant="h5" color="textSecondary" fontWeight="bold">Partida de {match?.modality}</Typography>
                                <Typography variant="body1" color="textSecondary"><strong>Local: </strong>{match?.local}</Typography>
                                <Typography variant="body1" color="textSecondary"><strong>Data e Hora:</strong> {`${match?.date} as ${match?.hour}`}</Typography>
                                <Typography variant="body1" color="textSecondary"><strong>Duração:</strong> {match?.duration} {match?.duration > 1 ? "horas" : "hora"}</Typography>
                                <Typography variant="body1" color="textSecondary"><strong>Min. Jogadores:</strong>{match.numberMinPlayers}</Typography>
                                <Chip label={`Situação: ${match.status}`} color={switchStatus(match.status)} sx={{ color: "#f5f5f5", fontWeight: "bold", marginTop: "0.6rem" }} />
                            </Box>
                            <Stack alignItems={"flex-end"} gap="1rem" sx={{
                                "@media (max-width:600px)": {
                                    flexDirection: "row",
                                    alignItems: "center"
                                }
                            }}>
                                {match.inviteCode ? (
                                    <Tooltip title="Copiar convite"><Button variant="outlined" disabled={match.status === "Cancelada" || match.status === "Finalizada"} sx={{ gap: "0.2rem" }} onClick={() => copyInviteLink()}><ContentCopyIcon color="primary" />{isMobile ? "" : `Copiar convite: ${match.inviteCode}`}</Button></Tooltip>
                                ) : (
                                    <Tooltip title="Gerar convite"><Button variant="contained" disabled={match.status === "Cancelada" || match.status === "Finalizada"} sx={{ gap: "0.2rem" }} onClick={() => handleGenerateInvite()}><ContentCopyIcon />{isMobile ? "" : "Gerar convite"}</Button></Tooltip>
                                )}
                                <Tooltip title="Adicionar jogador"><Button variant="contained" disabled={isDisabledButtonAddGuest()} sx={{ gap: "0.2rem" }} onClick={handleOpenModal}><PersonAddAlt1Icon />{isMobile ? "" : "Adicionar Jogador"}</Button></Tooltip>
                                <Tooltip title="Cancelar partida"><Button variant="contained" disabled={match.status === "Cancelada" || match.status === "Finalizada"} sx={{ gap: "0.2rem" }} onClick={handleOpenCancelModal} color="error"><DoDisturbIcon /> {isMobile ? "" : "Cancelar Partida"}</Button></Tooltip>
                            </Stack>
                        </Stack>
                        {match.status === "Agendada" && (
                            <>
                                <Stack
                                    direction="row"
                                    sx={{
                                        "@media (max-width:800px)": {
                                            flexDirection: "column",
                                            gap: "0.5rem"
                                        }
                                    }}
                                    divider={<Divider orientation="vertical" flexItem />}
                                    spacing={2}
                                    width="100%"
                                    justifyContent="center"
                                    marginTop="4rem"
                                    alignItems="center"
                                >
                                    <Box display="flex" alignItems="center" gap="1rem">
                                        <Typography variant="h5" color="textSecondary" fontWeight="bold">Lista de jogadores</Typography>
                                    </Box>
                                    <Box display="flex" gap="0.5rem">
                                        <Typography variant="body1" color="textSecondary" fontWeight="bold"> {`${match.numberPlayers}/${match.numberMaxPlayers}`}</Typography>
                                        <PersonIcon color="primary" />
                                    </Box>
                                    <Box display="flex" gap="0.5rem" >
                                        <Button disabled={(match.guests && match.guests.length < 1)} variant="contained" sx={{ gap: "0.2rem" }} size={isMobile ? "small" : "medium"} onClick={handleFinishMatch}><CheckCircleOutlineIcon />Finalizar partida</Button>
                                        <Button disabled={isExistsGuestConfirm()} variant="outlined" sx={{ gap: "0.2rem" }} size={isMobile ? "small" : "medium"} onClick={handleGenerateListConfirm}><ContentCopyIcon />Gerar lista</Button>
                                    </Box>
                                </Stack>
                                <Stack marginTop="1.5rem">
                                    {match.guests && match.guests.length > 0 ? (
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Presente</TableCell>
                                                        <TableCell width="450px" sx={{
                                                            '@media (max-width: 600px)': {
                                                                textAlign: "center"
                                                            }
                                                        }}>Nome</TableCell>
                                                        <TableCell sx={sxDisplayNone} >Email</TableCell>
                                                        <TableCell sx={sxDisplayNone} width="300px">Telefone</TableCell>
                                                        <TableCell sx={sxDisplayNone}>Posição</TableCell>
                                                        <TableCell ></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {match.guests.map((guest) => (
                                                        <TableRow key={guest.id} >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={guest.isConfirm}
                                                                    onChange={() => handleCheckboxChange(guest.id, guest.isConfirm)}
                                                                />
                                                            </TableCell>
                                                            <TableCell >{guest.name}</TableCell>
                                                            <TableCell sx={sxDisplayNone}>{guest.email}</TableCell>
                                                            <TableCell sx={sxDisplayNone}>{guest.phoneNumber ? guest.phoneNumber : "---"}</TableCell>
                                                            <TableCell sx={sxDisplayNone}>{guest.preferencePosition ? guest.preferencePosition : "---"}</TableCell>
                                                            <TableCell><IconButton color="error" onClick={() => handleDeleteGuest(guest.id)}><DeleteIcon /></IconButton></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Alert variant="standard" severity="info">
                                            Sem jogadores registrados.
                                        </Alert>
                                    )}
                                </Stack>
                            </>
                        )}
                        {match.status === "Finalizada" && (
                            <Stack mt="5rem" gap="5rem">
                                {listGuestPresent && listGuestPresent.length > 0 && (
                                    <Stack >
                                        <Typography variant="h6" color="textSecondary" fontWeight="bold">Lista de Jogadores que compareceram na partida</Typography>
                                        {listGuestPresent.map(guest => (
                                            <Card sx={{ display: "flex", alignItems: "center", mt: "1rem", flexDirection: "column" }}>
                                                <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                                                    <Typography variant="body1" color="textSecondary" fontWeight="bold">
                                                        {guest.name.toLocaleLowerCase()}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        E-mail: {guest.email}
                                                    </Typography>
                                                    {guest.phoneNumber && (
                                                        <Typography variant="body2" color="textSecondary">
                                                            Telefone: {guest.phoneNumber}
                                                        </Typography>
                                                    )}
                                                </CardContent>

                                            </Card>
                                        ))}
                                    </Stack>
                                )}
                                {listGuestNotPresent && listGuestNotPresent.length > 0 && (
                                    <Stack >
                                        <Typography variant="h6" color="textSecondary" fontWeight="bold">Lista de Jogadores que não compareceram na partida</Typography>
                                        {listGuestNotPresent.map(guest => (
                                            <Card sx={{ display: "flex", alignItems: "center", mt: "1rem", flexDirection: "column" }}>
                                                <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                                                    <Typography variant="body1" color="textSecondary" fontWeight="bold">
                                                        {guest.name.toLocaleLowerCase()}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        E-mail: {guest.email}
                                                    </Typography>
                                                    {guest.phoneNumber && (
                                                        <Typography variant="body2" color="textSecondary">
                                                            Telefone: {guest.phoneNumber}
                                                        </Typography>
                                                    )}
                                                </CardContent>

                                            </Card>
                                        ))}

                                    </Stack>
                                )}
                            </Stack>
                        )}

                        <CreateGuestModal isOpen={isOpenModal} handleClose={handleCloseModal} fetchMatch={fetchMatch} />
                        <CancelModal isOpen={isOpenCancelModal} handleClose={handleCloseCancelModal} />
                    </>
                )}
            </AppContent>
            <AppNavigation />
        </AppContainer >
    )
}