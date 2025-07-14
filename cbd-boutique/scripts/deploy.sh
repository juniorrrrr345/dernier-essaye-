#!/bin/bash

echo "🚀 Démarrage du déploiement..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérifier les erreurs TypeScript
echo "🔍 Vérification TypeScript..."
npx tsc --noEmit

# Vérifier les erreurs ESLint
echo "🔍 Vérification ESLint..."
npm run lint

# Build du projet
echo "🏗️ Build du projet..."
npm run build

echo "✅ Build terminé avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Poussez votre code sur GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix deployment issues'"
echo "   git push origin main"
echo ""
echo "2. Connectez votre projet à Vercel:"
echo "   - Allez sur vercel.com"
echo "   - Importez votre repo GitHub"
echo "   - Configurez les variables d'environnement"
echo ""
echo "3. Variables d'environnement requises dans Vercel:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - ADMIN_PASSWORD_HASH"
echo "   - JWT_SECRET"