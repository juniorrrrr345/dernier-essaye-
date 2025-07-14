import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult, UploadResponse } from '@/types';

// Configuration Cloudinary avec fallback
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const apiKey = process.env.CLOUDINARY_API_KEY || 'demo';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'demo';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export { cloudinary };

// Fonction pour détecter si on utilise Cloudinary en mode démo
export const isUsingDemoCloudinary = () => {
  return !process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'demo';
};

// Upload d'une vidéo avec génération automatique de miniature
export async function uploadVideo(file: File): Promise<UploadResponse> {
  try {
    // Si on est en mode démo, retourner une URL de démonstration
    if (isUsingDemoCloudinary()) {
      return {
        success: true,
        url: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
        thumbnail_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      };
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload de la vidéo
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "cbd-boutique/videos",
          transformation: [
            { quality: "auto" },
            { format: "mp4" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as CloudinaryUploadResult);
          else reject(new Error('No result from video upload'));
        }
      ).end(buffer);
    });

    // Générer l'URL de la miniature à partir de la vidéo
    const thumbnailUrl = cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: 400, height: 300, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      thumbnail_url: thumbnailUrl
    };
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    return {
      success: false,
      error: 'Erreur lors de l\'upload de la vidéo'
    };
  }
}

// Upload d'une image pour le fond
export async function uploadImage(file: File): Promise<UploadResponse> {
  try {
    // Si on est en mode démo, retourner une URL de démonstration
    if (isUsingDemoCloudinary()) {
      return {
        success: true,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "cbd-boutique/backgrounds",
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      ).end(buffer);
    });

    return {
      success: true,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Erreur upload image:', error);
    return {
      success: false,
      error: 'Erreur lors de l\'upload de l\'image'
    };
  }
}

// Supprimer un fichier de Cloudinary
export async function deleteCloudinaryFile(publicId: string, resourceType: 'image' | 'video' = 'image') {
  try {
    // Si on est en mode démo, simuler la suppression
    if (isUsingDemoCloudinary()) {
      return { result: 'ok' };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error);
    return null;
  }
}

// Extraire le public_id d'une URL Cloudinary
export function extractPublicId(url: string): string {
  const parts = url.split('/');
  const fileNameWithExt = parts[parts.length - 1];
  const fileName = fileNameWithExt.split('.')[0];
  return fileName;
}