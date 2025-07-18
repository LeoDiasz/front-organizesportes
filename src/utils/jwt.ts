import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  uid: string;
}

export function decodeJwtToken(token: string | null): DecodedToken | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode<DecodedToken>(token);

    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar token JWT:', error);
    return null;
  }
}