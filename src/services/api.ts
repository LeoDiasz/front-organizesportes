import axios from "axios";

const APPLICATION_BFF_URL = "http://localhost:3001";

const request = axios.create({
    baseURL: APPLICATION_BFF_URL,
    timeout: 30 * 1000
})


request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// request.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const navigate = useNavigate();
//     if (error.response?.status === 401) {
//       toast.error('Sessão expirada ou não autorizada. Por favor, faça login novamente.');
//       useUserStore.getState().logout();
//       navigate(PAGE.LOGIN());
//     } else if (error.response?.data?.error) {
//       // Exibe a mensagem de erro do backend
//       toast.error(error.response.data.error);
//     } else {
//       toast.error('Ocorreu um erro inesperado. Tente novamente.');
//     }
//     return Promise.reject(error);
//   }
// );

export default request;