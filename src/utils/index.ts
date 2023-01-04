/**
 * Util for create a simple slug
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

export const emailRegex = /^[^@]+@[^@]+.[^@]+$/;

export const strongPass =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export const removeNonNumericChars = (value: any) =>
  String(value).replace(/[^\d]/g, '');

export const removeNonPhoneChars = (value: any) =>
  String(value).replace(/[^+0-9]/g, '');

export interface IImage {
  publicId: string;
  width: number;
  height: number;
  format: string;
  type?: string;
  url: string;
}

export type ResourceType = 'image' | 'video' | 'raw' | 'auto';

export function isResourceType(
  resourceType: string
): resourceType is ResourceType {
  return ['image', 'video', 'raw', 'auto'].includes(resourceType);
}
