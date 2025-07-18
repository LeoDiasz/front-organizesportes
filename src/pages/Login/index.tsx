import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth"
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserStore } from "../../store/userStore";
import { AppContainer } from "../../components/AppContainer";
import { OrganizationService } from "../../services/organization.service";
import { UserServices } from "../../services/user.service";
import { PAGE } from "../../constants";
import GoogleIcon from "@mui/icons-material/Google";
import logoPng from "../../assets/logo.png";
import styles from "./styles.module.scss"
import theme from "../../theme";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyD7udS9fDHajuvA643wrJi2CwMVIQ0TEeo",
  authDomain: "organizesportes.firebaseapp.com",
  projectId: "organizesportes",
  storageBucket: "organizesportes.firebasestorage.app",
  messagingSenderId: "1048539728950",
  appId: "1:1048539728950:web:dddaa66c4705786ea35c97"
};

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 600,
  width: "100%",
  bgcolor: 'background.paper',
  border: '2px solid primary',
  boxShadow: 24,
  p: "4rem 10px",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const Login = () => {
  const navigate = useNavigate();
  const { setUser, setOrganization, setIsLoading } = useUserStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const organizationService = OrganizationService.getInstance();
  const userServices = UserServices.getInstance();

  const {
    handleSubmit,
  } = useForm({ mode: "all" });

  const onSubmit = handleSubmit(async () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        if (user && user.email) {
          const loginUserBody = {
            name: user.displayName || "",
            uid: user.uid || "",
            phoneNumber: user.phoneNumber || "",
            email: user.email
          }

          userServices.loginUser(loginUserBody).then(async (responseToken) => {
            console.log(responseToken);

            toast.success("Login realizado com sucesso!");
            localStorage.setItem("token", responseToken);

            setUser(loginUserBody);

            try {
              const resultOrganization = await organizationService.getOrganization();

              if (resultOrganization) {
                setOrganization(resultOrganization);
                navigate(PAGE.HOME());
              }

            } catch (err) {
              navigate(PAGE.CREATE_ORGANIZATION())
            }

          }).catch(() => {
            throw new Error("Erro ao realizar login");
          })



        }
      })
      .catch(() => {
        toast.error("Não foi possivel realizar o Login");
      }).finally(() => setIsLoading(false));
  });

  return (
    <AppContainer>
      <Box sx={style}>
        <form onSubmit={onSubmit} className={styles.form}>
          <img src={logoPng} />
          <Box>
            <Typography variant={isMobile ? "body1" : "h6"} color="primary" fontWeight="bold">
              Organização inteligente para quem faz o esporte acontecer!
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            size={isMobile ? "medium" : "large"}
            sx={{ backgroundColor: "#FDBF00", fontWeight: "bold" }}
          >
            Fazer Login com o Google <GoogleIcon />
          </Button>
        </form>
      </Box>
    </AppContainer>
  );
};
