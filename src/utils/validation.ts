/**
 * Validation Utilities
 *
 * Ce fichier centralise toutes les fonctions de validation.
 * Facilite la réutilisation et les tests.
 *
 * @module utils/validation
 */

/**
 * Valide un email
 *
 * @param email - Email à valider
 * @returns true si l'email est valide
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe
 * Règles :
 * - Minimum 8 caractères
 *
 * @param password - Mot de passe à valider
 * @returns true si le mot de passe est valide
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Vérifie que deux mots de passe correspondent
 *
 * @param password - Mot de passe
 * @param passwordConfirm - Confirmation du mot de passe
 * @returns true si les mots de passe correspondent
 */
export function passwordsMatch(password: string, passwordConfirm: string): boolean {
  return password === passwordConfirm && password.length > 0;
}

/**
 * Valide qu'une chaîne n'est pas vide
 *
 * @param value - Valeur à valider
 * @returns true si la valeur n'est pas vide
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Valide une date au format YYYY-MM-DD
 *
 * @param date - Date à valider
 * @returns true si la date est valide
 */
export function isValidDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}
