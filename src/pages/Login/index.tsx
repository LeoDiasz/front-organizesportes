import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button, Container, Typography } from "@mui/material";
import {PAGE} from "../../constants";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import logoPng from "../../assets/logo.png";
import styles from "./styles.module.scss"

const provider = new GoogleAuthProvider();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7udS9fDHajuvA643wrJi2CwMVIQ0TEeo",
  authDomain: "organizesportes.firebaseapp.com",
  projectId: "organizesportes",
  storageBucket: "organizesportes.firebasestorage.app",
  messagingSenderId: "1048539728950",
  appId: "1:1048539728950:web:dddaa66c4705786ea35c97"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth  = getAuth(app)


export const Login = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
  } = useForm({ mode: "all" });

  const onSubmit = handleSubmit(async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;

        toast.success("Login realizado com sucesso!");
        localStorage.setItem("token", token!);
        console.log("Token", token);
        console.log("User", user);
        navigate(PAGE.CREATE_ORGANIZATION());
      })
      .catch(() => {
        // const errorsCode = error.code;
        // const errorMessage = error.message;
        // const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error("Não foi possivel realizar o Login");
      });
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      
      navigate(PAGE.CREATE_ORGANIZATION()); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  return (
    <Container maxWidth="md" className={styles.containerLogin}>
      <form onSubmit={onSubmit} className={styles.form}>
        <img src={logoPng} />
        <div>
          <Typography variant="h6" sx={{color: "#03588C"}}>
            Organização inteligente para quem faz o esporte acontecer.
          </Typography>
        </div>
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{backgroundColor: "#FDBF00", fontWeight: "bold"}}
        >
          Fazer Login com o Google <GoogleIcon /> 
        </Button>
      </form>
    </Container>
  );
};
