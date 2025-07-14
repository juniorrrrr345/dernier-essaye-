import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater le prix en euros
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

// Extraire l'ID public d'une URL Cloudinary
export function extractCloudinaryPublicId(url: string): string {
  if (!url) return '';
  
  // Format: https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[transformations]/[public_id].[format]
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  
  // Retirer l'extension
  const publicId = lastPart.split('.')[0];
  
  // Si il y a des transformations, on doit naviguer plus loin
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
    // Reconstruire le public_id complet incluant le folder
    const pathAfterUpload = parts.slice(uploadIndex + 1);
    const fullPath = pathAfterUpload.join('/');
    return fullPath.split('.')[0]; // Retirer l'extension finale
  }
  
  return publicId;
}

// Valider une URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Générer un slug à partir d'un texte
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Retirer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .trim();
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Debounce function
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Deep merge objects
export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item: unknown): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}