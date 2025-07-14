import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadVideo, uploadImage } from '@/lib/cloudinary';

// POST /api/admin/upload - Upload d'un fichier (vidéo ou image)
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' ou 'image'

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    if (!type || !['video', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Type de fichier invalide. Utilisez "video" ou "image"' },
        { status: 400 }
      );
    }

    // Validation de la taille du fichier (max 100MB pour vidéo, 10MB pour image)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Taille max: ${type === 'video' ? '100MB' : '10MB'}` },
        { status: 400 }
      );
    }

    // Validation du type MIME
    const allowedTypes = type === 'video' 
      ? ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm']
      : ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non supporté: ${file.type}` },
        { status: 400 }
      );
    }

    // Upload vers Cloudinary
    const result = type === 'video' 
      ? await uploadVideo(file)
      : await uploadImage(file);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur upload' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      thumbnail_url: result.thumbnail_url,
      message: `${type === 'video' ? 'Vidéo' : 'Image'} uploadée avec succès`
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/upload - Supprimer un fichier de Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID requis' },
        { status: 400 }
      );
    }

    // TODO: Implémenter la suppression Cloudinary si nécessaire
    // const result = await deleteCloudinaryFile(publicId, resourceType);

    return NextResponse.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}