import jwt from 'jsonwebtoken';
import { UserModelHydrated } from 'src/types';

export const emailRegex = /^[^@]+@[^@]+.[^@]+$/;
export const strongPass = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export enum Months {
  'Enero' = 1,
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
}

export enum ShortMonths {
  'Ene' = 1,
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
}

/**
 * Normaliza el texto, cambia los espacios por (-) ademas de eliminar
 * los signos de puntucacion.
 * @param {string} text Texto a normalizar
 * @returns String
 */
export const createSlug = (text: string): string => {
  return text
    ? text
        .trim()
        .toLocaleLowerCase()
        .replace(/\s/gi, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
};

export const JWT_ALGORITHM = 'HS256';

/**
 * Returns the secret used to sign and verify JWTs.
 * Throws if it is not configured so tokens are never signed with a predictable key.
 */
export function getJwtSecret(): string {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) throw new Error('JWT_SECRET_KEY no está configurada.');
  return secretKey;
}

/**
 *
 * @param payload Information to save into token
 * @param duration Life of token in seconds by defaul is one day
 * @returns
 */
export function createToken(payload: object, duration?: number): string {
  const expiresIn: number = duration || 60 * 60 * 24 * 365; // 1 year by default
  return jwt.sign(payload, getJwtSecret(), { expiresIn, algorithm: JWT_ALGORITHM });
}

export const removeNonNumericChars = (value: any) => String(value).replace(/[^\d]/g, '');
export const removeNonPhoneChars = (value: any) => String(value).replace(/[^+0-9]/g, '');

// -------------------------------------------------------------------------------------------------------------------
// UTILS FOR ATUH
// -------------------------------------------------------------------------------------------------------------------
export const getLiteUserData = (user: UserModelHydrated) => ({
  name: user.name,
  email: user.email,
  profilePhoto: user.profilePhoto,
  role: user.role,
});
