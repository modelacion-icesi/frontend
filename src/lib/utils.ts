import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formateador de moneda (Español, Colombia)
 * Omitirá los decimales si son .00
 */
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/**
 * Formatea un número como moneda (ej: $ 1.000.000)
 */
export const formatCurrency = (amount: number) => {
  return currencyFormatter.format(amount);
};