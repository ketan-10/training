import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { jwtDecode, type JwtPayload } from 'jwt-decode';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TOKENS uilts 

type ExtraJWTPayload = {
  exp: number
}

export const isTokenValid = (token: string) => {
  try {
    var decoded = jwtDecode<JwtPayload & ExtraJWTPayload>(token);
    return Date.now() < decoded.exp * 1000;
  } catch (error) {
    return false;
  }
};

// LOCAL STORAGE utils:

export const setLocalStorage = (key: string, valueToStore: any) => {
  try {
    // Save to local storage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  } catch (error) {
    // A more advanced implementation would handle the error case
    console.log(error);
  }
};

export const getLocalStorage = (key: string, initialValue: any = null) => {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    // Get from local storage by key
    const item = window.localStorage.getItem(key);
    // Parse stored json or if none return initialValue
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
};
