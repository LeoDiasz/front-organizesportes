import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery } from "@mui/material"
import { AppContainer } from "../../components/AppContainer"
import Header from "../../components/Header"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PAGE } from "../../constants"
import { MatchServices } from "../../services/match.service"
import { useUserStore } from "../../store/userStore"
import { AppNavigation } from "../../components/AppNavigation"
import { AppContent } from "../../components/AppContent"
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PersonIcon from '@mui/icons-material/Person';
import theme from "../../theme"
import { filterStatusOptions, switchStatus } from "../../utils/match.utils"
import type { IListMatchFormattedResponse } from "../../model/match.model"

export const Home = () => {
    const navigate = useNavigate();
    const { organization, setMatch } = useUserStore();
    const [listMatchs, setListMatchs] = useState<IListMatchFormattedResponse[]>([]);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const matchServices = MatchServices.getInstance();
    const [listMatchsFilter, setListMatchsFilter] = useState(listMatchs);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState(filterStatusOptions[0].value);
    let listForFilterMatch = listMatchsFilter.length > 0 ? listMatchsFilter : listMatchs

    const handleGoCreateMatch = () => {
        navigate(PAGE.CREATE_MATCH());

    }

    const handleChangeFilter = (event: any) => {
        setSelectedFilterStatus(event.target.value)

        if (event.target.value === "Todas") {
            setListMatchsFilter(listMatchs);
        } else if (event.target.value === "Cancelada") {

            const listMatchsFiltered = listMatchs.filter(match => match.status === "Cancelada");
            setListMatchsFilter(listMatchsFiltered);
        } else if (event.target.value === "Agendada") {
            const listMatchsFiltered = listMatchsFilter.filter(match => match.status === "Agendada");
            setListMatchsFilter(listMatchsFiltered)
        } else if (event.target.value === "Finalizada") {
            const listMatchsFiltered = listMatchsFilter.filter(match => match.status === "Finalizada");
            setListMatchsFilter(listMatchsFiltered);
        }


    }

    useEffect(() => {
        if (organization) {
            matchServices.getMatchs({ organizationId: organization.id }).then(response => {
                setListMatchs(response)

            })
        }

    }, [organization])

    return (
        <AppContainer>
            <Header />
            <AppContent>
                <Stack
                    direction={isMobile ? "column" : "row"}
                    alignItems={"center"}
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    width="100%"
                    justifyContent="center"
                >
                    <Typography variant={isMobile ? "h6" : "h4"} color="textSecondary" fontWeight="bold">Histórico de Partidas</Typography>
                    <Button variant="contained" style={{ color: "#f3f3f3", fontWeight: "bold" }} color="secondary" size="large" onClick={handleGoCreateMatch}>Criar partida</Button>
                </Stack>
                <Box sx={{ marginTop: "1rem", width: "100%" }}>
                    {listMatchs.length > 0 ? (
                        <Stack alignItems="center" gap="2rem">
                            <FormControl size="small" sx={{ width: "60%" }}>
                                <InputLabel sx={{ mb: "0.5rem" }}>Status</InputLabel>
                                <Select
                                    value={selectedFilterStatus}
                                    onChange={handleChangeFilter}
                                >
                                    {filterStatusOptions.map(({ label, value }) => (
                                        <MenuItem disabled={value === "Todas" ? false : !listMatchs.some(item => item.status === value)} value={value}>{label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack
                                gap="1rem"
                                direction="row"
                                sx={{ flexWrap: "wrap", justifyContent: "center" }}
                            >

                                {listForFilterMatch.map(item => (
                                    <Card sx={{ maxWidth: 400, ":hover": { backgroundColor: item.status !== "Cancelada" ? "ButtonShadow" : "rgba(0, 0, 0, 0.26)", cursor: item.status === "Cancelada" ? "default" : "pointer" }, cursor: "pointer", width: "100%", backgroundColor: item.status === "Cancelada" ? "rgba(0, 0, 0, 0.26)" : "inherit" }} onClick={() => {

                                        if (item.status === "Cancelada") {
                                            return;
                                        }
                                        setMatch(item);
                                        navigate(`/partidas/${item.id}`)
                                    }}>
                                        <CardContent >
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Typography gutterBottom variant="h6">
                                                    Partida de {item.modality}
                                                </Typography>
                                                {item.modality === "Vôlei" ? (
                                                    <SportsVolleyballIcon fontSize="large" color={item.status === "Cancelada" ? "disabled" : "primary"} />
                                                ) : (
                                                    <SportsSoccerIcon fontSize="large" color={item.status === "Cancelada" ? "disabled" : "primary"} />
                                                )}
                                            </Box>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                <strong>Data e Hora</strong>: {`${item.date} as ${item.hour}`}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                <strong>Local:</strong> {item.local}
                                            </Typography>

                                        </CardContent>
                                        <CardActions sx={{ justifyContent: "space-between" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                <Chip label={item.status} color={switchStatus(item.status)} sx={{ color: "#f5f5f5", fontWeight: "bold" }} />
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                <Typography>{`${item.numberPlayers}/${item.numberMaxPlayers}`}</Typography>
                                                <PersonIcon color={item.status === "Cancelada" ? "disabled" : "primary"} />
                                            </Box>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Stack>
                        </Stack>
                    ) : (
                        <Alert variant="standard" severity="info">
                            Sem partidas agendadas.
                        </Alert>
                    )}

                </Box>
            </AppContent>
            <AppNavigation />
        </AppContainer>
    )
}