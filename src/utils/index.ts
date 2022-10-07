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

/**
 *
 * @param payload Information to save into token
 * @param duration Life of token in seconds by defaul is one day
 * @returns
 */
export function createToken(payload: object, duration?: number): string {
  const secretKey: string = process.env.JWT_SECRET_KEY || 'secretKey';
  const expiresIn: number = duration || 60 * 60 * 24 * 30;
  return jwt.sign(payload, secretKey, { expiresIn });
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
